// src/store/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
// import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export function AuthProvider({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    // Load token and user data on startup
    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('userToken');
                const storedUser = await AsyncStorage.getItem('userData');

                if (storedToken) {
                    setUserToken(storedToken);
                    if (storedUser) {
                        setUserData(JSON.parse(storedUser));
                        console.log('✅ User loaded from storage:', JSON.parse(storedUser).username);
                    }
                }
            } catch (e) {
                console.error('Error loading auth data from storage:', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadStoredData();
    }, []);

    // Register new user
    const register = async (username, email, password) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/db/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Automatically log in after successful registration
            await login(email, password);

            return true;
        } catch (e) {
            console.error('Registration error:', e);
            setError(e.message);
            Alert.alert('Registration Failed', e.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Log in user
    const login = async (email, password) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/db/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token and user data
            setUserToken(data.token);
            setUserData(data.user);

            await AsyncStorage.setItem('userToken', data.token);
            await AsyncStorage.setItem('userData', JSON.stringify(data.user));

            console.log('✅ Login successful:', data.user.username);

            return true;
        } catch (e) {
            console.error('Login error:', e);
            setError(e.message);
            Alert.alert('Login Failed', e.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Log out user
    const logout = async () => {
        try {
            setUserToken(null);
            setUserData(null);
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
            console.log('✅ Logged out successfully');
            return true;
        } catch (e) {
            console.error('Logout error:', e);
            return false;
        }
    };

    // Refresh user data from API
    const refreshUserData = async () => {
        if (!userToken) {
            console.log('❌ Cannot refresh user data, no token');
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/db/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to refresh user data');
            }

            const userData = await response.json();
            setUserData(userData);
            await AsyncStorage.setItem('userData', JSON.stringify(userData));

            return userData;
        } catch (e) {
            console.error('Error refreshing user data:', e);
            return false;
        }
    };

    const deleteAccount = async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (!userToken) {
                throw new Error('Not authenticated');
            }

            const response = await fetch(`${API_BASE_URL}/api/db/auth/delete-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete account');
            }

            // Successful deletion - clear all local data
            await AsyncStorage.clear();
            setUserToken(null);
            setUserData(null);

            return true;
        } catch (e) {
            console.error('Account deletion error:', e);
            setError(e.message);
            Alert.alert('Account Deletion Failed', e.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Provide auth context to the app
    return (
        <AuthContext.Provider value={{
            isLoading,
            userToken,
            userData,
            error,
            register,
            login,
            logout,
            refreshUserData,
            deleteAccount,
            isAuthenticated: !!userToken
        }}>
            {children}
        </AuthContext.Provider>
    );
}