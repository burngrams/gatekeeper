import React, { useEffect } from 'react';
import { Section } from './Section';

import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { GatekeeperModel } from '../lib/models';
import { dialogViewModel } from './Dialog';
import './GatekeepersSection.css';
import { trpc } from './trpc';
import { Switch } from './Switch';

import addSvg from '../assets/icons/noun-add-961411.svg'

class ViewModel {
	public gatekeepers: GatekeeperModel[] = []

	constructor() {
		makeAutoObservable(this)
	}

	onFetch(gatekeepers: GatekeeperModel[]) {
		this.gatekeepers = gatekeepers
	}

	refetch() {
		trpc.gatekeepers.get.query().then(({ gatekeepers }) => {
			this.onFetch(gatekeepers)
		})
	}

	private update(gatekeeper: GatekeeperModel) {
		trpc.gatekeepers.update.mutate(gatekeeper).then(() => {
			this.refetch()
		})
	}

	public toggleShift(gatekeeper: GatekeeperModel) {
		this.update({
			...gatekeeper,
			isActive: !gatekeeper.isActive
		})
	}
}

const viewModel = new ViewModel()
export const gatekeepersViewModel = viewModel;

export const GatekeepersSection = observer(() => {
	const gatekeepers = [...viewModel.gatekeepers]
	// .sort(activeFirstSort)

	useEffect(() =>
		viewModel.refetch()
		, []);

	return <div className="gatekeeper-container">
		<div className="gatekeeper-hr" />
		<div dir="rtl" className="gatekeeper-block-header">
			<span>כל הגייטרים</span>
		</div>
		<div className="gatekeeper-blocks">
			{gatekeepers.map(gatekeeper => {
				return <div className="gatekeeper-block gatekeeper-block-gater">
					<div className="header-and-subheader">
						<span>
							<a onClick={() => viewModel.toggleShift(gatekeeper)}>{
								gatekeeper.isActive ? 'ירידת משמרת' : 'עליית משמרת'
							}</a>
						</span>
					</div>
					<div className="header-and-subheader">
						<span className=''>{gatekeeper.fullname}</span>
						<span className="gatekeeper__active">
							{gatekeeper.isActive ? 'פעיל' : 'לא פעיל'}
							<span data-active={gatekeeper.isActive} className="box-indicator"></span>
						</span>
					</div>
				</div>
			})}
		</div>
	</div>
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