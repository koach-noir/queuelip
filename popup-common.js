// popup-common.js
// ポップアップ画面で共通して使用する機能を提供するスクリプト

// Tauriのモジュールをインポート
const { invoke } = window.__TAURI__.tauri;
const { appWindow } = window.__TAURI__.window;

/**
 * ポップアップの初期化処理
 */
export function initializePopup() {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Popup initialized');
    
    // ポップアップタイプを取得（ファイル名から）
    const popupType = getPopupTypeFromPath();
    console.log(`Detected popup type: ${popupType}`);
    
    // ポップアップの内容を明確に設定
    setupPopupContent(popupType);
    
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
 * ポップアップの内容を設定
 * @param {string} popupType - ポップアップタイプ
 */
function setupPopupContent(popupType) {
  // 既存のコンテンツをクリアする（もしあれば）
  const popupElement = document.getElementById(`popup${popupType}`);
  if (popupElement) {
    const popupText = popupElement.querySelector('.popup-text');
    if (popupText) {
      // ポップアップの種類に応じてコンテンツを設定
      popupText.textContent = popupType;
    }
  }
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
        
        // 順序を変更: メインウィンドウを表示してから、ポップアップを閉じる
        try {
          // メインウィンドウを確実に表示させる
          await invoke('show_main_window');
          console.log('Main window should now be visible');
          
          // 少し遅延させてから現在のウィンドウを閉じる
          setTimeout(async () => {
            // 現在のウィンドウを閉じる
            await invoke('close_current_window');
            console.log(`Popup ${popupType} closed`);
          }, 100); // 100msの遅延
        } catch (mainError) {
          console.error('Error showing main window:', mainError);
          
          // メインウィンドウが見つからない場合は新しく作成
          await invoke('create_main_window');
          
          // 少し遅延させてから現在のウィンドウを閉じる
          setTimeout(async () => {
            await invoke('close_current_window');
          }, 100);
        }
        
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

// アプリケーション終了処理の改善
// ウィンドウが閉じられたときのイベントリスナー
appWindow.onCloseRequested(async (event) => {
  console.log('Window close requested, performing cleanup...');
  // 必要なクリーンアップ処理があればここで実行
  
  // デフォルトのクローズ動作を続行
  // デフォルト動作を阻止したい場合は event.preventDefault() を呼び出す
});

// デフォルトでは初期化関数を実行
initializePopup();
