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
        yield readCloudProfile();
    });
}
exports.publishApplication = publishApplication;
function deployToUnsecureCluster(clusterInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        exec('sfctl cluster select --endpoint ' + clusterInfo.ConnectionIPOrURL + clusterInfo.ConnectionPort, function (err, stdout, stderr) {
            if (err) {
                vscode.window.showErrorMessage("Could not connect to cluster.");
                console.log(err);
                return;
            }
            installApplication();
        });
    });
}
function deployToSecureClusterCert(clusterInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        exec('sfctl cluster select --endpoint ' + clusterInfo.ConnectionIPOrURL + ':' + clusterInfo.ConnectionPort + ' --cert ' + clusterInfo.ClientCert + ' --key ' + clusterInfo.ClientKey + ' --no-verify', function (err, stdout, stderr) {
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
        console.log("Install Application");
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
function readCloudProfile() {
    return __awaiter(this, void 0, void 0, function* () {
        var fs = require('fs');
        const cloudProfile = yield vscode.workspace.findFiles('**/Cloud.json');
        const pathToCloudProfile = cloudProfile[0].path;
        yield fs.readFile(pathToCloudProfile, 'utf8', function (err, data) {
            if (err) {
                throw err;
            }
            var clusterInfo = JSON.parse(data);
            if (clusterInfo.ClientCert.length > 0) {
                deployToSecureClusterCert(clusterInfo);
            }
            else {
                deployToUnsecureCluster(clusterInfo);
            }
        });
    });
}
//# sourceMappingURL=publish-application.js.map