import { Text, View } from 'react-native'
import { credentialsManager } from '../lib/credentialsManager'

export const GatekeeperPage = () => {
	console.log('GatekeeperPage', credentialsManager.credentials)
	return <View >
		<Text>GatekeeperPage</Text>
		<Text>{credentialsManager.credentials?.user}</Text>
	</View>
}