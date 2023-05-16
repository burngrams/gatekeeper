import { observer } from 'mobx-react-lite'
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import ScanCredentialsPage from './src/components/ScanCredentialsPage';
import { PagesManager } from './src/lib/pagesManager';


function Intro() {
  return (
    <View>
      <Button title="Scan User" onPress={() => setPage(PagesManager.pages.login)} />
      <StatusBar style="auto" />
    </View>
  );
}

const App = observer(function App() {
  // TODO add hydration
  const [page, setPage] = useState('intro');

  console.log('page', page);

  return (
    <View style={styles.container}>
      {page === 'login' && <ScanCredentialsPage />}
      {page === 'scan' && <Scan />}
      {page === 'intro' && <Intro />}
    </View>
  );
})
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
