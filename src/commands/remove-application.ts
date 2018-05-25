import * as vscode from 'vscode';
import * as vars from './osdetector'
const exec = require('child_process').exec;

export async function removeApplication() {
    connectToCluster();
}

async function connectToCluster() {
    var fs = require('fs');
    var clusterInfo;

    const cloudProfile: vscode.Uri[] = await vscode.workspace.findFiles('**/Cloud.json');
    const pathToCloudProfile = cloudProfile[0].fsPath.replace('/c:', '');

    await fs.readFile(pathToCloudProfile, 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
        clusterInfo = JSON.parse(data);
        if (clusterInfo.ClientCert.length > 0) {
            connectToSecureCluster(clusterInfo);
        } else {
            connectToUnsecureCluster(clusterInfo);
        }
    });

    return clusterInfo;
}

function connectToSecureCluster(clusterInfo) {
    var terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    if(vars._isLinux){       
        exec('sfctl cluster select --endpoint ' + clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort + ' --cert ' + clusterInfo.ClientCert + ' --key ' + clusterInfo.ClientKey + ' --no-verify', function (err, stdout, stderr) {
            if (err) {
                vscode.window.showErrorMessage("Could not connect to cluster.");
                console.log(err);
                return;
            }
        });
    }
    else if(vars._isWindows){
        /*const terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
        var commands = ''
        terminal.sendText(relativeInstallPath);
        terminal.show();*/       
    }
    uninstallApplication(terminal);    
}

async function connectToUnsecureCluster(clusterInfo) {
    var terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    if (clusterInfo.ConnectionIPOrURL.length > 0) {
        if (vars._isLinux) {
            exec('sfctl cluster select --endpoint ' + clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort, function (err, stdout, stderr) {
                if (err) {
                    vscode.window.showErrorMessage("Could not connect to cluster.");
                    console.log(err);
                    return;
                }
            });
        }
        else if (vars._isWindows) {
            terminal.sendText("Connect-ServiceFabricCluster --ConnectionEndPoint "+ clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort);
            terminal.show();
        }
    }
    else {
        if (vars._isLinux) {
            exec('sfctl cluster select --endpoint http://localhost:10550', function (err, stdout, stderr) {
            if (err) {
                vscode.window.showErrorMessage("Could not connect to cluster.");
                console.log(err);
                return;
            }
            });
        }
        else if (vars._isWindows) {
            terminal.sendText("Connect-ServiceFabricCluster");
            terminal.show();
        }
    }
    uninstallApplication(terminal);
}

async function uninstallApplication(terminal:vscode.Terminal) {
    var uri: vscode.Uri[] = null;
    if (vars._isWindows) {
         uri = await vscode.workspace.findFiles('**/uninstall.ps1');
         if (uri.length < 1) {
            vscode.window.showErrorMessage("An uninstall.ps1 file was not found in the workspace");
            return;     
        }
    }
    else if (vars._isLinux) {
         uri = await vscode.workspace.findFiles('**/uninstall.sh');
         if (uri.length < 1) {
            vscode.window.showErrorMessage("An uninstall.sh file was not found in the workspace");
            return;
        }
    }
    const relativeInstallPath = vscode.workspace.asRelativePath(uri[0]);
    if (vars._isLinux)
        changePermissions(relativeInstallPath,terminal);
    terminal.sendText(relativeInstallPath);
    terminal.show();
}

function changePermissions(filename, terminal: vscode.Terminal) {
    var command = 'chmod a+x '+filename;
    terminal.sendText(command);
}