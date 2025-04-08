import { useEffect, useState } from 'react';
import { Platform, Button, Text, View, ActivityIndicator } from 'react-native';
import PlaidWebLink from '../modules/plaid/PlaidWeb';
import { create, open } from '../modules/plaid/PlaidNative';

export default function PlaidLink() {
    const [linkToken, setLinkToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Step 1: Fetch link_token from backend
    useEffect(() => {
        const getLinkToken = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/create_link_token');
                const data = await res.json();
                setLinkToken(data.link_token);
            } catch (err) {
                console.error('❌ Error fetching link token:', err);
            } finally {
                setLoading(false);
            }
        };

        getLinkToken();
    }, []);

    // Step 2: Handle success
    const handleSuccess = async (public_token, metadata) => {
        console.log('✅ Plaid success', metadata);

        try {
            const res = await fetch('http://localhost:3000/api/exchange_public_token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ public_token }),
            });

            const data = await res.json();
            console.log('✅ Access token response:', data);
        } catch (err) {
            console.error('❌ Error exchanging token:', err);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    if (!linkToken) {
        return <Text>❌ Failed to load link token</Text>;
    }

    // Step 3: Render platform-specific Plaid Link
    if (Platform.OS === 'web') {
        return (
            <PlaidWebLink
                token={linkToken}
                onSuccess={handleSuccess}
                onExit={(err) => console.warn('Plaid exit', err)}
            >
                Connect Bank Account
            </PlaidWebLink>
        );
    }

    // Native
    const handleOpen = async () => {
        const linkConfig = await create({ token: linkToken });
        open(linkConfig, { onSuccess: handleSuccess });
    };

    return (
        <View>
            <Button title="Connect Bank Account" onPress={handleOpen} />
        </View>
    );
}
