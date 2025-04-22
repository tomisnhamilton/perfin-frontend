import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useColorScheme, View, ActivityIndicator } from "react-native";
import "@/assets/css/global.css";
import { useNavigationTheme } from "@/navigation/useNavigationTheme";
import { PlaidProvider } from "../store/PlaidContext";
import { DBProvider } from "../store/DBContext";
import { AuthProvider, useAuth } from "../store/AuthContext";

function AuthRedirectWrapper({ children }) {
    const { user, authLoading } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (authLoading) return;

        const inAuthFlow = segments[0] === "auth";

        if (!user && !inAuthFlow) {
            router.replace("/auth");
        } else if (user && inAuthFlow) {
            router.replace("/(tabs)/dashboard");
        }
    }, [user, authLoading, segments]);

    if (authLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return children;
}

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const navigationTheme = useNavigationTheme();

    return (
        <AuthProvider>
            <DBProvider>
                <PlaidProvider colorScheme={colorScheme}>
                    <AuthRedirectWrapper>
                        <Stack
                            screenOptions={{
                                headerShown: false,
                                headerStyle: {
                                    backgroundColor: navigationTheme.headerBackground,
                                },
                                headerTintColor: navigationTheme.headerTint,
                            }}
                        />
                    </AuthRedirectWrapper>
                </PlaidProvider>
            </DBProvider>
        </AuthProvider>
    );
}
