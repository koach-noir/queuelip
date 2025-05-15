#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, RunEvent};

// アプリケーションを強制終了する関数
#[tauri::command]
async fn exit_app(app_handle: tauri::AppHandle) -> Result<(), String> {
    println!("Exiting application");
    app_handle.exit(0);
    Ok(())
}

fn main() {
    tauri::Builder::default()
        // コマンドを登録
        .invoke_handler(tauri::generate_handler![
            exit_app
        ])
        // メインウィンドウの設定
        .setup(|app| {
            // メインウィンドウのタイトル設定
            if let Some(main_window) = app.get_window("main") {
                main_window.set_title("Queuelip")?;
                println!("Main window initialized with label: {}", main_window.label());
                
                // メインウィンドウが閉じられたときのイベントハンドラ
                let app_handle = app.handle().clone();
                main_window.on_window_event(move |event| {
                    match event {
                        tauri::WindowEvent::CloseRequested { api, .. } => {
                            println!("Main window close requested, exiting application");
                            // アプリケーション全体を終了
                            app_handle.exit(0);
                        },
                        _ => {}
                    }
                });
            } else {
                println!("Warning: Main window not found");
            }
            Ok(())
        })
        // イベントループ処理
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| match event {
            // アプリケーション終了時
            RunEvent::ExitRequested { api, .. } => {
                println!("Application exit requested");
                // 終了を許可
                _app_handle.exit(0);
            },
            _ => {},
        });
}
