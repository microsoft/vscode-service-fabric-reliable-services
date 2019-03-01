import * as vscode from "vscode";
import * as vars from './osdetector';
import * as removeApplication from './remove-application';
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
    var cmd: string = './' + relativeInstallPath;
    if (installScriptExtension === '.ps1') {
        cmd = "try { " + cmd + " } catch { Write-Error 'Install Failed' }"
    }
    terminal.sendText(cmd);
    terminal.show();
    handleUncleanInstallation(terminal);
}

async function handleUncleanInstallation(terminal:vscode.Terminal) {
    await checkCleanInstall(terminal).catch(_ => {
        // installation failed
        // uninstall
        removeApplication.removeApplication();
    });
    cleanupLogFile();
}

async function checkCleanInstall(terminal:vscode.Terminal) {
    terminal.sendText('$? > temp.log',true);
    var fs = require('fs');
    var outpath = vscode.workspace.workspaceFolders[0].uri.fsPath+'/temp.log';
    var content;
    return new Promise((resolve, reject) => {
        setTimeout(function(){
            content = fs.readFileSync(outpath, 'utf8');
            if(content.includes('T') || content.includes('0'))
                resolve(0);
            else
                reject(1);
        },10000);
    });
}

function cleanupLogFile() {
    var fs = require('fs');
    var outpath = vscode.workspace.workspaceFolders[0].uri.fsPath+'/temp.log';
    fs.unlinkSync(outpath);
}
