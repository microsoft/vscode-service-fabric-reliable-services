"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const os_1 = require("os");
const _ = require("lodash");
const environment_1 = require("./environment");
const EscapeException_1 = require("../utils/EscapeException");
const readPkgUp = require('read-pkg-up');
const semver = require('semver');
const elegantSpinner = require('elegant-spinner');
const figures = require('figures');
const frame = elegantSpinner();
class Yeoman {
    constructor(options) {
        this._options = options;
        this._env = environment_1.default(undefined, options);
        this._status = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
        this._interval;
    }
    getEnvironment() {
        return this._env;
    }
    getGenerators() {
        const generatorsMeta = this._env.store.getGeneratorsMeta();
        // Remove sub generators from list
        let list = Object.keys(generatorsMeta).filter((key) => key.split(':')[1] === 'app');
        list = list.map(key => {
            const item = generatorsMeta[key];
            const name = key.split(':')[0];
            const pkgPath = readPkgUp.sync({ cwd: item.resolved });
            if (!pkgPath.pkg) {
                return null;
            }
            const pkg = pkgPath.pkg;
            const generatorVersion = pkg.dependencies['yeoman-generator'];
            const generatorMeta = _.pick(pkg, 'name', 'version', 'description');
            // Ignore the generator if does not depend on `yeoman-generator`
            if (!generatorVersion) {
                return null;
            }
            // Flag generator to indecate if the generator version is fully supported or not.
            // https://github.com/yeoman/yeoman-app/issues/16#issuecomment-121054821
            generatorMeta.isCompatible = semver.ltr('0.17.6', generatorVersion);
            // Indicator to verify official generators
            generatorMeta.officialGenerator = false;
            if (generatorMeta.repository && generatorMeta.repository.url) {
                generatorMeta.officialGenerator = generatorMeta.repository.url.indexOf('github.com/yeoman/') > -1;
            }
            // Add subgenerators
            generatorMeta.subGenerators = Object.keys(generatorsMeta).reduce((result, key) => {
                const split = key.split(':');
                if (split[0] === name) {
                    result.push(split[1]);
                }
                return result;
            }, []);
            return generatorMeta;
        });
        return _.compact(list);
    }
    run(generator, cwd) {
        if (!cwd) {
            throw new Error('Please open a workspace directory first.');
        }
        process.chdir(cwd);
        const prefix = 'generator-';
        if (generator.indexOf(prefix) === 0) {
            generator = generator.slice(prefix.length);
        }
        return new Promise((resolve, reject) => {
            Promise.resolve(vscode_1.window.showQuickPick(new Promise((res, rej) => {
                setImmediate(() => {
                    try {
                        this._env.run(generator, this.done)
                            .on('npmInstall', () => {
                            this.setState('install node dependencies');
                        })
                            .on('bowerInstall', () => {
                            this.setState('install bower dependencies');
                        })
                            .on('error', err => {
                            if (!(err instanceof EscapeException_1.default)) {
                                vscode_1.window.showErrorMessage(err.message);
                                throw err;
                            }
                        })
                            .on('end', () => {
                            this.clearState();
                            console.log(`${os_1.EOL}${figures.tick} done`);
                        });
                        resolve();
                    }
                    catch (err) {
                        reject(err);
                    }
                    rej();
                });
            }))).catch(err => {
                // do nothing because the input is always rejected
            });
        });
    }
    setState(state) {
        console.log(state);
        this._status.show();
        this._status.tooltip = state;
        this._interval = setInterval(() => {
            this._status.text = `${frame()} yo`;
        }, 50);
    }
    clearState() {
        clearInterval(this._interval);
        this._status.dispose();
    }
    done(err) {
        if (err) {
            // handle error
        }
    }
}
exports.default = Yeoman;
//# sourceMappingURL=yo.js.map