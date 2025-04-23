// src/app/plaid-link.jsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as plaidService from '@/services/plaidService';
import { usePlaid } from '@/store/PlaidContext';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'expo-router';
import { useDB } from '@/store/DBContext';

export default function PlaidLink() {
    const [linkToken, setLinkToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processingLink, setProcessingLink] = useState(false);
    const { setIsLinked, fetchAccounts, fetchTransactions } = usePlaid();
    const { userData, userToken } = useAuth();
    const { refetch: refetchDBData } = useDB(); // Get the refetch function from DBContext
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            try {
                // Pass the authenticated user information to the backend
                const token = await plaidService.getLinkToken(userToken, userData?.id);
                setLinkToken(token);
            } catch (err) {
                console.error('Error fetching Plaid link token:', err);
                Alert.alert(
                    'Connection Error',
                    'Unable to initialize bank connection. Please try again later.',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
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

                // Prevent duplicate processing
                if (processingLink) return;
                setProcessingLink(true);
                setLoading(true);

                try {
                    // Pass the authenticated user information when exchanging the token
                    const exchange = await plaidService.exchangePublicToken(
                        public_token,
                        userToken,
                        userData?.id
                    );

                    console.log('Token exchange successful:', exchange);
                    setIsLinked(true);

                    // Fetch data from Plaid
                    console.log('Fetching accounts from Plaid...');
                    await fetchAccounts();

                    console.log('Fetching transactions from Plaid...');
                    await fetchTransactions();

                    // Also refresh the DB data to make sure everything is up to date
                    console.log('Refreshing all financial data...');
                    await refetchDBData();

                    // Show success message
                    Alert.alert(
                        'Account Connected',
                        'Your bank account has been successfully connected and your financial data is ready to view.',
                        [
                            {
                                text: 'OK',
                                onPress: () => router.replace('/(tabs)/dashboard')
                            }
                        ]
                    );
                } catch (err) {
                    console.error('Error processing Plaid connection:', err);
                    Alert.alert(
                        'Connection Error',
                        'There was a problem connecting your account. Please try again.',
                        [{ text: 'OK', onPress: () => router.back() }]
                    );
                } finally {
                    setLoading(false);
                    setProcessingLink(false);
                }
            }
        } catch (e) {
            console.error('❌ Failed handling WebView message:', e);
            router.back();
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6"/>
                <Text className="mt-2">
                    {processingLink ?
                        "Processing your account. Please wait..." :
                        "Loading secure link..."}
                </Text>
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