// ビューを動的に読み込む機能
export class ViewLoader {
  constructor() {
    this.loadedViews = new Map(); // キャッシュ用
    this.currentView = 'main';
  }

  // 外部HTMLファイルを読み込む
  async loadViewFromFile(viewName) {
    if (this.loadedViews.has(viewName)) {
      return this.loadedViews.get(viewName);
    }

    try {
      const response = await fetch(`views/view-${viewName}.html`);
      if (!response.ok) {
        throw new Error(`Failed to load view: ${viewName}`);
      }
      
      const htmlContent = await response.text();
      this.loadedViews.set(viewName, htmlContent);
      return htmlContent;
    } catch (error) {
      console.error(`Error loading view ${viewName}:`, error);
      return `<div class="error">ビュー${viewName}の読み込みに失敗しました</div>`;
    }
  }

  // ビューをコンテナに挿入する
  async renderView(viewName, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container not found: ${containerId}`);
      return false;
    }

    let htmlContent;
    
    if (viewName === 'main') {
      // メインビューは元々のHTMLをそのまま使用
      return true;
    } else {
      // 外部ファイルから読み込み
      htmlContent = await this.loadViewFromFile(viewName);
    }

    // コンテンツを挿入
    container.innerHTML = htmlContent;
    
    // POPボタンのイベントリスナーを再設定
    this.setupDynamicEventListeners(viewName);
    
    return true;
  }

  // 動的に追加されたボタンのイベントリスナーを設定
  setupDynamicEventListeners(viewName) {
    // POPボタンの機能を再設定
    if (viewName === 'a' || viewName === 'b' || viewName === 'c') {
      const popButton = document.getElementById(`popButton${viewName.toUpperCase()}`);
      if (popButton) {
        // 既存のイベントリスナーを削除してから追加
        popButton.removeEventListener('click', this.handlePopClick);
        popButton.addEventListener('click', this.handlePopClick.bind(this, viewName));
      }
    }
  }

  // POPボタンのクリックハンドラー
  async handlePopClick(viewName, event) {
    event.preventDefault();
    
    // Tauriのinvokeが利用可能な場合のみ実行
    if (window.__TAURI__ && window.__TAURI__.tauri) {
      try {
        const result = await window.__TAURI__.tauri.invoke('popup_window_command', {
          message: `View ${viewName.toUpperCase()} からポップアップ!`
        });
        console.log('Popup result:', result);
      } catch (error) {
        console.error('Popup error:', error);
        // フォールバック: 通常のアラート
        alert(`View ${viewName.toUpperCase()} からポップアップ!`);
      }
    } else {
      // Tauri環境でない場合のフォールバック
      alert(`View ${viewName.toUpperCase()} からポップアップ!`);
    }
  }

  // 現在のビューを取得
  getCurrentView() {
    return this.currentView;
  }

  // 現在のビューを設定
  setCurrentView(viewName) {
    this.currentView = viewName;
  }
}

// グローバルインスタンス
export const viewLoader = new ViewLoader();
