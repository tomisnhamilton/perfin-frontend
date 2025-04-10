import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

// Mock transaction data
const TRANSACTIONS = [
    {
        id: "1",
        title: "Grocery Shopping",
        category: "Food",
        amount: -56.80,
        date: "April 8, 2025",
        icon: "cart-outline",
        color: "purple",
    },
    {
        id: "2",
        title: "Salary Deposit",
        category: "Income",
        amount: 1200.00,
        date: "April 5, 2025",
        icon: "cash-outline",
        color: "blue",
    },
    {
        id: "3",
        title: "Netflix Subscription",
        category: "Entertainment",
        amount: -12.99,
        date: "April 3, 2025",
        icon: "film-outline",
        color: "red",
    },
    {
        id: "4",
        title: "Gas Station",
        category: "Transportation",
        amount: -45.50,
        date: "April 2, 2025",
        icon: "car-outline",
        color: "green",
    },
    {
        id: "5",
        title: "Freelance Payment",
        category: "Income",
        amount: 350.00,
        date: "April 1, 2025",
        icon: "briefcase-outline",
        color: "blue",
    },
];

// Filter options
const FILTERS = ["All", "Income", "Expense"];

export default function TransactionsScreen() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === "dark";
    const [activeFilter, setActiveFilter] = useState("All");

    // Filter transactions based on active filter
    const filteredTransactions = TRANSACTIONS.filter((transaction) => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Income") return transaction.amount > 0;
        if (activeFilter === "Expense") return transaction.amount < 0;
        return true;
    });

    // Get icon color based on transaction color and theme
    const getIconColor = (color: string) => {
        const colorMap = {
            purple: isDarkMode ? "#d8b4fe" : "#8b5cf6",
            blue: isDarkMode ? "#93c5fd" : "#3b82f6",
            red: isDarkMode ? "#fca5a5" : "#ef4444",
            green: isDarkMode ? "#86efac" : "#22c55e",
        };
        return colorMap[color as keyof typeof colorMap] || colorMap.blue;
    };

    // Get background color for icon container
    const getIconBgColor = (color: string) => {
        const colorMap = {
            purple: isDarkMode ? "bg-purple-800" : "bg-purple-100",
            blue: isDarkMode ? "bg-blue-800" : "bg-blue-100",
            red: isDarkMode ? "bg-red-800" : "bg-red-100",
            green: isDarkMode ? "bg-green-800" : "bg-green-100",
        };
        return colorMap[color as keyof typeof colorMap] || colorMap.blue;
    };

    // Transaction item renderer
    const renderItem = ({ item }: { item: typeof TRANSACTIONS[0] }) => (
        <TouchableOpacity
            className="flex-row items-center p-4 mb-3 bg-white dark:bg-gray-800 rounded-xl"
            onPress={() => console.log(`Transaction ${item.id} pressed`)}
        >
            <View className={`h-10 w-10 rounded-full ${getIconBgColor(item.color)} items-center justify-center mr-3`}>
                <Ionicons
                    name={item.icon as any}
                    size={18}
                    color={getIconColor(item.color)}
                />
            </View>
            <View className="flex-1">
                <Text className="font-medium text-gray-800 dark:text-white">
                    {item.title}
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    {item.category} • {item.date}
                </Text>
            </View>
            <Text
                className={`font-medium ${
                    item.amount > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                }`}
            >
                {item.amount > 0 ? "+" : ""}{item.amount.toFixed(2)}
            </Text>
        </TouchableOpacity>
    );

    return (
        <ScreenLayout scrollable={false} withPadding={false}>
            {/* Header with filters */}
            <View className="px-4 py-4 bg-gray-50 dark:bg-gray-900">
                <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Transactions
                </Text>

                <View className="flex-row mb-4">
                    {FILTERS.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            className={`mr-2 py-2 px-4 rounded-full ${
                                activeFilter === filter
                                    ? "bg-blue-600 dark:bg-blue-500"
                                    : "bg-gray-200 dark:bg-gray-700"
                            }`}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text
                                className={`font-medium ${
                                    activeFilter === filter
                                        ? "text-white"
                                        : "text-gray-800 dark:text-gray-100"
                                }`}
                            >
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Transaction list */}
            <FlatList
                data={filteredTransactions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="items-center justify-center py-8">
                        <Text className="text-gray-500 dark:text-gray-400">
                            No transactions found
                        </Text>
                    </View>
                }
            />

            {/* Add transaction button */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 dark:bg-blue-500 items-center justify-center"
                onPress={() => console.log("Add transaction pressed")}
            >
                <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
        </ScreenLayout>
    );
}