// src/components/features/plaid/PlaidLink.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import * as plaidService from '@/services/plaidService';

export function PlaidLink({ onSuccess, onExit, onClose }) {
    const [loading, setLoading] = useState(true);
    const [linkToken, setLinkToken] = useState(null);
    const [error, setError] = useState(null);
    const [showWebView, setShowWebView] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchLinkToken = async () => {
            try {
                setLoading(true);
                const token = await plaidService.getLinkToken();
                setLinkToken(token);
            } catch (err) {
                console.error('Error fetching link token:', err);
                setError('Failed to initialize Plaid. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchLinkToken();
    }, []);

    const handleOpenPlaid = () => {
        setShowWebView(true);
    };

    const handleClose = () => {
        setShowWebView(false);
        if (onClose) onClose();
    };

    const handleMessage = async (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.action === 'EXIT') {
                setShowWebView(false);
                if (onExit) onExit();
            } else if (data.action === 'SUCCESS') {
                const { publicToken, metadata } = data;

                // Send the public token to our backend for exchange
                try {
                    await plaidService.exchangePublicToken(publicToken);
                    console.log('Successfully exchanged public token with backend');

                    setShowWebView(false);
                    if (onSuccess) onSuccess(publicToken, metadata);

                    // Navigate to dashboard after successful account linking
                    router.push('/(tabs)/dashboard');
                } catch (error) {
                    console.error('Error exchanging public token:', error);
                    setError('Failed to connect to your bank. Please try again later.');
                    setShowWebView(false);
                }
            }
        } catch (err) {
            console.error('Error handling message:', err);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="text-gray-600 dark:text-gray-300 mt-4">
                    Initializing Plaid...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center p-4">
                <Text className="text-red-600 dark:text-red-400 text-center mb-4">
                    {error}
                </Text>
                <Button
                    title="Try Again"
                    variant="primary"
                    onPress={() => {
                        setError(null);
                        setLoading(true);
                        plaidService.getLinkToken()
                            .then(token => {
                                setLinkToken(token);
                                setLoading(false);
                            })
                            .catch(err => {
                                console.error('Error retrying link token fetch:', err);
                                setError('Failed to initialize Plaid. Please try again later.');
                                setLoading(false);
                            });
                    }}
                />
            </View>
        );
    }

    if (!linkToken) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-600 dark:text-gray-300">
                    Unable to initialize Plaid Link.
                </Text>
            </View>
        );
    }

    // Only show button when WebView is not displayed
    if (!showWebView) {
        return (
            <View className="flex-1 justify-center items-center p-4">
                <Button
                    title="Connect Bank Account"
                    variant="primary"
                    onPress={handleOpenPlaid}
                />
            </View>
        );
    }

    // Create HTML to load Plaid Link in WebView
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
            <View className="bg-blue-600 dark:bg-blue-700 p-4 flex-row justify-between items-center">
                <Text className="text-white font-medium text-lg">Connect Your Bank</Text>
                <Button
                    title="Cancel"
                    variant="secondary"
                    size="sm"
                    onPress={handleClose}
                />
            </View>
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