# Queuelip

キューの動作を持つクリップボードアプリ「キューリップ」- A clipboard app with queue behavior called "Queuelip".

## 概要

Rust + Tauriで実装されたクリップボードマネージャーアプリです。コピーしたテキストをキュー（先入れ先出し）形式で管理します。

## 機能

- テキストのコピー履歴をキュー形式で管理
- シンプルで使いやすいUI
- マウスホバー検知機能で直感的な操作

## 開発

### 必要条件

- [Rust](https://www.rust-lang.org/)
- [Node.js](https://nodejs.org/)
- [Tauri CLI](https://tauri.app/)

### 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発モードで実行
npm run tauri dev
```

## ビルド

```bash
npm run tauri build
```

## インストールと実行（macOS）

### リリースからダウンロード
1. [Releases](https://github.com/koach-noir/queuelip/releases)から最新の`.dmg`または`.app.zip`をダウンロード
2. ダウンロードしたファイルを展開

### 実行方法
#### .dmgファイルの場合
1. `.dmg`ファイルをダブルクリックしてマウント
2. `Queuelip.app`をアプリケーションフォルダにドラッグ
3. アプリケーションフォルダから`Queuelip`を起動

#### .appファイルの場合
1. `Queuelip.app`を右クリック → "開く"を選択
2. 「開発元が未確認」の警告が出た場合は"開く"をクリック

### セキュリティ警告が出る場合
未署名アプリのため、初回実行時にセキュリティ警告が表示される場合があります：

```bash
# ターミナルで実行権限を付与
chmod +x /path/to/Queuelip.app/Contents/MacOS/queuelip

# または、quarantine属性を削除
xattr -d com.apple.quarantine /path/to/Queuelip.app
```

## ライセンス

MIT