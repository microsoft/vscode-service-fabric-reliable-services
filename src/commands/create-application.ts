import * as vscode from 'vscode';
import { generatorProject } from '../yo';

import { quickPickLanguage, quickPickServiceType } from '../configureWorkspace/config-utils';

export async function createApplication() {
    await generatorProject(false);
}