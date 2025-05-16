// navigation.jsからswitchViewとshowViewModal関数をインポート
import { switchView, showViewModal } from './navigation.js';

// レガシーボタンの設定
export function setupLegacyButtons() {
  const buttonA = document.getElementById('buttonA');
  const buttonB = document.getElementById('buttonB');
  const buttonC = document.getElementById('buttonC');
  
  if (buttonA) {
    buttonA.addEventListener('click', function() {
      switchView('a');
      // Aボタンクリック時にもモーダルを表示
      showViewModal('a');
    });
  }
  
  if (buttonB) {
    buttonB.addEventListener('click', function() {
      switchView('b');
      // Bボタンクリック時にもモーダルを表示
      showViewModal('b');
    });
  }
  
  if (buttonC) {
    buttonC.addEventListener('click', function() {
      switchView('c');
      // Cボタンクリック時にもモーダルを表示
      showViewModal('c');
    });
  }
}