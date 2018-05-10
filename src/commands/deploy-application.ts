import * as vscode from "vscode";
import * as vars from './osdetector';
const exec = require('child_process').exec;

export async function deployApplication() {
    var terminal : vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    if(vars._isLinux){
        exec('sfctl cluster select --endpoint http://localhost:10550', function (err, stdout, stderr) {
            if (err) {
                vscode.window.showErrorMessage("Could not connect to cluster.");
                console.log(err);
                return;
            }
        });
    }
    else if(vars._isWindows){
        var uri: vscode.Uri[] = await vscode.workspace.findFiles('**/preinstall.ps1');
        if (uri.length < 1) {
            vscode.window.showErrorMessage("A preinstall.ps1 file was not found in the workspace");
            return;
        }
        const relativeInstallPath = vscode.workspace.asRelativePath(uri[0]);
        //terminal.sendText(relativeInstallPath);
        var commands = "ipmo  E:\\Work\\WindowsFabric\\out\\debug-amd64\\bin\\FabricDrop\\ServiceFabricClientPackage\\ServiceFabric\\Microsoft.ServiceFabric.Powershell.dll";
        terminal.show();
        terminal.sendText(commands); 
        terminal.sendText("Connect-ServiceFabricCluster");
    }
    installApplication(terminal);
}

async function installApplication(terminal:vscode.Terminal) {
    var uri: vscode.Uri[] = null;
    if(vars._isWindows){
         uri = await vscode.workspace.findFiles('**/install.ps1');
         if (uri.length < 1) {
            vscode.window.showErrorMessage("An install.ps1 file was not found in the workspace");
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
    if(vars._isLinux)
        changePermissions(relativeInstallPath,terminal);
    terminal.sendText(relativeInstallPath);
//terminal.show();
}

function changePermissions(filename, terminal: vscode.Terminal){
    var command = 'chmod a+x '+filename;
    terminal.sendText(command);
}
