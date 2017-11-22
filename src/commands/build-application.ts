import * as vscode from "vscode";
import { quickPickLanguage } from '../configureWorkspace/config-utils';

export async function buildApplication() {

    const languageType = await quickPickLanguage();

    if (languageType === 'Java') {
        buildGradleApplication();
    } else if (languageType === 'C#') {
        buildCSharpApplication();
    }
}

async function buildGradleApplication() {

    const uris: vscode.Uri[] = await vscode.workspace.findFiles('**/build.gradle');
    if (uris.length < 1) {
        vscode.window.showErrorMessage("A build.gradle file was not found in the workspace");
        return;
    }

    const projectPath = uris[0].path.replace('build.gradle', '');
    let projectUri = vscode.Uri.parse(projectPath);

    const terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    terminal.sendText('gradle build ');
    terminal.show();
}

async function buildCSharpApplication() {
    const uris: vscode.Uri[] = await vscode.workspace.findFiles('**/build.sh');
    if (uris.length < 1) {
        vscode.window.showErrorMessage("A build file was not found in the workspace");
        return;
    }

    const relativeBuildPath = vscode.workspace.asRelativePath(uris[0].path);
    const terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    terminal.sendText('./' + relativeBuildPath);
    terminal.show();
}

