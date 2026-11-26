import * as vscode from 'vscode';
import { existsOnDisk } from '../../shared/file-actions';
import { literal } from './git/diff-options';
import { runGit } from './git/git-process';
import { ReviewLogger } from './logging/review-logger';
import { ReviewScope } from './review-scope';

export type RevertLayer = 'staged' | 'changes';

export interface RevertTarget {
    repoPath: string;
    layer: RevertLayer;
    isInHead: boolean;
    isInIndex: boolean;
}

export type RevertOutcome = 'restored' | 'removed' | 'unchanged';

export interface RevertReport {
    reverted: string[];
    failures: string[];
}

export class ReviewFileReverter {
    constructor(
        private readonly gitPath: string,
        private readonly repoRoot: string,
        private readonly scope: ReviewScope,
        private readonly logger: ReviewLogger,
    ) {}

    async revert(targets: readonly RevertTarget[]): Promise<RevertReport> {
        const report: RevertReport = { reverted: [], failures: [] };
        const outcomes: Record<RevertOutcome, number> = { restored: 0, removed: 0, unchanged: 0 };
        for (const target of targets) {
            try {
                outcomes[await this.revertOne(target)]++;
                report.reverted.push(target.repoPath);
            } catch (error) {
                this.logger.error(`Revert of ${target.repoPath} failed`, error);
                report.failures.push(`${target.repoPath}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        this.logger.info(`Revert finished: ${outcomes.restored} restored, ${outcomes.removed} removed, ${outcomes.unchanged} unchanged, ${report.failures.length} failed`);
        return report;
    }

    private async revertOne(target: RevertTarget): Promise<RevertOutcome> {
        return target.layer === 'staged' ? this.revertStaged(target) : this.revertChanges(target);
    }

    private async revertChanges(target: RevertTarget): Promise<RevertOutcome> {
        const spec = literal(target.repoPath);
        if (target.isInIndex) {
            await runGit(this.gitPath, this.repoRoot, ['restore', '--worktree', '--', spec]);
            return 'restored';
        }
        return this.trash(target.repoPath);
    }

    private async revertStaged(target: RevertTarget): Promise<RevertOutcome> {
        const spec = literal(target.repoPath);
        if (target.isInHead) {
            await runGit(this.gitPath, this.repoRoot, ['restore', '--source=HEAD', '--staged', '--worktree', '--', spec]);
            return 'restored';
        }
        await runGit(this.gitPath, this.repoRoot, ['rm', '--cached', '-f', '--ignore-unmatch', '--', spec]);
        return this.trash(target.repoPath);
    }

    private async trash(repoPath: string): Promise<RevertOutcome> {
        const uri = vscode.Uri.file(this.scope.absolutePath(repoPath));
        if (!await existsOnDisk(uri)) {
            return 'unchanged';
        }
        await vscode.workspace.fs.delete(uri, { useTrash: true });
        return 'removed';
    }
}
