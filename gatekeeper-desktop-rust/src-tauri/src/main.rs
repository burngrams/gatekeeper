// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::Path;

use base64::{engine::general_purpose, Engine as _};

use notify::{RecommendedWatcher, RecursiveMode, Result, Watcher};
use qrcode::render::svg;
use qrcode::QrCode;
use serde::{Deserialize, Serialize};
use serde_json::json;
use tauri::{api::file, Manager};

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct LoginInviteData {
    fullname: String,
    ip: String,
}

#[derive(Deserialize, Debug)]
struct EventLoadFile {
    filepath: String,
}
#[derive(Clone, serde::Serialize)]
struct FileLoadedPayload {
    contents: String,
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

    let mut watcher: RecommendedWatcher;

    tauri::Builder::default()
        .setup(|app| {
            // write file loaded anonymous function
            // app.manage(state).invoke_handler(|_webview, arg| {
            //     let filepath = arg
            //         .get("filepath")
            //         .unwrap()
            //         .as_str()
            //         .unwrap()
            //         .to_string();
            //     let contents =
            //         fs::read_to_string(&filepath).expect("Should have been able to read the file");
            //     Ok(contents)
            // });

            let id = app.listen_global("load_file", |event| {
                let json = event.payload().unwrap();

                let filepath = serde_json::from_str::<EventLoadFile>(&json)
                    .unwrap()
                    .filepath
                    .clone();
                let contents =
                    fs::read_to_string(&filepath).expect("Should have been able to read the file");
                app.emit_all("file_loaded", FileLoadedPayload { contents });

                let path = Path::new(&filepath);

                let mut watcher: RecommendedWatcher =
                    notify::recommended_watcher(move |res: Result<notify::Event>| match res {
                        Ok(event) => {
                            println!("event: {:?}", event)
                        }
                        Err(e) => println!("watch error: {:?}", e),
                    })
                    .unwrap();

                watcher.watch(path, RecursiveMode::Recursive).unwrap();
            });
            // // unlisten to the event using the `id` returned on the `listen_global` function
            // // a `once_global` API is also exposed on the `App` struct
            // app.unlisten(id);
            // emit the `event-name` event to all webview windows on the frontend
            app.emit_all(
                "event-name",
                Payload {
                    message: "Tauri is awesome!".into(),
                },
            )
            .unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![create_gatekeeper, create_ticket])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
