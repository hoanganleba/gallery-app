// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::PathBuf;
use image::GenericImageView;
use serde::{Serialize, Deserialize};
use tauri::async_runtime::spawn;
extern crate image;

use std::path::Path;

#[derive(Serialize, Deserialize, Debug)]
struct ImageDimensions {
    width: u32,
    height: u32,
}

#[derive(Serialize, Deserialize, Debug)]
struct DirEntry {
    path: String,
    is_file: bool,
}

#[tauri::command]
async fn get_image_dimensions(image_path: String) -> Result<ImageDimensions, String> {
    let image = spawn(async move {
        let result = image::open(&Path::new(&image_path));
        result
    }).await;
    
    match image {
        Ok(Ok(image)) => {
            let dimensions = image.dimensions();
            let width = dimensions.0;
            let height = dimensions.1;
            let image_dimensions = ImageDimensions { width, height };
            Ok(image_dimensions)
        }
        Ok(Err(err)) => Err(format!("Failed to open image file: {}", err)),
        Err(_) => Err(String::from("Failed to spawn async task")),
    }
}

#[tauri::command]
async fn read_directory(path_str: String) -> Vec<DirEntry> {
    let result = spawn(async move {
        let mut dir_entries = vec![];
        read_directory_recursive(&PathBuf::from(&path_str), &mut dir_entries).unwrap();
        dir_entries
    })
    .await
    .expect("Failed to spawn async task");

    result
}

fn read_directory_recursive(path: &PathBuf, dir_entries: &mut Vec<DirEntry>) -> Result<(), Box<dyn std::error::Error>> {
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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_directory, get_image_dimensions])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
