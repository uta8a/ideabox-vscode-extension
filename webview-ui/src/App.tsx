import { vscode } from "./utilities/vscode";
import { VSCodeButton, VSCodeCheckbox, VSCodeDivider, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import "./App.css";
import { useState } from "react";

type Data = {
  metadata?: {
    [key: string]: any;
  };
  ideas: {
    title: string;
    description: string;
    checked: boolean;
  }[];
};

function App() {
  const [data, setData] = useState<Data>({
    ideas: [],
  });
  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    });
  }
  window.addEventListener("DOMContentLoaded", () => {
    vscode.postMessage({
      command: "initialize"
    });
  });
  window.addEventListener("message", (event) => {
    const message = event.data;
    switch (message.command) {
      case "ready":
        setData(JSON.parse(message.text));
        break;
    }
  });
  const handleCheckboxChange = (index: number) => {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.ideas[index].checked = !next.ideas[index].checked;
      console.log('[log] ',next, index);
      return next;
    });
    vscode.postMessage({
      command: "update",
      text: JSON.stringify(data),
    });
  };
    

  return (
    <main>
      <h1>{data.metadata?.title ?? 'IDEA BOX'}</h1>
      {/* task view */}
      {
        data.ideas.map((idea, index) => {
          console.log('[log] index = ', index);
          return (
            <div key={index}>
              <VSCodeCheckbox onClick={() => handleCheckboxChange(index)} checked={idea.checked}>{idea.title} {index} {idea.checked ? 'true': 'false'}</VSCodeCheckbox>
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
