/**
 * アコーディオンコンポーネントを作成するためのユーティリティクラス
 */
class AccordionManager {
  /**
   * アコーディオンコンポーネントを作成して指定した親要素に追加します
   * @param {string} title - アコーディオンのタイトル
   * @param {string|HTMLElement} content - アコーディオンの内容 (HTML文字列またはDOM要素)
   * @param {string|HTMLElement} parent - 親要素のセレクタまたはDOM要素
   * @param {boolean} isOpen - 初期状態で開いているかどうか (デフォルト: false)
   * @returns {HTMLElement} 作成されたdetails要素
   */
  static createAccordion(title, content, parent, isOpen = false) {
    // details要素の作成
    const details = document.createElement('details');
    if (isOpen) {
      details.setAttribute('open', '');
    }

    // summary要素の作成
    const summary = document.createElement('summary');
    summary.textContent = title;
    details.appendChild(summary);

    // コンテンツ用のコンテナ作成
    const contentDiv = document.createElement('div');
    contentDiv.className = 'details-content';

    // contentがHTMLElement型の場合はそのまま追加、文字列の場合はinnerHTMLを設定
    if (content instanceof HTMLElement) {
      contentDiv.appendChild(content);
    } else {
      contentDiv.innerHTML = content;
    }

    details.appendChild(contentDiv);

    // 親要素に追加
    const parentElement = typeof parent === 'string' 
      ? document.querySelector(parent) 
      : parent;
    
    if (parentElement) {
      parentElement.appendChild(details);
    } else {
      console.error('親要素が見つかりません');
    }

    return details;
  }

  /**
   * 複数のアコーディオンをまとめて作成します
   * @param {Array<{title: string, content: string|HTMLElement, isOpen: boolean}>} items - アコーディオンアイテムの配列
   * @param {string|HTMLElement} parent - 親要素のセレクタまたはDOM要素
   * @returns {Array<HTMLElement>} 作成されたdetails要素の配列
   */
  static createAccordionGroup(items, parent) {
    return items.map(item => {
      return this.createAccordion(item.title, item.content, parent, item.isOpen || false);
    });
  }

  /**
   * すべてのアコーディオンを閉じます
   * @param {string} selector - アコーディオン要素のセレクタ (デフォルト: 'details')
   */
  static closeAll(selector = 'details') {
    document.querySelectorAll(selector).forEach(details => {
      details.removeAttribute('open');
    });
  }

  /**
   * すべてのアコーディオンを開きます
   * @param {string} selector - アコーディオン要素のセレクタ (デフォルト: 'details')
   */
  static openAll(selector = 'details') {
    document.querySelectorAll(selector).forEach(details => {
      details.setAttribute('open', '');
    });
  }
}
