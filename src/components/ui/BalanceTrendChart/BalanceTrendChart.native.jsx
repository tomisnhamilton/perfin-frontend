import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function BalanceTrendChart({ data }) {
    const labels = data.map(item => item.date.slice(5)); // "MM-DD"
    const values = data.map(item => {
        const raw = item.balance;
        const val = typeof raw === 'number' ? raw : parseFloat(raw);
        return Number.isFinite(val) ? val : 0;
    });

    if (!data.length) return null;

    return (
        <LineChart
            data={{
                labels,
                datasets: [{ data: values }],
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 2,
                color: () => '#1976d2',
                labelColor: () => '#666',
            }}
            bezier
            style={{ marginHorizontal: 16, marginTop: 8 }}
        />
    );
}
