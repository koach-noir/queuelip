// Main window用ログシステム初期化
import { attachConsole, info } from "tauri-plugin-log-api";

// Main window開始時にログを初期化
export async function initMainLogger() {
  try {
    const detach = await attachConsole();
    console.log('Log system initialized - console attached');
    info('Main window loaded - JavaScript log system active');
    
    // アプリケーション終了時にデタッチ（必要に応じて）
    window.addEventListener('beforeunload', () => {
      if (detach) {
        detach();
      }
    });
    
    return detach;
  } catch (error) {
    console.error('Failed to initialize log system:', error);
    throw error;
  }
}

// ページ読み込み時に自動初期化
initMainLogger();
