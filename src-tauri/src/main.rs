#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, RunEvent};
use tauri_plugin_log::LogTarget;
use log::{info, warn, error};

// dashboardウィンドウの設定オプション
const DASHBOARD_WINDOW_CONFIG: DashboardWindowConfig = DashboardWindowConfig {
    always_on_top: false,          // 通常ウィンドウ
    resizable: true,               // 可変サイズ
    width: 400.0,
    height: 350.0,
};

struct DashboardWindowConfig {
    always_on_top: bool,
    resizable: bool,
    width: f64,
    height: f64,
}

// メインウィンドウを表示するコマンド（Hide/Showパターン）
#[tauri::command]
async fn show_main_window(app_handle: tauri::AppHandle) -> Result<(), String> {
    info!("=== show_main_window called ===");
    
    // メインウィンドウを取得
    if let Some(main_window) = app_handle.get_window("main") {
        // 既存のメインウィンドウを表示
        main_window.show().map_err(|e| {
            error!("Failed to show main window: {}", e);
            e.to_string()
        })?;
        main_window.set_focus().map_err(|e| {
            warn!("Failed to set focus on main window: {}", e);
            e.to_string()
        })?;
        main_window.unminimize().map_err(|e| {
            warn!("Failed to unminimize main window: {}", e);
            e.to_string()
        })?;
        
        info!("Main window shown successfully");
    } else {
        error!("Main window not found");
        return Err("Main window not found".to_string());
    }
    
    Ok(())
}

// メインウィンドウを非表示にするコマンド
#[tauri::command]
async fn hide_main_window(app_handle: tauri::AppHandle) -> Result<(), String> {
    info!("=== hide_main_window called ===");
    
    if let Some(main_window) = app_handle.get_window("main") {
        main_window.hide().map_err(|e| {
            error!("Failed to hide main window: {}", e);
            e.to_string()
        })?;
        info!("Main window hidden successfully");
    } else {
        warn!("Main window not found for hiding");
    }
    
    Ok(())
}

// ダッシュボードウィンドウを開くコマンド（メインウィンドウを非表示にする）
#[tauri::command]
async fn open_dashboard(app_handle: tauri::AppHandle, context: Option<String>) -> Result<(), String> {
    let ctx = context.as_deref().unwrap_or("default");
    info!("=== open_dashboard called with context: {} ===", ctx);
    
    // 既存のdashboardウィンドウがあれば表示
    if let Some(existing_dashboard) = app_handle.get_window("dashboard") {
        info!("Dashboard window already exists, showing it");
        existing_dashboard.show().map_err(|e| e.to_string())?;
        existing_dashboard.set_focus().map_err(|e| e.to_string())?;
        
        // コンテキスト情報をフロントエンドに送信
        existing_dashboard.emit("dashboard-context", ctx).map_err(|e| e.to_string())?;
    } else {
        // dashboardウィンドウを新規作成
        info!("Creating new dashboard window");
        let dashboard_window = tauri::WindowBuilder::new(
            &app_handle,
            "dashboard", // ユニークラベル
            tauri::WindowUrl::App("dashboard.html".into())
        )
        .title("Dashboard")
        .decorations(false)     // ベゼルレス
        .always_on_top(DASHBOARD_WINDOW_CONFIG.always_on_top)
        .resizable(DASHBOARD_WINDOW_CONFIG.resizable)
        .inner_size(DASHBOARD_WINDOW_CONFIG.width, DASHBOARD_WINDOW_CONFIG.height)
        .center()              // 画面中央に表示
        .visible(true)         // 明示的に表示
        .build()
        .map_err(|e| {
            error!("Failed to create dashboard window: {}", e);
            e.to_string()
        })?;
        
        // dashboardウィンドウが閉じられた時のイベントハンドラを設定
        let app_handle_clone = app_handle.clone();
        dashboard_window.on_window_event(move |event| {
            match event {
                tauri::WindowEvent::CloseRequested { api, .. } => {
                    info!("=== Dashboard window close event detected ===");
                    // dashboardウィンドウを非表示にして閉じることを防ぐ
                    if let Some(dashboard_window) = app_handle_clone.get_window("dashboard") {
                        if let Err(e) = dashboard_window.hide() {
                            error!("Failed to hide dashboard window: {}", e);
                        }
                    }
                    api.prevent_close();
                    
                    // メインウィンドウを表示
                    let app_handle_for_show = app_handle_clone.clone();
                    tauri::async_runtime::spawn(async move {
                        info!("Spawning show_main_window task...");
                        if let Err(e) = show_main_window(app_handle_for_show).await {
                            error!("Error showing main window: {}", e);
                        } else {
                            info!("show_main_window task completed successfully");
                        }
                    });
                },
                _ => {}
            }
        });
        
        info!("Dashboard window created successfully");
        
        // 新規作成されたウィンドウにコンテキスト情報を送信
        dashboard_window.emit("dashboard-context", ctx).map_err(|e| e.to_string())?;
    }
    
    // メインウィンドウを非表示にする
    hide_main_window(app_handle).await?;
    
    Ok(())
}

// dashboardウィンドウを閉じるコマンド（Hide/Showパターン）
#[tauri::command]
async fn close_dashboard(app_handle: tauri::AppHandle) -> Result<(), String> {
    info!("=== close_dashboard called ===");
    
    if let Some(dashboard_window) = app_handle.get_window("dashboard") {
        dashboard_window.hide().map_err(|e| {
            error!("Failed to hide dashboard window: {}", e);
            e.to_string()
        })?;
        info!("Dashboard window hidden successfully");
    } else {
        warn!("Dashboard window not found for closing");
    }
    
    // メインウィンドウを表示
    show_main_window(app_handle).await?;
    
    Ok(())
}

// アプリケーションを強制終了する関数
#[tauri::command]
async fn exit_app(app_handle: tauri::AppHandle) -> Result<(), String> {
    info!("Exiting application");
    app_handle.exit(0);
    Ok(())
}

fn main() {
    tauri::Builder::default()
        // ログプラグインを設定
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([
                    LogTarget::LogDir,    // ファイルログ出力
                    LogTarget::Stdout,    // 標準出力
                    LogTarget::Webview,   // ウェブビューコンソール
                ])
                .build(),
        )
        // コマンドを登録
        .invoke_handler(tauri::generate_handler![
            exit_app,
            open_dashboard,
            close_dashboard,
            show_main_window,
            hide_main_window
        ])
        // メインウィンドウの設定
        .setup(|app| {
            info!("Application setup started");
            
            // メインウィンドウのタイトル設定
            if let Some(main_window) = app.get_window("main") {
                main_window.set_title("Queuelip")?;
                info!("Main window initialized with label: {}", main_window.label());
                
                // メインウィンドウが閉じられたときのイベントハンドラ
                let app_handle = app.handle().clone();
                main_window.on_window_event(move |event| {
                    match event {
                        tauri::WindowEvent::CloseRequested { .. } => {
                            info!("Main window close requested, exiting application");
                            // メインウィンドウが閉じられたらアプリケーション全体を終了
                            app_handle.exit(0);
                        },
                        _ => {}
                    }
                });
            } else {
                error!("Warning: Main window not found during setup");
            }
            
            info!("Application setup completed successfully");
            Ok(())
        })
        // イベントループ処理
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| match event {
            // アプリケーション終了時
            RunEvent::ExitRequested { .. } => {
                info!("Application exit requested");
                // 終了を許可
                _app_handle.exit(0);
            },
            _ => {},
        });
}
