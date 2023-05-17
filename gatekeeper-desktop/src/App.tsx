import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [name, setName] = useState("");

  async function login() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setQRCode(await invoke("login", { name }));
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

      <h2>Credential Generator</h2>
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
            placeholder="Enter a name..."
          />
          <button type="submit">login</button>
        </form>
      </div>

      <h2>Gatekeepers List</h2>
      <div className="row">
      </div>
    </div>
  );
}

export default App;
