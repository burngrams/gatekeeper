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

	return (
		<div className="container">
			<div className="controls">
				<div className="leftside">
					<div>לוג</div>
					<div>הגדרות</div>
					<div>ברקוד</div>
				</div>
				<div className="rightside">וולקאם</div>
			</div>
			<GatekeepersSection />
			<Section id="create-ticket" title="">
				{/* <form
					style={{ display: "flex", flexDirection: "column" }}
					onSubmit={onSubmitCreateTicket}
				>
					<input type="tel" name="ticketId" placeholder="ticketId" required defaultValue="always-existing-test-id" />
					<button type="submit">fבואי נחולל</button>
					<img width="150" height="150" />
				</form> */}
			</Section>
			{/* <Section id="auditlog" title="לוג פעולות">
				<AuditlogTable />
			</Section> */}
			{/* <Section id="settings" title="הגדרות">
				<div>
					<label htmlFor="allocations">
						<input name="allocations" type="checkbox" defaultChecked={electronAPI.allocationsModeSetting} onChange={() => {
							electronAPI.toggleAllocationsModeSetting()
						}} />
						הפעל מצב הקצאה מוקדמת</label>
				</div>
			</Section> */}
		</div>
	);
}
