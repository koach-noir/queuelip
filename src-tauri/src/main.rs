#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use tauri::{Manager, WindowBuilder, WindowUrl, Window, RunEvent};

// グローバル状態を管理するためのアプリケーション状態構造体
struct AppState {
    // アプリケーションが正常に終了するべきかのフラグ
    should_exit: Mutex<bool>,
}

// ポップアップウィンドウを作成する関数
#[tauri::command]
async fn create_popup_window(
    app_handle: tauri::AppHandle,
    label: String,
    title: String,
    url: String,
) -> Result<(), String> {
    println!("Creating popup window: {}", label);
    
    // 新しいウィンドウを作成
    let popup_win = WindowBuilder::new(
        &app_handle,
        label.clone(),
        WindowUrl::App(url.into())
    )
    .title(title)
    .inner_size(300.0, 400.0)
    .center()
    .decorations(true)
    .resizable(false)
    .build();

    // エラーハンドリング
    match popup_win {
        Ok(window) => {
            println!("Popup window '{}' created successfully", label);
            
            // 先にウィンドウのラベルを取得しておく
            let window_label = window.label().to_string();
            
            // ポップアップウィンドウが閉じられたときのイベントハンドラを追加
            let app_handle_clone = app_handle.clone();
            window.on_window_event(move |event| {
                match event {
                    tauri::WindowEvent::CloseRequested { api, .. } => {
                        println!("Popup window close requested, showing main window");
                        // API経由での閉じる操作を阻止（カスタム動作のため）
                        api.prevent_close();
                        
                        // メインウィンドウを表示
                        let main_window = app_handle_clone.get_window("main");
                        if let Some(main_win) = main_window {
                            let _ = main_win.show();
                            let _ = main_win.set_focus();
                        }
                        
                        // 少し遅延させてから現在のウィンドウを閉じる
                        let app_handle_for_close = app_handle_clone.clone();
                        let wl = window_label.clone(); // ラベルをクローンして使用
                        tauri::async_runtime::spawn(async move {
                            // 200ms待機
                            std::thread::sleep(std::time::Duration::from_millis(200));
                            
                            // ウィンドウを取得して閉じる
                            if let Some(win_to_close) = app_handle_for_close.get_window(&wl) {
                                let _ = win_to_close.close();
                            }
                        });
                    },
                    _ => {}
                }
            });
            
            Ok(())
        },
        Err(e) => {
            println!("Failed to create popup window: {}", e);
            Err(format!("Failed to create popup window: {}", e))
        },
    }
}

// 現在のウィンドウを閉じる関数
#[tauri::command]
async fn close_current_window(window: Window) -> Result<(), String> {
    println!("Closing window: {}", window.label());
    match window.close() {
        Ok(_) => {
            println!("Window closed successfully");
            Ok(())
        },
        Err(e) => {
            println!("Failed to close window: {}", e);
            Err(format!("Failed to close window: {}", e))
        }
    }
}

// ラベルを指定してウィンドウを閉じる関数
#[tauri::command]
async fn close_window_by_label(
    app_handle: tauri::AppHandle,
    label: String,
) -> Result<(), String> {
    println!("Closing window by label: {}", label);
    
    // ラベルでウィンドウを取得
    if let Some(window) = app_handle.get_window(&label) {
        match window.close() {
            Ok(_) => {
                println!("Window '{}' closed successfully", label);
                Ok(())
            },
            Err(e) => {
                println!("Failed to close window '{}': {}", label, e);
                Err(format!("Failed to close window: {}", e))
            }
        }
    } else {
        println!("Window with label '{}' not found", label);
        Err(format!("Window with label '{}' not found", label))
    }
}

// メインウィンドウを表示する関数
#[tauri::command]
async fn show_main_window(app_handle: tauri::AppHandle) -> Result<(), String> {
    println!("Attempting to show main window");
    
    let main_window = app_handle.get_window("main");
    
    match main_window {
        Some(window) => {
            println!("Main window found, attempting to show");
            
            // まず非表示状態を確認
            let is_visible = match window.is_visible() {
                Ok(visible) => visible,
                Err(e) => {
                    println!("Error checking visibility: {}", e);
                    false
                }
            };
            
            println!("Main window is currently {}", if is_visible {"visible"} else {"hidden"});
            
            // ウィンドウを表示、最前面に、フォーカスも与える
            let show_result = window.show();
            let unminimize_result = window.unminimize();
            let focus_result = window.set_focus();
            
            if let Err(e) = show_result {
                println!("Error showing window: {}", e);
                return Err(format!("Error showing window: {}", e));
            }
            
            if let Err(e) = unminimize_result {
                println!("Error unminimizing window: {}", e);
                // エラーは返さない（オプション操作）
            }
            
            if let Err(e) = focus_result {
                println!("Error focusing window: {}", e);
                // エラーは返さない（オプション操作）
            }
            
            println!("Main window should now be visible");
            Ok(())
        },
        None => {
            println!("Main window not found!");
            
            // 全ウィンドウをリスト
            let windows = app_handle.windows();
            println!("Available windows: {}", windows.len());
            for (label, _) in windows {
                println!("Window label: {}", label);
            }
            
            Err("Main window not found!".to_string())
        }
    }
}

// 新しいメインウィンドウを作成する（元のが失われた場合）
#[tauri::command]
async fn create_main_window(app_handle: tauri::AppHandle) -> Result<(), String> {
    println!("Creating new main window");
    
    // メインウィンドウが既に存在するか確認
    if let Some(existing) = app_handle.get_window("main") {
        println!("Main window already exists, showing it");
        // ?演算子を使わず、明示的にエラーハンドリング
        if let Err(e) = existing.show() {
            return Err(format!("Failed to show existing main window: {}", e));
        }
        return Ok(());
    }
    
    // 新しいメインウィンドウを作成
    let new_main = WindowBuilder::new(
        &app_handle,
        "main", // 重要: オリジナルと同じラベル
        WindowUrl::App("index.html".into())
    )
    .title("Queuelip")
    .inner_size(800.0, 600.0)
    .center()
    .build();
    
    match new_main {
        Ok(_window) => {
            println!("New main window created successfully");
            Ok(())
        },
        Err(e) => {
            println!("Failed to create new main window: {}", e);
            Err(format!("Failed to create new main window: {}", e))
        }
    }
}

// アプリケーションを強制終了する関数
#[tauri::command]
async fn force_quit_app(app_handle: tauri::AppHandle) -> Result<(), String> {
    println!("Force quitting application");
    
    // 終了フラグをセット
    let app_handle_clone = app_handle.clone();
    let state = app_handle_clone.state::<AppState>();
    let mut should_exit = state.should_exit.lock().unwrap();
    *should_exit = true;
    
    // 少し遅延させてからアプリケーションを終了
    let app_handle_for_exit = app_handle.clone();
    std::thread::spawn(move || {
        std::thread::sleep(std::time::Duration::from_millis(300));
        app_handle_for_exit.exit(0);
    });
    
    Ok(())
}

fn main() {
    tauri::Builder::default()
        // アプリケーション状態を初期化
        .manage(AppState {
            should_exit: Mutex::new(false),
        })
        // コマンドを登録
        .invoke_handler(tauri::generate_handler![
            create_popup_window,
            close_current_window,
            close_window_by_label,
            show_main_window,
            create_main_window,
            force_quit_app
        ])
        // メインウィンドウにラベルを設定
        .setup(|app| {
            // メインウィンドウにラベルを追加
            if let Some(main_window) = app.get_window("main") {
                main_window.set_title("Queuelip")?;
                
                // ウィンドウのラベルが正しく設定されていることを確認
                println!("Main window label: {}", main_window.label());
                
                // メインウィンドウが閉じられたときのイベントハンドラ
                let app_handle = app.handle().clone();
                main_window.on_window_event(move |event| {
                    match event {
                        tauri::WindowEvent::CloseRequested { api, .. } => {
                            println!("Main window close requested, exiting application");
                            // API経由での閉じる操作を阻止（アプリ側でexitを実行するため）
                            api.prevent_close();
                            
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
        // イベントループ終了後のクリーンアップ処理
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| match event {
            // ウィンドウがすべて閉じられたとき
            RunEvent::WindowEvent { label, event: tauri::WindowEvent::CloseRequested { .. }, .. } => {
                println!("Window '{}' has been closed", label);
                
                // メインウィンドウが閉じられた場合は、アプリケーションを終了
                if label == "main" {
                    println!("Main window closed, exiting application");
                    _app_handle.exit(0);
                }
            },
            // アプリケーション終了時
            RunEvent::ExitRequested { api, .. } => {
                println!("Application exit requested");
                // アプリケーションの終了を許可
                api.prevent_exit();
                _app_handle.exit(0);
            },
            _ => {},
        });
}
