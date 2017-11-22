"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const prompt_1 = require("./prompt");
const EscapeException_1 = require("../utils/EscapeException");
class ConfirmPrompt extends prompt_1.default {
    constructor(question) {
        super(question);
    }
    render() {
        const choices = {
            Yes: true,
            No: false
        };
        const options = {
            placeHolder: this._question.message
        };
        return vscode_1.window.showQuickPick(Object.keys(choices), options)
            .then(result => {
            if (result === undefined) {
                throw new EscapeException_1.default();
            }
            return choices[result] || false;
        });
    }
}
exports.default = ConfirmPrompt;
//# sourceMappingURL=confirm.js.map