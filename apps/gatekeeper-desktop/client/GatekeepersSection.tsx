import React from 'react';
import { Section } from './Section';

import { observer } from 'mobx-react-lite';
import { GatekeeperModel } from '../lib/models';
import './GatekeepersSection.css';
import { electronAPI } from './electronAPI';
import { trpc } from './trpc';
import { dialogViewModel } from './Dialog';
import { makeAutoObservable } from 'mobx';

class ViewModel {
	public gatekeepers = []

	constructor() {
		makeAutoObservable(this)
	}


}

export const GatekeepersSection = observer(() => {
	const [gatekeepers, setGatekeepers] = React.useState<GatekeeperModel[]>([])

	React.useEffect(() => {
		trpc.gatekeepers.get.query().then(({ gatekeepers }) => {
			setGatekeepers(gatekeepers)
		})
	})

	return <Section title="ניהול גייטרים" id="create-gatekeeper">
		<div className="gatekeeper-blocks">
			{gatekeepers.map(gatekeeper => <div className="gatekeeper-block">
				<div className="gatekeeper-block__name">{gatekeeper.fullname}</div>
				<div className="gatekeeper-block__isActive">{gatekeeper.isActive ? 'active' : 'inactive'}</div>
			</div>)}
			<button className="gatekeeper-block" onClick={() => dialogViewModel.openModal()}>
				+
			</button>
		</div>
	</Section>
})