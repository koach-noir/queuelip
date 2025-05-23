import { viewLoader } from './view-loader.js';

// タブボタンの設定
export function setupTabButtons() {
  const tabButtons = document.querySelectorAll('.nav-tab');
  
  tabButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const viewName = this.getAttribute('data-view');
      if (viewName) {
        switchView(viewName);
      }
    });
  });
}

// ビューを切り替える（動的読み込み対応）
export async function switchView(viewName) {
  console.log('Switching to view:', viewName);
  
  // 現在のアクティブビューを非表示にする
  const currentView = document.querySelector('.view.active');
  const currentTab = document.querySelector('.nav-tab.active');
  
  if (currentView) {
    currentView.classList.remove('active');
  }
  
  if (currentTab) {
    currentTab.classList.remove('active');
    // 非アクティブになったタブにはinactiveクラスを追加
    currentTab.classList.add('tab-hover-inactive');
  }
  
  // 新しいビューとタブをアクティブにする
  const newView = document.getElementById(`view-${viewName}`);
  const newTab = document.querySelector(`.nav-tab[data-view=\"${viewName}\"]`);
  
  if (newView) {
    // メインビュー以外の場合は動的読み込みを実行
    if (viewName !== 'main') {
      await viewLoader.renderView(viewName, `view-${viewName}`);
    }
    
    newView.classList.add('active');
    viewLoader.setCurrentView(viewName);
  }
  
  if (newTab) {
    newTab.classList.add('active');
    // アクティブになったタブからはinactiveクラスを除去
    newTab.classList.remove('tab-hover-inactive');
    
    // 他のタブをよりinactiveに見せる
    document.querySelectorAll('.nav-tab:not(.active)').forEach(tab => {
      tab.classList.add('tab-hover-inactive');
    });
  }
  
  // ビュー切り替えアニメーションのためのクラスを追加
  if (newView) {
    newView.classList.add('fade-in');
    setTimeout(() => {
      newView.classList.remove('fade-in');
    }, 300); // アニメーション終了後にクラスを除去
  }
}
