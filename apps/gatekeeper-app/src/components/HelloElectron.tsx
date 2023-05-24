// from https://www.electron-trpc.dev project

import { Text } from 'react-native';
import { trpcReact } from '../lib/trpcReact';

export function HelloElectron() {
	const { data } = trpcReact.greeting.useQuery({ name: 'Electron' });
	trpcReact.subscription.useSubscription(undefined, {
		onData: (data) => {
			console.log(data);
		},
	});

	if (!data) {
		return null;
	}

	return <Text>{data.text}</Text>;
}
