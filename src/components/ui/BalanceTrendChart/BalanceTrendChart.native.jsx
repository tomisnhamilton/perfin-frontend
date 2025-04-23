import React from 'react';
import { Dimensions } from 'react-native';


const screenWidth = Dimensions.get('window').width;

export default function BalanceTrendChart({ data }) {
    const labels = data.map(item => item.date.slice(5)); // "MM-DD"
    const values = data.map(item => {
        const raw = item.balance;
        const val = typeof raw === 'number' ? raw : parseFloat(raw);
        return Number.isFinite(val) ? val : 0;
    });

    if (!data.length) return null;

    return null;
}
