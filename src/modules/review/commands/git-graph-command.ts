import * as vscode from 'vscode';
import { ReviewServices } from '../review-services';
import { ReviewNode } from '../view/review-node';

const GIT_GRAPH_EXTENSION = 'mhutchie.git-graph';
const GIT_GRAPH_VIEW_COMMAND = 'git-graph.view';
const AVAILABLE_CONTEXT = 'sonara.review.gitGraphAvailable';
const SINGLE_REPOSITORY_CONTEXT = 'sonara.review.singleRepository';

export function trackGitGraph(services: ReviewServices): vscode.Disposable {
    const publishAvailability = (): void => {
        void vscode.commands.executeCommand('setContext', AVAILABLE_CONTEXT, vscode.extensions.getExtension(GIT_GRAPH_EXTENSION) !== undefined);
    };
    const publishLayout = (): void => {
        void vscode.commands.executeCommand('setContext', SINGLE_REPOSITORY_CONTEXT, services.all().length === 1);
    };
    publishAvailability();
    publishLayout();
    return vscode.Disposable.from(
        vscode.extensions.onDidChange(publishAvailability),
        services.onDidChange(publishLayout),
    );
}

export async function executeOpenGitGraph(services: ReviewServices, node: ReviewNode | undefined): Promise<void> {
    const all = services.all();
    const service = node?.type === 'repository' ? services.get(node.project) : all.length === 1 ? all[0] : undefined;
    const root = service?.getRepositoryRoot();
    if (!root) {
        await vscode.window.showInformationMessage('Sonara Review: Open Git Graph works from a repository row of the Review panel.');
        return;
    }
    await vscode.commands.executeCommand(GIT_GRAPH_VIEW_COMMAND, { rootUri: vscode.Uri.file(root) });
}
