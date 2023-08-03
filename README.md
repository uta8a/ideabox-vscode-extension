# ideabox-vscode-extension

Simple idea input/arrangement tool for VS Code

## Development

- build

```
task
```

- test

```
task test
```

- debug

`task` でビルドした後、F5ボタンを押すと環境が立ち上がる。
Ctrl + Shift + p / Cmd + Shift + p でideaboxと入力してEnterすると立ち上がる。

## Run The Sample

```bash
# Copy sample extension locally
npx degit microsoft/vscode-webview-ui-toolkit-samples/frameworks/hello-world-react-vite hello-world

# Navigate into sample directory
cd hello-world

# Install dependencies for both the extension and webview UI source code
npm run install:all

# Build webview UI source code
npm run build:webview

# Open sample in VS Code
code .
```

Once the sample is open inside VS Code you can run the extension by doing the following:

1. Press `F5` to open a new Extension Development Host window
2. Inside the host window, open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and type `Hello World (React + Vite): Show`
