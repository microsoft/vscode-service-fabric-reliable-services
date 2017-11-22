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
function cleanJavaApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        const uri = yield vscode.workspace.findFiles('build.gradle');
        if (uri.length < 1) {
            vscode.window.showErrorMessage("Task clean was not found in root project");
            return;
        }
        const terminal = vscode.window.createTerminal('Service Fabric');
        terminal.sendText('gradle clean ');
        terminal.show();
    });
}
exports.cleanJavaApplication = cleanJavaApplication;
//# sourceMappingURL=clean-application-java.js.map