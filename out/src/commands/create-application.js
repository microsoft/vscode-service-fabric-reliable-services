"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const yo_1 = require("../yo");
function createApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        yield yo_1.generatorProject(false);
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
    });
}
exports.createApplication = createApplication;
function showEmptyError(emptyValue) {
    vscode.window.showErrorMessage(emptyValue + ' cannot be blank.');
}
function promptForProjectName() {
    return __awaiter(this, void 0, void 0, function* () {
        var opt = {
            placeHolder: 'Project Name',
            prompt: 'Enter a Project Name',
        };
        return vscode.window.showInputBox(opt);
    });
}
function promptForServiceName() {
    return __awaiter(this, void 0, void 0, function* () {
        var opt = {
            placeHolder: 'Service Name',
            prompt: 'Enter a Service Name',
        };
        return vscode.window.showInputBox(opt);
    });
}
function generateJavaProject(projectName, serviceType, serviceName) {
    vscode.window.showInformationMessage('Generating a Java Project!');
}
function generateCSharpProject(projectName, serviceType, serviceName) {
    vscode.window.showInformationMessage('Generating a C# Project!');
}
//# sourceMappingURL=create-application.js.map