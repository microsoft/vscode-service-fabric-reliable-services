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

export async function upgradeApplication() {
    var version = await readVersionFromManifest();
    var clusterInfo = await readCloudProfile();
    if (clusterInfo.ClientCert.length > 0 || clusterInfo.ClientCertThumbprint.length > 0) {
        deployToSecureClusterCert(clusterInfo, version);
    } else {
        deployToUnsecureCluster(clusterInfo, version);
    }
}

async function deployToUnsecureCluster(clusterInfo, version) {
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
            terminal.sendText("Connect-ServiceFabricCluster -ConnectionEndpoint localhost:19000");
            terminal.show();
        }
    }
    installApplication(terminal, version);
}

async function deployToSecureClusterCert(clusterInfo, version) {
    var terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    if (vars._isLinux || vars._isMacintosh) {
        exec('sfctl cluster select --endpoint ' + clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort + ' --cert ' + clusterInfo.ClientCert + ' --key ' + clusterInfo.ClientKey + ' --no-verify', function (err, stdout, stderr) {
            if (err) {
                vscode.window.showErrorMessage("Could not connect to cluster.");
                console.log(err);
                return;
            }
        });
    }
    else if (vars._isWindows) {
        terminal.show();
        terminal.sendText("Connect-ServiceFabricCluster -ConnectionEndPoint "+ clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort + " -X509Credential -ServerCertThumbprint " + clusterInfo.ServerCertThumbprint + " -FindType FindByThumbprint -FindValue " + clusterInfo.ClientCertThumbprint +" -StoreLocation CurrentUser -StoreName My");
    }
    installApplication(terminal, version);
}

async function installApplication(terminal:vscode.Terminal, version:string) {
    console.log("Upgrade Application");
    var uri: vscode.Uri[] = null;
    uri = await vscode.workspace.findFiles('**/upgrade' + installScriptExtension);
    if (uri.length < 1) {
        vscode.window.showErrorMessage("An upgrade file was not found in the workspace");
        return;
    }
    const relativeInstallPath = vscode.workspace.asRelativePath(uri[0]);
    terminal.sendText('./' + relativeInstallPath + ' -version ' + version);
    terminal.show();
}

async function readVersionFromManifest(): Promise<string> {
    var fs = require('fs');
    const cloudProfile: vscode.Uri[] = await vscode.workspace.findFiles('**/ApplicationManifest.xml');
    const pathToCloudProfile = cloudProfile[0].fsPath.replace('/c:', '');
    const manifest = fs.readFileSync(pathToCloudProfile).toString('utf8');
    var manifestJs;
    var parseString = require('xml2js').parseString;

    parseString(manifest, function(err, result) {
        manifestJs = result;
    });

    var version = manifestJs['ApplicationManifest']['$']['ApplicationTypeVersion'];
    return version;
}

async function readCloudProfile() {
    var fs = require('fs');
    const cloudProfile: vscode.Uri[] = await vscode.workspace.findFiles('**/Cloud.json');
    const pathToCloudProfile = cloudProfile[0].fsPath.replace('/c:', '');
    const profile = fs.readFileSync(pathToCloudProfile).toString('utf8');

    var clusterData = JSON.parse(profile);
    var clusterInfo = clusterData.ClusterConnectionParameters;
    return clusterInfo;
}