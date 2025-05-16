// タブボタンの設定
export function setupTabButtons() {
  const tabButtons = document.querySelectorAll('.nav-tab');
  
  tabButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const viewName = this.getAttribute('data-view');
      if (viewName) {
        switchView(viewName);
        
        // メインビュー以外はモーダルダイアログを表示
        if (viewName !== 'main') {
          showViewModal(viewName);
        }
      }
    });
  });
  
  // モーダルの閉じるボタンのイベントリスナーを設定
  setupModalCloseButtons();
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
}

// モーダルダイアログの閉じるボタンのイベントリスナーを設定
function setupModalCloseButtons() {
  const closeButtons = document.querySelectorAll('.modal-close');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const viewName = this.getAttribute('data-view');
      closeViewModal(viewName);
    });
  });
}

// ビュー用モーダルダイアログを表示
export function showViewModal(viewName) {
  const modalDialog = document.getElementById(`modal-${viewName}`);
  if (modalDialog) {
    modalDialog.classList.add('active');
  }
}

// ビュー用モーダルダイアログを閉じる
export function closeViewModal(viewName) {
  const modalDialog = document.getElementById(`modal-${viewName}`);
  if (modalDialog) {
    modalDialog.classList.remove('active');
    
    // メインビューに戻る
    switchView('main');
  }
}

// 旧メソッド（互換性のため残しています）
export function showAViewModal() {
  showViewModal('a');
}

// 旧メソッド（互換性のため残しています）
export function closeAViewModal() {
  closeViewModal('a');
}
