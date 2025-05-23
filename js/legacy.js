// navigation.jsからswitchView関数をインポート
import { switchView } from './navigation.js';

// レガシーボタンの設定
export function setupLegacyButtons() {
  const buttonA = document.getElementById('buttonA');
  const buttonB = document.getElementById('buttonB');
  const buttonC = document.getElementById('buttonC');
  
  if (buttonA) {
    buttonA.addEventListener('click', function() {
      switchView('a');
    });
  }
  
  if (buttonB) {
    buttonB.addEventListener('click', function() {
      switchView('b');
    });
  }
  
  if (buttonC) {
    buttonC.addEventListener('click', function() {
      switchView('c');
    });
  }
}