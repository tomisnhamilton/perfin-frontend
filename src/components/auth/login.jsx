import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../store/AuthContext';
import axios from 'axios';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const router = useRouter();
    const { login } = useAuth();

    const handleChange = (key, value) => setForm({ ...form, [key]: value });

    const handleSubmit = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/db/auth/login', form);
            login(res.data.user); // save user globally
            router.replace('/(tabs)/dashboard'); // redirect
        } catch (err) {
            Alert.alert('Error', err.response?.data?.error || 'Login failed.');
        }
    };


    return (
        <View>
            <Text variant="headlineMedium" style={styles.title}>Login</Text>
            <TextInput
                placeholder="Email"
                onChangeText={(v) => handleChange('email', v)}
                autoCapitalize="none"
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                onChangeText={(v) => handleChange('password', v)}
                secureTextEntry
                style={styles.input}
            />
            <Button title="Login" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    title: { marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
});
