import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { GatekeeperPage } from './src/components/GatekeeperPage';
import BarcodeCameraScanner from './src/components/BarcodeCameraScanner';
import { PagesManager, pagesManager } from './src/lib/pagesManager';
import { HelloElectron } from './src/components/HelloElectron';
import { TrpcProvider } from './src/components/TrpcProvider';


// TODO stylize
function Intro() {
  return (
    <View>
      <Button title="Scan User" onPress={() => pagesManager.push(PagesManager.pages.camera)} />
      <StatusBar style="auto" />
    </View>
  );
}

export default observer(function App() {
  if (pagesManager.page === PagesManager.pages.camera) return <BarcodeCameraScanner />

  return (
    <View style={styles.container}>
      {pagesManager.page === PagesManager.pages.intro && <Intro />}
      {pagesManager.page === PagesManager.pages.gatekeeper && <TrpcProvider><GatekeeperPage /></TrpcProvider>}
      <Toast />
    </View>
  );
})

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
