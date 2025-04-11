// src/app/connect-bank.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Stack, useRouter } from 'expo-router';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { Ionicons } from '@expo/vector-icons';
import * as apiService from '@/services/apiService';

export default function ConnectBankScreen() {
    const router = useRouter();
    const [linkToken, setLinkToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showWebView, setShowWebView] = useState(false);

    // Fetch the link token from our backend
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

    // Handle WebView messages
    const handleMessage = async (event) => {
        try {
            console.log('Received message from WebView');
            const data = JSON.parse(event.nativeEvent.data);

            if (data.action === 'EXIT') {
                console.log('User exited Plaid Link flow');
                setShowWebView(false);
                router.back();
            } else if (data.action === 'SUCCESS') {
                console.log('Successfully connected bank account');
                const { publicToken, metadata } = data;

                try {
                    await apiService.exchangePublicToken(publicToken);
                    console.log('Public token exchanged successfully');

                    // Navigate back to dashboard
                    router.push('/(tabs)/dashboard');
                } catch (error) {
                    console.error('Error exchanging public token:', error);
                    setError(`Failed to connect bank: ${error.message}`);
                    setShowWebView(false);
                }
            }
        } catch (err) {
            console.error('Error handling WebView message:', err);
        }
    };

    // Show button to initiate Plaid Link
    if (!showWebView && !loading && linkToken) {
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
                        onPress={() => setShowWebView(true)}
                    >
                        <Text className="text-white font-medium">Continue to Bank Selection</Text>
                    </TouchableOpacity>
                </View>
            </ScreenLayout>
        );
    }

    // Show loading state
    if (loading) {
        return (
            <ScreenLayout>
                <Stack.Screen options={{ title: 'Connect Bank Account' }} />
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text className="text-gray-600 dark:text-gray-300 mt-4">
                        Initializing Plaid...
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

    // Show Plaid Link WebView
    if (showWebView && linkToken) {
        // HTML to load Plaid Link in WebView
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Plaid Link</title>
        <script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <script>
          const handler = Plaid.create({
            token: '${linkToken}',
            onSuccess: (public_token, metadata) => {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                action: 'SUCCESS',
                publicToken: public_token,
                metadata: metadata
              }));
            },
            onExit: (err, metadata) => {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                action: 'EXIT',
                error: err,
                metadata: metadata
              }));
            },
            onEvent: (eventName, metadata) => {
              console.log('Plaid event:', eventName);
            },
          });
          
          // Open immediately
          handler.open();
        </script>
      </body>
      </html>
    `;

        return (
            <View className="flex-1">
                <Stack.Screen options={{ title: 'Connect Your Bank' }} />
                <WebView
                    originWhitelist={['*']}
                    source={{ html }}
                    onMessage={handleMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    className="flex-1"
                />
            </View>
        );
    }

    // Fallback
    return (
        <ScreenLayout>
            <Stack.Screen options={{ title: 'Connect Bank Account' }} />
            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-600 dark:text-gray-300">
                    Unable to initialize Plaid Link.
                </Text>
                <TouchableOpacity
                    className="mt-4 py-3 px-6 bg-blue-600 dark:bg-blue-500 rounded-xl"
                    onPress={() => router.back()}
                >
                    <Text className="text-white font-medium">Go Back</Text>
                </TouchableOpacity>
            </View>
        </ScreenLayout>
    );
}