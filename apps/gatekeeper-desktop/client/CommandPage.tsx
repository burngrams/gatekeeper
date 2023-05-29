import React, { useEffect } from 'react';
import { formIdToQRImage } from './backend.layer';

import { AuditlogTable } from './AuditlogTable';
import "./CommandPage.css";
import { Section } from './Section';
import { electronAPI } from './electronAPI';
import { GatekeepersSection } from './GatekeepersSection';

export function CommandPage() {
	const onSubmitCreateTicket = async (e?: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e?.preventDefault();
		const id = 'create-ticket'
		await formIdToQRImage(id);
	};

	const [alloactionsModeSetting, setAllocationsModeSetting] = React.useState(electronAPI.allocationsModeSetting ?? false)

	return (
		<div className="container">
			<h1>Welcome to Gatekeeper!</h1>
			<GatekeepersSection />
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
			<Section id="settings" title="הגדרות">
				<div>
					<label htmlFor="allocations">
						<input name="allocations" type="checkbox" defaultChecked={electronAPI.allocationsModeSetting} onChange={() => {
							electronAPI.toggleAllocationsModeSetting()
						}} />
						הפעל מצב הקצאה מוקדמת</label>
				</div>
			</Section>
		</div>
	);
}
