import * as vscode from "vscode";
const exec = require('child_process').exec;

export async function publishApplication() {
    await readCloudProfile();
}

async function deployToUnsecureCluster(clusterInfo) {
    exec('sfctl cluster select --endpoint ' + clusterInfo.ConnectionIPOrURL + clusterInfo.ConnectionPort, function (err, stdout, stderr) {
        if (err) {
            vscode.window.showErrorMessage("Could not connect to cluster.");
            console.log(err);
            return;
        }
        installApplication();
    });
}

async function deployToSecureClusterCert(clusterInfo) {
    exec('sfctl cluster select --endpoint ' + clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort + ' --cert ' + clusterInfo.ClientCert + ' --key ' + clusterInfo.ClientKey + ' --no-verify', function (err, stdout, stderr) {
        if (err) {
            vscode.window.showErrorMessage("Could not connect to cluster.");
            console.log(err);
            return;
        }
        installApplication();
    });
}

async function installApplication() {
    console.log("Install Application");
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

async function readCloudProfile() {
    var fs = require('fs');
    const cloudProfile: vscode.Uri[] = await vscode.workspace.findFiles('**/Cloud.json');
    const pathToCloudProfile = cloudProfile[0].path.replace('/c:', '');

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