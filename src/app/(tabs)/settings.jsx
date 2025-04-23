// src/app/(tabs)/settings.jsx - Updated navigation routes
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/store/AuthContext";
import { usePlaid } from "@/store/PlaidContext";

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === "dark";
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();
    const { linkedStatus, isLoading, refreshData } = usePlaid();

    const handleConnectBank = () => {
        console.log('Connect Bank button pressed');

        if (!isAuthenticated) {
            Alert.alert(
                'Login Required',
                'You need to login before connecting your bank account.',
                [
                    { text: 'Login', onPress: () => router.push('/auth/login') },
                    { text: 'Cancel', style: 'cancel' }
                ]
            );
            return;
        }

        router.push('/connect-bank');
    };

    const handleLogout = async () => {
        try {
            await logout();
            // Refresh Plaid data after logout
            refreshData();
            Alert.alert('Success', 'You have been logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to log out. Please try again.');
        }
    };

    const handleLogin = () => {
        router.push('/auth/login');
    };

    return (
        <ScreenLayout>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="items-center mb-6">
                    <View
                        className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-800 items-center justify-center mb-2">
                        <Ionicons
                            name="person"
                            size={40}
                            color={isDarkMode ? "#93c5fd" : "#3b82f6"}
                        />
                    </View>
                    {isAuthenticated && user ? (
                        <>
                            <Text className="text-xl font-bold text-gray-800 dark:text-white">
                                {user.username}
                            </Text>
                            <Text className="text-gray-500 dark:text-gray-400">
                                {user.email}
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text className="text-xl font-bold text-gray-800 dark:text-white">
                                Guest
                            </Text>
                            <Text className="text-gray-500 dark:text-gray-400">
                                Not logged in
                            </Text>
                        </>
                    )}
                </View>

                {/* Authentication Section */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                        Account
                    </Text>

                    {isAuthenticated ? (
                        <TouchableOpacity
                            className="flex-row items-center p-4 mb-3 bg-white dark:bg-gray-800 rounded-xl"
                            onPress={handleLogout}
                        >
                            <View className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-800 items-center justify-center mr-3">
                                <Ionicons
                                    name="log-out-outline"
                                    size={20}
                                    color={isDarkMode ? "#fca5a5" : "#ef4444"}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="font-medium text-gray-800 dark:text-white">
                                    Logout
                                </Text>
                                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                                    Sign out of your account
                                </Text>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={isDarkMode ? "#9ca3af" : "#6b7280"}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            className="flex-row items-center p-4 mb-3 bg-white dark:bg-gray-800 rounded-xl"
                            onPress={handleLogin}
                        >
                            <View className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800 items-center justify-center mr-3">
                                <Ionicons
                                    name="log-in-outline"
                                    size={20}
                                    color={isDarkMode ? "#86efac" : "#22c55e"}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="font-medium text-gray-800 dark:text-white">
                                    Login
                                </Text>
                                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                                    Sign in to your account
                                </Text>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={isDarkMode ? "#9ca3af" : "#6b7280"}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Connected Accounts Section */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                        Connected Accounts
                    </Text>

                    <TouchableOpacity
                        className="flex-row items-center p-4 mb-3 bg-white dark:bg-gray-800 rounded-xl"
                        onPress={handleConnectBank}
                    >
                        <View className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 items-center justify-center mr-3">
                            <Ionicons
                                name="card-outline"
                                size={20}
                                color={isDarkMode ? "#93c5fd" : "#3b82f6"}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="font-medium text-gray-800 dark:text-white">
                                Bank Accounts
                            </Text>
                            <Text className="text-gray-500 dark:text-gray-400 text-sm">
                                {linkedStatus
                                    ? "Manage your connected accounts"
                                    : "Connect your bank accounts"}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={isDarkMode ? "#9ca3af" : "#6b7280"}
                        />
                    </TouchableOpacity>
                </View>

                {/* App Settings Section */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                        App Settings
                    </Text>

                    <TouchableOpacity
                        className="flex-row items-center p-4 mb-3 bg-white dark:bg-gray-800 rounded-xl"
                    >
                        <View className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-800 items-center justify-center mr-3">
                            <Ionicons
                                name="moon-outline"
                                size={20}
                                color={isDarkMode ? "#d8b4fe" : "#8b5cf6"}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="font-medium text-gray-800 dark:text-white">
                                Appearance
                            </Text>
                            <Text className="text-gray-500 dark:text-gray-400 text-sm">
                                {isDarkMode ? "Dark" : "Light"} mode
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={isDarkMode ? "#9ca3af" : "#6b7280"}
                        />
                    </TouchableOpacity>
                </View>

                {/* App Info */}
                <Text className="text-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                    PerFin v1.0.0
                </Text>
            </ScrollView>
        </ScreenLayout>
    );
}