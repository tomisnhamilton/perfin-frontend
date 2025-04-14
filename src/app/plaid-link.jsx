import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as plaidService from '@/services/plaidService';
import { usePlaid } from '@/store/PlaidContext';
import { useRouter } from 'expo-router';

export default function PlaidLink() {
    const [linkToken, setLinkToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const { setIsLinked, fetchAccounts, fetchTransactions } = usePlaid();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            try {
                const token = await plaidService.getLinkToken();
                setLinkToken(token);
            } catch (err) {
                console.error('Error fetching Plaid link token:', err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleMessage = async (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.exit) {
                console.log('👋 User exited Plaid:', data.metadata);
                return;
            }

            const public_token = data.public_token;
            if (public_token) {
                console.log('✅ Got public_token:', public_token);
                await plaidService.exchangePublicToken(public_token);
                setIsLinked(true);
                await fetchAccounts();
                await fetchTransactions();
                router.replace('/dashboard');
            }
        } catch (e) {
            console.error('❌ Failed handling WebView message:', e);
        }
    };

    if (loading || !linkToken) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
                <Text className="mt-2">Loading secure link...</Text>
            </View>
        );
    }

    return (
        <WebView
            source={{ uri: `http://localhost:3000/plaid-link.html?token=${linkToken}` }}
            onMessage={handleMessage}
            originWhitelist={['*']}
            javaScriptEnabled
            startInLoadingState
            style={{ flex: 1 }}
        />

    );
}
