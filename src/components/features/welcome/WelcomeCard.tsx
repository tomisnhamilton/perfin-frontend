import React from 'react';
import { Text, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WelcomeCardProps {
    title: string;
    subtitle: string;
}

export function WelcomeCard({ title, subtitle }: WelcomeCardProps) {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    return (
        <View className="w-full max-w-sm rounded-2xl bg-blue-50 dark:bg-blue-900 p-6 items-center">
            <View className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-800 items-center justify-center mb-4">
                <Ionicons
                    name="wallet-outline"
                    size={32}
                    color={isDarkMode ? '#93c5fd' : '#3b82f6'}
                />
            </View>

            <Text className="text-2xl font-bold text-gray-800 dark:text-white text-center">
                {title}
            </Text>

            <Text className="mt-2 text-gray-600 dark:text-gray-300 text-center">
                {subtitle}
            </Text>
        </View>
    );
}