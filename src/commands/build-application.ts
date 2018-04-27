import * as vscode from "vscode";
import { quickPickLanguage } from '../configureWorkspace/config-utils';
import { win32 } from "path";
import * as vars from './osdetector';

let _isWindows = false;
let _isMacintosh = false;
let _isLinux = false;

export interface IProcessEnvironment {
	[key: string]: string;
}
interface INodeProcess {
	platform: string;
	env: IProcessEnvironment;
	getuid(): number;
	nextTick: Function;
}
declare let process :INodeProcess;

    _isWindows = (process.platform === 'win32');
	_isMacintosh = (process.platform === 'darwin');
    _isLinux = (process.platform === 'linux');
    
export async function buildApplication() {

    const languageType = await quickPickLanguage();

    const uris: vscode.Uri[] = await vscode.workspace.findFiles('**/Cloud.json');
    if (uris.length < 1) {
        createPublishProfile();
    }

    if (languageType === 'Java') {
        buildGradleApplication();
    } else if (languageType === 'C#') {
        buildCSharpApplication();
    }
}

async function buildGradleApplication() {

    const uris: vscode.Uri[] = await vscode.workspace.findFiles('**/build.gradle');
    if (uris.length < 1) {
        vscode.window.showErrorMessage("A build.gradle file was not found in the workspace");
        return;
    }

    const projectPath = uris[0].path.replace('build.gradle', '');
    let projectUri = vscode.Uri.parse(projectPath);

    const terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    terminal.sendText('gradle build ');
    terminal.show();
}

async function buildCSharpApplication() {
     var uris: vscode.Uri[] = null;
    if(_isWindows)
        uris = await vscode.workspace.findFiles('**/build.cmd');
    else if(_isLinux)
        uris = await vscode.workspace.findFiles('**/build.sh');
    if (uris.length < 1) {
        vscode.window.showErrorMessage("A build file was not found in the workspace");
        return;
    }

    const buildPath = uris[0].path.replace('/c:', '');
    replaceBuildPath(buildPath);
    const relativeBuildPath = vscode.workspace.asRelativePath(uris[0]);
    const terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    var commands = relativeBuildPath ;
    terminal.sendText(commands);
    if(_isLinux)
       changePermissions(commands,terminal);
    terminal.show();
}

function changePermissions(filename, terminal: vscode.Terminal){
       var command = 'chmod a+x '+filename;
       terminal.sendText(command);
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
        ConnectionIPOrURL: '',
        ConnectionPort: '19080',
        ClientKey: '',
        ClientCert: '' };
    var publishParamsJson = JSON.stringify(publishParams, null, 4);

      var uri: vscode.Uri[] = null;
      var buildPath;
    if(vars._isWindows){
         uri = await vscode.workspace.findFiles('**/install.ps1');
         if (uri.length < 1) {
            vscode.window.showErrorMessage("An install.cmd file was not found in the workspace");
            return;     
        }
         buildPath = uri[0].fsPath.replace('/c:', '').replace('install.ps1','');
    }
    else if(vars._isLinux){
         uri = await vscode.workspace.findFiles('**\/install.sh');
         if (uri.length < 1) {
            vscode.window.showErrorMessage("An install.sh file was not found in the workspace");
            return;
        }
        buildPath = uri[0].path.replace('/c:', '').replace('install.sh','');
}

    console.log('Build Path: '+buildPath);
    var fs = require('fs');
    fs.writeFile(buildPath + 'Cloud.json', publishParamsJson, 'utf8', function(err) {
        if(err) throw err;
        console.log('Completed!');
    });
}
