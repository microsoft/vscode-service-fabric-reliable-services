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
const exec = require('child_process').exec;
function publishApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = yield promptForEndpointName();
        const security = yield pickSecuityType();
        if (security === 'Secure Cluster') {
            const certType = yield pickCertificateType();
            if (certType === 'Pem') {
                const pathToPem = yield promptForPathToPem();
                deployToSecureClusterPem(endpoint, pathToPem);
            }
            else {
                const pathToCert = yield promptForPathToCert();
                const pathToKey = yield promptForPathToKey();
                deployToSecureClusterCert(endpoint, pathToCert, pathToKey);
            }
        }
        else {
            deployToUnsecureCluster(endpoint);
        }
    });
}
exports.publishApplication = publishApplication;
function pickSecuityType() {
    return __awaiter(this, void 0, void 0, function* () {
        var opt = {
            matchOnDescription: true,
            matchOnDetail: true,
            placeHolder: 'Please select a cluster type'
        };
        const items = [];
        items.push('Unsecure Cluster');
        items.push('Secure Cluster');
        return vscode.window.showQuickPick(items, opt);
    });
}
function pickCertificateType() {
    return __awaiter(this, void 0, void 0, function* () {
        var opt = {
            matchOnDescription: true,
            matchOnDetail: true,
            placeHolder: 'Please select a certificate type'
        };
        const items = [];
        items.push('Pem');
        items.push('Cert, Key Pair');
        return vscode.window.showQuickPick(items, opt);
    });
}
function promptForPathToPem() {
    return __awaiter(this, void 0, void 0, function* () {
        var opt = {
            placeHolder: 'client.pem',
            prompt: 'Enter the path relative to the current workspace to the pem file',
        };
        return vscode.window.showInputBox(opt);
    });
}
function promptForPathToCert() {
    return __awaiter(this, void 0, void 0, function* () {
        var opt = {
            placeHolder: 'client.crt',
            prompt: 'Enter the path relative to the current workspace to the cert file',
        };
        return vscode.window.showInputBox(opt);
    });
}
function promptForPathToKey() {
    return __awaiter(this, void 0, void 0, function* () {
        var opt = {
            placeHolder: 'client.crt',
            prompt: 'Enter the path relative to the current workspace to the key file',
        };
        return vscode.window.showInputBox(opt);
    });
}
function promptForEndpointName() {
    return __awaiter(this, void 0, void 0, function* () {
        var opt = {
            placeHolder: 'Connection Endpoint',
            prompt: 'Enter a cluster connection endpoint http://PublicIPorFQDN:19080',
        };
        return vscode.window.showInputBox(opt);
    });
}
function deployToUnsecureCluster(endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        exec('sfctl cluster select --endpoint ' + endpoint, function (err, stdout, stderr) {
            if (err) {
                vscode.window.showErrorMessage("Could not connect to cluster.");
                console.log(err);
                return;
            }
            installApplication();
        });
    });
}
function deployToSecureClusterPem(endpoint, pathToPem) {
    return __awaiter(this, void 0, void 0, function* () {
        exec('sfctl cluster select --endpoint ' + endpoint + ' --pem ' + pathToPem + ' --no-verify', function (err, stdout, stderr) {
            if (err) {
                vscode.window.showErrorMessage("Could not connect to cluster.");
                console.log(err);
                return;
            }
            installApplication();
        });
    });
}
function deployToSecureClusterCert(endpoint, pathToCert, pathToKey) {
    return __awaiter(this, void 0, void 0, function* () {
        exec('sfctl cluster select --endpoint ' + endpoint + ' --cert' + pathToCert + ' --key' + pathToKey, function (err, stdout, stderr) {
            if (err) {
                vscode.window.showErrorMessage("Could not connect to cluster.");
                console.log(err);
                return;
            }
            installApplication();
        });
    });
}
function installApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        const uri = yield vscode.workspace.findFiles('**/install.sh');
        if (uri.length < 1) {
            vscode.window.showErrorMessage("An install.sh file was not found in the workspace");
            return;
        }
        const relativeInstallPath = vscode.workspace.asRelativePath(uri[0].path);
        const terminal = vscode.window.createTerminal('ServiceFabric');
        terminal.sendText('./' + relativeInstallPath);
        terminal.show();
    });
}
//# sourceMappingURL=publish-application.js.map