import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Title, Divider } from 'react-native-paper';
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

export default function RecurringTransactionsScreen() {
    const { recurring, upcomingTransactions, loading, refetch } = useDB();
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, income, expenses
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    // Safe access to data
    const safeInflow = recurring?.inflow || [];
    const safeOutflow = recurring?.outflow || [];
    const safeUpcoming = upcomingTransactions || [];

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
        if (!stream || !stream.average_amount) return sum;

        // Convert to monthly amount based on frequency
        let monthlyAmount = stream.average_amount;
        const frequency = (stream.frequency || '').toUpperCase();

        if (frequency === 'WEEKLY') {
            monthlyAmount *= 4.33; // Average weeks per month
        } else if (frequency === 'BIWEEKLY') {
            monthlyAmount *= 2.17; // Average bi-weekly occurrences per month
        } else if (frequency === 'QUARTERLY') {
            monthlyAmount /= 3; // Spread quarterly over 3 months
        } else if (frequency === 'ANNUALLY') {
            monthlyAmount /= 12; // Spread annual over 12 months
        }

        return sum + monthlyAmount;
    }, 0);

    // Calculate total monthly inflow
    const monthlyInflow = safeInflow.reduce((sum, stream) => {
        if (!stream || !stream.average_amount) return sum;

        // Convert to monthly amount based on frequency
        let monthlyAmount = stream.average_amount;
        const frequency = (stream.frequency || '').toUpperCase();

        if (frequency === 'WEEKLY') {
            monthlyAmount *= 4.33; // Average weeks per month
        } else if (frequency === 'BIWEEKLY') {
            monthlyAmount *= 2.17; // Average bi-weekly occurrences per month
        } else if (frequency === 'QUARTERLY') {
            monthlyAmount /= 3; // Spread quarterly over 3 months
        } else if (frequency === 'ANNUALLY') {
            monthlyAmount /= 12; // Spread annual over 12 months
        }

        return sum + monthlyAmount;
    }, 0);

    // Render content based on active tab
    const renderTabContent = () => {
        switch(activeTab) {
            case 'upcoming':
                return (
                    <View className="mt-4">
                        {safeUpcoming.length === 0 ? (
                            <Card className="mb-4">
                                <Card.Content className="items-center py-6">
                                    <Ionicons
                                        name="calendar-outline"
                                        size={48}
                                        color={isDarkMode ? '#6b7280' : '#9ca3af'}
                                    />
                                    <Text className="text-center mt-4 text-gray-500">
                                        No upcoming recurring transactions detected.
                                    </Text>
                                </Card.Content>
                            </Card>
                        ) : (
                            safeUpcoming.map((payment, index) => (
                                <Card key={index} className="mb-3">
                                    <Card.Content>
                                        <View className="flex-row justify-between items-center">
                                            <View className="flex-row items-center flex-1">
                                                <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center mr-3">
                                                    <Ionicons
                                                        name="calendar-outline"
                                                        size={20}
                                                        color={isDarkMode ? '#f87171' : '#ef4444'}
                                                    />
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="font-medium">{payment.name}</Text>
                                                    <Text className="text-gray-500 text-xs">
                                                        {formatFrequency(payment.frequency)} • {payment.date}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text className="font-semibold text-lg">
                                                {formatCurrency(payment.amount)}
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
                            <Card className="mb-4">
                                <Card.Content className="items-center py-6">
                                    <Ionicons
                                        name="arrow-down-circle-outline"
                                        size={48}
                                        color={isDarkMode ? '#6b7280' : '#9ca3af'}
                                    />
                                    <Text className="text-center mt-4 text-gray-500">
                                        No recurring income detected.
                                    </Text>
                                </Card.Content>
                            </Card>
                        ) : (
                            safeInflow.map((stream, index) => (
                                <Card key={index} className="mb-3">
                                    <Card.Content>
                                        <View className="flex-row justify-between items-center">
                                            <View className="flex-row items-center flex-1">
                                                <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                                                    <Ionicons
                                                        name="arrow-down-outline"
                                                        size={20}
                                                        color={isDarkMode ? '#34d399' : '#10b981'}
                                                    />
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="font-medium">
                                                        {stream.description || 'Unknown Income'}
                                                    </Text>
                                                    <Text className="text-gray-500 text-xs">
                                                        {formatFrequency(stream.frequency)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text className="font-semibold text-lg text-green-600">
                                                {formatCurrency(stream.average_amount)}
                                            </Text>
                                        </View>
                                    </Card.Content>
                                </Card>
                            ))
                        )}
                    </View>
                );

            case 'expenses':
                return (
                    <View className="mt-4">
                        {safeOutflow.length === 0 ? (
                            <Card className="mb-4">
                                <Card.Content className="items-center py-6">
                                    <Ionicons
                                        name="arrow-up-circle-outline"
                                        size={48}
                                        color={isDarkMode ? '#6b7280' : '#9ca3af'}
                                    />
                                    <Text className="text-center mt-4 text-gray-500">
                                        No recurring expenses detected.
                                    </Text>
                                </Card.Content>
                            </Card>
                        ) : (
                            safeOutflow.map((stream, index) => (
                                <Card key={index} className="mb-3">
                                    <Card.Content>
                                        <View className="flex-row justify-between items-center">
                                            <View className="flex-row items-center flex-1">
                                                <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center mr-3">
                                                    <Ionicons
                                                        name="arrow-up-outline"
                                                        size={20}
                                                        color={isDarkMode ? '#f87171' : '#ef4444'}
                                                    />
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="font-medium">
                                                        {stream.description || 'Unknown Expense'}
                                                    </Text>
                                                    <Text className="text-gray-500 text-xs">
                                                        {formatFrequency(stream.frequency)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text className="font-semibold text-lg text-red-600">
                                                {formatCurrency(stream.average_amount)}
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
                        <Text className="text-2xl font-bold text-white">{formatCurrency(monthlyInflow)}</Text>
                    </View>
                    <View>
                        <Text className="text-blue-100">Monthly Expenses</Text>
                        <Text className="text-2xl font-bold text-white">{formatCurrency(monthlyOutflow)}</Text>
                    </View>
                </View>
            </View>

            {/* Tabs */}
            <View className="flex-row justify-around bg-white dark:bg-gray-800 py-2 border-b border-gray-200 dark:border-gray-700">
                <TouchableOpacity
                    className={`px-4 py-2 ${activeTab === 'upcoming' ? 'border-b-2 border-blue-600' : ''}`}
                    onPress={() => setActiveTab('upcoming')}
                >
                    <Text className={`${activeTab === 'upcoming' ? 'text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-300'}`}>
                        Upcoming
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`px-4 py-2 ${activeTab === 'income' ? 'border-b-2 border-green-600' : ''}`}
                    onPress={() => setActiveTab('income')}
                >
                    <Text className={`${activeTab === 'income' ? 'text-green-600 font-medium' : 'text-gray-600 dark:text-gray-300'}`}>
                        Income
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`px-4 py-2 ${activeTab === 'expenses' ? 'border-b-2 border-red-600' : ''}`}
                    onPress={() => setActiveTab('expenses')}
                >
                    <Text className={`${activeTab === 'expenses' ? 'text-red-600 font-medium' : 'text-gray-600 dark:text-gray-300'}`}>
                        Expenses
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