"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
const vscode_1 = require("vscode");
const add_sf_service_1 = require("./commands/add-sf-service");
const build_application_1 = require("./commands/build-application");
const clean_application_java_1 = require("./commands/clean-application-java");
const create_application_1 = require("./commands/create-application");
const deploy_application_1 = require("./commands/deploy-application");
const publish_application_1 = require("./commands/publish-application");
const remove_application_1 = require("./commands/remove-application");
// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.log('Congratulations, your extension "Service Fabric" is now active!');
    // Registering all of the possible commands for interacting with a Service Fabric Project
    context.subscriptions.push(vscode_1.commands.registerCommand('vscode-sf.addSFService', add_sf_service_1.addSFService));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscode-sf.buildApplication', build_application_1.buildApplication));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscode-sf.cleanJavaApplication', clean_application_java_1.cleanJavaApplication));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscode-sf.createApplication', create_application_1.createApplication));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscode-sf.deployApplication', deploy_application_1.deployApplication));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscode-sf.publishApplication', publish_application_1.publishApplication));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscode-sf.removeApplication', remove_application_1.removeApplication));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map