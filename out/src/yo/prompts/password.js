"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("./input");
class PasswordPrompt extends input_1.default {
    constructor(question, answers) {
        super(question, answers);
        this._options.password = true;
    }
}
exports.default = PasswordPrompt;
//# sourceMappingURL=password.js.map