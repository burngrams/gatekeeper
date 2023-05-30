import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import superjson from 'superjson';
import { trpcReact } from '../lib/trpcReact';
import { credentialsManager } from '../lib/credentialsManager';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const onError = (err) => {

	Toast.show({
		type: 'error',
		text1: 'שגיאה',
		text2: err.message,
	})
}

export const TrpcProvider = ({ children }) => {
	const [queryClient] = useState(() => new QueryClient({
		queryCache: new QueryCache({
			onError: onError,
		}),
		mutationCache: new MutationCache({
			onError: onError,
		}),
	}),
	);
	const url = `http://${credentialsManager.serverIP}:3000`;
	console.log('Instantiating trpcClient with url', url)
	const [trpcClient] = useState(() => trpcReact.createClient({
		links: [
			httpBatchLink({
				url,
			}),
		],
		transformer: superjson,
	}));

	return (
		<trpcReact.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</trpcReact.Provider>
	);
}
	;