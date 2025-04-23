// src/app/auth/_layout.jsx
import React from 'react';
import { Stack } from 'expo-router';
import { useNavigationTheme } from '@/navigation/useNavigationTheme';

export default function AuthLayout() {
    const navigationTheme = useNavigationTheme();

    return (
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
            <Stack.Screen
                name="login"
                options={{
                    title: "Log In",
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="register"
                options={{
                    title: "Create Account",
                    headerShown: true,
                }}
            />
        </Stack>
    );
}