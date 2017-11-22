import vscode = require('vscode');

export async function quickPickLanguage(): Promise<string> {
    var opt: vscode.QuickPickOptions = {
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolder: 'Select Project Language'
    }

    const items: string[] = [];
    items.push('Java');
    items.push('C#');

    return vscode.window.showQuickPick(items, opt);
}

export async function quickPickServiceType(): Promise<string> {
    var opt: vscode.QuickPickOptions = {
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolder: 'Choose a framework for your service'
    }

    const items: string[] = [];
    items.push('Reliable Actor Service');
    items.push('Reliable Stateless Service');
    items.push('Reliable Stateful Service');

    return vscode.window.showQuickPick(items, opt);
}