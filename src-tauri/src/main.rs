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
        Ok(window) => {
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

fn main() {
    tauri::Builder::default()
        // コマンドを登録
        .invoke_handler(tauri::generate_handler![
            create_popup_window,
            close_current_window,
            close_window_by_label
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
