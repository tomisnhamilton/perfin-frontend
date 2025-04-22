import React from 'react';
import { Button } from 'react-native-paper';
import MainLayout from '@/components/ui/MainLayout';
import { usePlaid } from '@/store/PlaidContext';

export default function ConnectBank() {
    const { linkBank } = usePlaid();

    return (
        <MainLayout title="Connect Your Bank">
            <Button mode="contained" onPress={linkBank} icon="bank" style={{ marginTop: 20 }}>
                Link Bank Account
            </Button>
        </MainLayout>
    );
}
