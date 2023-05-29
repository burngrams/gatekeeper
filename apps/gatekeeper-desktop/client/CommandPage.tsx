import React, { useEffect } from 'react';
import { formIdToQRImage } from './backend.layer';

import QRCode from 'qrcode';
import { AuditlogTable } from './AuditlogTable';
import "./CommandPage.css";
import { Section } from './Section';
import { electronAPI } from './electronAPI';

export function CommandPage() {
	useEffect(() =>
		[onSubmitCreateTicket,
			onSubmitGatekeeper].forEach(fn => fn())
		, [])

	const onSubmitCreateTicket = async (e?: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e?.preventDefault();
		const id = 'create-ticket'
		await formIdToQRImage(id);
	};
	const onSubmitGatekeeper = async (e?: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e?.preventDefault();
		const id = 'create-gatekeeper'
		const formEle = document.querySelector<HTMLFormElement>(`#${id} form`)!
		const formData = new FormData(formEle)
		const data = Object.fromEntries(formData.entries())
		const ip = electronAPI.ip
		const json = JSON.stringify({ ...data, ip })
		const qrcode = await QRCode.toDataURL(json)

		const imgEle = document.querySelector<HTMLImageElement>(`#${id} img`)!
		imgEle.src = qrcode
	};

	const [alloactionsModeSetting, setAllocationsModeSetting] = React.useState(electronAPI.allocationsModeSetting)

	return (
		<div className="container">
			<h1>Welcome to Gatekeeper!</h1>
			<input type="checkbox" checked={alloactionsModeSetting} value={alloactionsModeSetting ? 'on' : 'off'} onChange={e => {
				setAllocationsModeSetting(e.target.checked)
			}} />
			<Section title="יצירת גייטרית" id="create-gatekeeper">
				<form
					onSubmit={onSubmitGatekeeper}
				>
					<input
						id="login-input"
						name="fullname"
						placeholder="Enter a user..."
						defaultValue="daniel k"
					/>
					<button type="submit">בואי נחולל</button>
				</form>
				<img width="150" height="150" alt="create-gatekeeper QR Code" />
			</Section>
			<Section id="create-ticket" title="צור ברקוד לכרטיס (לטובת הדרכה)">
				<form
					style={{ display: "flex", flexDirection: "column" }}
					onSubmit={onSubmitCreateTicket}
				>
					<input type="tel" name="ticketId" placeholder="ticketId" required defaultValue="always-existing-test-id" />
					<button type="submit">בואי נחולל</button>
					<img width="150" height="150" />
				</form>
			</Section>
			<Section id="auditlog" title="לוג פעולות">
				<AuditlogTable />
			</Section>
		</div>
	);
}
