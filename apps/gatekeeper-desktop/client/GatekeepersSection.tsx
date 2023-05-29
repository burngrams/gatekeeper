import React, { useEffect } from 'react';
import { Section } from './Section';

import { observer } from 'mobx-react-lite';
import { GatekeeperModel } from '../lib/models';
import './GatekeepersSection.css';
import { electronAPI } from './electronAPI';
import { trpc } from './trpc';
import { dialogViewModel } from './Dialog';
import { makeAutoObservable } from 'mobx';

class ViewModel {
	public gatekeepers: GatekeeperModel[] = []

	constructor() {
		makeAutoObservable(this)
	}

	onFetch(gatekeepers: GatekeeperModel[]) {
		this.gatekeepers = gatekeepers
	}

	onAdd(gatekeeper: GatekeeperModel) {
		// this.gatekeepers.push(gatekeeper)

		this.refetch()
	}

	refetch() {
		trpc.gatekeepers.get.query().then(({ gatekeepers }) => {
			this.onFetch(gatekeepers)
		})
	}

	update(gatekeeper: GatekeeperModel) {
		trpc.gatekeepers.update.mutate(gatekeeper).then(() => {
			this.refetch()
		})
	}
}

const viewModel = new ViewModel()
export const gatekeepersViewModel = viewModel;

export const GatekeepersSection = observer(() => {
	const gatekeepers = [...viewModel.gatekeepers].sort(activeFirstSort)

	useEffect(() =>
		viewModel.refetch()
		, []);

	return <Section title="ניהול גייטרים" id="create-gatekeeper">
		<div className="gatekeeper-blocks">
			{gatekeepers.map(gatekeeper => {
				return <div className="gatekeeper-block" onClick={() => {
					viewModel.update({ ...gatekeeper, isActive: !gatekeeper.isActive })
				}}>
					<div className="gatekeeper-block__name">{gatekeeper.fullname}</div>
					<div className="gatekeeper-block__isActive">{gatekeeper.isActive ? 'active' : 'inactive'}</div>
				</div>;
			})}
			<button className="gatekeeper-block" onClick={() => dialogViewModel.openModal()}>
				+
			</button>
		</div>
	</Section>
})

function activeFirstSort(a: GatekeeperModel, b: GatekeeperModel) {
	if (a.isActive === b.isActive) {
		return 0
	}

	if (a.isActive) {
		return -1
	}

	return 1
}