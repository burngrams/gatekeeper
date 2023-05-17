import { credentialsManager } from './credentialsManager';
import { ticketManager } from './ticketManager';

class CameraManager {
	data = null;

	setData(rawData) {
		const data = JSON.parse(rawData);
		this.data = data;

		credentialsManager.setCredentials(data);
		ticketManager.setTicket(data);
	}
}

export const cameraManager = new CameraManager();