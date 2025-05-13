#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// この段階ではシンプルなHello Worldアプリなので、基本的な構造のみを実装します

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}