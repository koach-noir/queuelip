// Tauri対応ビューマネージャー - 分離されたテンプレートアプローチ
import { viewATemplate, initializeViewA } from './views/view-a.js';
import { viewBTemplate, initializeViewB } from './views/view-b.js';
import { viewCTemplate } from './views/view-c.js';

export class ViewManager {
  constructor() {
    this.currentView = 'main';
    // 分離されたテンプレートファイルから動的に構築
    this.viewTemplates = {
      a: viewATemplate,
      b: viewBTemplate,
      c: viewCTemplate
    };
    
    // ビュー初期化関数のマップ
    this.viewInitializers = {
      a: initializeViewA,
      b: initializeViewB,
      c: null  // 将来の拡張用
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
    
    // 動的イベントリスナー設定（従来の実装）
    this.setupDynamicEventListeners(viewName);
    
    // ビュー固有の初期化関数を実行
    this.initializeView(viewName);
    
    return true;
  }

  // ビュー固有の初期化関数を実行
  initializeView(viewName) {
    const initializer = this.viewInitializers[viewName];
    if (initializer && typeof initializer === 'function') {
      try {
        initializer();
        console.log(`View ${viewName} initialized successfully`);
      } catch (error) {
        console.error(`Error initializing view ${viewName}:`, error);
      }
    }
  }

  // 動的に追加されたボタンのイベントリスナーを設定（レガシー対応）
  setupDynamicEventListeners(viewName) {
    if (viewName === 'a' || viewName === 'b' || viewName === 'c') {
      const popButton = document.getElementById(`popButton${viewName.toUpperCase()}`);
      if (popButton) {
        // ビューA、Bの場合は新しい初期化関数を使用するため、ここでは設定しない
        if (viewName === 'a' || viewName === 'b') {
          return; // initializeViewA()またはinitializeViewB()が処理する
        }
        
        // ビューCの場合は従来の処理
        popButton.addEventListener('click', (event) => this.handlePopClick(viewName, event));
      }
    }
  }

  // POPボタンのクリックハンドラー（レガシー実装 - ビューB、C用）
  async handlePopClick(viewName, event) {
    event.preventDefault();
    
    console.log(`POP button clicked for view ${viewName.toUpperCase()}`);
    
    // ビューC用の拡張
    if (viewName === 'c') {
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
  }

  // 新しいビューテンプレートを追加（動的テンプレート追加用）
  addViewTemplate(viewName, template, initializer = null) {
    this.viewTemplates[viewName] = template;
    if (initializer) {
      this.viewInitializers[viewName] = initializer;
    }
  }

  // 分離されたテンプレートファイルからテンプレートを動的ロード
  async loadViewTemplate(viewName, modulePath) {
    try {
      const module = await import(modulePath);
      const templateKey = `view${viewName.toUpperCase()}Template`;
      const initializerKey = `initialize${viewName.toUpperCase()}`;
      
      if (module[templateKey]) {
        this.viewTemplates[viewName] = module[templateKey];
        
        // 初期化関数がある場合は追加
        if (module[initializerKey]) {
          this.viewInitializers[viewName] = module[initializerKey];
        }
        
        return true;
      } else {
        console.error(`Template ${templateKey} not found in module ${modulePath}`);
        return false;
      }
    } catch (error) {
      console.error(`Failed to load template from ${modulePath}:`, error);
      return false;
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
