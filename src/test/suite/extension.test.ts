import * as assert from 'assert';
import { after } from 'mocha';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
  after(() => {
    vscode.window.showInformationMessage('All tests done!');
  });

  test('Check initialize process good-with-frontmatter.md', async () => {
    const testFileLocation = '/good-with-frontmatter.md';
    const targetFileLocation = '/good-with-frontmatter.expected.md';
    
    // for debug path
    // console.info('[info] ', vscode.workspace.workspaceFolders);

    const filepath = vscode.workspace.workspaceFolders![0].uri.fsPath + testFileLocation;
    const fileUri = vscode.Uri.file(filepath);
    const document = await vscode.workspace.openTextDocument(fileUri);
    const editor = await vscode.window.showTextDocument(document);

    await vscode.commands.executeCommand("ideabox.start");

    const result = editor.document.getText();
    const targetpath = vscode.workspace.workspaceFolders![0].uri.fsPath + targetFileLocation;
    const targetfileUri = vscode.Uri.file(targetpath);
    const targetDocument = await vscode.workspace.openTextDocument(targetfileUri);
    const targetEditor = await vscode.window.showTextDocument(targetDocument);
    const expected = targetEditor.document.getText();

    assert.strictEqual(expected, result);
  });
});
