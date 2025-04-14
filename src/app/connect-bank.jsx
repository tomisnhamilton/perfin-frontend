// src/app/connect-bank.jsx
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlaid } from '@/store/PlaidContext';
import { useRouter } from 'expo-router';

export default function ConnectBankScreen() {
    const { linkedStatus, isLoading } = usePlaid();
    const router = useRouter();

    const handleConnect = () => {
        router.push('/plaid-link');
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
        <View className="flex-1 justify-center items-center bg-white px-4">
            <Ionicons name="lock-closed-outline" size={48} color="black" />
            <Text className="text-xl font-semibold mt-4">Secure Bank Connection</Text>
            <Text className="text-center mt-2 text-gray-600">
                {linkedStatus
                    ? "Your account is already linked. You can view your data on the dashboard."
                    : "We use Plaid to securely link your bank account. Click below to get started."}
            </Text>

            <TouchableOpacity
                className="mt-6 bg-blue-600 px-6 py-3 rounded-full"
                onPress={handleConnect}
            >
                <Text className="text-white font-bold text-lg">
                    {linkedStatus ? "View Dashboard" : "Connect Bank"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
