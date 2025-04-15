import React from 'react';
import { useDB } from '@/store/DBContext';
import MainLayout from '@/components/ui/MainLayout';
import BalanceTrendChart from '@/components/ui/BalanceTrendChart';
import { ScrollView } from 'react-native';

export default function BalancePage() {
    const { accounts, loading } = useDB();

    if (loading) return null; // or <ActivityIndicator />

    const chartData = accounts?.map(account => ({
        date: new Date().toISOString().split('T')[0],
        balance: account.balances?.available ?? 0,
    })) ?? [];

    return (
        <MainLayout>
            <ScrollView>
                <BalanceTrendChart data={chartData} />
            </ScrollView>
        </MainLayout>
    );
}
