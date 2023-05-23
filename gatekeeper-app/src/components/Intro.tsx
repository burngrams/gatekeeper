import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, View } from 'react-native';
import { PagesManager, pagesManager } from '../lib/pagesManager';

// TODO stylize
export function Intro() {
	return (
		<View>
			<Button title="Scan User" onPress={() => pagesManager.push(PagesManager.pages.camera)} />
			<StatusBar style="auto" />
		</View>
	);
}
