// src/app/(tabs)/accounts.jsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { usePlaid } from "@/store/PlaidContext";

export default function AccountsScreen() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === "dark";
    const router = useRouter();
    const [error, setError] = useState(null);

    // Wrap the usePlaid hook in a try/catch block to handle errors gracefully
    let plaidData = { isLoading: true, accounts: [], linkedStatus: false, refreshData: () => {} };

    try {
        plaidData = usePlaid();
    } catch (err) {
        console.error("Error using PlaidContext:", err);
        setError("Unable to access account data. Please restart the app.");
    }

    const { isLoading, accounts, linkedStatus, refreshData } = plaidData;

    // Refresh data when screen is focused
    useEffect(() => {
        try {
            refreshData();
        } catch (err) {
            console.error("Error refreshing data:", err);
            setError("Failed to load account data. Please try again.");
        }
    }, []);

    const handleConnectBank = () => {
        router.push('/connect-bank');
    };

    // Get icon based on account type
    const getAccountIcon = (type, subtype) => {
        if (type === 'credit') return 'card-outline';
        if (type === 'loan') return 'cash-outline';
        if (type === 'investment') return 'trending-up';
        if (subtype === 'checking') return 'wallet-outline';
        if (subtype === 'savings') return 'save-outline';
        return 'wallet-outline';
    };

    // Get color based on account type
    const getAccountColor = (type) => {
        if (type === 'credit') return 'red';
        if (type === 'loan') return 'yellow';
        if (type === 'investment') return 'purple';
        if (type === 'depository') return 'blue';
        return 'green';
    };

    // Get icon color based on account color and theme
    const getIconColor = (color) => {
        const colorMap = {
            blue: isDarkMode ? "#93c5fd" : "#3b82f6",
            green: isDarkMode ? "#86efac" : "#22c55e",
            purple: isDarkMode ? "#d8b4fe" : "#8b5cf6",
            red: isDarkMode ? "#fca5a5" : "#ef4444",
            yellow: isDarkMode ? "#fde68a" : "#f59e0b",
        };
        return colorMap[color] || colorMap.blue;
    };

    // Get background color for icon container
    const getIconBgColor = (color) => {
        const colorMap = {
            blue: isDarkMode ? "bg-blue-800" : "bg-blue-100",
            green: isDarkMode ? "bg-green-800" : "bg-green-100",
            purple: isDarkMode ? "bg-purple-800" : "bg-purple-100",
            red: isDarkMode ? "bg-red-800" : "bg-red-100",
            yellow: isDarkMode ? "bg-yellow-800" : "bg-yellow-100",
        };
        return colorMap[color] || colorMap.blue;
    };

    // Format account balance
    const formatBalance = (balance, type) => {
        const formattedBalance = Math.abs(balance).toFixed(2);
        // Negatives for credit accounts mean you have credit available, not debt
        const isNegative = type === 'credit' ? balance > 0 : balance < 0;
        return isNegative ? `-$${formattedBalance}` : `$${formattedBalance}`;
    };

    // Calculate total balance
    const totalBalance = accounts.reduce((sum, account) => {
        // For credit accounts, negative means available credit (not counted in balance)
        // Only count negative (amount you owe) for credit accounts
        if (account.type === 'credit') {
            return sum + (account.balance > 0 ? account.balance : 0);
        }
        return sum + account.balance;
    }, 0);

    // If there's an error accessing the PlaidContext
    if (error) {
        return (
            <ScreenLayout>
                <View className="flex-1 justify-center items-center p-4">
                    <Text className="text-red-600 dark:text-red-400 text-center mb-4">
                        {error}
                    </Text>
                    <TouchableOpacity
                        className="bg-blue-600 dark:bg-blue-500 py-3 px-6 rounded-xl"
                        onPress={() => {
                            setError(null);
                            try {
                                refreshData();
                            } catch (err) {
                                console.error("Error refreshing data:", err);
                                setError("Failed to load account data. Please try again.");
                            }
                        }}
                    >
                        <Text className="text-white font-medium">Retry</Text>
                    </TouchableOpacity>
                </View>
            </ScreenLayout>
        );
    }

    if (isLoading) {
        return (
            <ScreenLayout>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text className="text-gray-600 dark:text-gray-300 mt-4">
                        Loading your accounts...
                    </Text>
                </View>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout>
            {/* Balance overview */}
            <View className="mb-6">
                <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Accounts
                </Text>
                <Text className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    ${linkedStatus ? totalBalance.toFixed(2) : "0.00"}
                </Text>
                <Text className="text-gray-500 dark:text-gray-400">
                    Total across all accounts
                </Text>
            </View>

            {/* Accounts list */}
            {linkedStatus && accounts.length > 0 ? (
                <FlatList
                    data={accounts}
                    keyExtractor={(item) => item.id || `account-${Math.random()}`}
                    renderItem={({ item }) => {
                        const accountColor = getAccountColor(item.type);
                        const accountIcon = getAccountIcon(item.type, item.subtype);

                        return (
                            <TouchableOpacity
                                className="flex-row items-center p-4 mb-3 bg-white dark:bg-gray-800 rounded-xl"
                                onPress={() => console.log(`Account ${item.id} pressed`)}
                            >
                                <View className={`h-12 w-12 rounded-full ${getIconBgColor(accountColor)} items-center justify-center mr-4`}>
                                    <Ionicons
                                        name={accountIcon}
                                        size={22}
                                        color={getIconColor(accountColor)}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-medium text-gray-800 dark:text-white">
                                        {item.name}
                                    </Text>
                                    <Text className="text-gray-500 dark:text-gray-400 text-sm capitalize">
                                        {item.subtype || item.type} • {item.institution_name || 'Bank'}
                                    </Text>
                                </View>
                                <Text
                                    className={`font-bold ${
                                        (item.type === 'credit' && item.balance > 0) ||
                                        (item.type !== 'credit' && item.balance < 0)
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-gray-800 dark:text-white"
                                    }`}
                                >
                                    {formatBalance(item.balance, item.type)}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={
                        <View className="items-center py-8 bg-white dark:bg-gray-800 rounded-xl">
                            <Text className="text-gray-500 dark:text-gray-400">
                                No accounts found
                            </Text>
                        </View>
                    }
                    ListHeaderComponent={
                        <Text className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                            Your Accounts
                        </Text>
                    }
                    ListFooterComponent={
                        <TouchableOpacity
                            className="flex-row items-center justify-center py-3 mb-6 bg-blue-50 dark:bg-gray-800 border border-dashed border-blue-400 dark:border-blue-700 rounded-xl"
                            onPress={handleConnectBank}
                        >
                            <Ionicons
                                name="add-circle-outline"
                                size={20}
                                color={isDarkMode ? "#93c5fd" : "#3b82f6"}
                            />
                            <Text className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                                Link Another Account
                            </Text>
                        </TouchableOpacity>
                    }
                />
            ) : (
                <View className="flex-1 justify-center items-center px-4">
                    <View className="bg-blue-50 dark:bg-blue-900 p-6 rounded-xl items-center mb-6 w-full">
                        <Ionicons
                            name="wallet-outline"
                            size={40}
                            color={isDarkMode ? "#93c5fd" : "#3b82f6"}
                        />
                        <Text className="text-xl font-bold text-gray-800 dark:text-white mt-4 text-center">
                            No Accounts Linked
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-300 text-center mt-2">
                            Connect your bank accounts to see your balances and transactions in one place.
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
            )}
        </ScreenLayout>
    );
}