import { Platform } from 'react-native';
import { useEffect } from 'react';
import { usePlaidEmitter } from './PlaidNative';

export default function PlaidProvider({ children }) {
    useEffect(() => {
        if (Platform.OS === 'web' || !usePlaidEmitter) return;

        const listener = usePlaidEmitter((event) => {
            console.log('[Plaid Event]', event);
        });

        return () => listener?.remove?.();
    }, []);

    return children;
}
