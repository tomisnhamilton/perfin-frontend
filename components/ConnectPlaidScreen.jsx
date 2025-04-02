import React, { useEffect, useState } from 'react';
import { Button, View, Text } from 'react-native';
import {
    create,
    open,
    usePlaidEmitter,
} from 'react-native-plaid-link-sdk';

export default function ConnectPlaidScreen() {
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initLink = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/create_link_token');
                const data = await res.json();
                await create({ token: data.link_token });
                setReady(true);
            } catch (err) {
                console.error(err);
                setError('Failed to initialize Plaid Link');
            }
        };

        initLink();
    }, []);

    usePlaidEmitter((event) => {
        console.log('📡 Plaid event:', event);

        if (event.eventName === 'onSuccess') {
            console.log('🪪 public_token:', event.metadata.publicToken);
            exchangePublicToken(event.metadata.publicToken);
        }

        if (event.eventName === 'HANDOFF') {
            console.log('⚠️ OAuth HANDOFF detected. Attempting to retrieve token...');
            fetchLatestPublicToken();
        }
    });



    const exchangePublicToken = async (publicToken) => {
        try {
            console.log('Sending public_token to backend:', publicToken);
            const res = await fetch('http://localhost:3000/api/exchange_public_token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ public_token: publicToken }),
            });

            const text = await res.text();
            console.log('Raw response:', text);

            const data = JSON.parse(text);
            console.log('✅ Token exchanged:', data);
        } catch (err) {
            console.error('❌ Token exchange failed:', err.message);
        }
    };

    const fetchLatestPublicToken = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/retrieve_latest_token');
            const text = await res.text(); // ← avoid crash if it's invalid JSON
            console.log('🔎 Raw response:', text);

            const data = JSON.parse(text);
            if (data?.public_token) {
                console.log('✅ Retrieved fallback token:', data.public_token);
                // wait 200ms before calling exchange
                setTimeout(() => {
                    exchangePublicToken(data.public_token);
                }, 200);
            } else {
                console.warn('⚠️ No public_token found in fallback call.');
            }
        } catch (err) {
            console.error('❌ Fallback token fetch failed:', err.message);
        }
    };



    return (
        <View style={{ padding: 20 }}>
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            <Button title="Connect Bank" onPress={open} disabled={!ready} />
        </View>
    );
}
