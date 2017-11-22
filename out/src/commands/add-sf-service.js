"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const yo_1 = require("../yo");
function addSFService() {
    // Need a way of determining what type of service to create
    // Maybe have 3 different commands for each type of service?
    // Does a Yeoman generator exist for an individual service?
    yo_1.generatorProject(true);
}
exports.addSFService = addSFService;
function generateSFService(serviceName) {
    vscode.window.showInformationMessage("Service Name: " + serviceName);
}
//# sourceMappingURL=add-sf-service.js.map