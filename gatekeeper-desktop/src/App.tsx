import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

async function getQRCode(user: string) {
  const result = await invoke<string>("generateQRCode", { user });
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  // const qrCode = JSON.parse(result)
  const decoded = atob(result);
  return (decoded.replace('<?xml version="1.0" standalone="yes"?>', ''));
}

function encodeSVGAsDataURI(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
function App() {
  const [user, setName] = useState("");
  const [qrCode, setQRCode] = useState<string | null>(null);

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
          <span className="icon">👇</span>
          <h2>Create Test Tickets</h2>
        </summary>
        <p>
          <form
            style={{ display: "flex", flexDirection: "column" }}
            onSubmit={async (e) => {
              // const form = e.currentTarget ?
              console.log(e.currentTarget)
              e.preventDefault();
              const imgEle = document.querySelector<HTMLImageElement>('img#generate-test-ticket')!;
              const qrcode = await getQRCode(user);
              imgEle.src = encodeSVGAsDataURI(qrcode)
            }}
          >
            <input type="tel" name="ticketId" placeholder="ticketId" required value="123" />
            <input type="tel" name="tazId" placeholder="tazId" value="205602378" />
            <input type="text" name="participantName" placeholder="participantName" required value="daniel" />
            <button type="submit">generate QR</button>
            <img id="generate-test-ticket" />
          </form>
        </p>
      </details>
      <h2>Credential Generator</h2>
      <div className="row">
        <div className="row">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setQRCode(await getQRCode(user));
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
          {qrCode && <img src={encodeSVGAsDataURI(qrCode)} alt="QR Code" />}
        </div>
      </div>

      <h2>Gatekeepers List</h2>
      <div className="row">
      </div>
    </div>
  );
}

export default App;
