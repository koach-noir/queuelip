// POPボタンの機能実装
// @ts-ignore
const { dialog } = window.__TAURI__ || { dialog: { message: (msg) => alert(msg) } };

export function setupPopButtons() {
  const popButtonA = document.getElementById('popButtonA');
  const popButtonB = document.getElementById('popButtonB');
  const popButtonC = document.getElementById('popButtonC');
  
  // ポップアップメッセージを表示する関数
  function showPopMessage() {
    // Tauriダイアログを使用
    dialog.message('POP!');
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
