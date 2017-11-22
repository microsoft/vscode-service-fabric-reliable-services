import * as vscode from "vscode";
const exec = require('child_process').exec;

export async function publishApplication() {
    const endpoint = await promptForEndpointName();
    const security = await pickSecuityType();

    if (security === 'Secure Cluster') {
        const certType = await pickCertificateType();
        if (certType === 'Pem') {
            const pathToPem = await promptForPathToPem();
            deployToSecureClusterPem(endpoint, pathToPem);
        } else {
            const pathToCert = await promptForPathToCert();
            const pathToKey = await promptForPathToKey();
            deployToSecureClusterCert(endpoint, pathToCert, pathToKey);
        }
    } else {
        deployToUnsecureCluster(endpoint);
    }
}

async function pickSecuityType(): Promise<string> {
    var opt: vscode.QuickPickOptions = {
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolder: 'Please select a cluster type'
    }

    const items: string[] = [];
    items.push('Unsecure Cluster');
    items.push('Secure Cluster');

    return vscode.window.showQuickPick(items, opt);
}

async function pickCertificateType(): Promise<string> {
    var opt: vscode.QuickPickOptions = {
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolder: 'Please select a certificate type'
    }

    const items: string[] = [];
    items.push('Pem');
    items.push('Cert, Key Pair');

    return vscode.window.showQuickPick(items, opt);
}

async function promptForPathToPem(): Promise<string> {
    var opt: vscode.InputBoxOptions = {
        placeHolder: 'client.pem',
        prompt: 'Enter the path relative to the current workspace to the pem file',
    }

    return vscode.window.showInputBox(opt);
}

async function promptForPathToCert(): Promise<string> {
    var opt: vscode.InputBoxOptions = {
        placeHolder: 'client.crt',
        prompt: 'Enter the path relative to the current workspace to the cert file',
    }

    return vscode.window.showInputBox(opt);
}

async function promptForPathToKey(): Promise<string> {
    var opt: vscode.InputBoxOptions = {
        placeHolder: 'client.crt',
        prompt: 'Enter the path relative to the current workspace to the key file',
    }

    return vscode.window.showInputBox(opt);
}

async function promptForEndpointName(): Promise<string> {
    var opt: vscode.InputBoxOptions = {
        placeHolder: 'Connection Endpoint',
        prompt: 'Enter a cluster connection endpoint http://PublicIPorFQDN:19080',
    }

    return vscode.window.showInputBox(opt);
}

async function deployToUnsecureCluster(endpoint) {
    exec('sfctl cluster select --endpoint ' + endpoint, function (err, stdout, stderr) {
        if (err) {
            vscode.window.showErrorMessage("Could not connect to cluster.");
            console.log(err);
            return;
        }
        installApplication();
    });
}

async function deployToSecureClusterPem(endpoint, pathToPem) {
    exec('sfctl cluster select --endpoint ' + endpoint + ' --pem ' + pathToPem + ' --no-verify', function (err, stdout, stderr) {
        if (err) {
            vscode.window.showErrorMessage("Could not connect to cluster.");
            console.log(err);
            return;
        }
        installApplication();
    });
}

async function deployToSecureClusterCert(endpoint, pathToCert, pathToKey) {
    exec('sfctl cluster select --endpoint ' + endpoint + ' --cert' + pathToCert + ' --key' + pathToKey, function (err, stdout, stderr) {
        if (err) {
            vscode.window.showErrorMessage("Could not connect to cluster.");
            console.log(err);
            return;
        }
        installApplication();
    });
}

async function installApplication() {
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