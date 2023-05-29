import QRCode from 'qrcode';
import { makeAutoObservable } from 'mobx';
import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { observer } from 'mobx-react-lite';
import './Dialog.css'
import { trpc } from './trpc';
import { electronAPI } from './electronAPI';

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
ReactModal.setAppElement('#react-root');

class ViewModel {
	public isOpen = false

	constructor() {
		makeAutoObservable(this)
	}

	openModal() {
		this.isOpen = true;
	}
}

export const dialogViewModel = new ViewModel()

export const Dialog = observer(() => {
	let subtitle;

	function afterOpenModal() {
		// references are now sync'd and can be accessed.
		subtitle.style.color = '#f00';
		const formEle = document.querySelector<HTMLFormElement>(`.modal-form`);
		onFormChange(formEle!)
	}

	function closeModal() {
		dialogViewModel.isOpen = (false);
	}

	const onFormChange = async (formEle: HTMLFormElement): Promise<void> => {
		console.log('hey')
		const formData = new FormData(formEle);
		const formEntries = Object.fromEntries(formData.entries());

		const ip = electronAPI.ip;
		const data = { ...formEntries, ip };
		const json = JSON.stringify(data);

		const qrcode = await QRCode.toDataURL(json);

		document.querySelector<HTMLImageElement>(`#qrcode`)!
			.src = qrcode;
	};

	return <ReactModal
		isOpen={dialogViewModel.isOpen}
		onAfterOpen={afterOpenModal}
		onRequestClose={closeModal}
		className="Modal"
		overlayClassName="Overlay"
	>
		<h2 ref={(_subtitle) => (subtitle = _subtitle)}></h2>
		<form className="modal-form" onAnimationStart={e => onFormChange(e.currentTarget)} onChange={e => onFormChange(e.currentTarget)} onSubmit={async (e) => {
			e.preventDefault()
			const formEle = e.currentTarget
			const formData = new FormData(formEle)
			const data: any = Object.fromEntries(formData.entries())
			data.isActive = data.isActive === 'on' ? true : false
			try {
				await trpc.gatekeepers.update.mutate(data)
			} catch (error) {
				alert("שגיאה: " + error.message)
			}
		}}>
			<div className='Modal__row'>
				<img id="qrcode" alt="QR Code will be here" />
			</div>
			<div className='Modal__row'>
				<input type="text" name="fullname" defaultValue="דניאל חנקינג" />
				<label htmlFor="fullname">שם מלא</label>
			</div>
			<div className='Modal__row'>
				<input type="checkbox" defaultChecked name="isActive" />
				<label htmlFor="isActive">?האם פעיל</label>
			</div>
			<button type="submit">הוספה</button>
		</form>
		<hr />
		<a href="#" onClick={closeModal}>סגור חלון</a>
	</ReactModal>
})