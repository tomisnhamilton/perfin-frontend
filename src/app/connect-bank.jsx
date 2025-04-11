// src/app/connect-bank.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as apiService from '@/services/apiService';

export default function ConnectBankScreen() {
    const router = useRouter();
    const [linkToken, setLinkToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingToken, setProcessingToken] = useState(false);

    // Fetch link token on component mount
    useEffect(() => {
        async function fetchLinkToken() {
            try {
                setLoading(true);
                const token = await apiService.getLinkToken();
                setLinkToken(token);
            } catch (err) {
                console.error('Error fetching link token:', err);
                setError(`Failed to initialize Plaid: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }

        fetchLinkToken();
    }, []);

    // Function to handle opening Plaid in Web Only mode
    const openPlaidLink = async () => {
        if (!linkToken) {
            setError('No link token available');
            return;
        }

        try {
            // The URL for Plaid Link Web Only mode
            const plaidUrl = `https://cdn.plaid.com/link/v2/stable/link.html?token=${linkToken}`;

            console.log('Opening Plaid Link Web Only URL:', plaidUrl);

            // Open the URL in a web browser and wait for result
            const result = await WebBrowser.openAuthSessionAsync(plaidUrl);

            console.log('WebBrowser result:', result.type);

            // Handle the response based on the result type
            if (result.type === 'success') {
                // Extract public_token from the URL
                try {
                    const url = new URL(result.url);
                    const publicToken = url.searchParams.get('public_token');

                    if (publicToken) {
                        console.log('Public token received, handling success');
                        await handleSuccess(publicToken);
                    } else {
                        console.log('No public token found in result URL');
                        setError('No public token received from Plaid');
                    }
                } catch (err) {
                    console.error('Error parsing result URL:', err);
                    setError(`Failed to process Plaid response: ${err.message}`);
                }
            } else if (result.type === 'cancel') {
                console.log('User canceled the Plaid flow');
            } else {
                console.log('WebBrowser session ended with type:', result.type);
            }
        } catch (err) {
            console.error('Error opening Plaid link:', err);
            Alert.alert(
                'Connection Error',
                'Failed to connect to Plaid. Please try again later.',
                [{ text: 'OK' }]
            );
            setError(`Failed to connect to Plaid: ${err.message}`);
        }
    };

    // Handle successful link
    const handleSuccess = async (publicToken) => {
        try {
            setProcessingToken(true);
            console.log('Processing public token...');

            // Exchange the public token
            await apiService.exchangePublicToken(publicToken);
            console.log('Public token exchanged successfully');

            // Navigate back to dashboard
            router.push('/(tabs)/dashboard');
        } catch (error) {
            console.error('Error exchanging public token:', error);
            setError(`Failed to connect bank: ${error.message}`);
        } finally {
            setProcessingToken(false);
        }
    };

    // Show loading state
    if (loading || processingToken) {
        return (
            <ScreenLayout>
                <Stack.Screen options={{ title: 'Connect Bank Account' }} />
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text className="text-gray-600 dark:text-gray-300 mt-4">
                        {processingToken ? 'Connecting your account...' : 'Initializing Plaid...'}
                    </Text>
                </View>
            </ScreenLayout>
        );
    }

    // Show error state
    if (error) {
        return (
            <ScreenLayout>
                <Stack.Screen options={{ title: 'Connect Bank Account' }} />
                <View className="flex-1 justify-center items-center p-4">
                    <Text className="text-red-600 dark:text-red-400 text-center mb-4">
                        {error}
                    </Text>
                    <TouchableOpacity
                        className="py-3 px-6 bg-blue-600 dark:bg-blue-500 rounded-xl"
                        onPress={() => router.back()}
                    >
                        <Text className="text-white font-medium">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </ScreenLayout>
        );
    }

    // Show connect button
    return (
        <ScreenLayout>
            <Stack.Screen options={{ title: 'Connect Bank Account' }} />
            <View className="flex-1 justify-center items-center p-4">
                <View className="bg-blue-50 dark:bg-blue-900 p-6 rounded-xl items-center mb-6 w-full">
                    <Ionicons name="wallet-outline" size={40} color="#3b82f6" />
                    <Text className="text-xl font-bold text-gray-800 dark:text-white mt-4 text-center">
                        Connect Your Bank
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-300 text-center mt-2">
                        Link your bank account to track your transactions and balances in one place.
                    </Text>
                </View>

                <TouchableOpacity
                    className="py-3 px-6 bg-blue-600 dark:bg-blue-500 rounded-xl w-full items-center"
                    onPress={openPlaidLink}
                >
                    <Text className="text-white font-medium">Connect Bank Account</Text>
                </TouchableOpacity>
            </View>
        </ScreenLayout>
    );
}