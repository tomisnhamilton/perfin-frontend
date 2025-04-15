import React from 'react';
import { Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function SpendingByCategoryChart({ data }) {
    const chartData = data.map((item, index) => ({
        name: item.category,
        population: item.amount,
        color: `hsl(${index * 40}, 70%, 50%)`,
        legendFontColor: '#333',
        legendFontSize: 12,
    }));

    return (
        <PieChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: () => '#1976d2',
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="16"
            // ✅ Removed `absolute` to show just the category names
        />
    );
}
