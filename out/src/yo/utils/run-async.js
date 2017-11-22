"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const runAsync = require('run-async');
const isFn = require('is-fn');
// Helper function that will show a progress bar while running a function async
function default_1(func) {
    if (!isFn(func)) {
        return function () {
            return Promise.resolve(func);
        };
    }
    const fn = runAsync(func);
    return function () {
        const args = Array.prototype.slice.call(arguments);
        return new Promise((resolve, reject) => {
            Promise.resolve(vscode_1.window.showQuickPick(new Promise((res, rej) => {
                fn.apply(fn, args)
                    .then(result => {
                    rej();
                    resolve(result);
                })
                    .catch(err => {
                    rej();
                    reject(err);
                });
            }))).catch(err => {
                // do nothing because the input is always rejected
            });
        });
    };
}
exports.default = default_1;
//# sourceMappingURL=run-async.js.map