// main.js
import { invoke } from "@tauri-apps/api/tauri";

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
  // メインコンテナ
  const container = document.querySelector('.container');
  const appContainer = document.getElementById('app');
  
  // A, B, Cのボタンに対してイベントリスナーを設定
  const buttonA = document.getElementById('buttonA');
  const buttonB = document.getElementById('buttonB');
  const buttonC = document.getElementById('buttonC');
  
  // ポップアップA
  buttonA.addEventListener('click', () => {
    // メイン画面を非表示
    appContainer.classList.add('hidden');
    
    // ポップアップAを作成
    const popupA = createPopup('A');
    container.appendChild(popupA);
    
    console.log('Popup A displayed');
  });
  
  // ポップアップB
  buttonB.addEventListener('click', () => {
    // メイン画面を非表示
    appContainer.classList.add('hidden');
    
    // ポップアップBを作成
    const popupB = createPopup('B');
    container.appendChild(popupB);
    
    console.log('Popup B displayed');
  });
  
  // ポップアップC
  buttonC.addEventListener('click', () => {
    // メイン画面を非表示
    appContainer.classList.add('hidden');
    
    // ポップアップCを作成
    const popupC = createPopup('C');
    container.appendChild(popupC);
    
    console.log('Popup C displayed');
  });
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
  backButton.addEventListener('click', () => {
    // ポップアップを削除
    popup.remove();
    
    // メイン画面を表示
    const appContainer = document.getElementById('app');
    appContainer.classList.remove('hidden');
    
    console.log(`Returned from popup ${text}`);
  });
  
  return popup;
}
