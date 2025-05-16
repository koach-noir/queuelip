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

  // 初期状態でのフォーカス制御を設定
  setupTabFocusNavigation();
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
    // 非アクティブになったタブにはinactiveクラスを追加
    currentTab.classList.add('tab-hover-inactive');
  }
  
  // 新しいビューとタブをアクティブにする
  const newView = document.getElementById(`view-${viewName}`);
  const newTab = document.querySelector(`.nav-tab[data-view="${viewName}"]`);
  
  if (newView) {
    newView.classList.add('active');
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

  // タブフォーカスナビゲーションを更新
  updateTabFocusNavigation(viewName);
}

// タブフォーカスナビゲーションの初期設定
function setupTabFocusNavigation() {
  // 現在のアクティブビューを取得
  const activeView = document.querySelector('.view.active');
  if (activeView) {
    const viewName = activeView.id.replace('view-', '');
    updateTabFocusNavigation(viewName);
  }
}

// タブフォーカスナビゲーションを更新
function updateTabFocusNavigation(activeViewName) {
  // すべてのビューを取得
  const views = document.querySelectorAll('.view');
  
  // 各ビューに対してフォーカス可能要素のtabindexを更新
  views.forEach(view => {
    const viewName = view.id.replace('view-', '');
    const isCurrent = viewName === activeViewName;
    
    // ビュー内のフォーカス可能要素を取得
    const focusableElements = view.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // フォーカス可能要素のtabindexを更新
    focusableElements.forEach(element => {
      // 現在のビューの要素はフォーカス可能に、それ以外は不可に
      if (isCurrent) {
        // 元のtabindexがある場合はそれを復元、なければ削除
        if (element.hasAttribute('data-original-tabindex')) {
          const originalTabindex = element.getAttribute('data-original-tabindex');
          if (originalTabindex !== null && originalTabindex !== '') {
            element.setAttribute('tabindex', originalTabindex);
          } else {
            element.removeAttribute('tabindex');
          }
        }
      } else {
        // 現在のtabindexを保存し、フォーカス不可に設定
        if (!element.hasAttribute('data-original-tabindex')) {
          const currentTabindex = element.getAttribute('tabindex');
          element.setAttribute('data-original-tabindex', currentTabindex || '');
        }
        element.setAttribute('tabindex', '-1');
      }
    });
  });
  
  // タブボタンは常にフォーカス可能
  const tabButtons = document.querySelectorAll('.nav-tab');
  tabButtons.forEach(button => {
    if (button.hasAttribute('data-original-tabindex')) {
      const originalTabindex = button.getAttribute('data-original-tabindex');
      if (originalTabindex !== null && originalTabindex !== '') {
        button.setAttribute('tabindex', originalTabindex);
      } else {
        button.removeAttribute('tabindex');
      }
    }
  });
}