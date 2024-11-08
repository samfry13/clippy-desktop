use tauri::{AppHandle, Manager, Runtime};
use tauri_plugin_fs::FsExt;
use window_vibrancy::*;

#[tauri::command]
fn allow_file<R: Runtime>(app: AppHandle<R>, path: &str) -> () {
    app.fs_scope().allow_file(path);
    let _ = app.asset_protocol_scope().allow_file(path);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![allow_file])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_mica(&window, None)
                .expect("Unsupported platform! 'apply_mica' is only supported on Windows");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
