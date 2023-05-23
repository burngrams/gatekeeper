import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GatekeeperPage } from './src/components/GatekeeperPage';
import { BarcodeCameraScanner } from './src/components/BarcodeCameraScanner';
import { PagesManager, pagesManager } from './src/lib/pagesManager';
import { TrpcProvider } from './src/components/TrpcProvider';
import { Intro } from './src/components/Intro';
import { DefaultLayout } from './DefaultLayout';


export const Main = observer(function App() {
	if (pagesManager.page === PagesManager.pages.intro) {
		return <DefaultLayout>
			<Intro />
		</DefaultLayout>;
	}
	if (pagesManager.page === PagesManager.pages.gatekeeper) {
		return <TrpcProvider><GatekeeperPage /></TrpcProvider>;
	}

});
