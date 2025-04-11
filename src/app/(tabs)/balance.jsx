// src/app/(tabs)/balance.jsx
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";

// Mock accounts data - we'll replace this with real data later
const ACCOUNTS = [
    {
        id: "1",
        name: "Main Checking",
        balance: 3250.75,
        type: "checking",
        color: "blue",
        icon: "card-outline",
    },
    {
        id: "2",
        name: "Savings",
        balance: 12780.50,
        type: "savings",
        color: "green",
        icon: "save-outline",
    },
    {
        id: "3",
        name: "Investment",
        balance: 5430.25,
        type: "investment",
        color: "purple",
        icon: "trending-up",
    },
    {
        id: "4",
        name: "Credit Card",
        balance: -950.30,
        type: "credit",
        color: "red",
        icon: "card-outline",
    },
];

// Monthly expense categories
const EXPENSE_CATEGORIES = [
    { name: "Housing", amount: 1200, color: "blue", percentage: 40 },
    { name: "Food", amount: 450, color: "green", percentage: 15 },
    { name: "Transportation", amount: 300, color: "purple", percentage: 10 },
    { name: "Entertainment", amount: 200, color: "yellow", percentage: 6.67 },
    { name: "Utilities", amount: 180, color: "red", percentage: 6 },
    { name: "Other", amount: 670, color: "gray", percentage: 22.33 },
];

export default function BalanceScreen() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === "dark";
    const [selectedPeriod, setSelectedPeriod] = useState("This Month");
    const router = useRouter();

    // Calculate total balance
    const totalBalance = ACCOUNTS.reduce((sum, account) => sum + account.balance, 0);

    // Handler for connecting bank account
    const handleConnectBank = () => {
        console.log('Connect Bank button pressed');
        router.push('/connect-bank');
    };

    // Get icon color based on account color and theme
    const getIconColor = (color) => {
        const colorMap = {
            blue: isDarkMode ? "#93c5fd" : "#3b82f6",
            green: isDarkMode ? "#86efac" : "#22c55e",
            purple: isDarkMode ? "#d8b4fe" : "#8b5cf6",
            red: isDarkMode ? "#fca5a5" : "#ef4444",
            yellow: isDarkMode ? "#fde68a" : "#f59e0b",
            gray: isDarkMode ? "#9ca3af" : "#6b7280",
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
            gray: isDarkMode ? "bg-gray-700" : "bg-gray-200",
        };
        return colorMap[color] || colorMap.blue;
    };

    // Get progress bar background color
    const getProgressBgColor = (color) => {
        const colorMap = {
            blue: isDarkMode ? "bg-blue-600" : "bg-blue-500",
            green: isDarkMode ? "bg-green-600" : "bg-green-500",
            purple: isDarkMode ? "bg-purple-600" : "bg-purple-500",
            red: isDarkMode ? "bg-red-600" : "bg-red-500",
            yellow: isDarkMode ? "bg-yellow-600" : "bg-yellow-500",
            gray: isDarkMode ? "bg-gray-600" : "bg-gray-500",
        };
        return colorMap[color] || colorMap.blue;
    };

    return (
        <ScreenLayout>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Balance overview */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Balance
                    </Text>
                    <Text className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        ${totalBalance.toFixed(2)}
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400">
                        Total across all accounts
                    </Text>
                </View>

                {/* Accounts list */}
                <Text className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                    Your Accounts
                </Text>
                {ACCOUNTS.map((account) => (
                    <TouchableOpacity
                        key={account.id}
                        className="flex-row items-center p-4 mb-3 bg-white dark:bg-gray-800 rounded-xl"
                        onPress={() => console.log(`Account ${account.id} pressed`)}
                    >
                        <View className={`h-12 w-12 rounded-full ${getIconBgColor(account.color)} items-center justify-center mr-4`}>
                            <Ionicons
                                name={account.icon}
                                size={22}
                                color={getIconColor(account.color)}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="font-medium text-gray-800 dark:text-white">
                                {account.name}
                            </Text>
                            <Text className="text-gray-500 dark:text-gray-400 text-sm capitalize">
                                {account.type}
                            </Text>
                        </View>
                        <Text
                            className={`font-bold ${
                                account.balance >= 0
                                    ? "text-gray-800 dark:text-white"
                                    : "text-red-600 dark:text-red-400"
                            }`}
                        >
                            ${Math.abs(account.balance).toFixed(2)}
                        </Text>
                    </TouchableOpacity>
                ))}

                {/* Period selector */}
                <View className="flex-row my-6">
                    {["This Month", "Last Month", "3 Months", "Year"].map((period) => (
                        <TouchableOpacity
                            key={period}
                            className={`mr-2 py-2 px-4 rounded-full ${
                                selectedPeriod === period
                                    ? "bg-blue-600 dark:bg-blue-500"
                                    : "bg-gray-200 dark:bg-gray-700"
                            }`}
                            onPress={() => setSelectedPeriod(period)}
                        >
                            <Text
                                className={`font-medium ${
                                    selectedPeriod === period
                                        ? "text-white"
                                        : "text-gray-800 dark:text-gray-100"
                                }`}
                            >
                                {period}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Expense categories */}
                <Text className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                    Expense Breakdown
                </Text>
                <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
                    {EXPENSE_CATEGORIES.map((category) => (
                        <View key={category.name} className="mb-4">
                            <View className="flex-row justify-between items-center mb-1">
                                <Text className="text-gray-800 dark:text-white font-medium">
                                    {category.name}
                                </Text>
                                <Text className="text-gray-800 dark:text-white font-medium">
                                    ${category.amount.toFixed(2)}
                                </Text>
                            </View>
                            <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <View
                                    className={`h-full ${getProgressBgColor(category.color)}`}
                                    style={{ width: `${category.percentage}%` }}
                                />
                            </View>
                            <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                {category.percentage.toFixed(1)}%
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Add account button */}
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
                        Add Account
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </ScreenLayout>
    );
}