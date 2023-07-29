import { commands, ExtensionContext, window } from "vscode";
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
    const data = PreRender.encode(editor.document.getText());
    IdeaboxPanel.render(context.extensionUri);
  });
  context.subscriptions.push(startIdeaboxCommand);
}
