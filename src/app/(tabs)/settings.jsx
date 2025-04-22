import React from 'react';
import MainLayout from '@/components/ui/MainLayout';
import { Text } from 'react-native';
import { Link } from 'expo-router';
import ConnectBank from "../connect-bank";

export default function SettingsPage() {
    return (
        <MainLayout>
            <Text>Settings will be configurable here.</Text>
            <Link href="/auth">Manage Account</Link>
            <Link href="/connect-bank">Connect Bank</Link>
        </MainLayout>
    );
}
