// src/app/plaid-link.jsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as plaidService from '@/services/plaidService';
import { usePlaid } from '@/store/PlaidContext';
import { useRouter } from 'expo-router';

export default function PlaidLink() {
    const [linkToken, setLinkToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setIsLinked, fetchAccounts, fetchTransactions } = usePlaid();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            try {
                console.log('Fetching Plaid link token...');
                const token = await plaidService.getLinkToken();
                console.log('Received token:', token);
                setLinkToken(token);
            } catch (err) {
                console.error('Error fetching Plaid link token:', err);
                setError('Failed to get link token. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleMessage = async (event) => {
        try {
            console.log('Received WebView message:', event.nativeEvent.data);
            const data = JSON.parse(event.nativeEvent.data);

            if (data.exit) {
                console.log('👋 User exited Plaid:', data.metadata);
                router.back();
                return;
            }

            const public_token = data.public_token;
            if (public_token) {
                console.log('✅ Got public_token:', public_token);
                setLoading(true);

                try {
                    await plaidService.exchangePublicToken(public_token);
                    setIsLinked(true);
                    await fetchAccounts();
                    await fetchTransactions();
                    router.replace('/(tabs)/dashboard');
                } catch (err) {
                    console.error('Error exchanging token:', err);
                    setError('Failed to link your account. Please try again.');
                    setLoading(false);
                }
            }
        } catch (e) {
            console.error('❌ Failed handling WebView message:', e);
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    if (error) {
        return (
            <View className="flex-1 justify-center items-center p-6">
                <Text className="text-red-600 font-bold text-lg mb-2">Error</Text>
                <Text className="text-center mb-4">{error}</Text>
                <Text
                    className="text-blue-600 font-semibold"
                    onPress={() => router.back()}
                >
                    Go Back
                </Text>
            </View>
        );
    }

    if (loading || !linkToken) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
                <Text className="mt-2">Loading secure link...</Text>
            </View>
        );
    }

    // Working with localhost in iOS simulator
    const plaidUrl = `http://localhost:3000/plaid-link.html?token=${linkToken}`;
    console.log('Opening Plaid Link at URL:', plaidUrl);

    return (
        <WebView
            source={{ uri: plaidUrl }}
            onMessage={handleMessage}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            style={{ flex: 1 }}
            renderLoading={() => (
                <View className="absolute inset-0 flex-1 justify-center items-center bg-white">
                    <ActivityIndicator size="large" />
                    <Text className="mt-2">Loading secure bank connection...</Text>
                </View>
            )}
            onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView error:', nativeEvent);
                setError(`Failed to load: ${nativeEvent.description}`);
            }}
        />
    );
}