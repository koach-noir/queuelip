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