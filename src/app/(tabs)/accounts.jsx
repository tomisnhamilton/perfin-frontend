import React, { useState } from 'react';
import { View, Text, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useDB } from '@/store/DBContext';
import AccountCard from '@/components/ui/AccountCard';
import { Card, Title } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function AccountsPage() {
    const { accounts, loading, refetch } = useDB();
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    // Calculate total balance across all accounts
    const totalBalance = accounts.reduce((sum, acc) => {
        const balance = acc.balances?.current || acc.balances?.available || 0;
        return sum + (typeof balance === 'number' ? balance : 0);
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
            {/* Summary card */}
            <Card className="mb-4">
                <Card.Content>
                    <Title className="text-xl font-bold">Total Balance</Title>
                    <Text className="text-3xl mt-2">${totalBalance.toFixed(2)}</Text>
                    <Text className="text-gray-500 mt-1">{accounts.length} accounts connected</Text>
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