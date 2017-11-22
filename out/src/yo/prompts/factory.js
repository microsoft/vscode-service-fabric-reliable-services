"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("./input");
const password_1 = require("./password");
const list_1 = require("./list");
const confirm_1 = require("./confirm");
const checkbox_1 = require("./checkbox");
const expand_1 = require("./expand");
class PromptFactory {
    static createPrompt(question, answers) {
        /**
         * TODO:
         *   - folder
         */
        switch (question.type || 'input') {
            case 'string':
            case 'input':
                return new input_1.default(question, answers);
            case 'password':
                return new password_1.default(question, answers);
            case 'list':
                return new list_1.default(question);
            case 'confirm':
                return new confirm_1.default(question);
            case 'checkbox':
                return new checkbox_1.default(question);
            case 'expand':
                return new expand_1.default(question);
            default:
                throw new Error(`Could not find a prompt for question type ${question.type}`);
        }
    }
}
exports.default = PromptFactory;
//# sourceMappingURL=factory.js.map