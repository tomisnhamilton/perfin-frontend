// src/app/plaid-link.jsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as plaidService from '@/services/plaidService';
import { usePlaid } from '@/store/PlaidContext';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'expo-router';

export default function PlaidLink() {
    const [linkToken, setLinkToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const {setIsLinked, fetchAccounts, fetchTransactions} = usePlaid();
    const {userData, userToken} = useAuth();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            try {
                // Pass the authenticated user information to the backend
                const token = await plaidService.getLinkToken(userToken, userData?.id);
                setLinkToken(token);
            } catch (err) {
                console.error('Error fetching Plaid link token:', err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [userToken, userData]);

    const handleMessage = async (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.exit) {
                console.log('👋 User exited Plaid:', data.metadata);
                router.back();
                return;
            }

            const public_token = data.public_token;
            if (public_token) {
                console.log('✅ Got public_token:', public_token);

                // Pass the authenticated user information when exchanging the token
                const exchange = await plaidService.exchangePublicToken(
                    public_token,
                    userToken,
                    userData?.id
                );

                setIsLinked(true);
                await fetchAccounts();
                await fetchTransactions();
                router.replace('/(tabs)/dashboard');
            }
        } catch (e) {
            console.error('❌ Failed handling WebView message:', e);
            router.back();
        }
    };

    if (loading || !linkToken) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6"/>
                <Text className="mt-2">Loading secure link...</Text>
            </View>
        );
    }

    // Use local server URL for development (change in production)
    const plaidLinkUrl = `http://localhost:3000/plaid-link.html?token=${linkToken}`;
    console.log('Opening Plaid Link at URL:', plaidLinkUrl, '...');

    return (
        <WebView
            source={{uri: plaidLinkUrl}}
            onMessage={handleMessage}
            originWhitelist={['*']}
            javaScriptEnabled
            startInLoadingState
            style={{flex: 1}}
        />
    );
}