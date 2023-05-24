import noop from 'lodash/noop';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { trpcReact } from '../lib/trpcReact';
import { BarcodeCameraScanner, cameraStore } from './BarcodeCameraScanner';
import { TicketModel } from 'gatekeeper-desktop/lib/models';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';

class ViewModel {
	constructor() {
		makeAutoObservable(this)
	}
	/* #region camera interactions */
	get scannedTicketId() {
		return cameraStore.data?.ticketId;
	}
	get hasScannedTicket() {
		return !!this.scannedTicketId;
	}
	get shouldRefetchTicket() {
		return cameraStore.hasChangedIndex;
	}
	/* #endregion */
	onSuccess4getTicket(ticket: TicketModel) {
		const text2 = `Particicpant ${ticket.participantId} is now ${ticket.isInside ? 'inside' : 'outside'}`;
		console.log('Toast:', text2)
	}
}

export const viewModel = new ViewModel()

export const GatekeeperPage = observer(() => {
	console.log('cameraStore.data', cameraStore.data)
	console.log('viewModel.scannedTicketId', viewModel.scannedTicketId)
	console.log('viewModel.shouldRefetchTicket', viewModel.shouldRefetchTicket)
	console.log('viewModel.hasScannedTicket', viewModel.hasScannedTicket)

	const getTicket = trpcReact.tickets.get.useQuery({
		ticketId: viewModel.scannedTicketId
	}, {
		enabled: false,
	})
	useEffect(() => {
		if (viewModel.hasScannedTicket)
			getTicket.refetch()
	}, [viewModel.shouldRefetchTicket])

	const queryClient = useQueryClient()
	const removeCurrentTicket = () => {
		// TODO didnt work
		queryClient.removeQueries(['tickets.get', { ticketId: viewModel.scannedTicketId }])
		cameraStore.data = null
	}

	const updateStatus = trpcReact.tickets.updateStatus.useMutation()
	const toggleTicketStatus = async () => {
		const ticketId = getTicket.data.ticket.ticketId
		const { ticket } = await updateStatus.mutateAsync({ ticketId, isInside: !getTicket.data.ticket.isInside }, {})
		const queryKey = getQueryKey(trpcReact.tickets.get, { ticketId })

		// rewrite getTicket to use the new data, but it doesnt work
		console.log('queryDataBefore', queryKey, queryClient.getQueryData(queryKey))
		queryClient.setQueryData(queryKey, ticket)
		console.log('queryDataAfter', queryKey, queryClient.getQueryData(queryKey))
		// show simple toast
		Toast.show({
			type: 'success',
			text1: 'הצלחה',
		})
		// worked
		getTicket.refetch()
	}

	const isInside = getTicket.data?.ticket.isInside ?? false

	return <View style={styles.container}>
		<View style={styles.cameraView}>
			{!cameraStore.data && <BarcodeCameraScanner />}
		</View>
		<View style={styles.skeletonLoader}>
			<Text style={{ fontSize: 24 }}>ת.ז: {getTicket.data?.ticket.participantId}</Text>
		</View>
		<View style={styles.buttonContainer}>
			<Button color="grey" title="סקיפ" onPress={removeCurrentTicket} />
			<Button color={"green"} title={['הכנס', 'הוציא'][+isInside]} onPress={toggleTicketStatus} />
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
		padding: 50,
		backgroundColor: '#ddd',
	}
});