import * as vscode from 'vscode';
const exec = require('child_process').exec;

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

async function connectToCluster() {
    var fs = require('fs');
    var clusterInfo;

    const cloudProfile: vscode.Uri[] = await vscode.workspace.findFiles('**/Cloud.json');
    const pathToCloudProfile = cloudProfile[0].path;

    await fs.readFile(pathToCloudProfile, 'utf8', function (err, data) {
        if(err) {
            throw err;
        }
        clusterInfo = JSON.parse(data);
    });

    if(clusterInfo.ClientKey.length > 0) {
    } else {

    }
}

function connectToSecureCluster(clusterInfo) {
    exec('sfctl cluster select --endpoint ' + clusterInfo.ConnectionIPOrURL  + ' --cert' + clusterInfo.ClientCert + ' --key' + clusterInfo.ClientKey, function (err, stdout, stderr) {
        if (err) {
            vscode.window.showErrorMessage("Could not connect to cluster.");
            console.log(err);
            return;
        }
    });
}

function connectToUnsecureCluster(clusterInfo) {
    exec('sfctl cluster select --endpoint ' + clusterInfo.ConnectionIPOrURL , function (err, stdout, stderr) {
        if (err) {
            vscode.window.showErrorMessage("Could not connect to cluster.");
            console.log(err);
            return;
        }
        installApplication();
    });
}