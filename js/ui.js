// ホバー検知機能を設定
export function setupHoverDetection() {
  const mainView = document.getElementById('view-main');
  const hoverStatus = document.getElementById('hover-status');
  
  // 基本的なホバー検知（ステータス表示用）
  if (mainView && hoverStatus) {
    mainView.addEventListener('mouseenter', function() {
      hoverStatus.textContent = 'ホバー検知: アクティブ';
      hoverStatus.classList.add('active');
    });
    
    mainView.addEventListener('mouseleave', function() {
      hoverStatus.textContent = 'ホバー検知: 非アクティブ';
      hoverStatus.classList.remove('active');
    });
  }
  
  // タブのホバー検知と拡張スタイル適用
  setupTabHoverStyles();
  
  // その他のボタン要素に対するホバー検知と拡張スタイル適用
  setupButtonHoverStyles();
  
  // アコーディオン要素に対するホバー検知と拡張スタイル適用
  setupAccordionHoverStyles();
}

// タブのホバースタイルを設定
function setupTabHoverStyles() {
  const tabs = document.querySelectorAll('.nav-tab');
  
  tabs.forEach(tab => {
    // 非アクティブタブのデフォルトスタイルを適用
    if (!tab.classList.contains('active')) {
      tab.classList.add('tab-hover-inactive');
    }
    
    // ホバー時のイベント処理
    tab.addEventListener('mouseenter', function() {
      // アクティブでないタブの場合は、ホバー時にアクティブに近いスタイルを表示
      if (!this.classList.contains('active')) {
        this.classList.remove('tab-hover-inactive');
        this.classList.add('tab-hover-active');
      }
      
      // 他のタブをさらに目立たなくする
      tabs.forEach(otherTab => {
        if (otherTab !== this && !otherTab.classList.contains('active')) {
          otherTab.classList.remove('tab-hover-active');
          otherTab.classList.add('tab-hover-inactive');
        }
      });
    });
    
    // マウスが離れた時のイベント処理
    tab.addEventListener('mouseleave', function() {
      // アクティブでないタブの場合は、通常の非アクティブスタイルに戻す
      if (!this.classList.contains('active')) {
        this.classList.remove('tab-hover-active');
        this.classList.add('tab-hover-inactive');
      }
    });
  });
}

// ボタン要素のホバースタイルを設定
function setupButtonHoverStyles() {
  const buttons = document.querySelectorAll('.popup-button');
  
  buttons.forEach(button => {
    // 非ホバー時のデフォルトスタイル
    button.classList.add('btn-hover-inactive');
    
    // ホバー時のイベント処理
    button.addEventListener('mouseenter', function() {
      this.classList.remove('btn-hover-inactive');
      this.classList.add('btn-hover-active');
      
      // 他のボタンをさらに目立たなくする
      buttons.forEach(otherButton => {
        if (otherButton !== this) {
          otherButton.classList.remove('btn-hover-active');
          otherButton.classList.add('btn-hover-inactive');
        }
      });
    });
    
    // マウスが離れた時のイベント処理
    button.addEventListener('mouseleave', function() {
      this.classList.remove('btn-hover-active');
      this.classList.add('btn-hover-inactive');
    });
  });
}

// アコーディオン要素のホバースタイルを設定
function setupAccordionHoverStyles() {
  const summaries = document.querySelectorAll('summary');
  
  summaries.forEach(summary => {
    // 非ホバー時のデフォルトスタイル
    summary.classList.add('hover-inactive');
    
    // ホバー時のイベント処理
    summary.addEventListener('mouseenter', function() {
      this.classList.remove('hover-inactive');
      this.classList.add('hover-active');
    });
    
    // マウスが離れた時のイベント処理
    summary.addEventListener('mouseleave', function() {
      this.classList.remove('hover-active');
      this.classList.add('hover-inactive');
    });
  });
}