import * as fs from 'fs';
import * as path from 'path';
import { REVIEW_CLI_NAME, reviewDirIn } from '../../../shared/sonara-paths';
import { ReviewLogger } from '../logging/review-logger';

const CLI_ENTRY = path.join('out', 'modules', 'review', 'cli', 'main.js');
const EXECUTABLE_MODE = 0o755;

function shellScript(entry: string, siblings: string, runtime: string): string {
    return `#!/bin/sh
project="$(CDPATH= cd -- "$(dirname -- "$0")/../../.." && pwd)"
cli='${entry}'
if [ ! -f "$cli" ]; then
    for candidate in ${siblings}; do
        [ -f "$candidate" ] && cli="$candidate"
    done
fi
if [ ! -f "$cli" ]; then
    echo "sonara-review: the Sonara extension is not installed where this launcher expects it ($cli). Open the project in VS Code once to refresh the launcher." >&2
    exit 3
fi
if command -v node >/dev/null 2>&1; then
    exec node "$cli" --project "$project" "$@"
fi
ELECTRON_RUN_AS_NODE=1 exec '${runtime}' "$cli" --project "$project" "$@"
`;
}

function batchScript(entry: string, runtime: string): string {
    return `@echo off\r
setlocal\r
for %%I in ("%~dp0..\\..\\..") do set "SONARA_PROJECT=%%~fI"\r
if not exist "${entry}" (\r
    echo sonara-review: the Sonara extension is not installed where this launcher expects it. Open the project in VS Code once to refresh the launcher. 1>&2\r
    exit /b 3\r
)\r
where node >nul 2>nul && (\r
    node "${entry}" --project "%SONARA_PROJECT%" %*\r
    exit /b\r
)\r
set ELECTRON_RUN_AS_NODE=1\r
"${runtime}" "${entry}" --project "%SONARA_PROJECT%" %*\r
`;
}

export class ReviewCliLauncher {
    static install(projectPath: string, extensionPath: string, logger: ReviewLogger): void {
        const entry = path.join(extensionPath, CLI_ENTRY);
        const siblings = path.join(path.dirname(extensionPath), '*sonara-*', CLI_ENTRY);
        const reviewRoot = reviewDirIn(projectPath);
        const files: [string, string][] = [
            [path.join(reviewRoot, REVIEW_CLI_NAME), shellScript(entry, siblings, process.execPath)],
            [path.join(reviewRoot, `${REVIEW_CLI_NAME}.cmd`), batchScript(entry, process.execPath)],
        ];
        try {
            fs.mkdirSync(reviewRoot, { recursive: true });
            for (const [target, content] of files) {
                if (fs.existsSync(target) && fs.readFileSync(target, 'utf8') === content) {
                    continue;
                }
                fs.writeFileSync(target, content, { encoding: 'utf8', mode: EXECUTABLE_MODE });
                fs.chmodSync(target, EXECUTABLE_MODE);
                logger.info(`Review CLI launcher written to ${target}`);
            }
        } catch (error) {
            logger.error(`Review CLI launcher could not be written to ${reviewRoot}`, error);
        }
    }
}
