use serde::Serialize;

#[derive(Serialize)]
struct Image {
    name: String,
    path: String,
}

#[tauri::command]
fn read_images_directory(path: String) -> Result<Vec<Image>, String> {
    let mut images: Vec<Image> = Vec::new();
    let paths = std::fs::read_dir(&path).map_err(|e| e.to_string())?;

    for entry in paths {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();

        if path.is_file() {
            if let Some(extension) = path.extension() {
                if ["jpg", "jpeg", "png", "gif", "bmp", "webp"].contains(&extension.to_str().unwrap_or("").to_lowercase().as_str()) {
                    let name = path.file_name().unwrap().to_str().unwrap().to_string();
                    let path = path.to_str().unwrap().to_string();
                    images.push(Image { name, path });
                }
            }
        } else if path.is_dir() {
            let sub_dir_path = path.to_str().unwrap().to_string();
            match read_images_directory(sub_dir_path) {
                Ok(mut sub_images) => images.append(&mut sub_images),
                Err(e) => return Err(e),
            }
        }
    }

    Ok(images)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            read_images_directory
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
