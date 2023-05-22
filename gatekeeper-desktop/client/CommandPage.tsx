import { useState } from "react";
import React from 'react';
import { createQRHandler } from './backend.layer';
import { strToQRstr, encodeSVGAsDataURI } from './presentation.layer';

import "./CommandPage.css";
import { Section } from './Section';

interface Ticket {
	ticketId: string;
	tazId: string;
	participantName: string;
}

export function CommandPage() {
	const [user, setName] = useState("");
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [gatekeepers, setGatekeepers] = useState<any[]>([]);
	const [filepath, setFilepath] = useState<string | null>(null);

	return (
		<div className="container">
			<h1>Welcome to Gatekeeper!</h1>

			<Section title="Manage Data" id="manage-data">
				<div>
					<input type="file" name="file" />
					<label htmlFor="file">{filepath ? "filepath: " + filepath : 'Choose a file'}</label>
				</div>
				<div>{!tickets.length ? null : `tickets loaded: ${tickets.length}.`}</div>
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
				<form
					style={{ display: "flex", flexDirection: "column" }}
					onSubmit={createQRHandler('create_ticket')}
				>
					<input type="tel" name="ticketId" placeholder="ticketId" required defaultValue="123" />
					<input type="tel" name="tazId" placeholder="tazId" defaultValue="205602378" />
					<input type="text" name="participantName" placeholder="participantName" required defaultValue="daniel" />
					<button type="submit">generate QR</button>
					<img />
				</form>
			</Section>

			<Section id="update-tickets" title="Update Ticket">
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
					<input type="tel" name="ticketId" placeholder="ticketId" required defaultValue="123" />
					<input type="tel" name="tazId" placeholder="tazId" defaultValue="205602378" />
					<input type="text" name="participantName" placeholder="participantName" required defaultValue="daniel" />
					<button type="submit">generate QR</button>
					<img id="generate-test-ticket" />
				</form>
			</Section>

			<Section id="audit-log" title="Audit Log">
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
					<input type="tel" name="ticketId" placeholder="ticketId" required defaultValue="123" />
					<button onClick={async () => {

					}}>generate QR</button>
					<input type="text" name="participantName" placeholder="participantName" required defaultValue="daniel" />
					<button type="submit">generate QR</button>
					<img id="generate-test-ticket" />
				</form>
			</Section>
		</div>
	);
}
