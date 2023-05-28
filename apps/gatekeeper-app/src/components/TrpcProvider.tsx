import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import superjson from 'superjson';
import { trpcReact } from '../lib/trpcReact';
import { credentialsManager } from '../lib/credentialsManager';

const onError = (err) => {
	console.log('trpc error', err);
}

export const TrpcProvider = ({ children }) => {
	const [queryClient] = useState(() => new QueryClient({
		defaultOptions: {

			queries: {
				onError,
			},
			mutations: {
				onError,
			},
		}
	}));
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
				<ErrorBoundary fallbackRender={({ children }: any) => children} onError={console.error}>
					{children}
				</ErrorBoundary>
			</QueryClientProvider>
		</trpcReact.Provider>
	);
}
	;