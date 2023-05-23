import { Text, View } from 'react-native'
import { credentialsManager } from '../lib/credentialsManager'
import ScanCredentialsPage from './ScanCredentialsPage'
import { ticketManager } from '../lib/ticketManager'
import { observer } from 'mobx-react-lite'
import { trpcReact } from '../lib/trpcReact'
import { useEffect } from 'react'
import { cameraManager } from '../lib/cameraManager'
import { PagesManager, pagesManager } from '../lib/pagesManager'

export const GatekeeperPage = observer(() => {
	console.log('GatekeeperPage', credentialsManager.credentials)
	const updateStatus = trpcReact.tickets.updateStatus.useMutation()

	const getTicket = trpcReact.tickets.get.useQuery({
		ticketId: cameraManager.data?.ticketId
	}, {
		enabled: !!cameraManager.data?.ticketId,
		async onSuccess({ ticket }) {
			console.log('fetched ticket', ticket)
			const ticketData = await updateStatus.mutateAsync({
				ticketId: ticket.ticketId,
				isInside: !ticket.isInside
			})
			console.log('mutated ticket', ticketData)
			ticketManager.setTicket(ticketData)
		},
	})

	useEffect(() => {
		getTicket.refetch()
	}, [cameraManager.i])

	return <View style={{ display: 'flex', flexDirection: 'column' }}>
		<Text>GatekeeperPage</Text>
		<Text>I am: {credentialsManager.credentials?.fullname}</Text>
		<Text>ticketing: ID[{ticketManager.currentTicket?.ticketId}]</Text>
		<Text>ticket status: {ticketManager.currentTicket?.isInside ? 'INside' : 'OUTside'}</Text>
		<View style={{ display: 'flex', height: '30%' }}>
			<ScanCredentialsPage />
		</View>
	</View>
})