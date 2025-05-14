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

  // ポップアップからのパラメータを確認
  checkForPopupParams();
});

/**
 * URLからクエリパラメータを取得する
 * @returns {Object} クエリパラメータのオブジェクト
 */
function getQueryParams() {
  const params = {};
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  
  return params;
}

/**
 * ポップアップからのパラメータを確認し処理する
 */
function checkForPopupParams() {
  const params = getQueryParams();
  
  // ポップアップモードの場合
  if (params.popup) {
    const popupType = params.type || 'A';
    console.log(`Initializing popup mode: ${popupType}`);
    
    // メインコンテンツを非表示
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.classList.add('hidden');
    }
    
    // ヘッダーとフッターを非表示
    const header = document.querySelector('h1');
    const description = document.querySelector('h1 + p');
    const footer = document.querySelector('.app-footer');
    
    if (header) header.classList.add('hidden');
    if (description) description.classList.add('hidden');
    if (footer) footer.classList.add('hidden');
    
    // コンテナの設定変更
    const container = document.querySelector('.container');
    if (container) {
      container.style.paddingTop = '0';
      container.style.height = '100vh';
      container.style.display = 'flex';
      container.style.justifyContent = 'center';
      container.style.alignItems = 'center';
    }
    
    // ポップアップを作成
    const popup = createPopup(popupType);
    container.appendChild(popup);
  }
}

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
  // A, B, Cのボタンに対してイベントリスナーを設定
  const buttonA = document.getElementById('buttonA');
  const buttonB = document.getElementById('buttonB');
  const buttonC = document.getElementById('buttonC');
  
  // ポップアップA
  if (buttonA) {
    buttonA.addEventListener('click', async () => {
      try {
        // 新しいポップアップウィンドウを開く
        await openPopupWindow('A');
        // メイン画面を隠す
        await appWindow.hide();
        console.log('Popup A displayed, main window hidden');
      } catch (error) {
        console.error('Error displaying popup A:', error);
      }
    });
  }
  
  // ポップアップB
  if (buttonB) {
    buttonB.addEventListener('click', async () => {
      try {
        // 新しいポップアップウィンドウを開く
        await openPopupWindow('B');
        // メイン画面を隠す
        await appWindow.hide();
        console.log('Popup B displayed, main window hidden');
      } catch (error) {
        console.error('Error displaying popup B:', error);
      }
    });
  }
  
  // ポップアップC
  if (buttonC) {
    buttonC.addEventListener('click', async () => {
      try {
        // 新しいポップアップウィンドウを開く
        await openPopupWindow('C');
        // メイン画面を隠す
        await appWindow.hide();
        console.log('Popup C displayed, main window hidden');
      } catch (error) {
        console.error('Error displaying popup C:', error);
      }
    });
  }
}

/**
 * ポップアップウィンドウを開く
 * @param {string} type - ポップアップの種類 (A, B, C)
 * @returns {Promise<void>}
 */
async function openPopupWindow(type) {
  try {
    // Tauriの新しいウィンドウを作成 - メインのHTMLを再利用し、クエリパラメータでポップアップ識別
    const label = `popup${type}`;
    const url = `index.html?popup=true&type=${type}`;
    
    const popupWindow = await invoke('create_popup_window', {
      label,
      title: `Popup ${type}`,
      url
    });
    
    console.log(`Popup window ${type} created`);
    return popupWindow;
  } catch (error) {
    console.error(`Error creating popup window ${type}:`, error);
    throw error;
  }
}

/**
 * ポップアップを作成する
 * @param {string} text - ポップアップに表示するテキスト (A, B, C)
 * @returns {HTMLElement} - 作成されたポップアップ要素
 */
function createPopup(text) {
  // ポップアップ要素を作成
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.id = `popup${text}`;
  
  // テキスト要素を作成
  const textElement = document.createElement('div');
  textElement.className = 'popup-text';
  textElement.textContent = text;
  popup.appendChild(textElement);
  
  // 戻るボタンを作成
  const backButton = document.createElement('button');
  backButton.className = 'back-button';
  backButton.textContent = 'back';
  popup.appendChild(backButton);
  
  // 戻るボタンのクリックイベント
  backButton.addEventListener('click', async () => {
    try {
      // メインウィンドウを表示
      const mainWindow = await appWindow.getByLabel('main');
      if (mainWindow) {
        await mainWindow.show();
      }
      
      // 現在のポップアップウィンドウを閉じる
      await appWindow.close();
      
      console.log(`Returned from popup ${text}`);
    } catch (error) {
      console.error('Error returning to main window:', error);
    }
  });
  
  return popup;
}
