import * as vscode from 'vscode';
import { generatorProject } from '../yo';


export function addSFService() {

    // Need a way of determining what type of service to create
    // Maybe have 3 different commands for each type of service?
    // Does a Yeoman generator exist for an individual service?
    generatorProject(true);

}

function generateSFService(serviceName) {
    vscode.window.showInformationMessage("Service Name: "+serviceName);
}