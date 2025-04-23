// src/app/_layout.jsx - Fixed version
import React, { useEffect, useState } from "react";
import { Stack, Redirect, useSegments, useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import "@/assets/css/global.css";
import { useNavigationTheme } from "@/navigation/useNavigationTheme";
import { PlaidProvider } from "@/store/PlaidContext";
import { AuthProvider, useAuth } from "@/store/AuthContext";
import { View, Text, ActivityIndicator } from "react-native";
import { DBProvider } from "../store/DBContext";

// Helper to check if a segment is protected
const isProtectedSegment = (segment) => {
    // Example: segments in (tabs) are protected
    return segment && segment.startsWith('(tabs)');
};

// Authentication Guard component
function AuthenticationGuard({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // Skip when still loading
        if (isLoading) return;

        // Get the current segment (first segment in the array)
        const inProtectedRoute = segments && segments.length > 0 &&
            segments.some(segment => segment && isProtectedSegment(segment));

        // If we're in a protected route but not authenticated, redirect to login
        if (inProtectedRoute && !isAuthenticated) {
            router.replace('/login');
        }
        // If we're in a login/register route but already authenticated, redirect to dashboard
        else if (segments && segments.length > 0 &&
            (segments[0] === 'login' || segments[0] === 'register') &&
            isAuthenticated) {
            router.replace('/(tabs)/dashboard');
        }
    }, [isLoading, isAuthenticated, segments, router]);

    // Show loading spinner while authentication state is being determined
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={{ marginTop: 10 }}>Loading...</Text>
            </View>
        );
    }

    // Render the children once we're done redirecting, or if no redirect is needed
    return children;
}

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const navigationTheme = useNavigationTheme();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Any setup code that needs to run before rendering the app
        setIsReady(true);
    }, []);

    // Wait until everything is ready
    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={{ marginTop: 10 }}>Initializing...</Text>
            </View>
        );
    }

    return (
        <AuthProvider>
            <DBProvider>
                <PlaidProvider>
                    <AuthenticationGuard>
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
                            <Stack.Screen name="connect-bank" options={{
                                title: "Connect Bank Account",
                                headerShown: true,
                            }} />
                            <Stack.Screen name="plaid-link" options={{
                                title: "Connect Your Bank",
                                headerShown: true,
                            }} />
                            <Stack.Screen name="login" options={{ headerShown: false }} />
                            <Stack.Screen name="register" options={{ headerShown: false }} />
                            <Stack.Screen name="index" options={{ headerShown: false }} />
                        </Stack>
                    </AuthenticationGuard>
                </PlaidProvider>
            </DBProvider>
        </AuthProvider>
    );
}