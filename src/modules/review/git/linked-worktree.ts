import * as fs from 'fs';
import * as path from 'path';

const GITDIR_PREFIX = 'gitdir:';
const BRANCH_PREFIX = 'ref: refs/heads/';
const SHORT_COMMIT_LENGTH = 7;

export interface LinkedWorktree {
    mainRoot: string;
    branch: string;
}

function readTrimmed(file: string): string | null {
    try {
        return fs.readFileSync(file, 'utf8').trim();
    } catch {
        return null;
    }
}

function describeHead(head: string | null): string {
    if (head === null) {
        return 'unknown branch';
    }
    return head.startsWith(BRANCH_PREFIX) ? head.slice(BRANCH_PREFIX.length) : `detached at ${head.slice(0, SHORT_COMMIT_LENGTH)}`;
}

export function linkedWorktreeOf(repoRoot: string): LinkedWorktree | null {
    const dotGit = readTrimmed(path.join(repoRoot, '.git'));
    if (dotGit === null || !dotGit.startsWith(GITDIR_PREFIX)) {
        return null;
    }
    const gitDir = path.resolve(repoRoot, dotGit.slice(GITDIR_PREFIX.length).trim());
    const commonDir = readTrimmed(path.join(gitDir, 'commondir'));
    if (commonDir === null) {
        return null;
    }
    return {
        mainRoot: path.dirname(path.resolve(gitDir, commonDir)),
        branch: describeHead(readTrimmed(path.join(gitDir, 'HEAD'))),
    };
}
