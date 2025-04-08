// modules/plaid/PlaidNative.jsx
import { Platform } from 'react-native';

let create, open;

if (Platform.OS !== 'web') {
    const plaid = require('react-native-plaid-link-sdk');
    create = plaid.create;
    open = plaid.open;
}

export { create, open };
