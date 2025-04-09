import React, { useEffect, useState } from 'react';
import { Button, View, ActivityIndicator, Text } from 'react-native';
import { usePlaidLink } from 'react-native-plaid-link-sdk';
import { API_URL } from '@/utils/env';

export default function PlaidNativeLink() {
    const [linkToken, setLinkToken] = useState(null);

    useEffect(() => {
        const fetchLinkToken = async () => {
            try {
                const res = await fetch(`${API_URL}/api/create_link_token`);
                const data = await res.json();
                setLinkToken(data.link_token);
            } catch (err) {
                console.error('❌ Error fetching link token:', err);
            }
        };

        fetchLinkToken();
    }, []);

    const { open, ready, error } = usePlaidLink({
        token: linkToken,
        onSuccess: async (public_token, metadata) => {
            console.log('✅ Success:', metadata);
            await fetch(`${API_URL}/api/exchange_public_token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ public_token }),
            });
        },
        onExit: (err, metadata) => {
            console.warn('⛔️ Exit:', err, metadata);
        },
    });

    if (!linkToken) return <ActivityIndicator />;

    return (
        <View style={{ padding: 20 }}>
            <Button title="Connect Bank" onPress={open} disabled={!ready} />
            {error && <Text style={{ color: 'red' }}>Error: {error.message}</Text>}
        </View>
    );
}
