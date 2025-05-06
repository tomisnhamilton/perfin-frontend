// src/app/(tabs)/dashboard.jsx
import React, { useState } from 'react';
import { View, ScrollView, ActivityIndicator, RefreshControl, Text, TouchableOpacity, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { useDB } from '@/store/DBContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

// Simple bar chart component for weekly spending - UPDATED to flip chart orientation
const SimpleBarChart = ({ data, height = 200 }) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    // If no data or empty data, show a message
    if (!data || data.length === 0 || data.every(p => p.y === 0)) {
        return (
            <View className="items-center justify-center" style={{ height }}>
                <Text className="text-gray-500">No transaction data available</Text>
            </View>
        );
    }

    // Find max y value for scaling
    const yValues = data.map(point => point.y);
    const maxY = Math.max(...yValues);

    // Calculate chart dimensions
    const chartHeight = height - 30; // Reserve space for labels

    return (
        <View className="mt-4" style={{ height }}>
            {/* Chart container with border */}
            <View style={{ height: chartHeight }} className="relative border-l border-b border-gray-300 dark:border-gray-700">
                {/* Bars container - taking full height and width */}
                <View className="absolute inset-0 flex-row">
                    {data.map((point, i) => {
                        // Calculate height as percentage of max value
                        const barHeight = maxY > 0 ? (point.y / maxY) * 100 : 0;

                        return (
                            <View key={i} className="flex-1 items-center" style={{ position: 'relative' }}>
                                {barHeight > 0 && (
                                    <View
                                        className="bg-blue-500 w-8 absolute bottom-0"
                                        style={{
                                            height: `${barHeight}%`,
                                            borderTopLeftRadius: 2,
                                            borderTopRightRadius: 2
                                        }}
                                    />
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Day labels row - completely separate from chart area */}
            <View className="flex-row mt-2">
                {data.map((point, i) => (
                    <View key={i} className="flex-1 items-center">
                        <Text className="text-xs text-gray-500">
                            {point.x}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

// Simple donut chart component for category spending
const SimpleDonutChart = ({ data, height = 250 }) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    // If no data, show a message
    if (!data || data.length === 0) {
        return (
            <View className="items-center justify-center" style={{ height }}>
                <Text className="text-gray-500">No spending data available</Text>
            </View>
        );
    }

    // Calculate total for percentages
    const total = data.reduce((sum, item) => sum + item.y, 0);

    // Define colors for the pie segments
    const colors = [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
        '#6366f1', '#ec4899', '#14b8a6', '#f97316', '#6b7280'
    ];

    return (
        <View className="mt-4 " style={{ height }} >
            <View className="flex-row flex-wrap justify-center mb-4">
                {data.slice(0, 5).map((item, index) => {
                    const percentage = ((item.y / total) * 100).toFixed(1);
                    return (
                        <View key={index} className="flex-row items-center mx-2 mb-2">
                            <View
                                className="w-3 h-3 rounded-full mr-1"
                                style={{ backgroundColor: colors[index % colors.length] }}
                            />
                            <Text className="text-xs text-gray-800 dark:text-gray-200">
                                {item.x}: {percentage}%
                            </Text>
                        </View>
                    );
                })}
            </View>

            <View className="items-center justify-center">
                {/* Simple visual representation - in real app use a proper pie chart */}
                <View className="flex-row flex-wrap justify-center">
                    {data.slice(0, 5).map((item, index) => {
                        const percentage = (item.y / total) * 100;
                        const width = `${Math.max(10, Math.min(percentage, 50))}%`;
                        return (
                            <View
                                key={index}
                                className="h-8 m-1 rounded-md items-center justify-center"
                                style={{
                                    width,
                                    backgroundColor: colors[index % colors.length],
                                }}
                            >
                                {percentage > 15 ? (
                                    <Text className="text-white text-xs font-bold">
                                        {Math.round(percentage)}%
                                    </Text>
                                ) : null}
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

// Recent Transactions Component with Logo Support
const RecentTransactionsSection = ({ transactions, router }) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    // Format currency consistently
    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
        return `$${Math.abs(parseFloat(amount)).toFixed(2)}`;
    };

    // Format date nicely
    const formatDate = (dateString) => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString.includes('T') ?
                dateString : `${dateString}T00:00:00Z`);

            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <Card className="mb-4 rounded-xl overflow-hidden shadow-sm ">
            <TouchableOpacity
                className="p-4"
                onPress={() => router.push('/(tabs)/transactions')}
            >
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800 items-center justify-center mr-3">
                            <Ionicons name="list-outline" size={20} color={isDarkMode ? '#d8b4fe' : '#8b5cf6'} />
                        </View>
                        <Text className="font-bold text-lg text-gray-800 dark:text-gray-100">Recent Transactions</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </View>

                {/* Recent Transactions List */}
                {transactions.length === 0 ? (
                    <Text className="text-center py-4 text-gray-500">
                        No recent transactions found
                    </Text>
                ) : (
                    transactions.slice(0, 3).map((transaction, index) => {
                        // Check if transaction has a logo
                        const hasLogo = transaction.logo_url && transaction.logo_url.trim() !== '';

                        return (
                            <View key={index} className="flex-row justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                                <View className="flex-row items-center">
                                    {/* Logo or Icon */}
                                    {hasLogo ? (
                                        <View className="w-8 h-8 rounded-full overflow-hidden bg-white mr-3">
                                            <Image
                                                source={{ uri: transaction.logo_url }}
                                                className="w-full h-full"
                                                resizeMode="contain"
                                            />
                                        </View>
                                    ) : (
                                        <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                                            transaction.amount < 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                                        }`}>
                                            <Ionicons
                                                name={transaction.amount < 0 ? 'arrow-down' : 'arrow-up'}
                                                size={16}
                                                color={transaction.amount < 0 ? '#10b981' : '#ef4444'}
                                            />
                                        </View>
                                    )}

                                    {/* Transaction Details */}
                                    <View>
                                        <Text className="font-medium text-gray-800 dark:text-gray-100">
                                            {transaction.name || 'Unknown Transaction'}
                                        </Text>
                                        <Text className="text-xs text-gray-500">{formatDate(transaction.date)}</Text>
                                    </View>
                                </View>

                                {/* Amount */}
                                <Text className={`font-medium ${
                                    transaction.amount < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                    {transaction.amount < 0 ? '+' : '-'} {formatCurrency(Math.abs(transaction.amount))}
                                </Text>
                            </View>
                        );
                    })
                )}

                {transactions.length > 3 && (
                    <Text className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                        + {transactions.length - 3} more transactions
                    </Text>
                )}
            </TouchableOpacity>
        </Card>
    );
};

export default function DashboardScreen() {
    const { accounts, transactions, upcomingTransactions, loading, refetch } = useDB();
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    // Safely access accounts and transactions with default values
    const safeAccounts = accounts || [];
    const safeTransactions = transactions || [];
    const safeUpcoming = upcomingTransactions || [];

    // If still loading, show a loading indicator
    if (loading && !refreshing) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text className="mt-4 text-gray-600">Loading your financial data...</Text>
            </View>
        );
    }

    // If no accounts but not loading, show a message
    if (safeAccounts.length === 0 && !loading) {
        return (
            <ScrollView
                className="p-4 bg-neutral-100 dark:bg-gray-700"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Card className="p-6 mb-4 items-center">
                    <View className="items-center">
                        <View className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-800 items-center justify-center mb-4">
                            <Ionicons name="wallet-outline" size={36} color={isDarkMode ? '#93c5fd' : '#3b82f6'} />
                        </View>
                        <Text className="text-xl text-center font-bold mb-4 text-gray-700 dark:text-gray-200">Welcome to PerFin!</Text>
                        <Text className="text-center mb-6 text-gray-600 dark:text-gray-400">
                            No financial accounts connected yet. Connect your bank to see your financial data.
                        </Text>
                        <TouchableOpacity
                            className="bg-blue-600 dark:bg-blue-500 px-6 py-3 rounded-xl"
                            onPress={() => router.push('/connect-bank')}
                        >
                            <Text className="text-white font-bold">Connect Bank Account</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </ScrollView>
        );
    }

    const getAccountBalance = (account) => {
        if (!account || !account.balances) return 0;

        // For credit accounts, we need to negate the balance since a positive
        // balance on a credit account means you owe money (a liability)
        if (account.type === 'credit') {
            // Use available balance if present, otherwise use current balance
            const balance = account.balances.available !== undefined
                ? account.balances.available
                : (account.balances.current !== undefined ? account.balances.current : 0);

            // Negate credit card balances so they're displayed correctly in the total
            return -Math.abs(balance);
        }
        // For loan accounts or other liabilities, also negate
        else if (account.type === 'loan' || account.type === 'mortgage') {
            const balance = account.balances.current || 0;
            return -Math.abs(balance);
        }
        // For regular accounts (checking, savings, etc.)
        else {
            // Use available balance if present, otherwise use current balance
            return account.balances.available !== undefined
                ? account.balances.available
                : (account.balances.current !== undefined ? account.balances.current : 0);
        }
    };

    // Replace the totalBalance calculation with this (in the appropriate place)
    const totalBalance = safeAccounts.reduce((sum, acc) => {
        return sum + getAccountBalance(acc);
    }, 0);

    // 2. Weekly transaction totals
    const now = new Date();
    const last7 = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0]; // yyyy-mm-dd
    });

    const txPerDay = last7.map(day => {
        const dailyTransactions = safeTransactions.filter(tx => {
            // Handle both date formats (ISO string or date string)
            if (!tx || !tx.date) return false;
            const txDate = tx.date.includes('T') ? tx.date.split('T')[0] : tx.date;
            return txDate === day;
        });

        // UPDATED: For expenses only (positive amount in Plaid = money out)
        const sum = dailyTransactions.reduce((total, tx) => {
            if (!tx || tx.amount === undefined) return total;
            // Only add positive amounts (expenses) for the weekly spending chart
            const amount = tx.amount > 0 ? tx.amount : 0;
            return total + (isNaN(amount) ? 0 : amount);
        }, 0);

        // Format date as day of week (e.g., "Mon")
        const dayOfWeek = new Date(day).toLocaleDateString('en-US', { weekday: 'short' });

        return { x: dayOfWeek, y: sum }; // show day of week
    });

    // 4. Spending by category
    const past = new Date();
    past.setDate(past.getDate() - 6);

    const spendingTx = safeTransactions.filter(tx => {
        if (!tx || !tx.date || tx.amount === undefined) return false;

        // Handle different date formats
        let txDate = null;
        try {
            txDate = tx.date.includes('T') ?
                new Date(tx.date) :
                new Date(tx.date + 'T00:00:00Z');
        } catch (e) {
            console.warn('Invalid date format:', tx.date);
            return false;
        }

        // Only include positive amounts (expenses in Plaid's convention)
        return txDate && txDate >= past && tx.amount > 0;
    });

    const grouped = {};
    for (let tx of spendingTx) {
        if (!tx) continue;

        let category = 'Other';

        // Handle different category formats from Plaid
        if (Array.isArray(tx.category) && tx.category.length) {
            category = tx.category[0];
        } else if (typeof tx.category === 'string') {
            category = tx.category;
        }

        if (!category || typeof category !== 'string') {
            category = 'Other';
        }

        const amt = Math.abs(tx.amount || 0);
        if (isNaN(amt) || amt <= 0) continue;

        grouped[category] = (grouped[category] || 0) + amt;
    }

    const pieData = Object.entries(grouped)
        .map(([category, total]) => ({
            x: category,
            y: Number(total.toFixed(2)),
        }))
        .filter(d => d.x && !isNaN(d.y) && d.y > 0)
        // Sort by value (descending)
        .sort((a, b) => b.y - a.y);

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
        return `$${Math.abs(parseFloat(amount)).toFixed(2)}`;
    };

    return (
        <ScrollView
            className="flex-1 bg-gray-50 dark:bg-gray-900"
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Balance Header Section */}
            <View className="p-6 bg-blue-600 dark:bg-blue-800">
                <Text className="text-blue-100">Net Worth</Text>
                <Text className="text-3xl font-bold text-white mb-2">
                    {totalBalance >= 0
                        ? `$${totalBalance.toFixed(2)}`
                        : `-$${Math.abs(totalBalance).toFixed(2)}`}
                </Text>
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <Ionicons name="wallet-outline" size={16} color="#93c5fd" />
                        <Text className="ml-1 text-blue-100">
                            {safeAccounts.length} {safeAccounts.length === 1 ? 'account' : 'accounts'} connected
                        </Text>
                    </View>
                </View>
            </View>

            {/* Main Content */}
            <View className="px-4 pb-6 mt-4">
                {/* Accounts Card - Quick View */}
                <Card className="mb-4 rounded-xl overflow-hidden shadow-sm">
                    <TouchableOpacity
                        className="p-4"
                        onPress={() => router.push('/(tabs)/accounts')}
                    >
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 items-center justify-center mr-3">
                                    <Ionicons name="card-outline" size={20} color={isDarkMode ? '#93c5fd' : '#3b82f6'} />
                                </View>
                                <Text className="font-bold text-lg text-gray-800 dark:text-gray-100">Your Accounts</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                        </View>

                        {safeAccounts.slice(0, 3).map((account, index) => (
                            <View key={index} className="flex-row justify-between items-center py-2">
                                <Text className="text-gray-600 dark:text-gray-300">{account?.name || 'Account'}</Text>
                                <Text className={`font-medium ${account.type === 'credit' || account.type === 'loan' ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-100'}`}>
                                    {account.type === 'credit' || account.type === 'loan'
                                        ? `-$${Math.abs((account?.balances?.current || account?.balances?.available || 0)).toFixed(2)}`
                                        : `$${(account?.balances?.current || account?.balances?.available || 0).toFixed(2)}`}
                                </Text>
                            </View>
                        ))}

                        {safeAccounts.length > 3 && (
                            <Text className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                                + {safeAccounts.length - 3} more accounts
                            </Text>
                        )}
                    </TouchableOpacity>
                </Card>

                {/* Weekly Spending Chart Card */}
                <Card className="mb-4 rounded-xl overflow-hidden shadow-sm">
                    <TouchableOpacity
                        className="p-4"
                        onPress={() => router.push('/(tabs)/transactions')}
                    >
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800 items-center justify-center mr-3">
                                    <Ionicons name="bar-chart-outline" size={20} color={isDarkMode ? '#d8b4fe' : '#8b5cf6'} />
                                </View>
                                <Text className="font-bold text-lg text-gray-800 dark:text-gray-100">Weekly Spending</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                        </View>

                        <SimpleBarChart data={txPerDay} height={180} />
                    </TouchableOpacity>
                </Card>

                {/* Spending Categories Card */}
                <Card className="mb-4 rounded-xl overflow-hidden shadow-sm">
                    <TouchableOpacity
                        className="p-4"
                        onPress={() => router.push('/(tabs)/transactions')}
                    >
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 items-center justify-center mr-3">
                                    <Ionicons name="pie-chart-outline" size={20} color={isDarkMode ? '#86efac' : '#22c55e'} />
                                </View>
                                <Text className="font-bold text-lg text-gray-800 dark:text-gray-100">Spending by Category</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                        </View>

                        <SimpleDonutChart data={pieData} />
                    </TouchableOpacity>
                </Card>

                {/* Recent Transactions Card */}
                <RecentTransactionsSection transactions={safeTransactions} router={router} />

                {/* Upcoming Payments Card */}
                <Card className="mb-4 rounded-xl overflow-hidden shadow-sm">
                    <TouchableOpacity
                        className="p-4"
                        onPress={() => router.push('/(tabs)/recurring')}
                    >
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800 items-center justify-center mr-3">
                                    <Ionicons name="calendar-outline" size={20} color={isDarkMode ? '#fca5a5' : '#ef4444'} />
                                </View>
                                <Text className="font-bold text-lg text-gray-800 dark:text-gray-100">Upcoming Payments</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                        </View>

                        {safeUpcoming.length === 0 ? (
                            <Text className="text-center py-4 text-gray-500">
                                No upcoming payments detected
                            </Text>
                        ) : (
                            safeUpcoming.slice(0, 3).map((payment, index) => (
                                <View key={index} className="flex-row justify-between mb-2 py-2 border-b border-gray-100 dark:border-gray-800">
                                    <View>
                                        <Text className="font-medium text-gray-800 dark:text-gray-100">{payment.name}</Text>
                                        <Text className="text-xs text-gray-500">{payment.date ? new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</Text>
                                    </View>
                                    {/* UPDATED: Format amount correctly based on Plaid convention */}
                                    <Text className="font-medium text-red-600 dark:text-red-400">
                                        {payment.amount > 0 ? `-${formatCurrency(payment.amount)}` : `+${formatCurrency(Math.abs(payment.amount))}`}
                                    </Text>
                                </View>
                            ))
                        )}

                        {safeUpcoming.length > 3 && (
                            <Text className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                                + {safeUpcoming.length - 3} more upcoming payments
                            </Text>
                        )}
                    </TouchableOpacity>
                </Card>

                {/* Connect Another Account Card */}
                <Card className="mb-4 rounded-xl overflow-hidden shadow-sm">
                    <TouchableOpacity
                        className="p-4 flex-row items-center"
                        onPress={() => router.push('/connect-bank')}
                    >
                        <View className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 items-center justify-center mr-3">
                            <Ionicons name="add-outline" size={24} color={isDarkMode ? '#93c5fd' : '#3b82f6'} />
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-gray-800 dark:text-gray-100">Connect Another Account</Text>
                            <Text className="text-gray-500 text-sm">Add more financial accounts</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                </Card>
            </View>
        </ScrollView>
    );
}