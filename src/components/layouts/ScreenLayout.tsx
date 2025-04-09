import React, { ReactNode } from 'react';
import { SafeAreaView, ScrollView, View, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface ScreenLayoutProps {
    children: ReactNode;
    scrollable?: boolean;
    withPadding?: boolean;
    safeArea?: boolean;
}

export function ScreenLayout({
                                 children,
                                 scrollable = false,
                                 withPadding = true,
                                 safeArea = true,
                             }: ScreenLayoutProps) {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const backgroundClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
    const paddingClass = withPadding ? 'px-4' : '';

    const content = (
        <View className={`flex-1 ${backgroundClass} ${paddingClass}`}>
            {children}
        </View>
    );

    if (scrollable) {
        return (
            <>
                <StatusBar style={isDarkMode ? 'light' : 'dark'} />
                {safeArea ? (
                    <SafeAreaView className={`flex-1 ${backgroundClass}`}>
                        <ScrollView className="flex-1">
                            {content}
                        </ScrollView>
                    </SafeAreaView>
                ) : (
                    <ScrollView className={`flex-1 ${backgroundClass}`}>
                        {content}
                    </ScrollView>
                )}
            </>
        );
    }

    return (
        <>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            {safeArea ? (
                <SafeAreaView className={`flex-1 ${backgroundClass}`}>
                    {content}
                </SafeAreaView>
            ) : content}
        </>
    );
}