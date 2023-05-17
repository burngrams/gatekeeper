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

// TODO extract
function Section(props: { title: string, children: React.ReactNode, id: string }) {
  return (
    <details id={props.id}>
      <summary>
        <span className="icon">👇</span>
        <h2>{props.title}</h2>
      </summary>
      <p>
        {props.children}
      </p>
    </details>
  )
}
function App() {
  const [user, setName] = useState("");
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [gatekeepers, setGatekeepers] = useState<Gatekeeper[]>([]);

  return (
    <div className="container">
      <h1>Welcome to Gatekeeper!</h1>
      <h2></h2>
      <Section title="Manage Data" id="manage-data">
        TBD - manage data
        <ul>
          <li>drag and drop JSON feature to here</li>
          <li>show some statistics on list of attendees</li>
          <li>add text attendees can be viewed in JSON / CSV at :path_to_json</li>
        </ul>
      </Section>

      <Section title="Create Login" id="create-credentials">
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

        {qrCode && <img src={encodeSVGAsDataURI(qrCode)} alt="QR Code" />}
      </Section>
      <Section title="Gatekeepers List" id="gatekeepers-list">
        <div className="row">
          {gatekeepers.map((gatekeeper) => (
            <div className="col-4" key={gatekeeper.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{gatekeeper.name}</h5>
                  <p className="card-text">
                    <strong>Phone:</strong> {gatekeeper.phone}
                    <br />
                    <strong>Address:</strong> {gatekeeper.address}
                  </p>
                  <div className="btn-group" role="group">
                    <Link
                      to={`/edit-gatekeeper/${gatekeeper.id}`}
                      className="btn btn-outline-primary"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteGatekeeper(gatekeeper.id)}
                      className="btn btn-outline-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section id="test-tickets" title="Create Test Tickets">
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
      </Section>
    </div>
  );
}

export default App;
