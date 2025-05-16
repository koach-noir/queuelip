// POPボタンの機能実装
export function setupPopButtons() {
  const popButtonA = document.getElementById('popButtonA');
  const popButtonB = document.getElementById('popButtonB');
  const popButtonC = document.getElementById('popButtonC');
  
  // ポップアップメッセージを表示する関数
  function showPopMessage() {
    alert('POP!');
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
