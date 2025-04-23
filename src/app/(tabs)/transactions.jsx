import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { useDB } from '@/store/DBContext';
import { Card, Title, List, Searchbar, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function TransactionsPage() {
    const { transactions, accounts, loading, refetch } = useDB();
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all'); // all, income, expense
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    // State for grouping transactions by date
    const [groupedTransactions, setGroupedTransactions] = useState({});

    // Group transactions by date whenever transactions change
    useEffect(() => {
        const grouped = transactions.reduce((groups, transaction) => {
            // Format the date to yyyy-mm-dd
            const date = transaction.date ?
                transaction.date.includes('T') ?
                    transaction.date.split('T')[0] :
                    transaction.date :
                'Unknown';

            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(transaction);
            return groups;
        }, {});

        // Sort dates in descending order (newest first)
        const sortedGroups = Object.keys(grouped)
            .sort((a, b) => new Date(b) - new Date(a))
            .reduce((sorted, date) => {
                sorted[date] = grouped[date];
                return sorted;
            }, {});

        setGroupedTransactions(sortedGroups);
    }, [transactions]);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    // Filter transactions based on search query and filter type
    const filteredTransactions = () => {
        // First, filter by search query
        let filtered = transactions;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(tx =>
                (tx.name && tx.name.toLowerCase().includes(query)) ||
                (tx.category && Array.isArray(tx.category) &&
                    tx.category.some(cat => cat.toLowerCase().includes(query))) ||
                (tx.category && typeof tx.category === 'string' &&
                    tx.category.toLowerCase().includes(query))
            );
        }

        // Then, filter by transaction type
        if (filter === 'income') {
            filtered = filtered.filter(tx => tx.amount > 0);
        } else if (filter === 'expense') {
            filtered = filtered.filter(tx => tx.amount < 0);
        }

        return filtered;
    };

    // Get transaction account name from account ID
    const getAccountName = (accountId) => {
        const account = accounts.find(a => a.account_id === accountId);
        return account ? account.name : 'Unknown Account';
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (typeof amount !== 'number') return '$0.00';
        return `${Math.abs(amount).toFixed(2)}`;
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';

        try {
            const date = new Date(dateString.includes('T') ?
                dateString : `${dateString}T00:00:00Z`);

            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    // Get category for display
    const getCategory = (tx) => {
        if (!tx.category) return 'Uncategorized';

        if (Array.isArray(tx.category) && tx.category.length) {
            return tx.category[0];
        }

        return typeof tx.category === 'string' ? tx.category : 'Uncategorized';
    };

    // If still loading, show a loading indicator
    if (loading && !refreshing) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text className="mt-4 text-gray-600">Loading your transactions...</Text>
            </View>
        );
    }

    // Apply filters to get final transactions list
    const displayedTransactions = filteredTransactions();

    // Group filtered transactions by date
    const filteredGroupedTransactions = {};
    displayedTransactions.forEach(tx => {
        const date = tx.date ?
            tx.date.includes('T') ?
                tx.date.split('T')[0] :
                tx.date :
            'Unknown';

        if (!filteredGroupedTransactions[date]) {
            filteredGroupedTransactions[date] = [];
        }
        filteredGroupedTransactions[date].push(tx);
    });

    // Sort dates in descending order (newest first)
    const sortedFilteredDates = Object.keys(filteredGroupedTransactions)
        .sort((a, b) => new Date(b) - new Date(a));

    return (
        <View className="flex-1">
            {/* Search bar */}
            <Searchbar
                placeholder="Search transactions..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                className="mx-4 my-2 rounded-lg"
            />

            {/* Filter tabs */}
            <View className="flex-row justify-around my-2 px-4">
                <TouchableOpacity
                    className={`py-2 px-4 rounded-full ${filter === 'all' ?
                        'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                    onPress={() => setFilter('all')}
                >
                    <Text className={filter === 'all' ? 'text-white' : 'text-gray-800 dark:text-white'}>
                        All
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`py-2 px-4 rounded-full ${filter === 'income' ?
                        'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                    onPress={() => setFilter('income')}
                >
                    <Text className={filter === 'income' ? 'text-white' : 'text-gray-800 dark:text-white'}>
                        Income
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`py-2 px-4 rounded-full ${filter === 'expense' ?
                        'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                    onPress={() => setFilter('expense')}
                >
                    <Text className={filter === 'expense' ? 'text-white' : 'text-gray-800 dark:text-white'}>
                        Expenses
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Transaction list */}
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                className="pb-4"
            >
                {displayedTransactions.length === 0 ? (
                    <View className="items-center justify-center py-12">
                        <Ionicons
                            name="receipt-outline"
                            size={48}
                            color={isDarkMode ? '#6b7280' : '#9ca3af'}
                        />
                        <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center">
                            {transactions.length === 0 ?
                                'No transactions found. Connect your bank to see transactions.' :
                                'No transactions match your search criteria.'}
                        </Text>
                    </View>
                ) : (
                    sortedFilteredDates.map(date => (
                        <View key={date}>
                            {/* Date header */}
                            <View className="bg-gray-100 dark:bg-gray-800 px-4 py-2">
                                <Text className="font-semibold text-gray-700 dark:text-gray-300">
                                    {formatDate(date)}
                                </Text>
                            </View>

                            {/* Transactions for this date */}
                            {filteredGroupedTransactions[date].map(transaction => (
                                <List.Item
                                    key={transaction.transaction_id}
                                    title={transaction.name || 'Unnamed Transaction'}
                                    description={`${getAccountName(transaction.account_id)} • ${getCategory(transaction)}`}
                                    left={props =>
                                        <View className="justify-center ml-2">
                                            <View className={`w-10 h-10 rounded-full items-center justify-center ${
                                                transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                                            }`}>
                                                <Ionicons
                                                    name={transaction.amount > 0 ? 'arrow-down' : 'arrow-up'}
                                                    size={20}
                                                    color={transaction.amount > 0 ? '#10b981' : '#ef4444'}
                                                />
                                            </View>
                                        </View>
                                    }
                                    right={props => (
                                        <View className="justify-center">
                                            <Text className={`font-medium ${
                                                transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {transaction.amount > 0 ? '+' : '-'} {formatCurrency(transaction.amount)}
                                            </Text>
                                        </View>
                                    )}
                                />
                            ))}
                            <Divider />
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}