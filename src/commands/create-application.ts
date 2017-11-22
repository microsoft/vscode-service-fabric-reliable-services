import * as vscode from 'vscode';
import { generatorProject } from '../yo';

import { quickPickLanguage, quickPickServiceType } from '../configureWorkspace/config-utils';

export async function createApplication() {
    await generatorProject(false);
    // // How should the user select the type of service that they wish to generate?
    // const languageType = await quickPickLanguage();
    // const projectName = await promptForProjectName();
    // const serviceType = await quickPickServiceType();
    // const serviceName = await promptForServiceName();

    // if (!languageType || languageType === '') {
    //     showEmptyError('Project language');
    //     return;
    // }

    // if (!projectName || projectName === '') {
    //     showEmptyError('Project name');
    //     return;
    // }

    // if (!serviceType || serviceType === '') {
    //     showEmptyError('Service type');
    //     return;
    // }

    // if (!serviceName || serviceName === '') {
    //     showEmptyError('Service name');
    //     return;
    // }

    // switch (languageType) {
    //     case 'Java': {
    //         generateJavaProject(projectName, serviceType, serviceName);
    //         break;
    //     }
    //     case 'C#': {
    //         generateCSharpProject(projectName, serviceType, serviceName);
    //         break;
    //     }
    // }

    // let yeomanExtension = vscode.extensions.getExtension('samverschueren.yo').activate;
}

function showEmptyError(emptyValue) {
    vscode.window.showErrorMessage(emptyValue + ' cannot be blank.')
}

async function promptForProjectName(): Promise<string> {
    var opt: vscode.InputBoxOptions = {
        placeHolder: 'Project Name',
        prompt: 'Enter a Project Name',
    }

    return vscode.window.showInputBox(opt);
}

async function promptForServiceName(): Promise<string> {
    var opt: vscode.InputBoxOptions = {
        placeHolder: 'Service Name',
        prompt: 'Enter a Service Name',
    }

    return vscode.window.showInputBox(opt);
}

function generateJavaProject(projectName, serviceType, serviceName) {





    vscode.window.showInformationMessage('Generating a Java Project!');
}

function generateCSharpProject(projectName, serviceType, serviceName) {
    vscode.window.showInformationMessage('Generating a C# Project!');
}
