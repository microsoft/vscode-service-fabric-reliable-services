import * as vscode from "vscode";
import { quickPickLanguage } from '../configureWorkspace/config-utils';
import { win32 } from "path";
import * as vars from './osdetector';
import { resolve } from "url";

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

export async function buildApplication() {

    var languageType;
    const buildFiles: vscode.Uri[] = await vscode.workspace.findFiles('**/build.gradle');
    if (buildFiles.length < 1)
        languageType = 'C#';
    else
        languageType = 'Java';

    const uris: vscode.Uri[] = await vscode.workspace.findFiles('**/Cloud.json');
    if (uris.length < 1) {
        createPublishProfile();
    }

    if (languageType === 'Java') {
        buildGradleApplication();
    } else if (languageType === 'C#') {
        buildCSharpApplication(true);
    }
}

export async function buildGradleApplication() {

    const uris: vscode.Uri[] = await vscode.workspace.findFiles('**/build.gradle');
    if (uris.length < 1) {
        vscode.window.showErrorMessage("A build.gradle file was not found in the workspace");
        return;
    }

    const projectPath = uris[0].path.replace('build.gradle', '');
    let projectUri = vscode.Uri.parse(projectPath);

    const terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    terminal.sendText('gradle ');
    terminal.show();
}

export async function buildCSharpApplication(showTerminal:boolean) {
    var uris: vscode.Uri[] = null;
    uris = await vscode.workspace.findFiles('**/build' + builScriptExtension);
    if (uris.length < 1) {
        vscode.window.showErrorMessage("A build file was not found in the workspace");
        return 1;
    }
    const buildPath = uris[0].fsPath.replace('/c:', '');
    replaceBuildPath(buildPath);
    const relativeBuildPath = vscode.workspace.asRelativePath(uris[0]);
    const terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    var commands = "./" + relativeBuildPath ;
    terminal.sendText(commands,true);
    if (showTerminal) {
        terminal.show();
        return 0;
    }
    else {
        //This is path for testing. To check whether the build command is successfully sent to terminal
        terminal.show(true);
        terminal.sendText('$? > TestCSharpApplication/out.out',true);
        var fs = require('fs');
        console.log(vscode.workspace.workspaceFolders[0].uri.fsPath);
        var outpath = vscode.workspace.workspaceFolders[0].uri.fsPath+'/TestCSharpApplication/out.out';
        var content;
        return new Promise((resolve, reject) => {
            setTimeout(function(){
                content = fs.readFileSync(outpath, 'utf8');
                if(content.includes('T'))
                    resolve(0);
                else
                    reject(1);
            },30000);
        });
    }
}

function replaceBuildPath(filePath) {
    var fs = require('fs')
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(/\\/g, "/");

        fs.writeFile(filePath, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}

async function createPublishProfile() {
    var publishParams = {
        ClusterConnectionParameters: {
            ConnectionIPOrURL: '',
            ConnectionPort: '19080',
            ClientKey: '',
            ClientCert: '',
            ServerCertThumbprint: '',
            ClientCertThumbprint: ''
        }
    };
    var publishParamsJson = JSON.stringify(publishParams, null, 4);

    var uri: vscode.Uri[] = null;
    var buildPath;
    uri = await vscode.workspace.findFiles('**/install' + installScriptExtension);
    if (uri.length < 1) {
        vscode.window.showErrorMessage("An install file was not found in the workspace");
        return;
    }
    buildPath = uri[0].fsPath.replace('/c:', '').replace('install'+ installScriptExtension,'');

    console.log('Build Path: '+buildPath);
    var fs = require('fs');
    fs.writeFile(buildPath + 'Cloud.json', publishParamsJson, 'utf8', function(err) {
        if (err) throw err;
        console.log('Completed!');
    });
}
