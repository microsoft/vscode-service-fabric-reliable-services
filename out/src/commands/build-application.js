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
const config_utils_1 = require("../configureWorkspace/config-utils");
function buildApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        const languageType = yield config_utils_1.quickPickLanguage();
        if (languageType === 'Java') {
            buildGradleApplication();
        }
        else if (languageType === 'C#') {
            buildCSharpApplication();
        }
    });
}
exports.buildApplication = buildApplication;
function buildGradleApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        const uris = yield vscode.workspace.findFiles('**/build.gradle');
        if (uris.length < 1) {
            vscode.window.showErrorMessage("A build.gradle file was not found in the workspace");
            return;
        }
        //const relativeBuildPath = vscode.workspace.asRelativePath(uris[0].path).replace('build.gradle', '');
        const projectPath = uris[0].path.replace('build.gradle', '');
        let projectUri = vscode.Uri.parse(projectPath);
        // Changes the directory of the workspace!
        //vscode.commands.executeCommand('vscode.openFolder', projectUri);
        const terminal = vscode.window.createTerminal('ServiceFabric');
        terminal.sendText('gradle build ');
        terminal.show();
    });
}
function buildCSharpApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        const uris = yield vscode.workspace.findFiles('**/build.sh');
        if (uris.length < 1) {
            vscode.window.showErrorMessage("A build file was not found in the workspace");
            return;
        }
        const relativeBuildPath = vscode.workspace.asRelativePath(uris[0].path);
        const terminal = vscode.window.createTerminal('ServiceFabric');
        terminal.sendText('./' + relativeBuildPath);
        terminal.show();
    });
}
//# sourceMappingURL=build-application.js.map