import React from 'react';
import MainLayout from '@/components/ui/MainLayout';
import TransactionList from '@/components/ui/TransactionList';
import { useDB } from '@/store/DBContext';

export default function TransactionsPage() {
    const { transactions, loading } = useDB();

    if (loading) return null; // or <ActivityIndicator />

    return (
        <MainLayout>
            <TransactionList transactions={transactions} />
        </MainLayout>
    );
}
