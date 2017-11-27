import * as vscode from "vscode";
import { quickPickLanguage } from '../configureWorkspace/config-utils';

export async function buildApplication() {

    const languageType = await quickPickLanguage();

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
    const uris: vscode.Uri[] = await vscode.workspace.findFiles('**/build.sh');
    if (uris.length < 1) {
        vscode.window.showErrorMessage("A build file was not found in the workspace");
        return;
    }

    const buildPath = uris[0].path.replace('/c:','');
    replaceBuildPath(buildPath);
    const relativeBuildPath = vscode.workspace.asRelativePath(uris[0].path);
    const terminal: vscode.Terminal = vscode.window.createTerminal('ServiceFabric');
    terminal.sendText('./' + relativeBuildPath);
    terminal.show();
}

function replaceBuildPath(filePath) {
    var fs = require('fs')
    fs.readFile(filePath, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace(/\\/g, "/");
    
      fs.writeFile(filePath, result, 'utf8', function (err) {
         if (err) return console.log(err);
      });
    });
}

