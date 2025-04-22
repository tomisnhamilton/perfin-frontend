// src/app/_layout.jsx
import React from "react";
import { Stack, Redirect } from "expo-router";
import { useColorScheme } from "react-native";
import "@/assets/css/global.css";
import { useNavigationTheme } from "@/navigation/useNavigationTheme";
import { PlaidProvider } from "../store/PlaidContext";
import {DBProvider} from "../store/DBContext";
import {AuthProvider} from "../store/AuthContext";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const navigationTheme = useNavigationTheme();

    // Redirect to the dashboard tab by default
    return (
        <>
            <AuthProvider>
            <DBProvider>
            <PlaidProvider colorScheme={colorScheme}>
                {/* This will redirect from the root route (/) to the (tabs)/dashboard route */}
                <Redirect href="/(tabs)/dashboard" />

                <Stack
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: navigationTheme.headerBackground,
                        },
                        headerTintColor: navigationTheme.headerTint,
                        headerShadowVisible: false,
                        headerBackTitle: "Back",
                    }}
                >
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen
                        name="connect-bank"
                        options={{
                            title: "Connect Bank Account",
                            headerShown: true,
                        }}
                    />
                    <Stack.Screen
                        name="plaid-link"
                        options={{
                            title: "Link Your Bank",
                            headerShown: true,
                            presentation: "modal",
                        }}
                    />
                    <Stack.Screen
                        name="webview-test"
                        options={{
                            title: "WebView Diagnostic",
                            headerShown: true,
                        }}
                    />
                </Stack>
            </PlaidProvider>
            </DBProvider>
            </AuthProvider>
        </>
    );
}