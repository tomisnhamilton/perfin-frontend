import { Platform } from 'react-native';
import NativeLayout from './MainLayout.native';
import WebLayout from './MainLayout.web';

export default Platform.OS === 'web' ? WebLayout : NativeLayout;
