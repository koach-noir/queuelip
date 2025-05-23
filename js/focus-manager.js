// フォーカス管理モジュール - 画面切り替え時の初期フォーカス制御

/**
 * ビュー切り替え時に適切な要素に自動フォーカスを設定するクラス
 */
export class FocusManager {
  constructor() {
    // フォーカス設定の遅延時間（ビュー切り替えアニメーション考慮）
    this.focusDelay = 100;
    
    // フォーカス可能な要素のセレクタ
    this.focusableElementsSelector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      'area[href]',
      'summary',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      'details:not([disabled])',
      '[contenteditable="true"]'
    ].join(', ');
  }

  /**
   * 指定されたビューの適切な要素にフォーカスを設定
   * @param {string} viewName - フォーカスを設定するビュー名
   */
  setInitialFocus(viewName) {
    // ビュー切り替えアニメーションの完了を待ってからフォーカス設定
    setTimeout(() => {
      const viewContainer = document.getElementById(`view-${viewName}`);
      
      if (!viewContainer) {
        console.warn(`View container not found: view-${viewName}`);
        return;
      }

      // nav-tabs以外の先頭のフォーカス可能要素を検索
      const firstFocusableElement = this.findFirstFocusableElement(viewContainer);
      
      if (firstFocusableElement) {
        try {
          firstFocusableElement.focus();
          console.log(`Focus set to first focusable element in view: ${viewName}`, firstFocusableElement);
        } catch (error) {
          console.error(`Failed to set focus on element in view: ${viewName}`, error);
        }
      } else {
        console.warn(`No focusable element found in view: ${viewName}`);
      }
    }, this.focusDelay);
  }

  /**
   * 指定されたコンテナ内でnav-tabs以外の先頭のフォーカス可能要素を検索
   * @param {Element} container - 検索対象のコンテナ要素
   * @returns {Element|null} 最初のフォーカス可能要素またはnull
   */
  findFirstFocusableElement(container) {
    // コンテナ内のすべてのフォーカス可能要素を取得
    const focusableElements = container.querySelectorAll(this.focusableElementsSelector);
    
    for (const element of focusableElements) {
      // nav-tabsの子要素またはnav-tabs自体は除外
      if (this.isWithinNavTabs(element)) {
        continue;
      }
      
      // 要素が表示されているかチェック
      if (this.isElementVisible(element)) {
        return element;
      }
    }
    
    return null;
  }

  /**
   * 要素がnav-tabs内にあるかチェック
   * @param {Element} element - チェックする要素
   * @returns {boolean} nav-tabs内の要素の場合true
   */
  isWithinNavTabs(element) {
    return element.closest('.nav-tabs') !== null || 
           element.classList.contains('nav-tabs') || 
           element.classList.contains('nav-tab');
  }

  /**
   * 要素が表示されているかチェック
   * @param {Element} element - チェックする要素
   * @returns {boolean} 要素が表示されている場合true
   */
  isElementVisible(element) {
    // 基本的な表示チェック
    if (element.offsetWidth === 0 && element.offsetHeight === 0) {
      return false;
    }
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0';
  }

  /**
   * フォーカス設定の遅延時間を変更
   * @param {number} delay - 遅延時間（ミリ秒）
   */
  setFocusDelay(delay) {
    this.focusDelay = delay;
    console.log(`Focus delay set to: ${delay}ms`);
  }

  /**
   * 現在フォーカスされている要素の情報を取得
   * @returns {Object} フォーカス情報
   */
  getCurrentFocusInfo() {
    const activeElement = document.activeElement;
    return {
      element: activeElement,
      tagName: activeElement ? activeElement.tagName : null,
      id: activeElement ? activeElement.id : null,
      className: activeElement ? activeElement.className : null,
      selector: this.getElementSelector(activeElement)
    };
  }

  /**
   * 要素のCSSセレクタを生成
   * @param {Element} element - 要素
   * @returns {string} CSSセレクタ
   */
  getElementSelector(element) {
    if (!element) return null;
    
    if (element.id) {
      return `#${element.id}`;
    }
    
    let selector = element.tagName.toLowerCase();
    if (element.className) {
      selector += '.' + element.className.split(' ').join('.');
    }
    
    return selector;
  }

  /**
   * 指定ビューのフォーカス可能要素をデバッグ出力
   * @param {string} viewName - ビュー名
   */
  debugFocusableElements(viewName) {
    const viewContainer = document.getElementById(`view-${viewName}`);
    if (!viewContainer) {
      console.warn(`View container not found for debug: view-${viewName}`);
      return;
    }

    const allFocusable = viewContainer.querySelectorAll(this.focusableElementsSelector);
    const filteredFocusable = Array.from(allFocusable).filter(el => 
      !this.isWithinNavTabs(el) && this.isElementVisible(el)
    );

    console.group(`🔍 Focusable elements debug for view: ${viewName}`);
    console.log('All focusable elements:', allFocusable);
    console.log('Filtered focusable elements (excluding nav-tabs):', filteredFocusable);
    console.log('First focusable element:', filteredFocusable[0] || 'None found');
    console.groupEnd();
  }
}

// グローバルインスタンス
export const focusManager = new FocusManager();
