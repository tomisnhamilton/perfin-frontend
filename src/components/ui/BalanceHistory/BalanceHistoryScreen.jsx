import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, Title, Divider } from 'react-native-paper';
import { useDB } from '@/store/DBContext';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Conditionally import VictoryLine
let VictoryLine;
try {
    // Dynamic import to avoid errors
    const Victory = require('victory-native');
    VictoryLine = Victory.VictoryLine;
} catch (error) {
    console.warn("Failed to import VictoryLine:", error);
    // Create a fallback component if import fails
    VictoryLine = ({ data, height, style }) => (
        <Text className="text-center py-4">Chart unavailable</Text>
    );
}

// Format currency consistently
const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
    return `${parseFloat(amount).toFixed(2)}`;
};

// Format date for display
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

export default function BalanceHistoryScreen() {
    const { accounts, balanceHistory, loading, refetch } = useDB();
    const [refreshing, setRefreshing] = useState(false);
    const [timeframe, setTimeframe] = useState('month'); // week, month, year
    const [chartData, setChartData] = useState([]);
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    // Calculate total current balance
    const totalBalance = (accounts || []).reduce((sum, acc) => {
        // Check if acc.balances is defined and has current property
        const balance = acc?.balances?.current || acc?.balances?.available || 0;
        return sum + (typeof balance === 'number' ? balance : 0);
    }, 0);

    // Process balance history data based on selected timeframe
    useEffect(() => {
        const now = new Date();
        let cutoffDate = new Date(now);

        // Set cutoff date based on timeframe
        if (timeframe === 'week') {
            cutoffDate.setDate(now.getDate() - 7);
        } else if (timeframe === 'month') {
            cutoffDate.setMonth(now.getMonth() - 1);
        } else if (timeframe === 'year') {
            cutoffDate.setFullYear(now.getFullYear() - 1);
        }

        // If we don't have historical data, use current account balances
        if (!balanceHistory || balanceHistory.length === 0) {
            // Generate some placeholder data using current balance
            const dummyData = [];

            // Create placeholder data points
            if (timeframe === 'week') {
                // For week: daily data points
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(now.getDate() - i);

                    // Add some small random variation for visual effect (-5% to +5%)
                    const variation = totalBalance * (Math.random() * 0.1 - 0.05);

                    dummyData.push({
                        date: date.toISOString().split('T')[0],
                        balance: totalBalance + variation
                    });
                }
            } else if (timeframe === 'month') {
                // For month: weekly data points
                for (let i = 4; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(now.getDate() - (i * 7));

                    // Add some small random variation for visual effect (-10% to +10%)
                    const variation = totalBalance * (Math.random() * 0.2 - 0.1);

                    dummyData.push({
                        date: date.toISOString().split('T')[0],
                        balance: totalBalance + variation
                    });
                }
            } else {
                // For year: monthly data points
                for (let i = 11; i >= 0; i--) {
                    const date = new Date(now);
                    date.setMonth(now.getMonth() - i);

                    // Add some small random variation for visual effect (-15% to +15%)
                    const variation = totalBalance * (Math.random() * 0.3 - 0.15);

                    dummyData.push({
                        date: date.toISOString().split('T')[0],
                        balance: totalBalance + variation
                    });
                }
            }

            // Always add the current balance as the last data point
            dummyData.push({
                date: now.toISOString().split('T')[0],
                balance: totalBalance
            });

            setChartData(dummyData);
            return;
        }

        // If we have historical data, filter and process it
        let filteredData = balanceHistory.filter(item => {
            if (!item || !item.date) return false;

            const itemDate = new Date(item.date);
            return itemDate >= cutoffDate;
        });

        // Sort by date (ascending)
        filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

        // If we have real data, use it
        if (filteredData.length > 0) {
            setChartData(filteredData);
        } else {
            // Fall back to placeholder data
            setChartData([
                { date: now.toISOString().split('T')[0], balance: totalBalance }
            ]);
        }
    }, [balanceHistory, timeframe, totalBalance]);

    // If still loading, show a loading indicator
    if (loading && !refreshing) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text className="mt-4 text-gray-600">Loading your balance history...</Text>
            </View>
        );
    }

    // Format chart data for VictoryLine
    const victoryData = chartData.map(item => ({
        x: formatDate(item.date),
        y: parseFloat(item.balance) || 0
    }));

    // Calculate min and max balances for the chart
    const getMinMax = () => {
        if (!chartData || chartData.length === 0) return { min: 0, max: 100 };

        const balances = chartData.map(item => parseFloat(item.balance) || 0);
        const min = Math.min(...balances);
        const max = Math.max(...balances);

        // Add a 10% buffer above and below
        const buffer = (max - min) * 0.1;

        return {
            min: Math.max(0, min - buffer), // Don't go below zero
            max: max + buffer
        };
    };

    const { min, max } = getMinMax();

    // Render the balance chart
    let balanceChart;
    try {
        balanceChart = (
            <View className="h-60 mt-4">
                <VictoryLine
                    data={victoryData}
                    style={{
                        data: { stroke: "#4f46e5", strokeWidth: 3 },
                    }}
                    padding={{ top: 20, bottom: 30, left: 40, right: 20 }}
                    domain={{ y: [min, max] }}
                    animate={{
                        duration: 500,
                        onLoad: { duration: 500 }
                    }}
                    interpolation="natural"
                />
            </View>
        );
    } catch (error) {
        console.warn("Failed to render VictoryLine:", error);
        balanceChart = <Text className="text-center py-4">Chart unavailable</Text>;
    }

    // Calculate balance change
    const getBalanceChange = () => {
        if (!chartData || chartData.length < 2) {
            return { amount: 0, percentage: 0, isPositive: true };
        }

        // Get first and last data points
        const firstBalance = parseFloat(chartData[0].balance) || 0;
        const lastBalance = parseFloat(chartData[chartData.length - 1].balance) || 0;

        const change = lastBalance - firstBalance;
        const percentage = firstBalance !== 0 ? (change / firstBalance) * 100 : 0;

        return {
            amount: change,
            percentage: percentage,
            isPositive: change >= 0
        };
    };

    const balanceChange = getBalanceChange();

    return (
        <View className="flex-1">
            {/* Header with current balance */}
            <View className="p-4 bg-blue-600 dark:bg-blue-800">
                <Text className="text-xl font-bold text-white">Balance History</Text>
                <Text className="text-3xl font-bold text-white mt-2">
                    {formatCurrency(totalBalance)}
                </Text>
                <View className="flex-row items-center mt-1">
                    <Ionicons
                        name={balanceChange.isPositive ? "arrow-up" : "arrow-down"}
                        size={16}
                        color={balanceChange.isPositive ? "#34d399" : "#f87171"}
                    />
                    <Text className={`ml-1 ${balanceChange.isPositive ? 'text-green-300' : 'text-red-300'}`}>
                        {formatCurrency(Math.abs(balanceChange.amount))}
                        ({balanceChange.percentage.toFixed(1)}%)
                    </Text>
                    <Text className="text-blue-100 ml-1">
                        {timeframe === 'week' ? 'this week' :
                            timeframe === 'month' ? 'this month' : 'this year'}
                    </Text>
                </View>
            </View>

            {/* Timeframe selector */}
            <View className="flex-row justify-around bg-white dark:bg-gray-800 py-2 border-b border-gray-200 dark:border-gray-700">
                <TouchableOpacity
                    className={`px-4 py-2 ${timeframe === 'week' ? 'border-b-2 border-blue-600' : ''}`}
                    onPress={() => setTimeframe('week')}
                >
                    <Text className={`${timeframe === 'week' ? 'text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-300'}`}>
                        Week
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`px-4 py-2 ${timeframe === 'month' ? 'border-b-2 border-blue-600' : ''}`}
                    onPress={() => setTimeframe('month')}
                >
                    <Text className={`${timeframe === 'month' ? 'text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-300'}`}>
                        Month
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`px-4 py-2 ${timeframe === 'year' ? 'border-b-2 border-blue-600' : ''}`}
                    onPress={() => setTimeframe('year')}
                >
                    <Text className={`${timeframe === 'year' ? 'text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-300'}`}>
                        Year
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Chart and account details */}
            <ScrollView
                className="flex-1 px-4 bg-gray-50 dark:bg-gray-900"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Balance chart */}
                <Card className="mt-4">
                    <Card.Content>
                        <Title>Balance Trend</Title>
                        {chartData.length === 0 ? (
                            <Text className="text-center py-4 text-gray-500">
                                No balance history data available
                            </Text>
                        ) : (
                            balanceChart
                        )}
                    </Card.Content>
                </Card>

                {/* Account breakdown */}
                <Card className="mt-4 mb-4">
                    <Card.Content>
                        <Title>Account Breakdown</Title>
                        {(accounts || []).map((account, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <Divider className="my-2" />}
                                <View className="flex-row justify-between items-center py-2">
                                    <View>
                                        <Text className="font-medium">{account?.name || 'Account'}</Text>
                                        <Text className="text-gray-500 text-xs">
                                            {account?.subtype ? account.subtype.charAt(0).toUpperCase() + account.subtype.slice(1) : 'Account'}
                                            {account?.mask ? ` •••• ${account.mask}` : ''}
                                        </Text>
                                    </View>
                                    <Text className="font-semibold text-lg">
                                        {formatCurrency(account?.balances?.current || account?.balances?.available || 0)}
                                    </Text>
                                </View>
                            </React.Fragment>
                        ))}
                    </Card.Content>
                </Card>

                {/* Add padding at the bottom for scroll area */}
                <View className="h-8" />
            </ScrollView>
        </View>
    );
}