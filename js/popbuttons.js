// POPボタンの機能実装
export function setupPopButtons() {
  const popButtonA = document.getElementById('popButtonA');
  const popButtonB = document.getElementById('popButtonB');
  const popButtonC = document.getElementById('popButtonC');
  
  // カスタム・ポップアップメッセージを表示する関数
  function showCustomPopup(message) {
    // 既存のポップアップを削除
    const existingPopup = document.getElementById('customPopup');
    if (existingPopup) {
      existingPopup.remove();
    }
    
    // ポップアップ要素を作成
    const popup = document.createElement('div');
    popup.id = 'customPopup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = '#ffffff';
    popup.style.padding = '20px';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '1000';
    popup.style.minWidth = '200px';
    popup.style.textAlign = 'center';
    
    // メッセージ要素
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.marginBottom = '15px';
    messageElement.style.fontSize = '16px';
    popup.appendChild(messageElement);
    
    // OKボタン
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.padding = '5px 15px';
    okButton.style.borderRadius = '4px';
    okButton.style.border = 'none';
    okButton.style.background = '#3b82f6';
    okButton.style.color = 'white';
    okButton.style.cursor = 'pointer';
    
    okButton.addEventListener('click', function() {
      popup.remove();
    });
    
    popup.appendChild(okButton);
    
    // オーバーレイを作成
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999';
    
    overlay.addEventListener('click', function() {
      popup.remove();
      overlay.remove();
    });
    
    // ボディに追加
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
    // フォーカスをOKボタンに設定
    okButton.focus();
  }
  
  // ポップアップメッセージを表示する関数
  async function showPopMessage() {
    try {
      // Tauriが利用可能かチェックして、APIを使用
      if (window.__TAURI__) {
        try {
          const { dialog } = await import('@tauri-apps/api');
          await dialog.message('POP!');
        } catch (e) {
          console.error("Tauriダイアログモジュール読み込みエラー:", e);
          // フォールバック：カスタムポップアップを表示
          showCustomPopup('POP!');
        }
      } else {
        // ブラウザ環境の場合はカスタムポップアップを表示
        showCustomPopup('POP!');
      }
    } catch (error) {
      console.error('Dialog error:', error);
      // 最終フォールバック
      showCustomPopup('POP!');
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
