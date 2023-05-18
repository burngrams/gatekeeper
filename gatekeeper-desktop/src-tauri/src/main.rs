// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::{engine::general_purpose, Engine as _};

use qrcode::render::svg;
use qrcode::QrCode;
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Serialize, Deserialize, Debug)]
struct LoginInviteData {
    fullname: String,
    ip: String,
}

#[tauri::command]
fn create_gatekeeper(fullname: &str) -> String {
    let my_local_ip = local_ip_address::local_ip().unwrap();

    let login_invite_data = LoginInviteData {
        fullname: String::from(fullname),
        ip: my_local_ip.to_string(),
    };

    return generate_qrcode(serde_json::to_value(login_invite_data).unwrap());
}

#[tauri::command]
fn create_ticket(ticket_id: &str, taz_id: &str, participant_name: &str) -> String {
    let login_invite_data = json!({
        "ticketId": String::from(ticket_id),
        "tazId": String::from(taz_id),
        "participantName": String::from(participant_name),
    });

    return generate_qrcode(serde_json::to_value(login_invite_data).unwrap());
}

fn generate_qrcode(json: serde_json::Value) -> String {
    let mut parsed: Vec<u8> = serde_json::to_vec(&json).unwrap();

    let code = QrCode::new(&parsed).unwrap();
    let image = code
        .render()
        .min_dimensions(200, 200)
        .dark_color(svg::Color("#800000"))
        .light_color(svg::Color("#ffff80"))
        .build();

    let encode = general_purpose::STANDARD.encode(image);

    return encode;
}

fn main() {
    let my_local_ip = local_ip_address::local_ip().unwrap();

    println!("This is my local IP address: {:?}", my_local_ip);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![create_gatekeeper, create_ticket])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
