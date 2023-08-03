import { vscode } from "./utilities/vscode";
import { VSCodeButton, VSCodeCheckbox, VSCodeDivider, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import "./App.css";

function App() {
  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    });
  }
  // sample data for UI
  const data = {
    "metadata": {
      "title": "My Ideas",
    },
    "ideas": [
      {
        "title": "My first idea",
        "description": "This is my first idea",
        "checked": false,
      },
      {
        "title": "My second idea",
        "description": "This is my second idea",
        "checked": true,
      },
    ],
  };

  return (
    <main>
      <h1>{data.metadata.title ?? 'IDEA BOX'}</h1>
      {/* task view */}
      {
        data.ideas.map((idea, index) => {
          return (
            <div key={index}>
              <VSCodeCheckbox checked={idea.checked}>{idea.title}</VSCodeCheckbox>
              <VSCodeButton onClick={handleHowdyClick}>Edit</VSCodeButton>
              <p>{idea.description}</p>
              {/* <VSCodeTextField>{idea.description}</VSCodeTextField> */}
            </div>
          );
        })
      }
      {/* input area */}
      <VSCodeDivider role="separator"></VSCodeDivider>
      <VSCodeTextField>タスク名</VSCodeTextField>
      <VSCodeTextField>説明</VSCodeTextField>
    </main>
  );
}

export default App;
