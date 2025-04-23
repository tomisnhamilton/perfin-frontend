// src/app/plaid-link.jsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as plaidService from '@/services/plaidService';
import { usePlaid } from '@/store/PlaidContext';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'expo-router';

export default function PlaidLink() {
    const [linkToken, setLinkToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setIsLinked, refreshData } = usePlaid();
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    // Check if user is authenticated before proceeding
    useEffect(() => {
        if (!isAuthenticated) {
            Alert.alert(
                'Login Required',
                'You need to log in before connecting your bank account.',
                [
                    {
                        text: 'Log In',
                        onPress: () => router.replace('/auth/login')
                    },
                    {
                        text: 'Cancel',
                        onPress: () => router.back(),
                        style: 'cancel'
                    }
                ]
            );
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const init = async () => {
            if (!isAuthenticated) return;

            try {
                console.log('Fetching Plaid link token for user:', user.id);
                const token = await plaidService.getLinkToken(user.id);
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
    }, [isAuthenticated, user]);

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
                    // Pass the user ID to associate the item with the user
                    await plaidService.exchangePublicToken(public_token, user.id);
                    setIsLinked(true);

                    // Delay slightly to ensure Plaid has processed the data
                    setTimeout(async () => {
                        await refreshData();
                        router.replace('/(tabs)/dashboard');
                    }, 500);
                } catch (err) {
                    console.error('Error exchanging token:', err);
                    setError('Failed to link your account. Please try again.');
                    setLoading(false);

                    Alert.alert(
                        'Connection Error',
                        'There was an error connecting to your bank. Please try again later.',
                        [{ text: 'OK' }]
                    );
                }
            }
        } catch (e) {
            console.error('❌ Failed handling WebView message:', e);
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setError(null);
        setLoading(true);

        const init = async () => {
            if (!isAuthenticated) return;

            try {
                const token = await plaidService.getLinkToken(user.id);
                console.log('Received new token:', token);
                setLinkToken(token);
            } catch (err) {
                console.error('Error fetching Plaid link token:', err);
                setError('Failed to get link token. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        init();
    };

    if (!isAuthenticated) {
        return (
            <View className="flex-1 justify-center items-center p-6">
                <Text className="text-xl font-bold mb-4">Login Required</Text>
                <Text className="text-center mb-6">You need to log in before connecting your bank account.</Text>
                <TouchableOpacity
                    className="bg-blue-500 px-5 py-2 rounded-md"
                    onPress={() => router.push('/auth/login')}
                >
                    <Text className="text-white font-medium">Go to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center p-6">
                <Text className="text-red-600 font-bold text-lg mb-2">Error</Text>
                <Text className="text-center mb-4">{error}</Text>
                <View className="flex-row">
                    <TouchableOpacity
                        className="bg-blue-500 px-5 py-2 rounded-md mr-3"
                        onPress={handleRetry}
                    >
                        <Text className="text-white font-medium">Try Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-gray-300 px-5 py-2 rounded-md"
                        onPress={() => router.back()}
                    >
                        <Text className="text-gray-700 font-medium">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (loading || !linkToken) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#4299e1" />
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
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            style={{ flex: 1 }}
            renderLoading={() => (
                <View className="absolute inset-0 flex-1 justify-center items-center bg-white">
                    <ActivityIndicator size="large" color="#4299e1" />
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