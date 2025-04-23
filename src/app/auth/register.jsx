// src/app/auth/register.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        // Basic validation
        if (!username || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        try {
            await register(username, email, password);
            router.replace('/(tabs)/dashboard');
        } catch (error) {
            Alert.alert('Registration Failed', error.message || 'Please try again with different credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToLogin = () => {
        router.push('/auth/login');
    };

    return (
        <ScrollView className="flex-1 bg-white p-4">
            <View className="mb-8 mt-10">
                <Text className="text-3xl font-bold text-center text-blue-600">PerFin</Text>
                <Text className="text-lg text-center text-gray-600 mt-2">Create your account</Text>
            </View>

            <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">Username</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                    placeholder="Choose a username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
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

            <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                    placeholder="Create a password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <View className="mb-6">
                <Text className="text-gray-700 mb-2 font-medium">Confirm Password</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity
                className="bg-blue-600 rounded-lg p-3 items-center"
                onPress={handleRegister}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">Sign Up</Text>
                )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6 mb-10">
                <Text className="text-gray-600">Already have an account? </Text>
                <TouchableOpacity onPress={navigateToLogin}>
                    <Text className="text-blue-600 font-medium">Log In</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}