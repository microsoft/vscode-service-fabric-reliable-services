"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const vscode_1 = require("vscode");
const factory_1 = require("../prompts/factory");
const run_async_1 = require("../utils/run-async");
const logger = require('yeoman-environment/lib/util/log');
const diff = require('diff');
const isFn = require('is-fn');
class CodeAdapter {
    constructor() {
        this.log = logger();
        this.outBuffer = '';
        let self = this;
        this.outChannel = vscode_1.window.createOutputChannel('Yeoman');
        this.outChannel.clear();
        this.outChannel.show();
        // TODO Do not overwrite these methods
        console.error = console.log = function () {
            const line = util.format.apply(util, arguments);
            self.outBuffer += `${line}\n`;
            self.outChannel.appendLine(line);
            return this;
        };
        this.log.write = function () {
            const line = util.format.apply(util, arguments);
            self.outBuffer += line;
            self.outChannel.append(line);
            return this;
        };
    }
    prompt(questions, callback) {
        let answers = {};
        callback = callback || function () { };
        const promise = questions.reduce((promise, question) => {
            return promise
                .then(() => {
                if (question.when === undefined) {
                    return true;
                }
                else if (isFn(question.when)) {
                    return run_async_1.default(question.when)(answers);
                }
                return question.when;
            })
                .then(askQuestion => {
                if (askQuestion) {
                    const prompt = factory_1.default.createPrompt(question, answers);
                    return prompt.render().then(result => answers[question.name] = question.filter ? question.filter(result) : result);
                }
            });
        }, Promise.resolve());
        return promise
            .then(() => {
            this.outChannel.clear();
            this.outChannel.append(this.outBuffer);
            callback(answers);
            return answers;
        });
    }
    diff(actual, expected) {
        this.outChannel.clear();
        let result = diff.diffLines(actual, expected);
        result.map(part => {
            let prefix = ' ';
            if (part.added === true) {
                prefix = '+';
            }
            else if (part.removed === true) {
                prefix = '-';
            }
            part.value = part.value.split('\n').map(line => {
                if (line.trim().length === 0) {
                    return line;
                }
                return `${prefix}${line}`;
            }).join('\n');
            this.outChannel.append(part.value);
        });
    }
}
exports.default = CodeAdapter;
//# sourceMappingURL=adapter.js.map