import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, Text, Title } from 'react-native-paper';
import { VictoryLine } from 'victory-native';
import { VictoryPie } from 'victory-native';
import { useDB } from '@/store/DBContext';

export default function DashboardScreen({ navigation }) {
    const { accounts, transactions, loading } = useDB();

    // 1. Calculate total balance
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balances?.current || 0), 0);

    // 2. Weekly transaction totals
    const now = new Date();
    const last7 = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0]; // yyyy-mm-dd
    });

    const txPerDay = last7.map(day => {
        const sum = transactions
            .filter(tx => tx.date === day)
            .reduce((total, tx) => total + Math.abs(tx.amount), 0);
        return { x: day.slice(5), y: sum }; // show MM-DD
    });

    // 3. Mocked upcoming recurring (replace with real logic later)
    const upcomingRecurring = [
        { name: 'Netflix', date: '2025-04-20', amount: 15.99 },
        { name: 'Spotify', date: '2025-04-22', amount: 9.99 },
    ];

    const past = new Date();
    past.setDate(past.getDate() - 6);

    const spendingTx = transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate >= past && tx.amount < 0 && !isNaN(tx.amount);
    });

    const grouped = {};
    for (let tx of spendingTx) {
        const category = Array.isArray(tx.category) && tx.category.length
            ? tx.category[0]
            : 'Other';

        if (!category || typeof category !== 'string') continue;

        const amt = Math.abs(tx.amount);
        if (isNaN(amt) || amt <= 0) continue;

        grouped[category] = (grouped[category] || 0) + amt;
    }

    const pieData = Object.entries(grouped)
        .map(([category, total]) => ({
            x: category,
            y: Number(total.toFixed(2)),
        }))
        .filter(d => d.x && !isNaN(d.y) && d.y > 0);

    let pieChart;
    if (pieData.length === 0) {
        pieChart = <Text>No spending this period.</Text>;
    } else {
        pieChart = (
            <VictoryPie
                height={250}
                colorScale="qualitative"
                innerRadius={50}
                padAngle={2}
                style={{
                    labels: { fontSize: 12, fill: '#555' },
                }}
                data={pieData}
            />
        );
    }

    return (
        <ScrollView className="p-4">
            {/* Current Balance */}
            <Card onPress={() => navigation.navigate('Balances')} className="mb-4">
                <Card.Content>
                    <Title className="text-xl font-bold">Current Balance</Title>
                    <Text className="text-3xl mt-2">${totalBalance.toFixed(2)}</Text>
                </Card.Content>
            </Card>

            {/* Weekly Transactions */}
            <Card onPress={() => navigation.navigate('Transactions')} className="mb-4">
                <Card.Content>
                    <Title className="text-xl font-bold mb-2">Spending (Last 7 Days)</Title>
                    {txPerDay.every(p => p.y === 0) ? (
                        <Text>No transactions found.</Text>
                    ) : (
                        <VictoryLine
                            data={txPerDay}
                            height={200}
                            style={{
                                data: { stroke: "#4f46e5", strokeWidth: 2 },
                            }}
                            interpolation="natural"
                        />
                    )}
                </Card.Content>
            </Card>

            {/* Spending by Category (This Week) */}
            <Card onPress={() => navigation.navigate('Transactions')} className="mb-4">
                <Card.Content>
                    <Title className="text-xl font-bold mb-4">Spending by Category</Title>
                    {pieChart}
                </Card.Content>
            </Card>

            {/* Upcoming Recurring Payments */}
            <Card onPress={() => navigation.navigate('Recurring')} className="mb-4">
                <Card.Content>
                    <Title className="text-xl font-bold mb-2">Upcoming Payments</Title>
                    {upcomingRecurring.map((r, i) => (
                        <View key={i} className="flex-row justify-between mb-2">
                            <Text>{r.name}</Text>
                            <Text>${r.amount.toFixed(2)} – {r.date}</Text>
                        </View>
                    ))}
                </Card.Content>
            </Card>
        </ScrollView>
    );
}
