// 各モジュールのインポート
import { updateSystemTime } from './time.js';
import { setupHoverDetection } from './ui.js';
import { setupTabButtons } from './navigation.js';
import { setupLegacyButtons } from './legacy.js';
import { initVersionInfo } from './version.js';
import { loadHTML } from './html-loader.js';

// Tauriアプリケーション初期化
document.addEventListener('DOMContentLoaded', function() {
  console.log('Queuelip application initialized');
  
  // フッター情報を読み込む
  loadHTML('./html/version-info.html', 'app-footer').then(() => {
    // バージョン情報の初期化（HTMLロード後）
    initVersionInfo();
  });
  
  // 各モジュールの初期化
  updateSystemTime();
  setupHoverDetection();
  setupTabButtons();
  setupLegacyButtons();
});