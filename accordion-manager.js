// accordion-manager.js - アコーディオン機能管理モジュール

/**
 * アコーディオン機能をセットアップする
 */
export function setupAccordions() {
  const accordionToggles = document.querySelectorAll('.accordion-toggle');
  
  accordionToggles.forEach(toggle => {
    // 初期状態では閉じておく
    const content = toggle.closest('.accordion-container').querySelector('.accordion-content');
    const icon = toggle.querySelector('.toggle-icon');
    
    // トグルボタンにクリックイベントを追加
    toggle.addEventListener('click', () => {
      // アイコンの回転
      icon.classList.toggle('open');
      
      // コンテンツの表示/非表示を切り替え
      if (content.classList.contains('open')) {
        // 閉じる
        content.style.height = content.scrollHeight + 'px';
        // トリガーreflow
        content.offsetHeight;
        content.style.height = '0';
        content.classList.remove('open');
        
        // テキストを切り替え
        toggle.querySelector('.toggle-text').textContent = 
          toggle.closest('.accordion-container').querySelector('.accordion-content').contains(document.querySelector('footer')) 
            ? 'バージョン情報を表示' 
            : '詳細情報を表示';
      } else {
        // 開く
        content.classList.add('open');
        content.style.height = content.scrollHeight + 'px';
        
        // テキストを切り替え
        toggle.querySelector('.toggle-text').textContent = 
          toggle.closest('.accordion-container').querySelector('.accordion-content').contains(document.querySelector('footer')) 
            ? 'バージョン情報を隠す' 
            : '詳細情報を隠す';
        
        // アニメーション完了後に高さを auto に設定
        setTimeout(() => {
          if (content.classList.contains('open')) {
            content.style.height = 'auto';
          }
        }, 300);
      }
    });
  });
}
