import React from "react";
import { View, Text } from "react-native";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

export default function DashboardScreen() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === "dark";

    return (
        <ScreenLayout>
            <View className="flex-1 justify-center items-center">
                <View className="bg-blue-50 dark:bg-blue-900 p-6 rounded-2xl w-full max-w-sm mb-4">
                    <Text className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        Overview
                    </Text>
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-gray-500 dark:text-gray-400">Balance</Text>
                            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                                $4,250.00
                            </Text>
                        </View>
                        <View className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 items-center justify-center">
                            <Ionicons
                                name="trending-up"
                                size={20}
                                color={isDarkMode ? "#93c5fd" : "#3b82f6"}
                            />
                        </View>
                    </View>
                </View>

                <View className="flex-row justify-between w-full max-w-sm mb-4">
                    <View className="bg-green-50 dark:bg-green-900 p-4 rounded-xl w-[48%]">
                        <View className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 items-center justify-center mb-2">
                            <Ionicons
                                name="arrow-down"
                                size={16}
                                color={isDarkMode ? "#86efac" : "#22c55e"}
                            />
                        </View>
                        <Text className="text-gray-500 dark:text-gray-400">Income</Text>
                        <Text className="text-lg font-bold text-gray-900 dark:text-white">
                            $2,450.00
                        </Text>
                    </View>

                    <View className="bg-red-50 dark:bg-red-900 p-4 rounded-xl w-[48%]">
                        <View className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-800 items-center justify-center mb-2">
                            <Ionicons
                                name="arrow-up"
                                size={16}
                                color={isDarkMode ? "#fca5a5" : "#ef4444"}
                            />
                        </View>
                        <Text className="text-gray-500 dark:text-gray-400">Expenses</Text>
                        <Text className="text-lg font-bold text-gray-900 dark:text-white">
                            $1,280.00
                        </Text>
                    </View>
                </View>

                <View className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl w-full max-w-sm">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-semibold text-gray-800 dark:text-white">
                            Recent Transactions
                        </Text>
                        <Text className="text-blue-600 dark:text-blue-400">See All</Text>
                    </View>

                    {/* Transaction item */}
                    <View className="flex-row items-center mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <View className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-800 items-center justify-center mr-3">
                            <Ionicons
                                name="cart-outline"
                                size={18}
                                color={isDarkMode ? "#d8b4fe" : "#8b5cf6"}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="font-medium text-gray-800 dark:text-white">
                                Grocery Shopping
                            </Text>
                            <Text className="text-gray-500 dark:text-gray-400 text-sm">
                                April 8, 2025
                            </Text>
                        </View>
                        <Text className="font-medium text-red-600 dark:text-red-400">-$56.80</Text>
                    </View>

                    {/* Transaction item */}
                    <View className="flex-row items-center">
                        <View className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 items-center justify-center mr-3">
                            <Ionicons
                                name="cash-outline"
                                size={18}
                                color={isDarkMode ? "#93c5fd" : "#3b82f6"}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="font-medium text-gray-800 dark:text-white">
                                Salary Deposit
                            </Text>
                            <Text className="text-gray-500 dark:text-gray-400 text-sm">
                                April 5, 2025
                            </Text>
                        </View>
                        <Text className="font-medium text-green-600 dark:text-green-400">
                            +$1,200.00
                        </Text>
                    </View>
                </View>
            </View>
        </ScreenLayout>
    );
}