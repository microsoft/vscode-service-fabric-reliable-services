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
function quickPickLanguage() {
    return __awaiter(this, void 0, void 0, function* () {
        var opt = {
            matchOnDescription: true,
            matchOnDetail: true,
            placeHolder: 'Select Project Language'
        };
        const items = [];
        items.push('Java');
        items.push('C#');
        return vscode.window.showQuickPick(items, opt);
    });
}
exports.quickPickLanguage = quickPickLanguage;
function quickPickServiceType() {
    return __awaiter(this, void 0, void 0, function* () {
        var opt = {
            matchOnDescription: true,
            matchOnDetail: true,
            placeHolder: 'Choose a framework for your service'
        };
        const items = [];
        items.push('Reliable Actor Service');
        items.push('Reliable Stateless Service');
        items.push('Reliable Stateful Service');
        return vscode.window.showQuickPick(items, opt);
    });
}
exports.quickPickServiceType = quickPickServiceType;
//# sourceMappingURL=config-utils.js.map