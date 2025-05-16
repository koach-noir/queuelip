// メインJSモジュール - アプリケーションのエントリーポイント

// 必要なモジュールをインポート
import { initVersionInfo } from './version.js';
import { initNavigation } from './navigation.js';
import { initUI } from './ui.js';
import { initLegacyButtons } from './legacy.js';

// DOMが完全にロードされたら実行する関数
document.addEventListener('DOMContentLoaded', () => {
  // フッターにバージョン情報を表示
  initVersionInfo();
  
  // ナビゲーション（タブ）を初期化
  initNavigation();
  
  // UIイベントとインタラクションを初期化
  initUI();
  
  // 旧式のボタンを初期化（互換性のため）
  initLegacyButtons();
  
  // 開発者へのメッセージ
  console.log('Queuelip アプリケーションが初期化されました。');
});
