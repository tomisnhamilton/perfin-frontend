// src/app/auth/login.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setIsLoading(true);
        try {
            await login(email, password);
            router.replace('/(tabs)/dashboard');
        } catch (error) {
            Alert.alert('Login Failed', error.message || 'Please check your credentials and try again');
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToRegister = () => {
        router.push('/auth/register');
    };

    return (
        <View className="flex-1 bg-white p-4 justify-center">
            <View className="mb-8">
                <Text className="text-3xl font-bold text-center text-blue-600">PerFin</Text>
                <Text className="text-lg text-center text-gray-600 mt-2">Log in to your account</Text>
            </View>

            <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">Email</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View className="mb-6">
                <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity
                className="bg-blue-600 rounded-lg p-3 items-center"
                onPress={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">Log In</Text>
                )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600">Don't have an account? </Text>
                <TouchableOpacity onPress={navigateToRegister}>
                    <Text className="text-blue-600 font-medium">Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}