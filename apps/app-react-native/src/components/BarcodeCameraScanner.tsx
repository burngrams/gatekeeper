import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, EventEmitter } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { makeAutoObservable } from 'mobx';

export class CameraStore {

  _data = null;
  hasChangedIndex = 0;

  constructor() {
    makeAutoObservable(this);
  }
  get data() {
    return cameraStore._data;
  }
  set data(data: any) {
    cameraStore._data = data;
    ++cameraStore.hasChangedIndex;
  }
}

export const cameraStore = new CameraStore

export function BarcodeCameraScanner({ onSuccess }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    cameraStore.data = JSON.parse(data);
    onSuccess?.(cameraStore.data)
    console.log(`Bar code with type ${type} and data ${data} has been scanned!`, cameraStore.data.ticketId);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={StyleSheet.absoluteFillObject}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
