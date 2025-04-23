// src/app/connect-bank.jsx
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlaid } from '@/store/PlaidContext';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'expo-router';

export default function ConnectBankScreen() {
    const { linkedStatus, isLoading } = usePlaid();
    const { userData, isAuthenticated } = useAuth();
    const router = useRouter();

    const handleConnect = () => {
        if (!isAuthenticated) {
            // If not authenticated, redirect to login
            router.replace('/login');
            return;
        }

        // Navigate to Plaid Link
        router.push('/plaid-link');
    };

    const handleViewAccounts = () => {
        router.push('/(tabs)/accounts');
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-2 text-gray-800 dark:text-gray-200">Checking account status...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900 px-4">
            <Ionicons name="lock-closed-outline" size={48} color="#3b82f6" />

            <Text className="text-xl font-semibold mt-4 text-gray-800 dark:text-white">
                Secure Bank Connection
            </Text>

            <Text className="text-center mt-2 text-gray-600 dark:text-gray-300">
                {linkedStatus
                    ? "Your account is already linked. You can view your financial data or link additional accounts."
                    : "We use Plaid to securely link your bank account. Your credentials are never stored on our servers."}
            </Text>

            {linkedStatus ? (
                <View className="w-full mt-6 space-y-3">
                    <TouchableOpacity
                        className="bg-blue-600 px-6 py-3 rounded-xl w-full"
                        onPress={handleViewAccounts}
                    >
                        <Text className="text-white font-bold text-center text-lg">
                            View My Accounts
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-gray-200 dark:bg-gray-700 px-6 py-3 rounded-xl w-full"
                        onPress={handleConnect}
                    >
                        <Text className="text-gray-800 dark:text-white font-bold text-center text-lg">
                            Link Another Account
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    className="mt-6 bg-blue-600 px-6 py-3 rounded-xl w-full"
                    onPress={handleConnect}
                >
                    <Text className="text-white font-bold text-center text-lg">
                        Connect Bank Account
                    </Text>
                </TouchableOpacity>
            )}

            <View className="mt-8 bg-blue-50 dark:bg-blue-900/50 p-4 rounded-xl w-full">
                <Text className="text-sm text-gray-600 dark:text-gray-300">
                    🔒 Your financial data is encrypted and secure.
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    📊 Connect your accounts to track spending, monitor balances, and more.
                </Text>
            </View>
        </View>
    );
}