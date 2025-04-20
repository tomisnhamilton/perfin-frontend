import React from 'react';
import MainLayout from '@/components/ui/MainLayout';
import { Text } from 'react-native';
import ConnectBank from "../connect-bank";

export default function SettingsPage() {
    return (
        <MainLayout>
            <Text>Settings will be configurable here.</Text>
            <ConnectBank/>
        </MainLayout>
    );
}
