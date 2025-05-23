// 各モジュールのインポート
import { setupHoverDetection } from './ui.js';
import { setupTabButtons } from './navigation.js';
import { setupLegacyButtons } from './legacy.js';
import { initVersionInfo, APP_VERSION, LAST_UPDATE } from './version.js';
import { viewManager } from './view-loader.js'; // テンプレート文字列アプローチ
import { focusManager } from './focus-manager.js'; // フォーカス管理モジュール

// Tauriアプリケーション初期化
document.addEventListener('DOMContentLoaded', function() {
  console.log('Queuelip application initialized');
  
  // フッター情報を直接挿入
  const appFooter = document.getElementById('app-footer');
  if (appFooter) {
    appFooter.innerHTML = `
      <div id="version-info">バージョン: ${APP_VERSION}</div>
      <div id="system-time">最終更新: ${LAST_UPDATE}</div>
    `;
  }
  
  // 各モジュールの初期化
  setupHoverDetection();
  setupTabButtons();
  setupLegacyButtons();
  
  // 🔧 新機能: 初期読み込み時にメインビューの適切な要素にフォーカスを設定
  setTimeout(() => {
    focusManager.setInitialFocus('main');
    console.log('Initial focus set for main view');
  }, 200);
  
  console.log('View manager initialized (template string approach)'); // テンプレート文字列アプローチが利用可能であることを確認
  console.log('Focus manager initialized - auto-focus enhancement enabled'); // フォーカス管理機能の初期化完了
});
