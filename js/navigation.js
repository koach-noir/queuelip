// navigation.js - タブによる画面切り替え機能の管理

/**
 * ナビゲーション（タブ）機能を初期化する
 */
export function initNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab');
  const views = document.querySelectorAll('.view');
  
  // 各タブにクリックイベントを追加
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // クリックされたタブに対応するビュー名を取得
      const targetView = tab.getAttribute('data-view');
      
      // すべてのタブから活性化クラスを削除
      navTabs.forEach(t => t.classList.remove('active'));
      
      // クリックされたタブを活性化
      tab.classList.add('active');
      
      // すべてのビューを非表示に
      views.forEach(view => {
        // ビューごとにフェードアウトアニメーションを適用
        view.classList.remove('active');
        view.style.opacity = '0';
      });
      
      // 対象のビューを表示
      const targetViewElement = document.getElementById(`view-${targetView}`);
      if (targetViewElement) {
        // アクティブクラスを追加してフェードインアニメーションを適用
        setTimeout(() => {
          targetViewElement.classList.add('active');
          targetViewElement.style.opacity = '1';
        }, 100); // 短いタイムアウトを設けて、CSSトランジションが適切に動作するようにする
      }
    });
  });
  
  /**
   * 特定のビューを表示する関数
   * @param {string} viewName - 表示するビュー名（'main', 'a', 'b', 'c'）
   */
  window.showView = function(viewName) {
    // 対応するタブを取得
    const tab = document.querySelector(`.nav-tab[data-view="${viewName}"]`);
    if (tab) {
      // タブをクリックしてビューを切り替え
      tab.click();
    }
  };
}
