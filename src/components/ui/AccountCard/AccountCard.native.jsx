// src/components/ui/AccountCard/AccountCard.native.jsx
import React from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

// Helper function to get icon for account type
function getAccountIcon(type, subtype) {
    // Default icon
    let iconName = 'card-outline';

    // Determine icon based on account type/subtype
    if (type === 'depository') {
        if (subtype === 'checking') {
            iconName = 'wallet-outline';
        } else if (subtype === 'savings') {
            iconName = 'cash-outline';
        } else {
            iconName = 'wallet-outline';
        }
    } else if (type === 'credit') {
        iconName = 'card-outline';
    } else if (type === 'loan') {
        iconName = 'home-outline';
    } else if (type === 'investment') {
        iconName = 'trending-up-outline';
    }

    return iconName;
}

// Helper function to get color for account type
function getAccountColor(type, isDarkMode) {
    switch (type) {
        case 'depository':
            return isDarkMode ? '#93c5fd' : '#3b82f6'; // blue
        case 'credit':
            return isDarkMode ? '#f87171' : '#ef4444'; // red
        case 'loan':
            return isDarkMode ? '#a78bfa' : '#8b5cf6'; // purple
        case 'investment':
            return isDarkMode ? '#4ade80' : '#10b981'; // green
        default:
            return isDarkMode ? '#9ca3af' : '#6b7280'; // gray
    }
}

// Format balance with proper sign and decimals
function formatBalance(account) {
    if (!account || !account.balances) return '$0.00';

    let displayBalance;
    const isDebt = account.type === 'credit' || account.type === 'loan' || account.type === 'mortgage';

    // Try current first
    const rawBalance = account.balances.current !== undefined ?
        account.balances.current :
        (account.balances.available !== undefined ? account.balances.current : 0);

    // For credit cards and loans, show the amount owed as a positive number
    // but we'll add a prefix to indicate it's a debt
    displayBalance = Math.abs(rawBalance);

    // If this is a debt account and has a non-zero balance
    if (isDebt && displayBalance > 0) {
        return `-$${displayBalance.toFixed(2)}`;
    }

    return `$${displayBalance.toFixed(2)}`;
}

export default function AccountCard({ account }) {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    // Handle undefined account gracefully
    if (!account) {
        return (
            <Card style={{ marginVertical: 8, marginHorizontal: 16 }}>
                <Card.Content>
                    <Text>Account data unavailable</Text>
                </Card.Content>
            </Card>
        );
    }

    const { name, type, subtype, balances } = account;
    const iconName = getAccountIcon(type, subtype);
    const iconColor = getAccountColor(type, isDarkMode);
    const isDebt = type === 'credit' || type === 'loan' || type === 'mortgage';

    const balanceColor = isDebt ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white';

    return (
        <Card className="mb-2 overflow-hidden">
            <Card.Content>
                <View className="flex-row items-center">
                    <View className={`w-10 h-10 rounded-full items-center justify-center mr-3`}
                          style={{backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9'}}>
                        <Ionicons name={iconName} size={20} color={iconColor} />
                    </View>

                    <View className="flex-1">
                        <Text className="font-medium text-gray-800 dark:text-white">
                            {name || 'Unnamed Account'}
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-sm">
                            {type ? `${type.charAt(0).toUpperCase() + type.slice(1)}` : ''}
                            {subtype ? ` • ${subtype.charAt(0).toUpperCase() + subtype.slice(1)}` : ''}
                        </Text>
                    </View>

                    <View>
                        <Text className={`font-bold ${balanceColor} text-right`}>
                            {formatBalance(account)}
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-xs text-right">
                            {account.mask ? `****${account.mask}` : ''}
                        </Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
}