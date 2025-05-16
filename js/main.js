// 各モジュールのインポート
import { setupHoverDetection } from './ui.js';
import { setupTabButtons } from './navigation.js';
import { setupLegacyButtons } from './legacy.js';
import { initVersionInfo, APP_VERSION, LAST_UPDATE } from './version.js';
import { setupPopButtons } from './popbuttons.js';

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
  setupPopButtons(); // POPボタン機能の初期化
});
