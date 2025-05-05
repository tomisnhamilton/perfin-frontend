// src/components/ui/TransactionList/TransactionList.native.jsx
import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function TransactionList({ transactions }) {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    // Fixed formatAmount function - respecting Plaid's sign convention
    const formatAmount = (amount) => {
        if (typeof amount !== 'number') return '$0.00';

        // For Plaid: positive = money out, negative = money in
        const isExpense = amount > 0;
        const formattedAmount = Math.abs(amount).toFixed(2);

        return `${isExpense ? '-' : '+'} $${formattedAmount}`;
    };

    // Get appropriate icon and color based on transaction type
    const getTransactionVisuals = (amount) => {
        // For Plaid: positive = money out, negative = money in
        const isExpense = amount > 0;

        return {
            icon: isExpense ? 'arrow-up' : 'arrow-down',
            color: isExpense ? '#ef4444' : '#10b981', // red for expense, green for income
            bgColor: isExpense ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900',
        };
    };

    return (
        <View style={{ margin: 16 }}>
            <Text className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Recent Transactions
            </Text>
            <FlatList
                data={transactions}
                keyExtractor={item => item.transaction_id || String(Math.random())}
                renderItem={({ item }) => {
                    const visuals = getTransactionVisuals(item.amount);

                    return (
                        <List.Item
                            title={props => (
                                <Text className="text-gray-800 dark:text-white">
                                    {item.name || 'Unknown Transaction'}
                                </Text>
                            )}
                            description={props => (
                                <Text className="text-gray-500 dark:text-gray-400">
                                    {new Date(item.date).toLocaleDateString()}
                                </Text>
                            )}
                            left={() => (
                                <View className="justify-center ml-2">
                                    <View className={`w-10 h-10 rounded-full items-center justify-center ${visuals.bgColor}`}>
                                        <Ionicons
                                            name={visuals.icon}
                                            size={20}
                                            color={visuals.color}
                                        />
                                    </View>
                                </View>
                            )}
                            right={() => (
                                <View className="justify-center">
                                    <Text className={`font-medium ${item.amount > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                        {formatAmount(item.amount)}
                                    </Text>
                                </View>
                            )}
                            style={{ backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }}
                        />
                    );
                }}
                ListEmptyComponent={
                    <View className="items-center py-8 bg-white dark:bg-gray-800 rounded-lg">
                        <Text className="text-gray-500 dark:text-gray-400">No transactions found</Text>
                    </View>
                }
            />
        </View>
    );
}