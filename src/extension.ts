import * as vscode from 'vscode';
import * as mbUpload from './upload';


export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('mystbin.share', async (menuResource) => {
		await mbUpload.singleEditorUpload(menuResource);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
