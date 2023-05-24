import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, View } from 'react-native';
import { PagesManager, pagesManager } from '../lib/pagesManager';
import { BarcodeCameraScanner } from './BarcodeCameraScanner';
import { credentialsManager } from '../lib/credentialsManager';

// TODO stylize
export function Intro() {
	// whether the camera is active for scanning a user
	const [cameraActive, setCameraActive] = useState(false);

	if (cameraActive) {
		return <BarcodeCameraScanner validator={data => {
			// TODO validate data
			return true;
		}}
			onSuccess={data => {
				console.log(data, data.fullname, data.ip)
				credentialsManager.fullname = data.fullname;
				credentialsManager.serverIP = data.ip;
				// TODO get ssid from expo-network and associate it with the serverIP
				pagesManager.replace(PagesManager.pages.gatekeeper);
			}} />
	}

	return (
		<View>
			<Button title="Scan User" onPress={() => setCameraActive(true)} />
			<StatusBar style="auto" />
		</View>
	);
}
