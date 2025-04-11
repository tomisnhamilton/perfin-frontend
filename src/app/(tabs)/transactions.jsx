// src/app/(tabs)/transactions.jsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";

export default function TransactionsScreen() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === "dark";
    const router = useRouter();

    const handleConnectBank = () => {
        console.log('Connect Bank button pressed');
        router.push('/connect-bank');
    };

    return (
        <ScreenLayout>
            <View className="p-4">
                <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Transactions
                </Text>
            </View>

            <View className="flex-1 justify-center items-center p-4">
                <View className="bg-blue-50 dark:bg-blue-900 p-6 rounded-xl items-center mb-6 w-full">
                    <Ionicons
                        name="list-outline"
                        size={40}
                        color={isDarkMode ? "#93c5fd" : "#3b82f6"}
                    />
                    <Text className="text-xl font-bold text-gray-800 dark:text-white mt-4 text-center">
                        No Transactions
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-300 text-center mt-2">
                        Connect your bank account to see your transactions here.
                    </Text>
                </View>

                <TouchableOpacity
                    className="flex-row items-center justify-center py-3 px-4 bg-blue-600 dark:bg-blue-500 rounded-xl w-full"
                    onPress={handleConnectBank}
                >
                    <Ionicons
                        name="add-circle-outline"
                        size={20}
                        color="white"
                    />
                    <Text className="ml-2 text-white font-medium">
                        Connect Bank Account
                    </Text>
                </TouchableOpacity>
            </View>
        </ScreenLayout>
    );
}