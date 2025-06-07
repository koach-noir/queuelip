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

#### 方法1: ターミナルで属性削除（推奨）
```bash
# quarantine属性を削除
xattr -d com.apple.quarantine /Applications/Queuelip.app

# 実行権限を確認・付与
chmod +x /Applications/Queuelip.app/Contents/MacOS/*
```

#### 方法2: システム環境設定
1. システム環境設定 → セキュリティとプライバシー → 一般
2. 「"Queuelip"は開発元が未確認のため開けませんでした」の隣の「このまま開く」をクリック

#### 方法3: 右クリックで開く
1. Queuelip.appを右クリック
2. 「開く」を選択
3. 警告ダイアログで「開く」をクリック

#### 方法4: 「マルウェア検証エラー」が出る場合
「このアプリケーションにマルウェアが含まれていないことを検証できません」エラーの場合：

1. **一時的にGatekeeperを無効化**（推奨しません）：
   ```bash
   sudo spctl --master-disable
   # アプリ起動後に再有効化
   sudo spctl --master-enable
   ```

2. **特定アプリのみ許可**（推奨）：
   ```bash
   sudo spctl --add /Applications/Queuelip.app
   ```

3. **完全なリセット**：
   ```bash
   sudo xattr -cr /Applications/Queuelip.app
   sudo codesign --force --deep --sign - /Applications/Queuelip.app
   ```

## ライセンス

MIT