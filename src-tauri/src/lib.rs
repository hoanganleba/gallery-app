use std::fs;
use std::path::Path;

#[tauri::command]
fn read_images_dir(folder_path: String) -> Vec<String> {
    fn is_image_file(entry: &fs::DirEntry) -> bool {
        if let Some(ext) = entry.path().extension() {
            match ext.to_str().unwrap_or("").to_lowercase().as_str() {
                "jpg" | "jpeg" | "png" | "gif" | "bmp" | "webp" | "tiff" => true,
                _ => false,
            }
        } else {
            false
        }
    }

    fn read_images_recursively<P: AsRef<Path>>(path: P, images: &mut Vec<String>) {
        if let Ok(entries) = fs::read_dir(path) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.is_dir() {
                    read_images_recursively(&path, images);
                } else if is_image_file(&entry) {
                    if let Some(path_str) = path.to_str() {
                        images.push(path_str.to_string());
                    }
                }
            }
        }
    }

    let mut images = Vec::new();
    read_images_recursively(&folder_path, &mut images);
    images.sort();
    images
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![read_images_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
