import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import MainLayout from '@/components/ui/MainLayout';
import {usePlaid} from "../store/PlaidContext";
import {useRouter} from "expo-router";
import {ActivityIndicator, Text, View} from "react-native";
import * as plaidService from "../services/plaidService";


export default function PlaidLinkScreen() {
    const [linkToken, setLinkToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const { setIsLinked, fetchAccounts, fetchTransactions } = usePlaid();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            try {
                const token = await plaidService.getLinkToken();
                setLinkToken(token);
            } catch (err) {
                console.error('Error fetching Plaid link token:', err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleMessage = async (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.exit) {
                console.log('👋 User exited Plaid:', data.metadata);
                return;
            }

            const public_token = data.public_token;
            if (public_token) {
                console.log('✅ Got public_token:', public_token);
                await plaidService.exchangePublicToken(public_token);
                setIsLinked(true);
                await fetchAccounts();
                await fetchTransactions();
                router.replace('/dashboard');
            }
        } catch (e) {
            console.error('❌ Failed handling WebView message:', e);
        }
    };

    if (loading || !linkToken) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
                <Text className="mt-2">Loading secure link...</Text>
            </View>
        );
    }

    return (
        <MainLayout title="Plaid Link">
            <WebView
                source={{ uri: `http://localhost:3000/plaid-link.html?token=${linkToken}` }}
                style={{ height: 600 }}
            />
        </MainLayout>
    );
}
