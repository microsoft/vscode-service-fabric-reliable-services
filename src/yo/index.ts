'use strict';

import { window, workspace, commands, ExtensionContext, QuickPickItem, InputBoxOptions } from 'vscode';
import EscapeException from './utils/EscapeException';
import runAsync from './utils/run-async';
import Yeoman from './yo/yo';

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

	try {
		const question: string = await yo.run(`${main}:${sub}`, cwd) as string;
		if (!question) {
			return;
		}
		const input = window.showInputBox({ prompt: question })
		if (!input) {
			return;
		}
		const argument = input;
		await yo.run(`${main}:${sub} ${argument}`, cwd);

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
