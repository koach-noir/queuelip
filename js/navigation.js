import { viewManager } from './view-loader.js';
import { focusManager } from './focus-manager.js';

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
  
  // 初期化時に非アクティブなビューにinert属性を設定
  initializeInertViews();
}

// 初期化時に非アクティブなビューにinert属性を設定
function initializeInertViews() {
  const allViews = document.querySelectorAll('.view');
  
  allViews.forEach(function(view) {
    if (!view.classList.contains('active')) {
      view.setAttribute('inert', '');
    }
  });
}

// ビューを切り替える（テンプレート文字列アプローチ対応）
export function switchView(viewName) {
  console.log('Switching to view:', viewName);
  
  // 現在のアクティブビューを非表示にする
  const currentView = document.querySelector('.view.active');
  const currentTab = document.querySelector('.nav-tab.active');
  
  if (currentView) {
    currentView.classList.remove('active');
    // 非アクティブになったビューにinert属性を追加
    currentView.setAttribute('inert', '');
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
    // メインビュー以外の場合はテンプレートを描画
    if (viewName !== 'main') {
      const success = viewManager.renderView(viewName, `view-${viewName}`);
      if (!success) {
        console.error(`Failed to render view: ${viewName}`);
        return;
      }
    }
    
    newView.classList.add('active');
    // アクティブになったビューからinert属性を削除
    newView.removeAttribute('inert');
    viewManager.setCurrentView(viewName);
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

  // 🔧 新機能: ビュー切り替え後に適切な要素に自動フォーカスを設定
  focusManager.setInitialFocus(viewName);
}
