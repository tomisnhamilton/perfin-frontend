// src/app/register.jsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { useAuth } from '@/store/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const { register, isLoading, isAuthenticated, error } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(tabs)/dashboard');
        }
    }, [isAuthenticated]);

    const validateForm = () => {
        const errors = {};

        if (!username) errors.username = 'Username is required';
        if (!email) errors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
        if (!password) errors.password = 'Password is required';
        if (password.length < 6) errors.password = 'Password must be at least 6 characters';
        if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        const success = await register(username, email, password);
        if (success) {
            router.replace('/(tabs)/dashboard');
        }
    };

    const navigateToLogin = () => {
        router.push('/login');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
        >
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />

            <Stack.Screen
                options={{
                    title: 'Register',
                    headerStyle: {
                        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    },
                    headerTintColor: isDarkMode ? '#f9fafb' : '#1f2937',
                    headerShadowVisible: false,
                }}
            />

            <ScrollView contentContainerClassName="flex-grow">
                <View className="flex-1 justify-center px-6 py-8">
                    <View className="items-center mb-8">
                        <View className="w-20 h-20 bg-blue-100 dark:bg-blue-800 rounded-full items-center justify-center mb-4">
                            <Ionicons
                                name="person-add-outline"
                                size={36}
                                color={isDarkMode ? '#93c5fd' : '#3b82f6'}
                            />
                        </View>
                        <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                            Create Account
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-center">
                            Sign up to start managing your finances
                        </Text>
                    </View>

                    <View className="mb-6">
                        <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                            Username
                        </Text>
                        <TextInput
                            className={`bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-gray-800 dark:text-white mb-1 ${
                                formErrors.username ? 'border border-red-500' : ''
                            }`}
                            placeholder="Choose a username"
                            placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                        {formErrors.username && (
                            <Text className="text-red-600 dark:text-red-400 text-sm mb-2">
                                {formErrors.username}
                            </Text>
                        )}

                        <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium mt-3">
                            Email
                        </Text>
                        <TextInput
                            className={`bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-gray-800 dark:text-white mb-1 ${
                                formErrors.email ? 'border border-red-500' : ''
                            }`}
                            placeholder="Enter your email"
                            placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {formErrors.email && (
                            <Text className="text-red-600 dark:text-red-400 text-sm mb-2">
                                {formErrors.email}
                            </Text>
                        )}

                        <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium mt-3">
                            Password
                        </Text>
                        <View className="flex-row items-center relative">
                            <TextInput
                                className={`bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-gray-800 dark:text-white flex-1 ${
                                    formErrors.password ? 'border border-red-500' : ''
                                }`}
                                placeholder="Create a password"
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
                        {formErrors.password && (
                            <Text className="text-red-600 dark:text-red-400 text-sm mt-1 mb-2">
                                {formErrors.password}
                            </Text>
                        )}

                        <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium mt-3">
                            Confirm Password
                        </Text>
                        <TextInput
                            className={`bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-gray-800 dark:text-white mb-1 ${
                                formErrors.confirmPassword ? 'border border-red-500' : ''
                            }`}
                            placeholder="Confirm your password"
                            placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!isPasswordVisible}
                            autoCapitalize="none"
                        />
                        {formErrors.confirmPassword && (
                            <Text className="text-red-600 dark:text-red-400 text-sm mb-2">
                                {formErrors.confirmPassword}
                            </Text>
                        )}
                    </View>

                    {error && (
                        <Text className="text-red-600 dark:text-red-400 mb-4 text-center">
                            {error}
                        </Text>
                    )}

                    <TouchableOpacity
                        className="bg-blue-600 dark:bg-blue-500 p-4 rounded-xl items-center mb-4"
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-semibold text-lg">
                                Create Account
                            </Text>
                        )}
                    </TouchableOpacity>

                    <View className="flex-row justify-center">
                        <Text className="text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={navigateToLogin}>
                            <Text className="text-blue-600 dark:text-blue-400 font-medium">
                                Login
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}