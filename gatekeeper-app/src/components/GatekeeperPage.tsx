import { Text, View } from 'react-native'
import { credentialsManager } from '../lib/credentialsManager'
import ScanCredentialsPage from './ScanCredentialsPage'
import { ticketManager } from '../lib/ticketManager'
import { observer } from 'mobx-react-lite'

export const GatekeeperPage = observer(() => {
	console.log('GatekeeperPage', credentialsManager.credentials)
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