// src/app/(tabs)/_layout.jsx
import React from "react";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigationTheme } from "@/navigation/useNavigationTheme";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const navigationTheme = useNavigationTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: navigationTheme.tabActiveColor,
                tabBarInactiveTintColor: navigationTheme.tabInactiveColor,
                tabBarStyle: {
                    backgroundColor: navigationTheme.tabBackground,
                    borderTopColor: isDark ? "#374151" : "#e5e7eb", // gray-700 or gray-200
                },
                headerStyle: {
                    backgroundColor: navigationTheme.headerBackground,
                },
                headerTintColor: navigationTheme.headerTint,
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