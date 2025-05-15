#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, WindowBuilder, WindowUrl, Window};

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
        Ok(_window) => {
            println!("Popup window '{}' created successfully", label);
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

fn main() {
    tauri::Builder::default()
        // コマンドを登録
        .invoke_handler(tauri::generate_handler![
            create_popup_window,
            close_current_window,
            close_window_by_label,
            show_main_window,
            create_main_window
        ])
        // メインウィンドウにラベルを設定
        .setup(|app| {
            // メインウィンドウにラベルを追加
            if let Some(main_window) = app.get_window("main") {
                main_window.set_title("Queuelip")?;
                
                // ウィンドウのラベルが正しく設定されていることを確認
                println!("Main window label: {}", main_window.label());
            } else {
                println!("Warning: Main window not found");
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
