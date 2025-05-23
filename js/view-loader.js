// Tauri対応ビューマネージャー - テンプレート文字列アプローチ
export class ViewManager {
  constructor() {
    this.currentView = 'main';
    this.viewTemplates = {
      a: `
        <h2 class="text-center">ビューA</h2>
        <div class="text-center mb-4">
          <div class="text-lg font-bold" style="color: #2563eb;">A</div>
        </div>
        <div class="text-center">
          <button id="popButtonA" class="popup-button">POP</button>
        </div>
      `,
      b: `
        <h2 class="text-center">ビューB</h2>
        <div class="text-center mb-4">
          <div class="text-lg font-bold" style="color: #9333ea;">B</div>
        </div>
        <div class="text-center">
          <button id="popButtonB" class="popup-button">POP</button>
        </div>
      `,
      c: `
        <h2 class="text-center">ビューC</h2>
        <div class="text-center mb-4">
          <div class="text-lg font-bold" style="color: #db2777;">C</div>
        </div>
        <div class="text-center">
          <button id="popButtonC" class="popup-button">POP</button>
        </div>
      `
    };
  }

  // ビューテンプレートを取得
  getViewTemplate(viewName) {
    return this.viewTemplates[viewName] || `<div class="error">ビュー${viewName}が見つかりません</div>`;
  }

  // ビューをコンテナに描画
  renderView(viewName, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container not found: ${containerId}`);
      return false;
    }

    if (viewName === 'main') {
      // メインビューは元々のHTMLをそのまま使用
      return true;
    }

    // テンプレートからHTMLを挿入
    const htmlContent = this.getViewTemplate(viewName);
    container.innerHTML = htmlContent;
    
    // POPボタンのイベントリスナーを設定
    this.setupDynamicEventListeners(viewName);
    
    return true;
  }

  // 動的に追加されたボタンのイベントリスナーを設定
  setupDynamicEventListeners(viewName) {
    if (viewName === 'a' || viewName === 'b' || viewName === 'c') {
      const popButton = document.getElementById(`popButton${viewName.toUpperCase()}`);
      if (popButton) {
        // クリックイベントを設定
        popButton.addEventListener('click', (event) => this.handlePopClick(viewName, event));
      }
    }
  }

  // POPボタンのクリックハンドラー
  async handlePopClick(viewName, event) {
    event.preventDefault();
    
    console.log(`POP button clicked for view ${viewName.toUpperCase()}`);
    
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

  // 新しいビューテンプレートを追加
  addViewTemplate(viewName, template) {
    this.viewTemplates[viewName] = template;
  }

  // 現在のビューを取得
  getCurrentView() {
    return this.currentView;
  }

  // 現在のビューを設定
  setCurrentView(viewName) {
    this.currentView = viewName;
  }

  // 全ビューをクリア（必要に応じて）
  clearAllViews() {
    ['a', 'b', 'c'].forEach(viewName => {
      const container = document.getElementById(`view-${viewName}`);
      if (container) {
        container.innerHTML = '';
      }
    });
  }
}

// グローバルインスタンス
export const viewManager = new ViewManager();

// 後方互換性のため、旧名でもエクスポート
export const viewLoader = viewManager;