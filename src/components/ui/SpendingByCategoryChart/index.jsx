import { Platform } from 'react-native';
import NativeCard from './SpendingByCategoryChart.native';
import WebCard from './SpendingByCategoryChart.web';

export default Platform.OS === 'web' ? WebCard : NativeCard;
