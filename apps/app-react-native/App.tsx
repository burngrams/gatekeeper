import { configure } from 'mobx';
import { Main } from './Main';
import Toast from 'react-native-toast-message';
import { View } from 'react-native';

// configure({ useProxies: "never" })
// if (!new class { x }().hasOwnProperty('x')) throw new Error('Transpiler is not configured correctly');

export default function () {
  return <View style={{ display: 'flex', flex: 1, paddingTop: 0 }}>
    <Main />
    <Toast topOffset={80} position='top' />
  </View>
};