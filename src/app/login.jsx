// src/app/login.jsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { useAuth } from '@/store/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { login, isLoading, isAuthenticated, error } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(tabs)/dashboard');
        }
    }, [isAuthenticated]);

    const handleLogin = async () => {
        if (!email || !password) {
            return;
        }

        const success = await login(email, password);
        if (success) {
            router.replace('/(tabs)/dashboard');
        }
    };

    const navigateToRegister = () => {
        router.push('/register');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
        >
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />

            <Stack.Screen
                options={{
                    title: 'Login',
                    headerStyle: {
                        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    },
                    headerTintColor: isDarkMode ? '#f9fafb' : '#1f2937',
                    headerShadowVisible: false,
                }}
            />

            <View className="flex-1 justify-center px-6">
                <View className="items-center mb-8">
                    <View className="w-20 h-20 bg-blue-100 dark:bg-blue-800 rounded-full items-center justify-center mb-4">
                        <Ionicons
                            name="wallet-outline"
                            size={36}
                            color={isDarkMode ? '#93c5fd' : '#3b82f6'}
                        />
                    </View>
                    <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                        Welcome to PerFin
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-center">
                        Login to manage your personal finances
                    </Text>
                </View>

                <View className="mb-6">
                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                        Email
                    </Text>
                    <TextInput
                        className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-gray-800 dark:text-white mb-4"
                        placeholder="Enter your email"
                        placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                        Password
                    </Text>
                    <View className="flex-row items-center relative">
                        <TextInput
                            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-gray-800 dark:text-white flex-1"
                            placeholder="Enter your password"
                            placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!isPasswordVisible}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            className="absolute right-4"
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            <Ionicons
                                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                                size={24}
                                color={isDarkMode ? '#9ca3af' : '#6b7280'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {error && (
                    <Text className="text-red-600 dark:text-red-400 mb-4 text-center">
                        {error}
                    </Text>
                )}

                <TouchableOpacity
                    className="bg-blue-600 dark:bg-blue-500 p-4 rounded-xl items-center mb-4"
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-semibold text-lg">
                            Login
                        </Text>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-center">
                    <Text className="text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                    </Text>
                    <TouchableOpacity onPress={navigateToRegister}>
                        <Text className="text-blue-600 dark:text-blue-400 font-medium">
                            Register
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}