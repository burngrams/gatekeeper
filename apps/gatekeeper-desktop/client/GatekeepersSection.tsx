import React from 'react'
import { Section } from './Section'
import QRCode from 'qrcode';

import './GatekeepersSection.css'
import { electronAPI } from './electronAPI';
import { trpc } from './trpc';
import { GatekeeperModel } from '../lib/models';

export const GatekeepersSection = () => {
	const [gatekeepers, setGatekeepers] = React.useState<GatekeeperModel[]>([])

	React.useEffect(() => {
		trpc.gatekeepers.get.query().then(({ gatekeepers }) => {
			setGatekeepers(gatekeepers)
		})
	}, [])

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

	const newLocal = <form
		onSubmit={onSubmitGatekeeper}
	>
		<input
			id="login-input"
			name="fullname"
			placeholder="Enter a user..."
			defaultValue="daniel k" />
		<button type="submit">בואי נחולל</button>
		<img width="150" height="150" alt="create-gatekeeper QR Code" />
	</form>;
	return <Section title="ניהול גייטרים" id="create-gatekeeper">
		<div className="gatekeeper-blocks">
			{gatekeepers.map(gatekeeper => <div className="gatekeeper-block">
				<div className="gatekeeper-block__name">{gatekeeper.fullname}</div>
			</div>)}
			<button className="gatekeeper-block" onClick={console.log}>
				+
			</button>
		</div>

	</Section>
}