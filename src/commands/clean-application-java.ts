import * as vscode from 'vscode';

export async function cleanJavaApplication() {
    const uri: vscode.Uri[] = await vscode.workspace.findFiles('build.gradle');
    if (uri.length < 1) {
        vscode.window.showErrorMessage("Task clean was not found in root project");
        return;
    }

    const terminal: vscode.Terminal = vscode.window.createTerminal('Service Fabric');
    terminal.sendText('gradle clean ');
    terminal.show();
}