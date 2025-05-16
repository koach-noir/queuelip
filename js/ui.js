// ui.js - UIイベントとインタラクションの処理

/**
 * UIイベントとインタラクションを初期化する
 */
export function initUI() {
  // ホバー状態の表示
  initHoverStatus();
  
  // フォーカス制御の初期化
  initFocusControl();
}

/**
 * ホバー状態の検知と表示を初期化する
 */
function initHoverStatus() {
  const hoverStatus = document.getElementById('hover-status');
  const popupButtons = document.querySelectorAll('.popup-button');
  
  if (!hoverStatus) return;
  
  // ボタンにホバーイベントを追加
  popupButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      hoverStatus.textContent = `ホバー検知: ${button.textContent}ボタン上`;
      hoverStatus.classList.add('active');
    });
    
    button.addEventListener('mouseleave', () => {
      hoverStatus.textContent = 'ホバー検知: 非アクティブ';
      hoverStatus.classList.remove('active');
    });
  });
}

/**
 * フォーカス制御を初期化する
 */
function initFocusControl() {
  const focusControlMain = document.querySelector('.focus-control-main');
  
  if (focusControlMain) {
    // フォーカスイベントの処理
    focusControlMain.addEventListener('focus', () => {
      console.log('メインページのフォーカス制御要素にフォーカスが当たりました');
    });
    
    focusControlMain.addEventListener('blur', () => {
      console.log('メインページのフォーカス制御要素からフォーカスが外れました');
    });
    
    // キーボードイベントの処理
    focusControlMain.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        // Enter または Space キーでアコーディオンを開閉
        const details = focusControlMain.closest('details');
        if (details) {
          details.open = !details.open;
          event.preventDefault();
        }
      }
    });
  }
  
  // アコーディオン要素のアクセシビリティ強化
  const allSummaries = document.querySelectorAll('summary');
  allSummaries.forEach(summary => {
    // 適切なARIAロールと属性を設定
    summary.setAttribute('role', 'button');
    summary.setAttribute('aria-expanded', summary.parentElement.open ? 'true' : 'false');
    
    // 開閉状態が変わったときにaria-expandedを更新
    summary.parentElement.addEventListener('toggle', () => {
      summary.setAttribute('aria-expanded', summary.parentElement.open ? 'true' : 'false');
    });
    
    // タブインデックスを設定して、キーボードでフォーカス可能にする
    if (!summary.hasAttribute('tabindex')) {
      summary.setAttribute('tabindex', '0');
    }
  });
}
