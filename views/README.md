# Views Directory - Deprecated

このディレクトリの外部HTMLファイルは使用されなくなりました。

## 変更内容

Tauri環境での動的読み込み問題を解決するため、以下のようにアプローチを変更しました：

### 旧アプローチ（非推奨）
- 外部HTMLファイルからfetch APIで動的読み込み
- Tauriのセキュリティ制約により失敗

### 新アプローチ（現在）
- JavaScript内のテンプレート文字列でビュー定義
- DOM操作による動的表示切り替え
- Tauriセキュリティ制約を回避し、高いパフォーマンスを実現

## ファイル状況

- `view-a.html` - 使用中止（js/view-loader.js内にテンプレート化）
- `view-b.html` - 使用中止（js/view-loader.js内にテンプレート化）  
- `view-c.html` - 使用中止（js/view-loader.js内にテンプレート化）

## 今後の拡張

新しいビューを追加する場合は、`js/view-loader.js`の`viewTemplates`オブジェクトに追加してください。
