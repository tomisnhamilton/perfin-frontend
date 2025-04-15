import { Platform } from 'react-native';
import NativeCard from './AccountCard.native';
import WebCard from './AccountCard.web';

export default Platform.OS === 'web' ? WebCard : NativeCard;
