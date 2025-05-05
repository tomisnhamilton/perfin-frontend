// src/components/ui/RecurringTransactions/RecurringTransactionsScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import { useDB } from '@/store/DBContext';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

// Format currency consistently
const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
    return `$${Math.abs(parseFloat(amount)).toFixed(2)}`;
};

// Format frequency for display
const formatFrequency = (frequency) => {
    if (!frequency) return 'Unknown';

    const formatted = frequency.toLowerCase()
        .replace('_', ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

    return formatted;
};

// Helper function to safely extract amount from the average_amount object or value
const extractAmount = (amountField) => {
    if (!amountField) return 0;

    // If it's already a number, return it
    if (typeof amountField === 'number') return amountField;

    // If it's an object with amount property, return that
    if (amountField.amount !== undefined) return parseFloat(amountField.amount);

    // Try to parse it as a number if it's a string
    if (typeof amountField === 'string') {
        const parsed = parseFloat(amountField);
        return isNaN(parsed) ? 0 : parsed;
    }

    // Default fallback
    return 0;
};

export default function RecurringTransactionsScreen() {
    const { recurring, loading, refetch } = useDB();
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('expenses'); // expenses, income - changed default to expenses
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    // Safe access to data
    const safeInflow = recurring?.inflow_streams || [];
    const safeOutflow = recurring?.outflow_streams || [];

    // If still loading, show a loading indicator
    if (loading && !refreshing) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text className="mt-4 text-gray-600">Loading your recurring transactions...</Text>
            </View>
        );
    }

    // Calculate total monthly outflow
    const monthlyOutflow = safeOutflow.reduce((sum, stream) => {
        if (!stream) return sum;

        // Extract the amount properly from the average_amount field
        const amount = extractAmount(stream.average_amount);
        if (isNaN(amount) || amount === 0) return sum;

        // Make sure amount is positive for expenses
        const positiveAmount = Math.abs(amount);

        // Convert to monthly amount based on frequency
        let monthlyAmount = positiveAmount;
        const frequency = (stream.frequency || '').toUpperCase();

        if (frequency === 'WEEKLY') {
            monthlyAmount *= 4.33; // Average weeks per month
        } else if (frequency === 'BIWEEKLY') {
            monthlyAmount *= 2.17; // Average bi-weekly occurrences per month
        } else if (frequency === 'QUARTERLY') {
            monthlyAmount /= 3; // Spread quarterly over 3 months
        } else if (frequency === 'ANNUALLY' || frequency === 'YEARLY') {
            monthlyAmount /= 12; // Spread annual over 12 months
        }

        return sum + monthlyAmount;
    }, 0);

    // Calculate total monthly inflow
    const monthlyInflow = safeInflow.reduce((sum, stream) => {
        if (!stream) return sum;

        // Extract the amount properly from the average_amount field
        const amount = extractAmount(stream.average_amount);
        if (isNaN(amount) || amount === 0) return sum;

        // Make sure amount is positive for income
        const positiveAmount = Math.abs(amount);

        // Convert to monthly amount based on frequency
        let monthlyAmount = positiveAmount;
        const frequency = (stream.frequency || '').toUpperCase();

        if (frequency === 'WEEKLY') {
            monthlyAmount *= 4.33; // Average weeks per month
        } else if (frequency === 'BIWEEKLY') {
            monthlyAmount *= 2.17; // Average bi-weekly occurrences per month
        } else if (frequency === 'QUARTERLY') {
            monthlyAmount /= 3; // Spread quarterly over 3 months
        } else if (frequency === 'ANNUALLY' || frequency === 'YEARLY') {
            monthlyAmount /= 12; // Spread annual over 12 months
        }

        return sum + monthlyAmount;
    }, 0);

    // Render content based on active tab
    const renderTabContent = () => {
        switch(activeTab) {
            case 'expenses':
                return (
                    <View className="mt-4">
                        {safeOutflow.length === 0 ? (
                            <Card className="mb-4 bg-white dark:bg-gray-800">
                                <Card.Content className="items-center py-6">
                                    <Ionicons
                                        name="arrow-up-circle-outline"
                                        size={48}
                                        color={isDarkMode ? '#6b7280' : '#9ca3af'}
                                    />
                                    <Text className="text-center mt-4 text-gray-500 dark:text-gray-400">
                                        No recurring expenses detected.
                                    </Text>
                                    <Text className="text-center mt-2 text-gray-500 dark:text-gray-400">
                                        Plaid may need more transaction history to identify patterns.
                                    </Text>
                                </Card.Content>
                            </Card>
                        ) : (
                            safeOutflow.map((stream, index) => (
                                <Card key={index} className="mb-3 bg-white dark:bg-gray-800">
                                    <Card.Content>
                                        <View className="flex-row justify-between items-center">
                                            <View className="flex-row items-center flex-1">
                                                <View className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 items-center justify-center mr-3">
                                                    <Ionicons
                                                        name="arrow-up-outline"
                                                        size={20}
                                                        color={isDarkMode ? "#f87171" : "#ef4444"}
                                                    />
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="font-medium text-gray-800 dark:text-white">
                                                        {stream.description || 'Unknown Expense'}
                                                    </Text>
                                                    <Text className="text-gray-500 dark:text-gray-400 text-xs">
                                                        {formatFrequency(stream.frequency)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text className="font-semibold text-lg text-red-600 dark:text-red-400">
                                                - {formatCurrency(extractAmount(stream.average_amount))}
                                            </Text>
                                        </View>
                                    </Card.Content>
                                </Card>
                            ))
                        )}
                    </View>
                );

            case 'income':
                return (
                    <View className="mt-4">
                        {safeInflow.length === 0 ? (
                            <Card className="mb-4 bg-white dark:bg-gray-800">
                                <Card.Content className="items-center py-6">
                                    <Ionicons
                                        name="arrow-up-circle-outline"
                                        size={48}
                                        color={isDarkMode ? '#6b7280' : '#9ca3af'}
                                    />
                                    <Text className="text-center mt-4 text-gray-500 dark:text-gray-400">
                                        No recurring expenses detected.
                                    </Text>
                                    <Text className="text-center mt-2 text-gray-500 dark:text-gray-400">
                                        Plaid may need more transaction history to identify patterns.
                                    </Text>
                                </Card.Content>
                            </Card>
                        ) : (
                            safeInflow.map((stream, index) => (
                                <Card key={index} className="mb-3 bg-white dark:bg-gray-800">
                                    <Card.Content>
                                        <View className="flex-row justify-between items-center">
                                            <View className="flex-row items-center flex-1">
                                                <View className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 items-center justify-center mr-3">
                                                    <Ionicons
                                                        name="arrow-down-outline"
                                                        size={20}
                                                        color={isDarkMode ? "#71f871" : "#44ef44"}
                                                    />
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="font-medium text-gray-800 dark:text-white">
                                                        {stream.description || 'Unknown Expense'}
                                                    </Text>
                                                    <Text className="text-gray-500 dark:text-gray-400 text-xs">
                                                        {formatFrequency(stream.frequency)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text className="font-semibold text-lg text-green-600 dark:text-green-400">
                                                - {formatCurrency(extractAmount(stream.average_amount))}
                                            </Text>
                                        </View>
                                    </Card.Content>
                                </Card>
                            ))
                        )}
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <View className="flex-1">
            {/* Header with summary */}
            <View className="p-4 bg-blue-600 dark:bg-blue-800">
                <Text className="text-xl font-bold text-white">Recurring Transactions</Text>
                <View className="flex-row justify-between mt-2">
                    <View>
                        <Text className="text-blue-100">Monthly Income</Text>
                        <Text className="text-2xl font-bold text-white">${monthlyInflow.toFixed(2)}</Text>
                    </View>
                    <View>
                        <Text className="text-blue-100">Monthly Expenses</Text>
                        <Text className="text-2xl font-bold text-white">${monthlyOutflow.toFixed(2)}</Text>
                    </View>
                </View>
            </View>


            {/* Tabs - updated order to show expenses first */}
            <View className="flex-row justify-around bg-white dark:bg-gray-800 py-2 border-b border-gray-200 dark:border-gray-700">
                <TouchableOpacity
                    className={`px-4 py-2 ${activeTab === 'expenses' ? 'border-b-2 border-red-600' : ''}`}
                    onPress={() => setActiveTab('expenses')}
                >
                    <Text className={`${activeTab === 'expenses' ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                        Expenses
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`px-4 py-2 ${activeTab === 'income' ? 'border-b-2 border-green-600' : ''}`}
                    onPress={() => setActiveTab('income')}
                >
                    <Text className={`${activeTab === 'income' ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                        Income
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Tab content */}
            <ScrollView
                className="flex-1 px-4 bg-gray-50 dark:bg-gray-900"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {renderTabContent()}

                {/* Add some padding at the bottom for scroll area */}
                <View className="h-10" />
            </ScrollView>
        </View>
    );
}