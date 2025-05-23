// フォーカス管理モジュール - 画面切り替え時の初期フォーカス制御

/**
 * ビュー切り替え時に適切な要素に自動フォーカスを設定するクラス
 */
export class FocusManager {
  constructor() {
    // 各ビューでフォーカスすべき要素のセレクタを定義
    this.focusTargets = {
      main: '.main-details:first-of-type summary', // 最初のアコーディオンのsummary
      a: '#popButtonA',                          // ビューAのPOPボタン
      b: '#popButtonB',                          // ビューBのPOPボタン
      c: '#popButtonC'                           // ビューCのPOPボタン
    };
    
    // フォーカス設定の遅延時間（ビュー切り替えアニメーション考慮）
    this.focusDelay = 100;
  }

  /**
   * 指定されたビューの適切な要素にフォーカスを設定
   * @param {string} viewName - フォーカスを設定するビュー名
   */
  setInitialFocus(viewName) {
    const selector = this.focusTargets[viewName];
    
    if (!selector) {
      console.warn(`Focus target not defined for view: ${viewName}`);
      return;
    }

    // ビュー切り替えアニメーションの完了を待ってからフォーカス設定
    setTimeout(() => {
      const targetElement = document.querySelector(selector);
      
      if (targetElement) {
        try {
          // 要素が表示されている場合のみフォーカスを設定
          if (this.isElementVisible(targetElement)) {
            targetElement.focus();
            console.log(`Focus set to element: ${selector} in view: ${viewName}`);
          } else {
            console.warn(`Target element not visible: ${selector} in view: ${viewName}`);
          }
        } catch (error) {
          console.error(`Failed to set focus on element: ${selector}`, error);
        }
      } else {
        console.warn(`Focus target element not found: ${selector} in view: ${viewName}`);
      }
    }, this.focusDelay);
  }

  /**
   * 要素が表示されているかチェック
   * @param {Element} element - チェックする要素
   * @returns {boolean} 要素が表示されている場合true
   */
  isElementVisible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           element.offsetWidth > 0 && 
           element.offsetHeight > 0;
  }

  /**
   * 新しいビューのフォーカス対象を追加
   * @param {string} viewName - ビュー名
   * @param {string} selector - フォーカス対象のCSSセレクタ
   */
  addFocusTarget(viewName, selector) {
    this.focusTargets[viewName] = selector;
    console.log(`Added focus target for view ${viewName}: ${selector}`);
  }

  /**
   * 指定ビューのフォーカス対象を削除
   * @param {string} viewName - ビュー名
   */
  removeFocusTarget(viewName) {
    delete this.focusTargets[viewName];
    console.log(`Removed focus target for view: ${viewName}`);
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
   * 現在のフォーカス対象設定を取得
   * @returns {Object} フォーカス対象の設定オブジェクト
   */
  getFocusTargets() {
    return { ...this.focusTargets };
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
}

// グローバルインスタンス
export const focusManager = new FocusManager();
