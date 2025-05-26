// バージョン情報と最終更新日時の管理
export const APP_VERSION = '0.1.131';
export const LAST_UPDATE = '2025年05月26日 10:17:00';

// バージョン情報を画面に表示する
export function displayVersionInfo() {
  const versionInfoElement = document.getElementById('version-info');
  if (versionInfoElement) {
    versionInfoElement.textContent = `バージョン: ${APP_VERSION}`;
  }
}

// 最終更新日時を画面に表示する
export function displayLastUpdate() {
  const systemTimeElement = document.getElementById('system-time');
  if (systemTimeElement) {
    systemTimeElement.textContent = `最終更新: ${LAST_UPDATE}`;
  }
}

// バージョン情報と最終更新日時を初期化する
export function initVersionInfo() {
  displayVersionInfo();
  displayLastUpdate();
}
