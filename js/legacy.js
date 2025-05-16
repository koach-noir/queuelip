// legacy.js - 古いボタンの互換性維持のためのコード

/**
 * 以前のバージョンで使用されていたボタンの機能を初期化
 * 現在はタブ式UIに移行していますが、互換性のために残しています
 */
export function initLegacyButtons() {
  const buttonA = document.getElementById('buttonA');
  const buttonB = document.getElementById('buttonB');
  const buttonC = document.getElementById('buttonC');
  
  // 各ボタンにクリックイベントを追加
  // クリック時に対応するタブを表示する
  
  if (buttonA) {
    buttonA.addEventListener('click', () => {
      window.showView('a');
    });
  }
  
  if (buttonB) {
    buttonB.addEventListener('click', () => {
      window.showView('b');
    });
  }
  
  if (buttonC) {
    buttonC.addEventListener('click', () => {
      window.showView('c');
    });
  }
}
