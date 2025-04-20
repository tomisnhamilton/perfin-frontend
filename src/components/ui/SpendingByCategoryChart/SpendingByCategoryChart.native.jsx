import React from 'react';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function SpendingByCategoryChart({ data }) {
    const chartData = data.map((item, index) => ({
        name: item.category,
        population: item.amount,
        color: `hsl(${index * 40}, 70%, 50%)`,
        legendFontColor: '#333',
        legendFontSize: 12,
    }));

    return null;
}
