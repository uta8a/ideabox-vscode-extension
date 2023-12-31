# Design

# 用語

- idea: ideaboxに入れるアイデア。以下の2つからなる
  - title: アイデアのタイトル
  - description: アイデアの説明
- webview-ui: VS Code extensionのwebviewのこと

# ユーザフロー

- VS Codeでmarkdown fileを開く
- Ctrl + Shift + p/Cmd + Shift + p でコマンド呼び出しして、ideaboxと入力してEnter
  - markdownが適正かチェック→ideaboxの仕様に沿わないならエラーをshowInformationMessageで出す
    - 適正の基準
      - frontmatterはあってもなくてもOK
      - frontmatterとspaceを除くと、listのみを含む
      - 各listのitemはcheckboxを含む
      - 各listのitemはtokenが1,2のいずれか(titleのみ、titleとdescription)
  - markdownのタスクを走査して、以下のinit処理を行う
    1. checkboxを走査して データをインメモリで保持する。以降、ファイルに書き込みをしても後々上書きされ、ideaboxのデータが優先される。
    2. checkされているものが後ろになるようにする。ファイル書き込みが走る。(checkされているものの先頭になるように配置)
    3. ideaboxの画面が開く。描画が行われ、webview-uiから編集可能になる。
- ユーザは以下の行動が可能になる。それぞれの行動後にファイル書き込みが走る。
  - ideaの追加
  - ideaの編集
  - ideaの削除
  - ideaの並び替え
  - checkboxのcheck/uncheck
- ideaboxの画面を閉じる
  - 閉じる前に何も処理は行われない(ユーザの行動に応じて保存が走るため、最後の処理は必要ない)

# 技術仕様

## validate, initialize for markdown

### validate

ideaboxをstartしたときに開いていたファイルを、以下のようなデータにencodeする。

```json
{
  "metadata": {
    "title": "ideabox-vscode-extension"
  },
  "ideas": [
    {
      "title": "idea1",
      "description": "description1 [link](https://example.com)",
      "checked": false
    },
    {
      "title": "idea2",
      "description": "description2",
      "checked": true
    }
  ]
}
```

その過程で失敗したらvalidate失敗としてエラーログを出す。

### initialize

validateが成功したら、checkedがtrueのものを後ろにして、そのデータをファイルに書き込む。


# 仕様決定ログ

## 編集対象ファイルの決まり方

- 編集対象のファイルをどう決定するか
  - 入力を求める
  - MarkdownのOpen previewみたいに、今開いているファイルにするか

→毎度入力を求められるのはしんどいし `.vscode` を作るのもなんか微妙なので、idea.md的なものを開く→コマンド打つと発火 という流れにする。

## ideaboxとして適正なmarkdown: frontmatterの有無

- frontmatterは必要か？
  - 必要: メタデータはいずれ欲しくなるのでkey-valueを許容
  - 不必要: simpleに保ちたい

例えばideaにタグをつける運用をするなら拡張される可能性がある。
ユーザの動きとして、まずmarkdownでタスクリストを書いて途中からideaboxに移行するのを考えると、frontmatterがない可能性がある。
→frontmatterはなくても動くし、あってもいい

## ファイル編集に関するロック

- ファイルをideaboxが開いている時に、VS Codeでファイルを編集した場合
  - ideaboxを優先
  - VS Codeを優先

→これはideaboxを優先する。ideaboxを開いているときはそもそもファイルを編集しないで欲しい。

別で保存のタイミングは考えたほうがいいかも→ユーザ行動後とした

## ideaboxからできる走査: frontmatterの変更

- frontmatterをideabox webview-uiから変更可能にするか？

→これはいらないでしょう。メタデータは頻繁に変更しないので、webview-uiにwidgetを追加しない方がシンプルさを保てる。

## ideaのdescriptionフィールドに許すmarkdown

- ideaのdescriptionフィールドに書いていいもの

→個人的にはリンクは欲しいな。リンク記法だけで、あとはplaintextとする

技術的にはパターンマッチで `[.*](http.*)` を検知する。
リンク記法なので、 `target text` を選択してそこにCtrl + vで勝手にリンク記法になってくれるやつが入力と編集のところで欲しいな。Ctrl + vにフックが必要そう。

## コードの設計: init処理をどこに書くか

active editorの有無判定はrenderではないと思ったので外に出した。
initも違いそう。renderの中でもvscodeは触るので、vscodeへの依存を1fileにするみたいな気遣いはいらない。

→init処理は別ファイルにする。renderは描画以降で、ユーザの行動に応じてファイル書き換えもrender内で行う。

あと、ファイル読み込みはpre-renderでやって、それ以降はやらないことにする。データはpanels側に渡す。

```ts
const data = await readFile();
render(data);
```

## validateと、encodeで2回markdownをparseすることに決めた理由

- validateってtry-catchでerrorが起きたら右下でメッセージ出すのがいい
- try-catchをencodeの前段でやるべき
- try-catchが値を返さないので、letで変数を宣言して、try-catch内で代入することになる
  - これが嫌だった

→validateで1回parse、その後encodeする際にもparseをする。

備考:

- 2回のパースの間に元ファイルを編集されると壊れる
  - 許容
- 2回のパースでパフォーマンスが落ちる
  - 許容



