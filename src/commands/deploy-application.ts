import * as vscode from "vscode";
const exec = require('child_process').exec;

export async function deployApplication() {

    exec('sfctl cluster select --endpoint http://localhost:19080', function (err, stdout, stderr) {
        if (err) {
            vscode.window.showErrorMessage("Could not connect to cluster.");
            console.log(err);
            return;
        }
        installApplication();
    });
}

async function installApplication() {
    const uri: vscode.Uri[] = await vscode.workspace.findFiles('**/install.sh');
    if (uri.length < 1) {
        vscode.window.showErrorMessage("An install.sh file was not found in the workspace");
        return;
    }

    const relativeInstallPath = vscode.workspace.asRelativePath(uri[0].path);
    const terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    terminal.sendText('./' + relativeInstallPath);
    terminal.show();
}
