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
  
  // データ属性ベースのホバーエフェクト設定
  setupDataAttributeHoverEffects();
}

// データ属性を使ったホバー効果の設定
function setupDataAttributeHoverEffects() {
  // data-hover属性を持つすべての要素を取得
  const hoverElements = document.querySelectorAll('[data-hover="active"]');
  
  // ホバー要素ごとのグループを管理するマップ
  const hoverGroups = {};
  
  // ホバー効果を持つ要素をグループに分類
  hoverElements.forEach(element => {
    const hoverType = element.getAttribute('data-hover-type') || 'default';
    const hoverGroup = element.getAttribute('data-hover-group') || 'default';
    
    // グループが未定義の場合は初期化
    if (!hoverGroups[hoverGroup]) {
      hoverGroups[hoverGroup] = [];
    }
    
    // 要素をグループに追加
    hoverGroups[hoverGroup].push({
      element: element,
      type: hoverType
    });
    
    // 初期状態では非アクティブスタイルを適用（アクティブな要素を除く）
    if (!element.classList.contains('active')) {
      const inactiveClass = `${hoverType}-hover-inactive`;
      if (!element.classList.contains(inactiveClass)) {
        element.classList.add(inactiveClass);
      }
    }
    
    // ホバーイベントの設定
    element.addEventListener('mouseenter', function() {
      const type = this.getAttribute('data-hover-type') || 'default';
      const group = this.getAttribute('data-hover-group') || 'default';
      
      // 自身のホバースタイル切り替え
      this.classList.remove(`${type}-hover-inactive`);
      this.classList.add(`${type}-hover-active`);
      
      // 同じグループの他の要素をより非アクティブに
      if (hoverGroups[group]) {
        hoverGroups[group].forEach(item => {
          if (item.element !== this && !item.element.classList.contains('active')) {
            item.element.classList.remove(`${item.type}-hover-active`);
            item.element.classList.add(`${item.type}-hover-inactive`);
          }
        });
      }
    });
    
    // マウスが離れた時のイベント処理
    element.addEventListener('mouseleave', function() {
      // アクティブでない場合のみスタイルを戻す
      if (!this.classList.contains('active')) {
        const type = this.getAttribute('data-hover-type') || 'default';
        this.classList.remove(`${type}-hover-active`);
        this.classList.add(`${type}-hover-inactive`);
      }
    });
  });
  
  // アクティブ状態の変化を監視するMutationObserverの設定
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'class') {
        const element = mutation.target;
        const type = element.getAttribute('data-hover-type') || 'default';
        
        // activeクラスが追加された場合
        if (element.classList.contains('active')) {
          element.classList.remove(`${type}-hover-inactive`);
        } 
        // activeクラスが削除された場合
        else if (!element.classList.contains(`${type}-hover-active`)) {
          element.classList.add(`${type}-hover-inactive`);
        }
      }
    });
  });
  
  // 全てのホバー要素にオブザーバーを設定
  hoverElements.forEach(element => {
    observer.observe(element, { attributes: true });
  });
}