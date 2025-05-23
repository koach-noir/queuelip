// ビューC テンプレート
export const viewCTemplate = `
  <h2 class="text-center">ビューC</h2>
  <div class="text-center mb-4">
    <div class="text-lg font-bold" style="color: #db2777;">C</div>
  </div>
  <div class="text-center">
    <button id="popButtonC" class="popup-button">POP</button>
  </div>
`;

// ビューC固有の設定（将来の拡張用）
export const viewCConfig = {
  name: 'c',
  title: 'ビューC',
  color: '#db2777',
  buttonId: 'popButtonC'
};