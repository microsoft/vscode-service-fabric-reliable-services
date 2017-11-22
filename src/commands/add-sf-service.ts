import * as vscode from 'vscode';
import { generatorProject } from '../yo';

export function addSFService() {
    generatorProject(true);
}