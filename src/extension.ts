import { commands, ExtensionContext } from "vscode";
import { IdeaboxPanel } from "./panels/IdeaboxPanel";

export function activate(context: ExtensionContext) {
  const startIdeaboxCommand = commands.registerCommand("ideabox.start", () => {
    IdeaboxPanel.render(context.extensionUri);
  });
  context.subscriptions.push(startIdeaboxCommand);
}
