// ビューA テンプレート
export const viewATemplate = `
  <h2 class="text-center">ビューA</h2>
  <div class="text-center mb-4">
    <div class="text-lg font-bold" style="color: #2563eb;">A</div>
  </div>
  <div class="text-center">
    <button id="popButtonA" class="popup-button">POP</button>
  </div>
`;

// ビューA固有の設定（将来の拡張用）
export const viewAConfig = {
  name: 'a',
  title: 'ビューA',
  color: '#2563eb',
  buttonId: 'popButtonA'
};

// ビューA初期化関数（POPボタンのイベントリスナー追加）
export function initializeViewA() {
  const popButton = document.getElementById('popButtonA');
  
  if (popButton) {
    popButton.addEventListener('click', async function() {
      try {
        console.log('POP button clicked - opening dashboard window');
        
        // ボタンの視覚的フィードバック
        popButton.disabled = true;
        popButton.textContent = 'OPENING...';
        
        // Tauri APIを使用してダッシュボードウィンドウを開く
        if (window.__TAURI__ && window.__TAURI__.tauri) {
          await window.__TAURI__.tauri.invoke('open_dashboard');
          console.log('Dashboard window opened successfully');
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
    
    console.log('View A POP button initialized');
  } else {
    console.warn('POP button not found in View A');
  }
}
