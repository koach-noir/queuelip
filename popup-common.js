// popup-common.js
// ポップアップ画面で共通して使用する機能を提供するスクリプト

// Tauriのモジュールをインポート
const { invoke } = window.__TAURI__.tauri;

/**
 * ポップアップの初期化処理
 */
export function initializePopup() {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Popup initialized');
    
    // ポップアップタイプを取得（ファイル名から）
    const popupType = getPopupTypeFromPath();
    console.log(`Detected popup type: ${popupType}`);
    
    // 戻るボタンのセットアップ
    setupBackButton(popupType);
  });
}

/**
 * ファイルパスからポップアップタイプを取得
 * @returns {string} ポップアップタイプ（'A', 'B', 'C'など）
 */
function getPopupTypeFromPath() {
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  
  if (filename.startsWith('popup') && filename.length > 5) {
    return filename.charAt(5); // "popup" の次の文字を取得
  }
  
  return 'Unknown';
}

/**
 * 戻るボタンのセットアップ
 * @param {string} popupType - ポップアップタイプ
 */
function setupBackButton(popupType) {
  const backButton = document.getElementById('backButton');
  
  if (backButton) {
    backButton.addEventListener('click', async () => {
      try {
        console.log(`Back button clicked in popup ${popupType}, trying to return to main window`);
        
        // メインウィンドウを表示
        await invoke('show_main_window');
        
        // 現在のウィンドウを閉じる
        await invoke('close_current_window');
        
        console.log(`Returned from popup ${popupType}`);
      } catch (error) {
        console.error('Error during popup closing sequence:', error);
        
        // 最終手段：強制的にフォールバック
        try {
          await invoke('close_window_by_label', { label: `popup${popupType}` });
          await invoke('create_main_window');
        } catch (finalError) {
          console.error('Critical error in window management:', finalError);
          alert('エラーが発生しました。アプリを再起動してください。');
        }
      }
    });
  } else {
    console.error('Back button not found in the DOM');
  }
}

// デフォルトでは初期化関数を実行
initializePopup();
