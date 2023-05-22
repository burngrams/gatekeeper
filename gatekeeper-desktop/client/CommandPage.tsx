import { useState, useEffect } from "react";
import React from 'react';
import { formIdToQRImage } from './backend.layer';
import { strToQRstr, encodeSVGAsDataURI } from './presentation.layer';

import "./CommandPage.css";
import { Section } from './Section';
import { trpcReact } from '.';

interface Ticket {
	ticketId: string;
	tazId: string;
	participantName: string;
}

export function CommandPage() {
	useEffect(() =>
		['create-gatekeeper'].forEach(formIdToQRImage)
		, [])

	const createQRHandler = (id: string) => async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		await formIdToQRImage(id);
	};
	return (
		<div className="container">
			<h1>Welcome to Gatekeeper!</h1>
			<Section title="יצירת גייטרית" id="create-gatekeeper">
				<form
					onSubmit={createQRHandler('create-gatekeeper')}
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
					onSubmit={createQRHandler('create-ticket')}
				>
					<input type="tel" name="ticketId" placeholder="ticketId" required defaultValue="always-existing-test-id" />
					<button type="submit">generate QR</button>
					<img width="150" height="150" />
				</form>
			</Section>
		</div>
	);
}
