// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
import * as vscode from "vscode";
import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument, Terminal } from 'vscode';
import { addSFService } from './commands/add-sf-service';
import { buildApplication } from './commands/build-application';
import { cleanJavaApplication } from './commands/clean-application-java';
import { createApplication } from './commands/create-application';
import { deployApplication } from './commands/deploy-application';
import { publishApplication } from './commands/publish-application';
import { removeApplication } from './commands/remove-application';
import { upgradeApplication } from './commands/upgrade-application';
import { openVSproject } from './commands/InitializeVSProject';
import { cleanCsharpApplication } from './commands/clean-application-csharp';
var fs=require('fs');
var find=require('find');
var path=require('path');
var ind=require('./yo/index');
var fe=require('./commands/InitializeVSProject');
var fileext=fe.fileext;
import {getWorkingFolder} from './yo';
// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
var configfilename=ind.configfilename;
export async function activate(context: ExtensionContext) {
    var re = new RegExp("\."+ fileext +"$", "g");
    var root=await getWorkingFolder();
    var files = find.fileSync(re,root);
    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.log('Congratulations, your extension "Service Fabric" is now active!');
    if(files.length&&!fs.existsSync(path.join(root,configfilename))){
        window.showInformationMessage("This is a VS project, do you want to initialise it for VS code?","Continue","Cancel").then(choice => {
            if (choice === 'Continue') {
                openVSproject();
            }
            else if(choice === 'Cancel')
            {
            }
        });; 
    }
    // Registering all of the possible commands for interacting with a Service Fabric Project
    context.subscriptions.push(commands.registerCommand('vscode-sf.addSFService', addSFService));
    context.subscriptions.push(commands.registerCommand('vscode-sf.buildApplication', buildApplication));
    context.subscriptions.push(commands.registerCommand('vscode-sf.cleanJavaApplication', cleanJavaApplication));
    context.subscriptions.push(commands.registerCommand('vscode-sf.createApplication', createApplication));
    context.subscriptions.push(commands.registerCommand('vscode-sf.deployApplication', deployApplication));
    context.subscriptions.push(commands.registerCommand('vscode-sf.publishApplication', publishApplication));
    context.subscriptions.push(commands.registerCommand('vscode-sf.removeApplication', removeApplication));
    context.subscriptions.push(commands.registerCommand('vscode-sf.upgradeApplication', upgradeApplication));
    context.subscriptions.push(commands.registerCommand('vscode-sf.openVSproject', openVSproject));
    context.subscriptions.push(commands.registerCommand('vscode-sf.cleanCsharpApplication', cleanCsharpApplication));
}


