// main.js
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";

document.addEventListener('DOMContentLoaded', () => {
  console.log('Queuelip application initialized');
  
  // マウスホバー検知のためのイベントリスナーを追加
  setupHoverDetection();
  
  // バージョン情報と日時の表示を更新
  updateVersionAndTimeDisplay();

  // ポップアップボタンの設定
  setupPopupButtons();
});

/**
 * マウスホバー検知機能をセットアップする
 */
function setupHoverDetection() {
  // アプリ全体のコンテナ要素
  const appContainer = document.getElementById('app');
  
  // ホバー状態を表示する要素を作成
  const hoverStatusElement = document.createElement('div');
  hoverStatusElement.id = 'hover-status';
  hoverStatusElement.className = 'hover-status';
  hoverStatusElement.innerText = 'ホバー検知: 非アクティブ';
  appContainer.appendChild(hoverStatusElement);
  
  // マウスイベントのリスナーを追加
  appContainer.addEventListener('mouseenter', () => {
    hoverStatusElement.innerText = 'ホバー検知: アクティブ';
    hoverStatusElement.classList.add('active');
    console.log('Mouse hover detected');
    
    // ここで必要なアクションを実行できます
    // 例：Tauri APIを使ってRust側の関数を呼び出す
    // invoke("handle_hover", { active: true });
  });
  
  appContainer.addEventListener('mouseleave', () => {
    hoverStatusElement.innerText = 'ホバー検知: 非アクティブ';
    hoverStatusElement.classList.remove('active');
    console.log('Mouse hover ended');
    
    // ここで必要なアクションを実行できます
    // 例：Tauri APIを使ってRust側の関数を呼び出す
    // invoke("handle_hover", { active: false });
  });
}

/**
 * バージョン情報と日時の表示を更新する
 */
function updateVersionAndTimeDisplay() {
  // 実際のアプリケーションではTauriのAPIを使ってバージョン情報を取得できます
  // 例: invoke("get_version").then((version) => {...});
  
  // システム日時の更新
  const systemTimeElement = document.getElementById('system-time');
  if (systemTimeElement) {
    const currentDate = new Date();
    const formattedDate = `最終更新: ${currentDate.getFullYear()}年${String(currentDate.getMonth() + 1).padStart(2, '0')}月${String(currentDate.getDate()).padStart(2, '0')}日 ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;
    systemTimeElement.textContent = formattedDate;
  }
}

/**
 * ポップアップボタン機能をセットアップする
 */
function setupPopupButtons() {
  // メインウィンドウの参照を取得
  const mainWindow = appWindow;
  
  // A, B, Cのボタンに対してイベントリスナーを設定
  const buttonA = document.getElementById('buttonA');
  const buttonB = document.getElementById('buttonB');
  const buttonC = document.getElementById('buttonC');
  
  // ポップアップA
  buttonA.addEventListener('click', async () => {
    try {
      // 新しいウィンドウを開く
      await openPopupWindow('A');
      // メインウィンドウを非表示
      await mainWindow.hide();
      
      console.log('Popup A displayed, main window hidden');
    } catch (error) {
      console.error('Error displaying popup A:', error);
    }
  });
  
  // ポップアップB
  buttonB.addEventListener('click', async () => {
    try {
      // 新しいウィンドウを開く
      await openPopupWindow('B');
      // メインウィンドウを非表示
      await mainWindow.hide();
      
      console.log('Popup B displayed, main window hidden');
    } catch (error) {
      console.error('Error displaying popup B:', error);
    }
  });
  
  // ポップアップC
  buttonC.addEventListener('click', async () => {
    try {
      // 新しいウィンドウを開く
      await openPopupWindow('C');
      // メインウィンドウを非表示
      await mainWindow.hide();
      
      console.log('Popup C displayed, main window hidden');
    } catch (error) {
      console.error('Error displaying popup C:', error);
    }
  });
}

/**
 * ポップアップウィンドウを開く
 * @param {string} type - ポップアップの種類 (A, B, C)
 * @returns {Promise<void>}
 */
async function openPopupWindow(type) {
  try {
    // Tauriの新しいウィンドウを作成
    const popupWindow = await invoke('create_popup_window', {
      label: `popup${type}`,
      title: `Popup ${type}`,
      url: `popup${type}.html`
    });
    
    console.log(`Popup window ${type} created`);
    return popupWindow;
  } catch (error) {
    console.error(`Error creating popup window ${type}:`, error);
    throw error;
  }
}
