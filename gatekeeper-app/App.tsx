import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import superjson from 'superjson';
import { GatekeeperPage } from './src/components/GatekeeperPage';
import ScanCredentialsPage from './src/components/ScanCredentialsPage';
import { PagesManager, pagesManager } from './src/lib/pagesManager';
import { trpcReact } from './src/lib/trpcReact';
import { HelloElectron } from './src/components/HelloElectron';
import { credentialsManager } from './src/lib/credentialsManager';


// TODO stylize
function Intro() {
  return (
    <View>
      <Button title="Scan User" onPress={() => pagesManager.push(PagesManager.pages.camera)} />
      <StatusBar style="auto" />
    </View>
  );
}

const App = observer(function App() {
  if (pagesManager.page === PagesManager.pages.camera) return <ScanCredentialsPage />

  return (
    <View style={styles.container}>
      {pagesManager.page === PagesManager.pages.intro && <Intro />}
      {pagesManager.page === PagesManager.pages.gatekeeper && <GatekeeperPage />}
      <Toast />
    </View>
  );
})

export default function () {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpcReact.createClient({
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
        <App />
      </QueryClientProvider>
    </trpcReact.Provider>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
