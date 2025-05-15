// main.js
import { invoke } from "@tauri-apps/api/tauri";

document.addEventListener('DOMContentLoaded', () => {
  console.log('Queuelip application initialized');
  
  // マウスホバー検知のためのイベントリスナーを追加
  setupHoverDetection();
  
  // バージョン情報と日時の表示を更新
  updateVersionAndTimeDisplay();

  // ビュー切り替え機能のセットアップ
  setupViewSwitcher();
});

/**
 * マウスホバー検知機能をセットアップする
 */
function setupHoverDetection() {
  // アプリ全体のコンテナ要素
  const appContainer = document.getElementById('view-main');
  if (!appContainer) return;
  
  // ホバー状態を表示する要素を取得
  const hoverStatusElement = document.getElementById('hover-status');
  if (!hoverStatusElement) return;
  
  // マウスイベントのリスナーを追加
  appContainer.addEventListener('mouseenter', () => {
    hoverStatusElement.innerText = 'ホバー検知: アクティブ';
    hoverStatusElement.classList.add('active');
    console.log('Mouse hover detected');
  });
  
  appContainer.addEventListener('mouseleave', () => {
    hoverStatusElement.innerText = 'ホバー検知: 非アクティブ';
    hoverStatusElement.classList.remove('active');
    console.log('Mouse hover ended');
  });
}

/**
 * バージョン情報と日時の表示を更新する
 */
function updateVersionAndTimeDisplay() {
  // システム日時の更新
  const systemTimeElement = document.getElementById('system-time');
  if (systemTimeElement) {
    const currentDate = new Date();
    const formattedDate = `最終更新: ${currentDate.getFullYear()}年${String(currentDate.getMonth() + 1).padStart(2, '0')}月${String(currentDate.getDate()).padStart(2, '0')}日 ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;
    systemTimeElement.textContent = formattedDate;
  }
}

/**
 * ビュー切り替え機能をセットアップする
 */
function setupViewSwitcher() {
  // タブボタンイベントのセットアップ
  setupTabButtons();
  
  // 旧式のポップアップボタンをビュー切り替えに変更
  setupLegacyButtons();
}

/**
 * タブボタンによるビュー切り替え機能をセットアップする
 */
function setupTabButtons() {
  const tabButtons = document.querySelectorAll('.nav-tab');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetView = button.getAttribute('data-view');
      if (targetView) {
        switchToView(targetView);
      }
    });
  });
}

/**
 * 旧式のポップアップボタンをビュー切り替えボタンとして再利用
 */
function setupLegacyButtons() {
  // A, B, Cのボタンに対してイベントリスナーを設定
  const buttonA = document.getElementById('buttonA');
  const buttonB = document.getElementById('buttonB');
  const buttonC = document.getElementById('buttonC');
  
  // ボタンA
  if (buttonA) {
    buttonA.addEventListener('click', () => {
      switchToView('a');
    });
  }
  
  // ボタンB
  if (buttonB) {
    buttonB.addEventListener('click', () => {
      switchToView('b');
    });
  }
  
  // ボタンC
  if (buttonC) {
    buttonC.addEventListener('click', () => {
      switchToView('c');
    });
  }
}

/**
 * 指定されたビューに切り替える
 * @param {string} viewName - 切り替え先のビュー名 ('main', 'a', 'b', 'c')
 */
function switchToView(viewName) {
  console.log(`Switching to view: ${viewName}`);
  
  // 現在のアクティブビューとタブを非アクティブ化
  const currentView = document.querySelector('.view.active');
  const currentTab = document.querySelector('.nav-tab.active');
  
  if (currentView) {
    // フェードアウトアニメーション
    currentView.classList.add('fade-out');
    
    // アニメーション完了後に非アクティブ化
    setTimeout(() => {
      currentView.classList.remove('active', 'fade-out');
      
      // 新しいビューをアクティブ化
      activateNewView(viewName);
    }, 200); // フェードアウト時間に合わせる
  } else {
    // 現在のビューがない場合は直接新ビューをアクティブ化
    activateNewView(viewName);
  }
  
  // タブの切り替え
  if (currentTab) {
    currentTab.classList.remove('active');
  }
  
  const newTab = document.querySelector(`.nav-tab[data-view="${viewName}"]`);
  if (newTab) {
    newTab.classList.add('active');
  }
}

/**
 * 新しいビューをアクティブ化する
 * @param {string} viewName - アクティブ化するビュー名
 */
function activateNewView(viewName) {
  // ビュー要素を取得
  const newView = document.getElementById(`view-${viewName}`);
  
  if (newView) {
    // フェードインアニメーション
    newView.classList.add('active', 'fade-in');
    
    // アニメーション完了後にクラスを整理
    setTimeout(() => {
      newView.classList.remove('fade-in');
    }, 300); // フェードイン時間に合わせる
  }
}
