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
function removeApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        const uri = yield vscode.workspace.findFiles('**/uninstall.sh');
        if (uri.length < 1) {
            vscode.window.showErrorMessage("An uninstall.sh file was not found in the workspace");
            return;
        }
        const relativeInstallPath = vscode.workspace.asRelativePath(uri[0].path);
        const terminal = vscode.window.createTerminal('ServiceFabric');
        terminal.sendText('./' + relativeInstallPath);
        terminal.show();
    });
}
exports.removeApplication = removeApplication;
//# sourceMappingURL=remove-application.js.map