use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::async_runtime::spawn;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DirEntry {
    path: String,
    is_file: bool,
}

#[tauri::command]
pub async fn read_directory(path_str: String) -> Vec<DirEntry> {
    let result = spawn(async move {
        let mut dir_entries = vec![];
        read_directory_recursive(&PathBuf::from(&path_str), &mut dir_entries).unwrap();
        dir_entries
    })
    .await
    .expect("Failed to spawn async task");

    result
}

fn read_directory_recursive(
    path: &PathBuf,
    dir_entries: &mut Vec<DirEntry>,
) -> Result<(), Box<dyn std::error::Error>> {
    for entry in fs::read_dir(path)? {
        let dir_entry = entry?;
        let file_type = dir_entry.file_type()?;
        let path_buf = dir_entry.path();
        let path_string = path_buf.to_string_lossy().to_string();
        let file_name = path_buf.file_name().unwrap_or_default();

        if !file_name.to_string_lossy().starts_with('.') {
            dir_entries.push(DirEntry {
                path: path_string.clone(),
                is_file: file_type.is_file(),
            });

            if !file_type.is_file() {
                read_directory_recursive(&path_buf, dir_entries)?;
            }
        }
    }

    Ok(())
}