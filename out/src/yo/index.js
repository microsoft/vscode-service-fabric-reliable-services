'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const yo_1 = require("./yo/yo");
const fs = require('fs');
const figures = require('figures');
const opn = require('opn');
function getWorkingFolder() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(vscode_1.workspace.workspaceFolders) || vscode_1.workspace.workspaceFolders.length === 0) {
            return undefined;
        }
        if (vscode_1.workspace.workspaceFolders.length === 1) {
            return vscode_1.workspace.workspaceFolders[0].uri.fsPath;
        }
        const selectedWkFolder = vscode_1.window.showWorkspaceFolderPick();
        return selectedWkFolder ? selectedWkFolder.uri.fspath : undefined;
    });
}
function generatorProject(addService) {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = yield getWorkingFolder();
        if (!cwd) {
            vscode_1.window.showErrorMessage('Please open a workspace directory first.');
            return;
        }
        const yo = new yo_1.default({ cwd });
        let main;
        let sub;
        const generator = yield vscode_1.window.showQuickPick(list(yo));
        if (generator === undefined) {
            return;
        }
        main = generator.label;
        let subGenerator;
        if (generator.subGenerators.length > 1 && addService) {
            subGenerator = yield runSubGenerators(generator.subGenerators);
        }
        else {
            subGenerator = 'app';
        }
        if (subGenerator === undefined) {
            return;
        }
        sub = subGenerator;
        try {
            const question = yield yo.run(`${main}:${sub}`, cwd);
            if (!question) {
                return;
            }
            const input = vscode_1.window.showInputBox({ prompt: question });
            if (!input) {
                return;
            }
            const argument = input;
            yield yo.run(`${main}:${sub} ${argument}`, cwd);
        }
        catch (err) {
            const regexp = new RegExp('Did not provide required argument (.*?)!', 'i');
            if (err) {
                const match = err.message.match(regexp);
                if (match) {
                    return `${sub} ${match[1]}?`;
                }
            }
            vscode_1.window.showErrorMessage(err.message || err);
        }
    });
}
exports.generatorProject = generatorProject;
function runSubGenerators(subGenerators) {
    const app = `${figures.star} app`;
    const index = subGenerators.indexOf('app');
    if (index !== -1) {
        subGenerators.splice(index, 1);
    }
    return vscode_1.window.showQuickPick(subGenerators)
        .then(choice => {
        if (choice === app) {
            return 'app';
        }
        return choice;
    });
}
function list(yo) {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            yo.getEnvironment().lookup(() => {
                const generators = yo.getGenerators().map(generator => {
                    return {
                        label: generator.name.replace(/(^|\/)generator\-/i, '$1'),
                        description: generator.description,
                        subGenerators: generator.subGenerators
                    };
                });
                if (generators.length === 0) {
                    reject();
                    vscode_1.window.showInformationMessage('Make sure to install some generators first.', 'more info')
                        .then(choice => {
                        if (choice === 'more info') {
                            opn('http://yeoman.io/learning/');
                        }
                    });
                    return;
                }
                const azureGenerators = generators.filter(generator => {
                    return generator.label === 'azuresfcsharp'
                        || generator.label === 'azuresfjava'
                        || generator.label === 'azuresfcontainer'
                        || generator.label === 'azuresfguest';
                });
                resolve(azureGenerators);
            });
        });
    });
}
//# sourceMappingURL=index.js.map