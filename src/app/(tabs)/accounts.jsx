import React from 'react';
import MainLayout from '@/components/ui/MainLayout';
import AccountCard from '@/components/ui/AccountCard';
import { useDB } from '@/store/DBContext';
import { ScrollView } from 'react-native';

export default function AccountsPage() {
    const { accounts, loading } = useDB();

    if (loading || !accounts) return null; // optionally use <ActivityIndicator />

    return (
        <MainLayout>
            <ScrollView>
                {accounts.map(account => (
                    <AccountCard key={account.account_id} account={account} />
                ))}
            </ScrollView>
        </MainLayout>
    );
}

