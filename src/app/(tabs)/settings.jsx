// src/app/(tabs)/settings.jsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/store/AuthContext";

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === "dark";
    const router = useRouter();
    const { userData, logout, isAuthenticated, deleteAccount } = useAuth();

    const handleConnectBank = () => {
        router.push('/connect-bank');
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    onPress: async () => {
                        await logout();
                        router.replace('/login');
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = () => {
        // First confirmation
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This will permanently remove all your data.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => confirmDeleteAccount()
                }
            ]
        );
    };

    const confirmDeleteAccount = () => {
        // Second confirmation for added safety
        Alert.alert(
            "Confirm Deletion",
            "This action CANNOT be undone. All your financial data will be permanently deleted.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes, Delete My Account",
                    style: "destructive",
                    onPress: async () => {
                        const success = await deleteAccount();
                        if (success) {
                            Alert.alert(
                                "Account Deleted",
                                "Your account has been successfully deleted.",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => router.replace('/login')
                                    }
                                ]
                            );
                        }
                    }
                }
            ]
        );
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
                    <Text className="text-xl font-bold text-gray-800 dark:text-white">
                        {userData?.username || "User"}
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400">
                        {userData?.email || "user@example.com"}
                    </Text>
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
                                Manage your connected bank accounts
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
                                {isDarkMode ? "Dark" : "Light"} mode (set by system)
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={isDarkMode ? "#9ca3af" : "#6b7280"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center p-4 mb-3 bg-white dark:bg-gray-800 rounded-xl"
                        onPress={handleLogout}
                    >
                        <View className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-800 items-center justify-center mr-3">
                            <Ionicons
                                name="log-out-outline"
                                size={20}
                                color={isDarkMode ? "#fdba74" : "#f97316"}
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
                </View>

                {/* Danger Zone */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">
                        Danger Zone
                    </Text>

                    <TouchableOpacity
                        className="flex-row items-center p-4 mb-3 bg-red-50 dark:bg-red-900 rounded-xl border border-red-200 dark:border-red-800"
                        onPress={handleDeleteAccount}
                    >
                        <View className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-800 items-center justify-center mr-3">
                            <Ionicons
                                name="trash-outline"
                                size={20}
                                color={isDarkMode ? "#fca5a5" : "#ef4444"}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="font-medium text-red-600 dark:text-red-400">
                                Delete Account
                            </Text>
                            <Text className="text-red-500 dark:text-red-300 text-sm">
                                Permanently delete your account and data
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={isDarkMode ? "#f87171" : "#ef4444"}
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