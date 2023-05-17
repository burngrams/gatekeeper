import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [user, setName] = useState("");
  const [qrCode, setQRCode] = useState<string | null>(null);

  async function login() {
    const result = await invoke<string>("generateQRCode", { user });
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    // const qrCode = JSON.parse(result)
    const decoded = atob(result);
    setQRCode(decoded.replace('<?xml version="1.0" standalone="yes"?>', ''));
  }

  return (
    <div className="container">
      <h1>Welcome to Gatekeeper!</h1>
      <h2></h2>
      <h2>Manage Data</h2>
      <div>
        TBD - manage data
        <ul>
          <li>drag and drop JSON feature to here</li>
          <li>show some statistics on list of attendees</li>
          <li>add text attendees can be viewed in JSON / CSV at :path_to_json</li>
        </ul>
      </div>
      <details>
        <summary>
          <span class="icon">👇</span>
          <h2>Create Test Tickets</h2>
        </summary>
        <p>
          42
        </p>
      </details>
      <h2>Credential Generator</h2>
      <div className="row">
        <div className="row">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
          >
            <input
              id="login-input"
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Enter a user..."
            />
            <button type="submit">generate QR</button>
          </form>
        </div>
        <div className="row">
          {qrCode && <img src={`data:image/svg+xml;utf8,${encodeURIComponent(qrCode)}`} alt="QR Code" />}
        </div>
      </div>

      <h2>Gatekeepers List</h2>
      <div className="row">
      </div>
    </div>
  );
}

export default App;
