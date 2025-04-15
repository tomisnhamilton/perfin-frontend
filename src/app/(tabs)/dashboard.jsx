import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import MainLayout from '@/components/ui/MainLayout';
import AccountCard from '@/components/ui/AccountCard';
import BalanceTrendChart from '@/components/ui/BalanceTrendChart';
import SpendingByCategoryChart from '@/components/ui/SpendingByCategoryChart';
import { useDB } from '@/store/DBContext';
import { ScrollView } from 'react-native';


export default function Dashboard() {
    const { accounts, transactions, loading } = useDB();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const balanceData = accounts?.map(account => ({
        date: new Date().toISOString().split('T')[0],
        balance: account.balances?.available ?? 0,
    })) ?? [];

    const categoryTotals = transactions.reduce((acc, txn) => {
        const category = txn.category?.[0] || 'Uncategorized';
        acc[category] = (acc[category] || 0) + txn.amount;
        return acc;
    }, {});

    const categoryData = Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount,
    }));

    return (
        <MainLayout>
            <ScrollView>
                {accounts.map(account => (
                    <AccountCard key={account.account_id} account={account} />
                ))}
                <BalanceTrendChart data={balanceData} />
                <SpendingByCategoryChart data={categoryData} />
            </ScrollView>
        </MainLayout>
    );

}
