import { createRoot as reactCreateRoot } from 'react-dom/client';
import React, { useState } from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import { ipcLink } from 'electron-trpc/renderer';
import superjson from 'superjson';
import { createTRPCReact } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppRouter } from '../lib';
import { CommandPage } from './CommandPage';
import { Dialog } from './Dialog';

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
        <Dialog />
      </QueryClientProvider>
    </trpcReact.Provider>
  );
}

reactCreateRoot(document.getElementById("react-root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
