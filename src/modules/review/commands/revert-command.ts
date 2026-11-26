import * as path from 'path';
import * as vscode from 'vscode';
import { selectedNodes } from '../../../shared/file-actions';
import { RevertLayer } from '../review-file-reverter';
import { RevertRequest, inactiveMessage } from '../review-service';
import { ReviewServices } from '../review-services';
import { ReviewNode } from '../view/review-node';
import { collectFiles } from '../view/review-tree-builder';

const REVERT = 'Revert';
const LISTED_FILES = 10;

function confirmationTitle(repoPaths: readonly string[]): string {
    return repoPaths.length === 1 ? `Revert '${path.posix.basename(repoPaths[0])}'?` : `Revert ${repoPaths.length} files?`;
}

function confirmationDetail(repoPaths: readonly string[], layers: ReadonlySet<RevertLayer>): string {
    const listed = repoPaths.slice(0, LISTED_FILES);
    const lines = repoPaths.length > 1 ? listed : [];
    if (repoPaths.length > LISTED_FILES) {
        lines.push(`and ${repoPaths.length - LISTED_FILES} more`);
    }
    if (layers.has('changes')) {
        lines.push('Changes outside Staged Changes: the files on disk go back to what is staged, files that are not staged are moved to the Trash. Staged Changes stay as they are.');
    }
    if (layers.has('staged')) {
        lines.push('Staged Changes: the files go back to HEAD, staged and on disk; files that are not in HEAD are removed from the index and moved to the Trash.');
    }
    lines.push('This cannot be undone.');
    return lines.join('\n');
}

export async function executeRevert(
    services: ReviewServices,
    node: ReviewNode | undefined,
    selection: readonly ReviewNode[] | undefined,
): Promise<void> {
    const byProject = new Map<string, Map<string, RevertLayer>>();
    for (const file of selectedNodes(node, selection).flatMap(current => collectFiles(current))) {
        const requests = byProject.get(file.project) ?? new Map<string, RevertLayer>();
        const layer: RevertLayer = file.level === 'staged' || requests.get(file.path) === 'staged' ? 'staged' : 'changes';
        byProject.set(file.project, requests.set(file.path, layer));
    }
    if (byProject.size === 0) {
        await vscode.window.showInformationMessage('Sonara Review: select a file or a folder to revert.');
        return;
    }
    for (const project of byProject.keys()) {
        const service = services.get(project);
        if (!service || !service.isActive()) {
            await vscode.window.showInformationMessage(inactiveMessage(service));
            return;
        }
    }
    const repoPaths = Array.from(byProject.values()).flatMap(requests => Array.from(requests.keys()));
    const layers = new Set(Array.from(byProject.values()).flatMap(requests => Array.from(requests.values())));
    const answer = await vscode.window.showWarningMessage(confirmationTitle(repoPaths), { modal: true, detail: confirmationDetail(repoPaths, layers) }, REVERT);
    if (answer !== REVERT) {
        return;
    }
    const failures: string[] = [];
    for (const [project, requests] of byProject) {
        const report = await services.get(project)?.revertFiles(Array.from(requests, ([repoPath, layer]) => ({ repoPath, layer })));
        failures.push(...(report?.failures ?? []));
    }
    if (failures.length > 0) {
        await vscode.window.showErrorMessage(`Sonara Review could not revert ${failures.join('; ')}`);
    }
}
