// 各モジュールのインポート
import { updateSystemTime } from './time.js';
import { setupHoverDetection } from './ui.js';
import { setupTabButtons } from './navigation.js';
import { setupLegacyButtons } from './legacy.js';

// Tauriアプリケーション初期化
document.addEventListener('DOMContentLoaded', function() {
  console.log('Queuelip application initialized');
  
  // 各モジュールの初期化
  updateSystemTime();
  setupHoverDetection();
  setupTabButtons();
  setupLegacyButtons();
});