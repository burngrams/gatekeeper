// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::{engine::general_purpose, Engine as _};
use image::Luma;
use qrcode::render::svg;
use qrcode::QrCode;
use qrcode::{EcLevel, Version};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct LoginInviteData {
    user: String,
    ip: String,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn generateQRCode(user: &str) -> String {
    let my_local_ip = local_ip_address::local_ip().unwrap();

    let loginInviteData = LoginInviteData {
        user: String::from(user),
        ip: my_local_ip.to_string(),
    };

    let mut parsed = serde_json::to_vec(&loginInviteData).unwrap();

    // let parsed = json::parse(
    //     data,
    //     //         r#"

    //     // {
    //     //     "user": "Daniel Khankin"
    //     // }

    //     // "#,
    // )
    // .unwrap();

    // let code = QrCode::with_version(stringified.as_bytes(), Version::Micro(2), EcLevel::L).unwrap();
    let code = QrCode::new(&parsed).unwrap();
    let image = code
        .render()
        .min_dimensions(200, 200)
        .dark_color(svg::Color("#800000"))
        .light_color(svg::Color("#ffff80"))
        .build();

    // image qr code generation
    // let code = QrCode::new(stringified.as_bytes()).unwrap();

    // // Render the bits into an image.
    // let image = code.render::<Luma<u8>>().build();

    let encode = general_purpose::STANDARD.encode(image);

    println!("Encoded request: {:?}", user);

    return encode;
}

fn main() {
    let my_local_ip = local_ip_address::local_ip().unwrap();

    println!("This is my local IP address: {:?}", my_local_ip);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, generateQRCode])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
