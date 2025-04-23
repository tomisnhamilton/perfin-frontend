import { Platform } from 'react-native';
import NativeList from './TransactionList.native';
import WebList from './TransactionList.web';

export default Platform.OS === 'web' ? WebList : NativeList;
