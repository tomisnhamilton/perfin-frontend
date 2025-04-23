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
function formatBalance(balances) {
    if (!balances) return '$0.00';

    // Try available first, then current, then 0
    const balance = balances.available !== undefined ?
        balances.available :
        (balances.current !== undefined ? balances.current : 0);

    return `$${Math.abs(balance).toFixed(2)}`;
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

    return (
        <Card className="mb-2 overflow-hidden">
            <Card.Content>
                <View className="flex-row items-center">
                    <View className={`w-10 h-10 rounded-full items-center justify-center bg-${iconColor}-100 dark:bg-${iconColor}-900 mr-3`}>
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
                        <Text className="font-bold text-gray-800 dark:text-white text-right">
                            {formatBalance(balances)}
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