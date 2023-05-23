import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import superjson from 'superjson';
import { trpcReact } from '../lib/trpcReact';
import { credentialsManager } from '../lib/credentialsManager';
import { App } from '../../App';


export const TrpcProvider = ({ children }) => {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() => trpcReact.createClient({
		links: [
			httpBatchLink({
				url: `http://${credentialsManager.credentials?.ip}:3000`,
			}),
		],
		transformer: superjson,
	})
	);

	return (
		<trpcReact.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</trpcReact.Provider>
	);
}
	;