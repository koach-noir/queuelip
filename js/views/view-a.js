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