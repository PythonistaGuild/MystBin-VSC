import * as vscode from 'vscode';


export interface FileSelection {
    startLine: number,
    endLine: number,
    content: string,
    filename: string,
    fullDocument: boolean
}


export function getEditorSelections(activeEditor: vscode.TextEditor): FileSelection[] {
        const editorSelections: readonly vscode.Selection[] = activeEditor.selections;
        const sortedSelections: vscode.Selection[] = sortSelections(editorSelections);

        const fileName: string = vscode.workspace.asRelativePath(activeEditor.document.uri, false);
        let highlighted: FileSelection[] = [];
    
        for (let selection of sortedSelections) {
            let content: string = "";
    
            if (selection && !selection.isEmpty) {
                const selectionRange: vscode.Range = new vscode.Range(
                    selection.start.line,
                    selection.start.character,
                    selection.end.line,
                    selection.end.character
                    );
        
                content = activeEditor.document.getText(selectionRange);
            }
    
            if (content) {
                let file: FileSelection = {
                    "startLine": selection.start.line,
                    "endLine": selection.end.line,
                    "content": content,
                    "filename": fileName,
                    "fullDocument": false
                }
                highlighted.push(file);
            }
        }

        if (highlighted.length > 0) {
            return highlighted;
        }

        return [{
            "startLine": 1,
            "endLine": activeEditor.document.lineCount,
            "content": activeEditor.document.getText(),
            "filename": fileName,
            "fullDocument": true
        }];
}


function sortSelections(editorSelections: readonly vscode.Selection[]): vscode.Selection[] {
    let selectionCopy: vscode.Selection[] = [...editorSelections];

    function doSort(a: vscode.Selection, b: vscode.Selection): number {
        if (a.start.line < b.start.line) {
            return -1;
        } 

        if (a.start.line > b.start.line) {
            return 1;
        }

        if (a.end.character < b.end.character) {
            return -1;
        }

        if (a.end.character > b.end.character) {
            return 1;
        }

        return 0; 
    }

    selectionCopy.sort(doSort);
    return selectionCopy;
}