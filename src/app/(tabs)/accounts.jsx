// src/app/(tabs)/accounts.jsx - Updated with correct balance calculation
import React, { useState } from 'react';
import { View, Text, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useDB } from '@/store/DBContext';
import AccountCard from '@/components/ui/AccountCard';
import { Card, Title } from 'react-native-paper';
import { useRouter } from 'expo-router';

// Helper function to get proper account balance
const getAccountBalance = (account) => {
    if (!account || !account.balances) return 0;

    // For credit accounts, negate the balance to represent debt as negative
    if (account.type === 'credit') {
        // Use available balance if present, otherwise use current balance
        const balance = account.balances.current !== undefined
            ? account.balances.current
            : (account.balances.available !== undefined ? account.balances.current : 0);

        // Negate credit card balances for calculation purposes
        return -Math.abs(balance);
    }
    // For loan accounts, also negate the balance
    else if (account.type === 'loan' || account.type === 'mortgage') {
        const balance = account.balances.current || 0;
        return -Math.abs(balance);
    }
    // For regular deposit accounts (checking, savings, etc.)
    else {
        // Use available balance if present, otherwise use current balance
        return account.balances.current !== undefined
            ? account.balances.current
            : (account.balances.available !== undefined ? account.balances.current : 0);
    }
};

// Helper to format a balance for display
const formatCurrency = (amount, isNegative = false) => {
    if (typeof amount !== 'number') return '$0.00';

    // Handle negative amounts for display
    if (isNegative) {
        return `-$${Math.abs(amount).toFixed(2)}`;
    } else {
        return `$${Math.abs(amount).toFixed(2)}`;
    }
};

export default function AccountsPage() {
    const { accounts, loading, refetch } = useDB();
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    // Calculate total balance across all accounts - UPDATED FOR CORRECT BALANCE HANDLING
    const totalBalance = accounts.reduce((sum, acc) => {
        return sum + getAccountBalance(acc);
    }, 0);

    // Calculate assets (positive balances)
    const totalAssets = accounts.reduce((sum, acc) => {
        const balance = getAccountBalance(acc);
        return sum + (balance > 0 ? balance : 0);
    }, 0);

    // Calculate debts (negative balances)
    const totalDebts = accounts.reduce((sum, acc) => {
        const balance = getAccountBalance(acc);
        return sum + (balance < 0 ? balance : 0);
    }, 0);

    // Group accounts by type
    const accountsByType = accounts.reduce((groups, account) => {
        const type = account.type || 'Other';
        if (!groups[type]) {
            groups[type] = [];
        }
        groups[type].push(account);
        return groups;
    }, {});

    // If still loading, show a loading indicator
    if (loading && !refreshing) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text className="mt-4 text-gray-600">Loading your accounts...</Text>
            </View>
        );
    }

    // If no accounts but not loading, show a message
    if (accounts.length === 0 && !loading) {
        return (
            <ScrollView
                className="p-4"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Card className="p-6 mb-4 items-center">
                    <Title className="text-xl text-center mb-4">No Accounts Found</Title>
                    <Text className="text-center mb-6">
                        You don't have any financial accounts connected yet.
                    </Text>
                    <Card
                        onPress={() => router.push('/connect-bank')}
                        className="bg-blue-600 w-full"
                    >
                        <Card.Content className="items-center">
                            <Text className="text-white text-lg font-medium">Connect Bank Account</Text>
                        </Card.Content>
                    </Card>
                </Card>
            </ScrollView>
        );
    }

    return (
        <ScrollView
            className="p-4"
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Summary card - UPDATED WITH BETTER BALANCE INFO */}
            <Card className="mb-4">
                <Card.Content>
                    <Title className="text-xl font-bold">Financial Summary</Title>
                    <View className="mt-2">
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-gray-600">Total Assets:</Text>
                            <Text className="text-green-600 font-medium">{formatCurrency(totalAssets)}</Text>
                        </View>
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-gray-600">Total Debts:</Text>
                            <Text className="text-red-600 font-medium">{formatCurrency(Math.abs(totalDebts), true)}</Text>
                        </View>
                        <View className="flex-row justify-between pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                            <Text className="text-gray-800 dark:text-gray-200 font-semibold">Net Worth:</Text>
                            <Text className={`font-semibold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {totalBalance >= 0 ? formatCurrency(totalBalance) : formatCurrency(Math.abs(totalBalance), true)}
                            </Text>
                        </View>
                    </View>
                    <Text className="text-gray-500 mt-3 text-sm">{accounts.length} accounts connected</Text>
                </Card.Content>
            </Card>

            {/* Accounts by type */}
            {Object.entries(accountsByType).map(([type, typeAccounts]) => (
                <View key={type} className="mb-4">
                    <Text className="text-lg font-semibold mb-2 px-2">{type} Accounts</Text>
                    {typeAccounts.map(account => (
                        <AccountCard key={account.account_id} account={account} />
                    ))}
                </View>
            ))}

            {/* Connect another account card */}
            <Card
                onPress={() => router.push('/connect-bank')}
                className="mb-4 bg-gray-100 dark:bg-gray-800"
            >
                <Card.Content className="items-center py-4">
                    <Text className="text-blue-600 dark:text-blue-400 font-medium">
                        + Connect Another Account
                    </Text>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}