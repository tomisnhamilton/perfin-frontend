import React from 'react';
import { WebView } from 'react-native-webview';
import MainLayout from '@/components/ui/MainLayout';

export default function PlaidLinkScreen() {
    return (
        <MainLayout title="Plaid Link">
            <WebView
                source={{ uri: 'https://link.plaid.com/?token=your_link_token' }}
                style={{ height: 600 }}
            />
        </MainLayout>
    );
}
