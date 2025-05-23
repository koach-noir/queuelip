#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, RunEvent};

// miniウィンドウの設定オプション
const MINI_WINDOW_CONFIG: MiniWindowConfig = MiniWindowConfig {
    always_on_top: false,          // 通常ウィンドウ
    resizable: true,               // 可変サイズ
    width: 400.0,
    height: 350.0,
};

struct MiniWindowConfig {
    always_on_top: bool,
    resizable: bool,
    width: f64,
    height: f64,
}

// miniウィンドウを開くコマンド（メインウィンドウを閉じる機能付き）
#[tauri::command]
async fn open_mini_window(app_handle: tauri::AppHandle) -> Result<(), String> {
    // 既存のminiウィンドウがあれば閉じる
    if let Some(existing_window) = app_handle.get_window("mini") {
        existing_window.close().map_err(|e| e.to_string())?;
    }
    
    // miniウィンドウを作成
    let mini_window = tauri::WindowBuilder::new(
        &app_handle,
        "mini", // ユニークラベル
        tauri::WindowUrl::App("mini.html".into())
    )
    .title("Mini View")
    .decorations(false)     // ベゼルレス
    .always_on_top(MINI_WINDOW_CONFIG.always_on_top)
    .resizable(MINI_WINDOW_CONFIG.resizable)
    .inner_size(MINI_WINDOW_CONFIG.width, MINI_WINDOW_CONFIG.height)
    .build()
    .map_err(|e| e.to_string())?;
    
    // miniウィンドウが閉じられた時のイベントハンドラを設定
    let app_handle_clone = app_handle.clone();
    mini_window.on_window_event(move |event| {
        match event {
            tauri::WindowEvent::CloseRequested { .. } => {
                println!("Mini window close requested, exiting application");
                // miniウィンドウが閉じられたらアプリケーション全体を終了
                app_handle_clone.exit(0);
            },
            _ => {}
        }
    });
    
    println!("Mini window opened successfully");
    
    // メインウィンドウを閉じる
    if let Some(main_window) = app_handle.get_window("main") {
        main_window.close().map_err(|e| e.to_string())?;
        println!("Main window closed successfully");
    }
    
    Ok(())
}

// miniウィンドウを閉じるコマンド（アプリケーション終了付き）
#[tauri::command]
async fn close_mini_window(app_handle: tauri::AppHandle) -> Result<(), String> {
    if let Some(mini_window) = app_handle.get_window("mini") {
        mini_window.close().map_err(|e| e.to_string())?;
        println!("Mini window closed successfully");
    }
    
    // miniウィンドウが閉じられたらアプリケーション全体を終了
    println!("Exiting application after mini window close");
    app_handle.exit(0);
    
    Ok(())
}

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
            exit_app,
            open_mini_window,
            close_mini_window
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
                        tauri::WindowEvent::CloseRequested { .. } => {
                            println!("Main window close requested, exiting application");
                            // メインウィンドウが閉じられたらアプリケーション全体を終了
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
            RunEvent::ExitRequested { .. } => {
                println!("Application exit requested");
                // 終了を許可
                _app_handle.exit(0);
            },
            _ => {},
        });
}
