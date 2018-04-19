import * as vscode from "vscode";
import * as vars from './osdetector';
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
    var uri: vscode.Uri[] = null;
    if(vars._isWindows){
         uri = await vscode.workspace.findFiles('**/install.cmd');
         if (uri.length < 1) {
            vscode.window.showErrorMessage("An install.cmd file was not found in the workspace");
            return;     
        }
    }
    else if(vars._isLinux){
         uri = await vscode.workspace.findFiles('**/install.sh');
         if (uri.length < 1) {
            vscode.window.showErrorMessage("An install.sh file was not found in the workspace");
            return;
        }
    }
    const relativeInstallPath = vscode.workspace.asRelativePath(uri[0]);
    const terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    if(vars._isLinux)
        changePermissions(relativeInstallPath,terminal);
    terminal.sendText(relativeInstallPath);
    terminal.show();
}

function changePermissions(filename, terminal: vscode.Terminal){
    var command = 'chmod a+x '+filename;
    terminal.sendText(command);
}
