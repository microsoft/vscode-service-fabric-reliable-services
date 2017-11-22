"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const prompt_1 = require("./prompt");
const EscapeException_1 = require("../utils/EscapeException");
const figures = require('figures');
class CheckboxPrompt extends prompt_1.default {
    constructor(question) {
        question.choices = question.choices.map(choice => {
            if (typeof choice === 'string') {
                return {
                    name: choice,
                    value: choice
                };
            }
            return choice;
        });
        super(question);
    }
    render() {
        let choices = this._question.choices.reduce((result, choice) => {
            result[`${choice.checked === true ? figures.radioOn : figures.radioOff} ${choice.name}`] = choice;
            return result;
        }, {});
        const options = {
            placeHolder: this._question.message
        };
        let quickPickOptions = Object.keys(choices);
        quickPickOptions.push(figures.tick);
        return vscode_1.window.showQuickPick(quickPickOptions, options)
            .then(result => {
            if (result === undefined) {
                throw new EscapeException_1.default();
            }
            if (result !== figures.tick) {
                choices[result].checked = !choices[result].checked;
                return this.render();
            }
            return this._question.choices.reduce((result, choice) => {
                if (choice.checked === true) {
                    result.push(choice.value);
                }
                return result;
            }, []);
        });
    }
}
exports.default = CheckboxPrompt;
//# sourceMappingURL=checkbox.js.map