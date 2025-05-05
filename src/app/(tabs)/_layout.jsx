// src/app/(tabs)/_layout.jsx - Simplified tabs layout without theme references
import React from "react";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: isDark ? '#60a5fa' : '#3b82f6',
                tabBarInactiveTintColor: isDark ? '#6b7280' : '#9ca3af',
                tabBarStyle: {
                    backgroundColor: isDark ? "#111827" : "#ffffff",
                    borderTopColor: isDark ? "#374151" : "#e5e7eb",
                },
                headerStyle: {
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                },
                headerTintColor: isDark ? '#f9fafb' : '#1f2937',
                headerShadowVisible: false,
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    title: "Transactions",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="accounts"
                options={{
                    title: "Accounts",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="recurring"
                options={{
                    title: "Recurring",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}