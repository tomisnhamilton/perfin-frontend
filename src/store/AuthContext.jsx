import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('user').then((storedUser) => {
            if (storedUser) setUser(JSON.parse(storedUser));
            setAuthLoading(false);
        });
    }, []);

    useEffect(() => {
        const restoreSession = async () => {
            const stored = await AsyncStorage.getItem('user');
            if (!stored) return setAuthLoading(false);

            const parsed = JSON.parse(stored);
            try {
                // 🔍 Confirm user still exists in DB
                const res = await axios.get(`http://localhost:3000/api/db/auth/validate/${parsed.id}`);
                if (res.data.valid) {
                    setUser(parsed);
                } else {
                    await AsyncStorage.removeItem('user');
                }
            } catch {
                await AsyncStorage.removeItem('user');
            } finally {
                setAuthLoading(false);
            }
        };

        restoreSession();
    }, []);

    const login = async (userData) => {
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
