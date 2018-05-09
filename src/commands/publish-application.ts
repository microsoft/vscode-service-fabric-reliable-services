import * as vscode from "vscode";
import * as vars from './osdetector';
const exec = require('child_process').exec;

export async function publishApplication() {
    await readCloudProfile();
}

async function deployToUnsecureCluster(clusterInfo) {
    var terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    if(clusterInfo.ConnectionIPOrURL.length > 0){
        if(vars._isLinux){       
            exec('sfctl cluster select --endpoint ' + clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort, function (err, stdout, stderr) {
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
            terminal.sendText(commands); 
            terminal.show();
            terminal.sendText("Connect-ServiceFabricCluster --ConnectionEndPoint "+ clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort);
        }
    }
    else{
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
    }
    installApplication();
}

async function deployToSecureClusterCert(clusterInfo) {
    var terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    if(clusterInfo.ConnectionIPOrURL.length > 0){
        if(vars._isLinux){       
            exec('sfctl cluster select --endpoint ' + clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort, function (err, stdout, stderr) {
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
            terminal.sendText(commands); 
            terminal.show();
            terminal.sendText("Connect-ServiceFabricCluster --ConnectionEndPoint "+ clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort);
        }
    }
    else{
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
            var uri: vscode.Uri[] = await vscode.workspace.findFiles('**/       .ps1');
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
    }
    installApplication();
}

async function installApplication() {
    console.log("Install Application");
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
    terminal.sendText('./' + relativeInstallPath);
    terminal.show();
}

async function readCloudProfile() {
    var fs = require('fs');
    const cloudProfile: vscode.Uri[] = await vscode.workspace.findFiles('**/Cloud.json');
    const pathToCloudProfile = cloudProfile[0].fsPath.replace('/c:', '');

    await fs.readFile(pathToCloudProfile, 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
        var clusterInfo = JSON.parse(data);
        if (clusterInfo.ClientCert.length > 0) {
            deployToSecureClusterCert(clusterInfo);
        } else {
            deployToUnsecureCluster(clusterInfo);
        }
    });
}