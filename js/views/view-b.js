// ビューB テンプレート
export const viewBTemplate = `
  <h2 class="text-center">ビューB</h2>
  <div class="text-center mb-4">
    <div class="text-lg font-bold" style="color: #9333ea;">B</div>
  </div>
  <div class="text-center">
    <button id="popButtonB" class="popup-button">POP</button>
  </div>
`;

// ビューB固有の設定（将来の拡張用）
export const viewBConfig = {
  name: 'b',
  title: 'ビューB',
  color: '#9333ea',
  buttonId: 'popButtonB'
};

// ビューB初期化関数（POPボタンのイベントリスナー追加）
export function initializeViewB() {
  const popButton = document.getElementById('popButtonB');
  
  if (popButton) {
    popButton.addEventListener('click', async function() {
      try {
        console.log('POP button clicked - opening dashboard window (view-b context)');
        
        // ボタンの視覚的フィードバック
        popButton.disabled = true;
        popButton.textContent = 'OPENING...';
        
        // Tauri APIを使用してダッシュボードウィンドウを開く（ビューBコンテキスト）
        if (window.__TAURI__ && window.__TAURI__.tauri) {
          await window.__TAURI__.tauri.invoke('open_dashboard', { context: 'view-b' });
          console.log('Dashboard window opened successfully (view-b context)');
        } else {
          console.error('Tauri API not available');
          alert('Dashboard window feature requires Tauri environment');
        }
        
      } catch (error) {
        console.error('Error opening dashboard window:', error);
        alert('Failed to open dashboard window: ' + error.message);
      } finally {
        // ボタンを元に戻す（少し遅延させて視覚的効果を持続）
        setTimeout(() => {
          if (popButton) {
            popButton.disabled = false;
            popButton.textContent = 'POP';
          }
        }, 1000);
      }
    });
    
    console.log('View B POP button initialized');
  } else {
    console.warn('POP button not found in View B');
  }
}