import * as vscode from 'vscode';
import { getEditorSelections, FileSelection } from './getSelections';
import fetch, { Headers } from 'node-fetch';
import { FetchException } from './exceptions';
import { title } from 'process';


const BASE_URL: string = "https://api-beta.mystb.in/paste";

interface File {
    filename: string,
    content: string
}

interface PasteContent {
    files: File[],
    expires?: string,
    password?: string
}


export async function singleEditorUpload() {
    let activeEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;

    if (!activeEditor) {
        vscode.window.showErrorMessage("Please open a file and re-run this command to upload to MystBin.");
        return
    }

    // Meta Data...
    // const filename: string = activeEditor.document.fileName;
    // const source: string = "VSCode";

    // Returns active selections OR full content if there are none...
    let highlighted: FileSelection[] = getEditorSelections(activeEditor);

    if (highlighted.length > 5) {
        vscode.window.showErrorMessage(
            `Unable to post to MystBin, you have seclected too many items.\n\nAllowed: 5.\nSelected: ${highlighted.length}.`
            );

        return;
    }

    let tempFiles: File[] = [];
    for (let file of highlighted) {
        tempFiles.push({"filename": file.filename, "content": file.content});
    }

    const pasteContent: PasteContent = {
        "files": tempFiles
    }

    let resp: any;
    try {
        resp = await doPaste(pasteContent);
    } catch (err) {
        if (err instanceof FetchException) {
            if (!err.code) {
                vscode.window.showErrorMessage(`An unknown error occurred while uploading to MystBin.\n\n${err.message}`);
                return;
            }

            if (err.code === 429) {
                vscode.window.showErrorMessage(`You are being ratelimited. Slow down and try again later.\n\nStatus: 429`);
                return;
            }

            if (err.code >= 500) {
                vscode.window.showErrorMessage(`${err.message}\n\nStatus: ${err.code}`);
                return;
            }

            vscode.window.showErrorMessage(`${err.message}\n\nStatus: ${err.code}\nExtra: ${err.extras.error}`);
            return;
        }

        if (err instanceof Error) {
            vscode.window.showErrorMessage(`An unknown error occurred while uploading to MystBin.\n\n${err.message}`);
        }
    }

    let pasteURL: string = `https://beta.mystb.in/${resp["id"]}`;
    await vscode.env.clipboard.writeText(pasteURL);

    let choice = vscode.window.showInformationMessage(
        `MystBin | Success\n\nYour paste URL was copied and can be found at: ${pasteURL}`,
        "Ok",
        "Open URL"
        );

    if (!choice || await choice === "Ok") {
        return;
    }

    vscode.env.openExternal(vscode.Uri.parse(pasteURL));
}


async function doPaste(pasteContent: PasteContent): Promise<any> {
    let resp;
    let errorData: any;

    try {
        resp = await fetch(BASE_URL, {
            "method": "POST",
            "headers": new Headers({"Content-Type": "application/json"}),
            "body": JSON.stringify(pasteContent)
        });
    } catch (err) {
        throw new FetchException(`Internal error with unknown status code occureed during pasting to ${BASE_URL}.`);
    }

    if (resp.status === 200) {
        // Success...
        let data: any = await resp.json();
        return data;
    }

    if (resp.status === 429) {
        // Ratelimit...
        throw new FetchException(`Ratelimiting occurred during pasting to ${BASE_URL}.`, resp.status);
    }

    if (resp.status >= 500) {
        // Internal API Error...
        throw new FetchException(`Internal API error occurred during pasting to ${BASE_URL}.`, resp.status);
    }

    // Probably some other 400 at this point...
    errorData = await resp.json();
    throw new FetchException(`An error occurred during pasting to ${BASE_URL}.`, resp.status, errorData);
}
