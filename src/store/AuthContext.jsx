// src/store/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the authentication context
const AuthContext = createContext(null);

// Custom hook for using the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load user from storage on initial render
    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    setIsAuthenticated(true);
                    console.log('✅ User loaded from storage:', userData.username);
                }
            } catch (error) {
                console.error('Error loading user from storage:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            setIsLoading(true);

            const response = await fetch('http://localhost:3000/api/db/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            const data = await response.json();

            // Store user data
            const userData = data.user;
            setUser(userData);
            setIsAuthenticated(true);

            // Save to AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(userData));

            console.log('✅ Logged in successfully:', userData.username);
            return userData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Register function
    const register = async (username, email, password) => {
        try {
            setIsLoading(true);

            const response = await fetch('http://localhost:3000/api/db/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            const data = await response.json();
            console.log('✅ Registered successfully:', data.message);

            // Automatically log in after registration
            return await login(email, password);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
            console.log('✅ Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Auth context value
    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}