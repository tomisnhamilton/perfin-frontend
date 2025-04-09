import { Platform } from 'react-native';

let PlaidLink;

if (Platform.OS === 'web') {
    PlaidLink = require('../modules/plaid/PlaidWeb').default;
} else {
    PlaidLink = require('../modules/plaid/PlaidNative').default;
}

export default PlaidLink;
