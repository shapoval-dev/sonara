import { execFile } from 'child_process';
import * as fs from 'fs';
import { promisify } from 'util';
import * as vscode from 'vscode';
import type { API, Repository } from './git-api';

const run = promisify(execFile);

const WORKTREE_LINE = 'worktree ';
const PRUNABLE_LINE = 'prunable';

function linkedWorktreePaths(porcelain: string): string[] {
    const entries = porcelain.split('\n\n').map(entry => entry.split('\n'));
    return entries
        .slice(1)
        .filter(lines => !lines.some(line => line.startsWith(PRUNABLE_LINE)))
        .flatMap(lines => lines.filter(line => line.startsWith(WORKTREE_LINE)).map(line => line.slice(WORKTREE_LINE.length)));
}

export class LinkedWorktreeOpener implements vscode.Disposable {
    private readonly disposable: vscode.Disposable;

    constructor(
        private readonly api: API,
        private readonly isInScope: (fsPath: string) => boolean,
        private readonly onError: (message: string, error: unknown) => void,
    ) {
        this.disposable = api.onDidOpenRepository(repository => this.openWorktreesOf(repository));
        api.repositories.forEach(repository => this.openWorktreesOf(repository));
    }

    dispose(): void {
        this.disposable.dispose();
    }

    private openWorktreesOf(repository: Repository): void {
        this.listWorktrees(repository.rootUri.fsPath).then(
            paths => Promise.all(paths.map(worktree => this.api.openRepository(vscode.Uri.file(worktree)))),
        ).catch(error => this.onError(`Opening the git worktrees of ${repository.rootUri.fsPath} failed`, error));
    }

    private async listWorktrees(repoRoot: string): Promise<string[]> {
        const { stdout } = await run(this.api.git.path, ['worktree', 'list', '--porcelain'], { cwd: repoRoot });
        return linkedWorktreePaths(stdout).filter(worktree =>
            this.isInScope(worktree)
            && fs.existsSync(worktree)
            && this.api.getRepository(vscode.Uri.file(worktree))?.rootUri.fsPath !== worktree);
    }
}
