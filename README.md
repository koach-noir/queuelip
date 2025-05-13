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

## ライセンス

MIT