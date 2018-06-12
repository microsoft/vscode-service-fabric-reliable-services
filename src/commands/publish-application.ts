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

export async function publishApplication() {
    await readCloudProfile();
}

async function deployToUnsecureCluster(clusterInfo) {
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
            terminal.sendText("Connect-ServiceFabricCluster --ConnectionEndPoint "+ clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort);
            terminal.show();
        }
    }
    else {
        if (vars._isLinux || vars._isMacintosh) {
            exec('sfctl cluster select --endpoint http://localhost:10550', function (err, stdout, stderr) {
            if (err) {
                vscode.window.showErrorMessage("Could not connect to cluster.");
                console.log(err);
                return;
            }
            });
        }
        else if (vars._isWindows) {
            terminal.sendText("Connect-ServiceFabricCluster -ConnectionEndpoint localhost:19000");
            terminal.show();
        }
    }
    installApplication();
}

async function deployToSecureClusterCert(clusterInfo) {
    var terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    if (vars._isLinux || vars._isWindows) {
        exec('sfctl cluster select --endpoint ' + clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort + ' --cert ' + clusterInfo.ClientCert + ' --key ' + clusterInfo.ClientKey + ' --no-verify', function (err, stdout, stderr) {
            if (err) {
                vscode.window.showErrorMessage("Could not connect to cluster.");
                console.log(err);
                return;
            }
        });
    }
    else if (vars._isWindows) {
        terminal.sendText("Connect-ServiceFabricCluster --ConnectionEndPoint "+ clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort + " -X509Credential -ServerCertThumbprint " + clusterInfo.ServerCertThumbprint + "-FindType FindByThumbprint -FindValue " + clusterInfo.ClientCertThumbprint +" -StoreLocation CurrentUser -StoreName My");
        terminal.show();
    }
    installApplication();
}

async function installApplication() {
    console.log("Install Application");
    var uri: vscode.Uri[] = null;
    if (vars._isWindows) {
         uri = await vscode.workspace.findFiles('**/install' + installScriptExtension);
         if (uri.length < 1) {
            vscode.window.showErrorMessage("An install file was not found in the workspace");
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