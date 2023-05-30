import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import QRCode from 'qrcode';
import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { electronAPI } from './electronAPI';
import { trpc } from './trpc';
import { useLocalstorageState } from './useLocalstorageState';

import './Dialog.css';
import { gatekeepersViewModel } from './GatekeepersSection';
import { GatekeeperModel } from '../lib/models';

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
ReactModal.setAppElement('#react-root');

const defaultGatekeeper: GatekeeperModel = {
	fullname: '',
	isActive: true,
}

class ViewModel {
	public isOpen = false
	public editedGatekeeper: GatekeeperModel | null = {
		...defaultGatekeeper
	}

	constructor() {
		makeAutoObservable(this)
	}

	openModal(gatekeeper: GatekeeperModel | null = null) {
		this.isOpen = true;
		this.editedGatekeeper = gatekeeper
	}
	submitModal(gatekeeper: GatekeeperModel) {
		gatekeepersViewModel.update(gatekeeper)

		this.editedGatekeeper = null
	}
}

const viewModel = new ViewModel()
export const dialogViewModel = viewModel

export const Dialog = observer(() => {
	const [closeAfterAdd, setCloseAfterAdd] = useLocalstorageState('modal-closeAfterAdd', true)
	const formRef = React.useRef<HTMLFormElement>(null);
	const formEle = formRef.current;

	function afterOpenModal() {
		if (formEle) onFormChange(formEle)
	}

	function closeModal() {
		viewModel.isOpen = (false);
	}

	const onFormChange = async (formEle: HTMLFormElement): Promise<void> => {
		const formData = new FormData(formEle);
		const formEntries = Object.fromEntries(formData.entries());

		const ip = electronAPI.ip;
		const data = { ...formEntries, ip };
		const json = JSON.stringify(data);

		const qrcode = await QRCode.toDataURL(json);

		document.querySelector<HTMLImageElement>(`#qrcode`)!
			.src = qrcode;
	};

	const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		const formEle = e.currentTarget;
		const formData = new FormData(formEle);
		const {
			closeAfterAdd,
			...formEntries
		} = Object.fromEntries(formData.entries());
		const gatekeeper = {
			...formEntries,
			isActive: formEntries.isActive === 'on' ? true : false
		} as GatekeeperModel;
		viewModel.submitModal(gatekeeper);

		if (closeAfterAdd) {
			closeModal()
		} else {
			formEle.reset();
			onFormChange(formEle);
		}
	};

	return <ReactModal
		isOpen={viewModel.isOpen}
		onAfterOpen={afterOpenModal}
		onRequestClose={closeModal}
		className="Modal"
		overlayClassName="Overlay"
	>
		<form
			ref={formRef}
			className="modal-form"
			onAnimationStart={e => onFormChange(e.currentTarget)}
			onChange={e => onFormChange(e.currentTarget)}
			onSubmit={onFormSubmit}
		>
			<div className='Modal__row'>
				<img id="qrcode" alt="QR Code will be here" />
			</div>
			<div className='Modal__row'>
				<input type="text" name="fullname" value={viewModel.editedGatekeeper?.fullname ?? ''} onChange={
					e => {
						viewModel.editedGatekeeper!.fullname = e.target.value
					}
				} />
				<label htmlFor="fullname">שם מלא</label>
			</div>
			<div className='Modal__row'>
				<input type="checkbox" name="isActive"
					checked={viewModel.editedGatekeeper?.isActive}
					onChange={() => viewModel.editedGatekeeper!.isActive = !viewModel.editedGatekeeper!.isActive}
				/>
				<label htmlFor="isActive">?האם פעיל</label>
			</div>
			<div className='Modal__row'>
				<input type="checkbox" name="closeAfterAdd" checked={closeAfterAdd} onChange={e => setCloseAfterAdd(!closeAfterAdd)} />
				<label htmlFor="closeAfterAdd">?האם לסגור חלון אחרי עדכון</label>
			</div>
			<button type="submit">עדכון</button>
		</form>
		<hr />
		<a href="#" onClick={closeModal}>סגור חלון</a>
	</ReactModal>
})