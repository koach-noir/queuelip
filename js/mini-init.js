// Mini window用ログシステム初期化
import { attachConsole, info } from "tauri-plugin-log-api";

// Mini window開始時にログを初期化
export async function initMiniLogger() {
  try {
    const detach = await attachConsole();
    console.log('Mini window log system initialized - console attached');
    info('Mini window loaded - JavaScript log system active');
    
    // ウィンドウ終了時にデタッチ（必要に応じて）
    window.addEventListener('beforeunload', () => {
      if (detach) {
        detach();
      }
    });
    
    return detach;
  } catch (error) {
    console.error('Failed to initialize mini window log system:', error);
    throw error;
  }
}

// ページ読み込み時に自動初期化
initMiniLogger();
