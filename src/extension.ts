import { commands, ExtensionContext, window, workspace, WorkspaceEdit } from "vscode";
import { IdeaboxPanel } from "./panels/IdeaboxPanel";
import * as PreRender from "./pre-render/lib";

export function activate(context: ExtensionContext) {
  const startIdeaboxCommand = commands.registerCommand("ideabox.start", () => {
    const editor = window.activeTextEditor;
    if (!editor) {
      window.showErrorMessage("No active editor: select a markdown file for ideabox");
      return;
    }
    if (!PreRender.validate(editor.document.getText())) {
      window.showErrorMessage("Invalid markdown file: select a valid markdown file for ideabox");
      return;
    }
    const data = PreRender.encode(editor, editor.document.getText());
    IdeaboxPanel.render(context.extensionUri, editor, data);
  });
  context.subscriptions.push(startIdeaboxCommand);
}
