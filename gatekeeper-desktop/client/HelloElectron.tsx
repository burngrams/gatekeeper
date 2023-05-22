import React from 'react';
import { trpcReact } from '.';

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

	return <div>{data.text}</div>;
}
