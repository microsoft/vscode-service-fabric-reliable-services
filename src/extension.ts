// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument, Terminal } from 'vscode';
import { addSFService } from './commands/add-sf-service';
import { buildApplication } from './commands/build-application';
import { cleanJavaApplication } from './commands/clean-application-java';
import { createApplication } from './commands/create-application';
import { deployApplication } from './commands/deploy-application';
import { publishApplication } from './commands/publish-application';
import { removeApplication } from './commands/remove-application';
import { upgradeApplication } from './commands/upgrade-application';
import { openVSproject } from './commands/Initialize VS project for VScode';

// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.log('Congratulations, your extension "Service Fabric" is now active!');

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
}
