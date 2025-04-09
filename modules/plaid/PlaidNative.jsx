import React, { useEffect, useState } from 'react';
import { Button, View, ActivityIndicator, Platform } from 'react-native';
import {
    create,
    open,
    LinkIOSPresentationStyle,
} from 'react-native-plaid-link-sdk';
import { API_URL } from '@/utils/env';

export default function PlaidNativeLink() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const initPlaid = async () => {
            try {
                const res = await fetch(`${API_URL}/api/create_link_token`);
                const { link_token } = await res.json();

                const config = {
                    token: link_token,
                    onSuccess: (public_token, metadata) => {
                        console.log('✅ Success:', metadata);
                        fetch(`${API_URL}/api/exchange_public_token`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ public_token }),
                        });
                    },
                    onExit: (error, metadata) => {
                        console.warn('⛔️ Exit:', error, metadata);
                    },
                };

                if (Platform.OS === 'ios') {
                    config.iOSPresentationStyle = LinkIOSPresentationStyle?.FULL_SCREEN ?? 'FULL_SCREEN';
                }

                console.log('🛠 calling create() with config:', config);
                await create(config);
                setReady(true);
            } catch (err) {
                console.error('❌ create() error:', err);
            }
        };

        initPlaid();
    }, []);

    if (!ready) return <ActivityIndicator />;

    return (
        <View>
            <Button title="Link with Plaid" onPress={() => open()} />
        </View>
    );
}
