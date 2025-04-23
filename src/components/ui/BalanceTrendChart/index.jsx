import { Platform } from 'react-native';
import NativeCard from './BalanceTrendChart.native';
import WebCard from './BalanceTrendChart.web';

export default Platform.OS === 'web' ? WebCard : NativeCard;
