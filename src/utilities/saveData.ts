import * as vscode from 'vscode';
import { SourceIdeas } from '../types/idea';
import * as frontmatter from 'gray-matter';

const saveData = (data: SourceIdeas) => {
    const { ideas, metadata } = data;
    const content = ideas.reduce((acc, idea) => {
        const { title, description, checked } = idea;
        const checkedString = checked ? "x" : " ";
        return `${acc}- [${checkedString}] ${title}${description === "" ? "\n" : "\n  - " + description + "\n"}`;
    }, "\n");
    const writeData = frontmatter.stringify(content, metadata ?? {});
    // if activeTextEditor is none, throw Error below
    vscode.window.activeTextEditor!.edit((editBuilder) => {
        editBuilder.replace(new vscode.Range(vscode.window.activeTextEditor!.document.lineAt(0).range.start, vscode.window.activeTextEditor!.document.lineAt(vscode.window.activeTextEditor!.document.lineCount - 1).range.end), writeData);
    });
    vscode.window.activeTextEditor!.document.save();
};

export { saveData };
