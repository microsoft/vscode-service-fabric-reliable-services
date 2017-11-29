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
function removeApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        connectToCluster();
    });
}
exports.removeApplication = removeApplication;
function connectToCluster() {
    return __awaiter(this, void 0, void 0, function* () {
        var fs = require('fs');
        var clusterInfo;
        const cloudProfile = yield vscode.workspace.findFiles('**/Cloud.json');
        const pathToCloudProfile = cloudProfile[0].path.replace('/c:', '');
        ;
        yield fs.readFile(pathToCloudProfile, 'utf8', function (err, data) {
            if (err) {
                throw err;
            }
            clusterInfo = JSON.parse(data);
            if (clusterInfo.ClientCert.length > 0) {
                connectToSecureCluster(clusterInfo);
            }
            else {
                connectToUnsecureCluster(clusterInfo);
            }
        });
        return clusterInfo;
    });
}
function connectToSecureCluster(clusterInfo) {
    exec('sfctl cluster select --endpoint ' + clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort + ' --cert ' + clusterInfo.ClientCert + ' --key ' + clusterInfo.ClientKey + ' --no-verify', function (err, stdout, stderr) {
        if (err) {
            vscode.window.showErrorMessage("Could not connect to cluster.");
            console.log(err);
            return;
        }
        uninstallApplication();
    });
}
function connectToUnsecureCluster(clusterInfo) {
    exec('sfctl cluster select --endpoint ' + clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort, function (err, stdout, stderr) {
        if (err) {
            vscode.window.showErrorMessage("Could not connect to cluster.");
            console.log(err);
            return;
        }
        uninstallApplication();
    });
}
function uninstallApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        const uri = yield vscode.workspace.findFiles('**/uninstall.sh');
        if (uri.length < 1) {
            vscode.window.showErrorMessage("An uninstall.sh file was not found in the workspace");
            return;
        }
        const relativeInstallPath = vscode.workspace.asRelativePath(uri[0].path);
        const terminal = vscode.window.createTerminal('ServiceFabric');
        terminal.sendText('./' + relativeInstallPath);
        terminal.show();
    });
}
//# sourceMappingURL=remove-application.js.map