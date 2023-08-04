import * as vscode from 'vscode';
import { SourceIdeas } from '../types/idea';
import * as frontmatter from 'gray-matter';

const saveData = async (target: vscode.TextEditor, data: SourceIdeas) => {
    const { ideas, metadata } = data;
    const content = ideas.reduce((acc, idea) => {
        const { title, description, checked } = idea;
        const checkedString = checked ? "x" : " ";
        return `${acc}- [${checkedString}] ${title}${description === "" ? "\n" : "\n  - " + description + "\n"}`;
    }, "\n");
    const writeData = frontmatter.stringify(content, metadata ?? {});
    // if activeTextEditor is none, throw Error below
    console.log('[log] URI = ', target.document.uri);
    const edit = new vscode.WorkspaceEdit();
    const textEdit = new vscode.TextEdit(new vscode.Range(target.document.lineAt(0).range.start, target.document.lineAt(target.document.lineCount - 1).range.end), writeData);
    console.log('[log] writeData = ', writeData);
    await vscode.workspace.fs.writeFile(target.document.uri, Buffer.from(writeData));
};

export { saveData };
