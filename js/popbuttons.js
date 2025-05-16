// POPボタンの機能実装
export function setupPopButtons() {
  const popButtonA = document.getElementById('popButtonA');
  const popButtonB = document.getElementById('popButtonB');
  const popButtonC = document.getElementById('popButtonC');
  
  // ポップアップメッセージを表示する関数
  async function showPopMessage() {
    try {
      // Tauriが利用可能かチェック
      if (window.__TAURI__) {
        // Tauriのdialogモジュールを動的にインポート
        const { message } = await import('@tauri-apps/api/dialog');
        await message('POP!', { title: 'Queuelip' });
      } else {
        // フォールバックとして標準のalertを使用
        alert('POP!');
      }
    } catch (error) {
      // エラーが発生した場合は標準のalertを使用
      console.error('Dialog error:', error);
      alert('POP!');
    }
  }
  
  // 各ボタンにイベントリスナーを設定
  if (popButtonA) {
    popButtonA.addEventListener('click', showPopMessage);
  }
  
  if (popButtonB) {
    popButtonB.addEventListener('click', showPopMessage);
  }
  
  if (popButtonC) {
    popButtonC.addEventListener('click', showPopMessage);
  }
}
