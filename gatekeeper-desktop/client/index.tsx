import { createRoot as reactCreateRoot } from 'react-dom/client';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ipcLink } from 'electron-trpc/renderer';
import superjson from 'superjson';
import { createTRPCReact } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppRouter } from '../lib/api';
import { CommandPage } from './CommandPage';

export const trpcReact = createTRPCReact<AppRouter>();

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpcReact.createClient({
      links: [ipcLink()],
      transformer: superjson,
    })
  );

  return (
    <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <CommandPage />
      </QueryClientProvider>
    </trpcReact.Provider>
  );
}

reactCreateRoot(document.getElementById("react-root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
