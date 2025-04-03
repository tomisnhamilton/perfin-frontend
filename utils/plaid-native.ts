// utils/plaid-native.ts
import { Platform } from 'react-native';

let create, open, usePlaidEmitter;

if (Platform.OS !== 'web') {
    const plaid = require('react-native-plaid-link-sdk');
    create = plaid.create;
    open = plaid.open;
    usePlaidEmitter = plaid.usePlaidEmitter;
}

export { create, open, usePlaidEmitter };
