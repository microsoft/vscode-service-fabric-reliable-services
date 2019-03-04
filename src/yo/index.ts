'use strict';

import { window, workspace, commands, ExtensionContext, QuickPickItem, InputBoxOptions, Uri } from 'vscode';
import EscapeException from './utils/EscapeException';
import runAsync from './utils/run-async';
import Yeoman from './yo/yo';
import * as _ from 'lodash';

import * as path from 'path';
const fs = require('fs');
const figures = require('figures');
const opn = require('opn');

async function getWorkingFolder() {
	if (!Array.isArray(workspace.workspaceFolders) || workspace.workspaceFolders.length === 0) {
		return undefined;
	}

	if (workspace.workspaceFolders.length === 1) {
		return workspace.workspaceFolders[0].uri.fsPath;
	}
	const selectedWkFolder = (window as any).showWorkspaceFolderPick()
	return selectedWkFolder ? selectedWkFolder.uri.fspath : undefined;
}

export async function generatorProject(addService) {
	const cwd = await getWorkingFolder();
	if (!cwd) {
		window.showErrorMessage('Please open a workspace directory first.');
		return;
	}

	const yo = new Yeoman({ cwd });
	let main;
	let sub;

	const generator = await window.showQuickPick(list(yo));
	if (generator === undefined) {
		return;
	}

	main = generator.label;
	let subGenerator: string;
	if ((generator as any).subGenerators.length > 1 && addService) {
		subGenerator = await runSubGenerators((generator as any).subGenerators);
	} else {
		subGenerator = 'app';
	}

	if (subGenerator === undefined) {
		return;
	}

	sub = subGenerator;

	var beforeYo = getAllDirs(cwd);
	var afterYo;
	try {
		yo.run(`${main}:${sub}`, cwd).then(_p => {
			afterYo = getAllDirs(cwd);
			var newApp = _.difference(afterYo, beforeYo);
			if (newApp.length > 0) {
				openFolder(newApp[0]);
			}
		});
	} catch (err) {
		const regexp = new RegExp('Did not provide required argument (.*?)!', 'i');

		if (err) {
			const match = err.message.match(regexp);

			if (match) {
				return `${sub} ${match[1]}?`;
			}
		}
		window.showErrorMessage(err.message || err);
	}
}

function openFolder(folderPath: string) {
	let uri = Uri.file(folderPath);
	commands.executeCommand('vscode.openFolder', uri);
}

function getAllDirs(folderPath: string) {
	const fs = require('fs');
	const path = require('path');
	return fs.readdirSync(folderPath)
	.map(name => path.join(folderPath, name))
	.filter(filePath => fs.lstatSync(filePath).isDirectory());
}

function runSubGenerators(subGenerators: string[]) {
	const app = `${figures.star} app`;
	const index = subGenerators.indexOf('app');

	if (index !== -1) {
		subGenerators.splice(index, 1);
	}

	return window.showQuickPick(subGenerators)
		.then(choice => {
			if (choice === app) {
				return 'app';
			}

			return choice;
		});
}

function list(yo: Yeoman): Promise<QuickPickItem[]> {
	return new Promise((resolve, reject) => {
		setImmediate(() => {
			yo.getEnvironment().lookup(() => {
				const generators = yo.getGenerators().map(generator => {
					return {
						label: generator.name.replace(/(^|\/)generator\-/i, '$1') as string,
						description: generator.description,
						subGenerators: generator.subGenerators
					};
				});

				if (generators.length === 0) {
					reject();

					window.showInformationMessage('Make sure to install some generators first.', 'more info')
						.then(choice => {
							if (choice === 'more info') {
								opn('http://yeoman.io/learning/');
							}
						});

					return;
				}
				const azureGenerators = generators.filter(generator => {
					return generator.label === 'azuresfcsharp' 
					|| generator.label === 'azuresfjava'
					|| generator.label === 'azuresfcontainer' 
					|| generator.label === 'azuresfguest'
				})
				resolve(azureGenerators);
			});
		});
	});
}
