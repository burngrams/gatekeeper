import { configure } from 'mobx';
import { Main } from './Main';

// configure({ useProxies: "never" })
// if (!new class { x }().hasOwnProperty('x')) throw new Error('Transpiler is not configured correctly');

export default Main;