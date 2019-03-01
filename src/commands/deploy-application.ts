import * as vscode from "vscode";
import * as vars from './osdetector';
const exec = require('child_process').exec;

var builScriptExtension;
var installScriptExtension;

if(vars._isWindows){
    builScriptExtension = '.cmd';
    installScriptExtension = '.ps1';
}

else{
    builScriptExtension = '.sh';
    installScriptExtension = '.sh';
}

export async function deployApplication() {
    var terminal : vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    if (vars._isLinux || vars._isMacintosh) {
        exec('sfctl cluster select --endpoint http://localhost:19080', function (err, stdout, stderr) {
            if (err) {
                vscode.window.showErrorMessage("Could not connect to cluster.");
                console.log(err);
                return;
            }
        });
    }
    else if (vars._isWindows) {
        var buildFiles: vscode.Uri[] = await vscode.workspace.findFiles('**/build.gradle');
        if (buildFiles.length > 1){
            vscode.window.showErrorMessage("Sorry! You cannot deploy Service Fabric Java application to Windows Cluster");
            return;
        }
        terminal.show();
        terminal.sendText("Connect-ServiceFabricCluster -ConnectionEndpoint localhost:19000");
    }
    installApplication(terminal);
}

async function installApplication(terminal:vscode.Terminal) {
    var uri: vscode.Uri[] = null;
    uri = await vscode.workspace.findFiles('**/install' + installScriptExtension);
    if (uri.length < 1) {
        vscode.window.showErrorMessage("An install file was not found in the workspace");
        return;     
    }
    const relativeInstallPath = vscode.workspace.asRelativePath(uri[0]);
    terminal.sendText('./' + relativeInstallPath);
    terminal.show();
}
