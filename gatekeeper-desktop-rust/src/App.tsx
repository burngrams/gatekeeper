import { useState } from "react";
import { invoke, } from "@tauri-apps/api/tauri";
import { event, } from "@tauri-apps/api";
import { open, } from "@tauri-apps/api/dialog";
import "./App.css";
import { emit } from 'process';

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
  const [filepath, setFilepath] = useState<string | null>(null);

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
        <p>
          <button onClick={async () => {
            const filepath = await open({
              multiple: false,
              // filters: [{
              //   name: ''
              //   extensions: ['json']
              // }]
            }) as string;
            setFilepath(filepath)
            event.emit('load_file', { filepath })
          }}>load file</button>
          <span>{filepath && "filepath: " + filepath}</span>
        </p>
        {!tickets.length ? null : <p>{`tickets loaded: ${tickets.length}.`}</p>}
      </Section>

      <Section title="Tickets" id="tickets">
        <table>
          <thead>
            {tickets[0] && Object.entries(tickets[0]).map(([key, value]) => (
              <th key={key}>{key}</th>
            ))}
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.ticketId}>
                {Object.entries(ticket).map(([key, value]) => (
                  <td key={key}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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

      <Section id="create_ticket" title="Create Test Ticket">
        <p>
          <form
            style={{ display: "flex", flexDirection: "column" }}
            onSubmit={createQRHandler('create_ticket')}
          >
            <input type="tel" name="ticketId" placeholder="ticketId" required value="123" />
            <input type="tel" name="tazId" placeholder="tazId" value="205602378" />
            <input type="text" name="participantName" placeholder="participantName" required value="daniel" />
            <button type="submit">generate QR</button>
            <img />
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
