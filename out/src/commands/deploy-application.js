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
const exec = require('child_process').exec;
function deployApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        exec('sfctl cluster select --endpoint http://localhost:19080', function (err, stdout, stderr) {
            if (err) {
                vscode.window.showErrorMessage("Could not connect to cluster.");
                console.log(err);
                return;
            }
            installApplication();
        });
    });
}
exports.deployApplication = deployApplication;
function installApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        const uri = yield vscode.workspace.findFiles('**/install.sh');
        if (uri.length < 1) {
            vscode.window.showErrorMessage("An install.sh file was not found in the workspace");
            return;
        }
        const relativeInstallPath = vscode.workspace.asRelativePath(uri[0].path);
        const terminal = vscode.window.createTerminal('ServiceFabric');
        terminal.sendText('./' + relativeInstallPath);
        terminal.show();
    });
}
//# sourceMappingURL=deploy-application.js.map