// src/app/connect-bank.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlaid } from '@/store/PlaidContext';
import { useRouter } from 'expo-router';
import { checkServerConnection } from '@/utils/debugHelper';

export default function ConnectBankScreen() {
    const { linkedStatus, isLoading } = usePlaid();
    const router = useRouter();
    const [checking, setChecking] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(null);

    const handleConnect = () => {
        router.push('/plaid-link');
    };

    const handleDiagnostics = () => {
        router.push('/webview-test');
    };

    const checkConnection = async () => {
        setChecking(true);
        try {
            const result = await checkServerConnection();
            setConnectionStatus(result);

            if (result.success) {
                Alert.alert(
                    "Connection Successful",
                    `Server responded in ${result.time}ms with status: ${result.status}`,
                    [{ text: "OK" }]
                );
            } else {
                Alert.alert(
                    "Connection Failed",
                    `Error: ${result.error}`,
                    [{ text: "OK" }]
                );
            }
        } catch (error) {
            console.error('Connection check error:', error);
            setConnectionStatus({ success: false, error: error.message });
            Alert.alert("Error", `Failed to check connection: ${error.message}`);
        } finally {
            setChecking(false);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" />
                <Text className="mt-2">Checking account status...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-white px-4">
            <View className="items-center py-8">
                <Ionicons name="lock-closed-outline" size={48} color="black" />
                <Text className="text-xl font-semibold mt-4">Secure Bank Connection</Text>
                <Text className="text-center mt-2 text-gray-600">
                    {linkedStatus
                        ? "Your account is already linked. You can view your data on the dashboard."
                        : "We use Plaid to securely link your bank account. Click below to get started."}
                </Text>

                <TouchableOpacity
                    className="mt-6 bg-blue-600 px-6 py-3 rounded-full w-full"
                    onPress={handleConnect}
                >
                    <Text className="text-white font-bold text-lg text-center">
                        {linkedStatus ? "View Dashboard" : "Connect Bank"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Debugging section */}
            <View className="mt-8 border-t border-gray-200 pt-6">
                <Text className="text-lg font-semibold mb-4">Troubleshooting</Text>

                <TouchableOpacity
                    className="mb-4 bg-gray-200 px-4 py-3 rounded-md flex-row items-center justify-between"
                    onPress={checkConnection}
                    disabled={checking}
                >
                    <Text className="text-gray-800 font-medium">Check Server Connection</Text>
                    {checking ? (
                        <ActivityIndicator size="small" color="#4B5563" />
                    ) : (
                        <Ionicons name="server-outline" size={20} color="#4B5563" />
                    )}
                </TouchableOpacity>

                {connectionStatus && (
                    <View className="mb-4 p-3 rounded-md bg-gray-100">
                        <Text className="font-medium">
                            Status: {connectionStatus.success ? '✅ Connected' : '❌ Failed'}
                        </Text>
                        {connectionStatus.success ? (
                            <Text>Response time: {connectionStatus.time}ms</Text>
                        ) : (
                            <Text>Error: {connectionStatus.error}</Text>
                        )}
                    </View>
                )}

                <TouchableOpacity
                    className="mb-4 bg-gray-200 px-4 py-3 rounded-md flex-row items-center justify-between"
                    onPress={handleDiagnostics}
                >
                    <Text className="text-gray-800 font-medium">WebView Diagnostics</Text>
                    <Ionicons name="bug-outline" size={20} color="#4B5563" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}