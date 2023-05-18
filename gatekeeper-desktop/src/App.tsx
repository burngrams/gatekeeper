import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function strToQRstr(invokeResult: string) {
  const decoded = atob(invokeResult);
  return (decoded.replace('<?xml version="1.0" standalone="yes"?>', ''));
}

function encodeSVGAsDataURI(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

interface Ticket {
  ticketId: string;
  tazId: string;
  participantName: string;
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
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [gatekeepers, setGatekeepers] = useState<any[]>([]);
  const [filepath, setFilepath] = useState<File | null>(null);

  const createQRHandler = (id: string): React.FormEventHandler<HTMLFormElement> => async (e) => {
    e.preventDefault();

    // get all fields from form in event
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const result = await invoke<string>(id, data);
    debugger
    const qrcode = strToQRstr(result);
    const imgEle = document.querySelector<HTMLImageElement>(`#${id} img`)!;
    imgEle.src = encodeSVGAsDataURI(qrcode);
  };
  return (
    <div className="container">
      <h1>Welcome to Gatekeeper!</h1>

      <Section title="Manage Data" id="manage-data">
        <input type="file" name="input-file" onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setFilepath(file)
          const text = await file.text();
          const tickets = JSON.parse(text);
          setTickets(tickets);
        }} />
        <label htmlFor='input-file'>Upload tickets JSON</label>
        {!tickets.length ? null : <p>{`tickets loaded: ${tickets.length}.`}</p>}
      </Section>

      <Section title="Create new gatekeeper" id="create_gatekeeper">
        <form
          onSubmit={createQRHandler('create_gatekeeper')}
        >
          <input
            id="login-input"
            name="fullname"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a user..."
          />
          <button type="submit">generate QR</button>
        </form>

        {<img alt="QR Code" />}
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

      <Section id="test-tickets" title="Create Test Ticket">
        <p>
          <form
            style={{ display: "flex", flexDirection: "column" }}
            onSubmit={async (e) => {
              // const form = e.currentTarget ?
              console.log(e.currentTarget)
              e.preventDefault();
              const imgEle = document.querySelector<HTMLImageElement>('img#generate-test-ticket')!;
              const qrcode = await strToQRstr(user);
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

      <Section id="update-tickets" title="Update Ticket">
        <p>
          <form
            style={{ display: "flex", flexDirection: "column" }}
            onSubmit={async (e) => {
              // const form = e.currentTarget ?
              console.log(e.currentTarget)
              e.preventDefault();
              const imgEle = document.querySelector<HTMLImageElement>('img#generate-test-ticket')!;
              const qrcode = await strToQRstr(user);
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

      <Section id="audit-log" title="Audit Log">
        <p>
          <form
            style={{ display: "flex", flexDirection: "column" }}
            onSubmit={async (e) => {
              // const form = e.currentTarget ?
              console.log(e.currentTarget)
              e.preventDefault();
              const imgEle = document.querySelector<HTMLImageElement>('img#generate-test-ticket')!;
              const qrcode = await strToQRstr(user);
              imgEle.src = encodeSVGAsDataURI(qrcode)
            }}
          >
            <input type="tel" name="ticketId" placeholder="ticketId" required value="123" />
            <button onClick={async () => {

            }}>generate QR</button>
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
