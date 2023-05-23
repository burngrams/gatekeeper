import { useState, useEffect } from "react";
import React from 'react';
import { formIdToQRImage } from './backend.layer';
import { strToQRstr, encodeSVGAsDataURI } from './presentation.layer';

import "./CommandPage.css";
import { Section } from './Section';
import { trpcReact } from '.';
import QRCode from 'qrcode'

interface Ticket {
	ticketId: string;
	tazId: string;
	participantName: string;
}

export function CommandPage() {
	useEffect(() =>
		['create-gatekeeper'].forEach(formIdToQRImage)
		, [])

	const onSubmitCreateTicket = (id: string) => async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		await formIdToQRImage(id);
	};
	const onSubmitGatekeeper = (id: string) => async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		const formEle = document.querySelector<HTMLFormElement>(`#${id} form`)!
		const formData = new FormData(formEle)
		const data = Object.fromEntries(formData.entries())
		const json = JSON.stringify({ data, ip: window['gatekeeper'].ip })
		const qrcode = await QRCode.toDataURL(json)

		const imgEle = document.querySelector<HTMLImageElement>(`#${id} img`)!
		imgEle.src = qrcode
	};

	return (
		<div className="container">
			<h1>Welcome to Gatekeeper!</h1>
			<Section title="יצירת גייטרית" id="create-gatekeeper">
				<form
					onSubmit={onSubmitGatekeeper('create-gatekeeper')}
				>
					<input
						id="login-input"
						name="fullname"
						placeholder="Enter a user..."
						defaultValue="daniel k"
					/>
					<button type="submit">generate QR</button>
				</form>
				<img width="150" height="150" alt="create-gatekeeper QR Code" />
			</Section>
			<Section id="create-ticket" title="צור ברקוד לכרטיס (לטובת הדרכה)">
				<form
					style={{ display: "flex", flexDirection: "column" }}
					onSubmit={onSubmitCreateTicket('create-ticket')}
				>
					<input type="tel" name="ticketId" placeholder="ticketId" required defaultValue="always-existing-test-id" />
					<button type="submit">generate QR</button>
					<img width="150" height="150" />
				</form>
			</Section>
		</div>
	);
}
