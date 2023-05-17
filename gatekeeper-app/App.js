import { observer } from 'mobx-react-lite'
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import ScanCredentialsPage from './src/components/ScanCredentialsPage';
import { PagesManager, pagesManager } from './src/lib/pagesManager';
import { GatekeeperPage } from './src/components/GatekeeperPage';

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
    </View>
  );
})

export default App;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
