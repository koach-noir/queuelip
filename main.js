// main.js
import { invoke } from "@tauri-apps/api/tauri";

document.addEventListener('DOMContentLoaded', () => {
  console.log('Queuelip application initialized');
  
  // マウスホバー検知のためのイベントリスナーを追加
  setupHoverDetection();
  
  // バージョン情報と日時の表示を更新
  updateVersionAndTimeDisplay();
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
