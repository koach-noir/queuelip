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

// ビューを切り替える
export function switchView(viewName) {
  console.log('Switching to view:', viewName);
  
  // 現在のアクティブビューを非表示にする
  const currentView = document.querySelector('.view.active');
  const currentTab = document.querySelector('.nav-tab.active');
  
  if (currentView) {
    currentView.classList.remove('active');
  }
  
  if (currentTab) {
    currentTab.classList.remove('active');
    // data-hover属性が使われている場合のスタイル対応はMutationObserverで自動処理
  }
  
  // 新しいビューとタブをアクティブにする
  const newView = document.getElementById(`view-${viewName}`);
  const newTab = document.querySelector(`.nav-tab[data-view="${viewName}"]`);
  
  if (newView) {
    newView.classList.add('active');
  }
  
  if (newTab) {
    newTab.classList.add('active');
    // data-hover属性が使われている場合のスタイル対応はMutationObserverで自動処理
  }
  
  // ビュー切り替えアニメーションのためのクラスを追加
  if (newView) {
    newView.classList.add('fade-in');
    setTimeout(() => {
      newView.classList.remove('fade-in');
    }, 300); // アニメーション終了後にクラスを除去
  }
}