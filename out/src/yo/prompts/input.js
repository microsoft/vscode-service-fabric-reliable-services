"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const prompt_1 = require("./prompt");
const EscapeException_1 = require("../utils/EscapeException");
const run_async_1 = require("../utils/run-async");
const figures = require('figures');
class InputPrompt extends prompt_1.default {
    constructor(question, answers) {
        super(question, answers);
        this._options = {
            prompt: this._question.message
        };
    }
    render() {
        return run_async_1.default(this._question.default)(this._answers)
            .then(placeHolder => {
            if (placeHolder instanceof Error) {
                placeHolder = placeHolder.message;
                this._question.default = undefined;
            }
            this._options.placeHolder = placeHolder;
            return vscode_1.window.showInputBox(this._options);
        })
            .then(result => {
            if (result === undefined) {
                throw new EscapeException_1.default();
            }
            if (result === '') {
                result = this._options.placeHolder || '';
            }
            return run_async_1.default(this._question.validate)(result || '')
                .then(valid => {
                if (valid !== undefined && valid !== true) {
                    this._question.default = new Error(`${figures.warning} ${valid}`);
                    return this.render();
                }
                return result;
            });
        });
    }
}
exports.default = InputPrompt;
//# sourceMappingURL=input.js.map