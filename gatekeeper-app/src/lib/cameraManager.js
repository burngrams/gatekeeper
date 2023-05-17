import { credentialsManager } from './credentialsManager';

class CameraManager {
	data = null;

	setData(rawData) {
		const data = JSON.parse(rawData);
		this.data = data;

		credentialsManager.setCredentials(data);
	}
}

export const cameraManager = new CameraManager();