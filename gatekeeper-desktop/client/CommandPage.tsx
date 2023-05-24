import React, { useEffect, useState } from 'react';
import { formIdToQRImage } from './backend.layer';

import QRCode from 'qrcode';
import "./CommandPage.css";
import { Section } from './Section';
import { json } from 'stream/consumers';
import { AuditlogModel, OperationLogModel } from '../lib/models';
import { trpc, wsClient } from './trpc';

/**
 * takes an auditlog and returns a table JSX element
 * it takes each property of the auditlog and creates a th row
 * then it takes each operationlog and creates a tr row with td for each property
 * 
 */
function AuditlogTable() {
	const [auditlogRaw, setAuditlog] = useState<AuditlogModel>([])
	const auditlog = auditlogRaw.reverse()

	useEffect(() => {
		const getAuditlog = async () => {
			const { auditlog } = await trpc.auditlog.get.query();
			setAuditlog(auditlog)
		}
		getAuditlog()
	}, [])

	useEffect(() => {
		const disposer = wsClient.auditlog.onAdd.subscribe(undefined, {
			onData(operationLog) {
				setAuditlog(auditlog => [...auditlog, operationLog])
			},
		})

		return () => disposer.unsubscribe()
	}, [])

	/* #region creating table elements jsx */
	const item = auditlog.length ? auditlog[0] : {}
	const ths = Object.keys(item).map(key => <th>{key}</th>)
	const trs = auditlog.map(operationLog => {
		const tds = Object.values(operationLog).map(value => {
			if (typeof value === 'object') {
				return <td>{JSON.stringify(value)}</td>
			}
			return <td>{value}</td>
		})
		return <tr>{tds}</tr>
	})
	/* #endregion */

	return <table>
		<thead>
			<tr>{ths}</tr>
		</thead>
		<tbody>
			{trs}
		</tbody>
	</table>
}


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
		const ip = window['gatekeeper'].ip
		const json = JSON.stringify({ ...data, ip })
		const qrcode = await QRCode.toDataURL(json)

		const imgEle = document.querySelector<HTMLImageElement>(`#${id} img`)!
		imgEle.src = qrcode
	};

	return (
		<div className="container">
			<h1>Welcome to Gatekeeper!</h1>
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
