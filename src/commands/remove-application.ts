import * as vscode from 'vscode';

export async function removeApplication() {

    const uri: vscode.Uri[] = await vscode.workspace.findFiles('**/uninstall.sh');
    if(uri.length < 1) {
        vscode.window.showErrorMessage("An uninstall.sh file was not found in the workspace");
        return;
    }

    const relativeInstallPath = vscode.workspace.asRelativePath(uri[0].path);
    const terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    terminal.sendText('./'+relativeInstallPath);
    terminal.show();
}