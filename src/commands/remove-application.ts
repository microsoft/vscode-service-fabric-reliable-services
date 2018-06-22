import * as vscode from 'vscode';
import * as vars from './osdetector'
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

export async function removeApplication() {
    connectToCluster();
}

async function connectToCluster() {
    var fs = require('fs');
    var clusterData;
    var clusterInfo;

    const cloudProfile: vscode.Uri[] = await vscode.workspace.findFiles('**/Cloud.json');
    const pathToCloudProfile = cloudProfile[0].fsPath.replace('/c:', '');

    await fs.readFile(pathToCloudProfile, 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
        clusterData = JSON.parse(data);
        clusterInfo = clusterData.ClusterConnectionParameters;
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
    if(vars._isLinux || vars._isMacintosh){       
        exec('sfctl cluster select --endpoint ' + clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort + ' --cert ' + clusterInfo.ClientCert + ' --key ' + clusterInfo.ClientKey + ' --no-verify', function (err, stdout, stderr) {
            if (err) {
                vscode.window.showErrorMessage("Could not connect to cluster.");
                console.log(err);
                return;
            }
        });
    }
    else if(vars._isWindows){
        terminal.sendText("Connect-ServiceFabricCluster -ConnectionEndPoint "+ clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort + " -X509Credential -ServerCertThumbprint " + clusterInfo.ServerCertThumbprint + " -FindType FindByThumbprint -FindValue " + clusterInfo.ClientCertThumbprint +" -StoreLocation CurrentUser -StoreName My");
        terminal.show();
    }
    uninstallApplication(terminal);    
}

async function connectToUnsecureCluster(clusterInfo) {
    var terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    if (clusterInfo.ConnectionIPOrURL.length > 0) {
        if (vars._isLinux || vars._isMacintosh) {
            exec('sfctl cluster select --endpoint ' + clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort, function (err, stdout, stderr) {
                if (err) {
                    vscode.window.showErrorMessage("Could not connect to cluster.");
                    console.log(err);
                    return;
                }
            });
        }
        else if (vars._isWindows) {
            terminal.sendText("Connect-ServiceFabricCluster -ConnectionEndPoint "+ clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort);
            terminal.show();
        }
    }
    else {
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
            terminal.sendText("Connect-ServiceFabricCluster -ConnectionEndPoint localhost:19000");
            terminal.show();
        }
    }
    uninstallApplication(terminal);
}

async function uninstallApplication(terminal:vscode.Terminal) {
    var uri: vscode.Uri[] = null;
    uri = await vscode.workspace.findFiles('**/uninstall' + installScriptExtension);
    if (uri.length < 1) {
    vscode.window.showErrorMessage("An uninstall file was not found in the workspace");
    return;
    }
    const relativeInstallPath = vscode.workspace.asRelativePath(uri[0]);
    terminal.sendText('./' + relativeInstallPath);
    terminal.show();
}