import { Button, PlatformColor, StyleSheet } from 'react-native';
import { Text, View } from 'react-native'
import { credentialsManager } from '../lib/credentialsManager'
import { BarcodeCameraScanner, cameraStore } from './BarcodeCameraScanner'
import { ticketManager } from '../lib/ticketManager'
import { observer } from 'mobx-react-lite'
import { trpcReact } from '../lib/trpcReact'
import { useEffect } from 'react'
import { PagesManager, pagesManager } from '../lib/pagesManager'
import noop from 'lodash/noop'
import { autorun, makeAutoObservable, when } from 'mobx';

class ViewModel {
	constructor() {
		makeAutoObservable(this)
	}

	get scannedTicketId() {
		return cameraStore.data?.ticketId;
	}
	get hasScannedTicket() {
		return !!this.scannedTicketId;
	}
	get shouldRefetchTicket() {
		return cameraStore.hasChangedIndex;
	}
}

export const viewModel = new ViewModel()

export const GatekeeperPage = observer(() => {
	const updateStatus = trpcReact.tickets.updateStatus.useMutation()

	console.log('cameraStore.data', cameraStore.data)
	console.log('viewModel.scannedTicketId', viewModel.scannedTicketId)
	console.log('viewModel.shouldRefetchTicket', viewModel.shouldRefetchTicket)
	console.log('viewModel.hasScannedTicket', viewModel.hasScannedTicket)

	const getTicket = trpcReact.tickets.get.useQuery({
		ticketId: viewModel.scannedTicketId
	}, {
		enabled: false, onSuccess(data) {
			console.log('data', data)
		},
	})

	useEffect(() => {
		if (viewModel.hasScannedTicket)
			getTicket.refetch()
	}, [viewModel.shouldRefetchTicket])

	return <View style={styles.container}>
		<View style={styles.cameraView}>
			<BarcodeCameraScanner />
		</View>
		<View style={styles.skeletonLoader}>
			<Text style={{ fontSize: 24 }}>ת.ז: {getTicket.data?.ticket.participantId}</Text>
		</View>
		<View style={styles.buttonContainer}>
			<Button color="grey" title="סקיפ" onPress={noop} />
			<Button color={"green"} title="הכנס" onPress={noop} />
		</View>
	</View >
})


const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	cameraView: {
		margin: 60,
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'black',
	},
	skeletonLoader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#eee',
		padding: 10,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		padding: 10,
		backgroundColor: '#ddd',
	}
});