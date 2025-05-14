#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, WindowBuilder, WindowUrl};

// ポップアップウィンドウを作成する関数
#[tauri::command]
async fn create_popup_window(
    app_handle: tauri::AppHandle,
    label: String,
    title: String,
    url: String,
) -> Result<(), String> {
    // 新しいウィンドウを作成
    let popup_win = WindowBuilder::new(
        &app_handle,
        label,
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
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to create popup window: {}", e)),
    }
}

fn main() {
    tauri::Builder::default()
        // ポップアップウィンドウ作成コマンドを登録
        .invoke_handler(tauri::generate_handler![create_popup_window])
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
