import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../store/AuthContext';
import axios from 'axios';

export default function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const router = useRouter();
    const { login } = useAuth();

    const handleChange = (key, value) => setForm({ ...form, [key]: value });

    const handleSubmit = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/db/auth/register', form);
            const loginRes = await axios.post('http://localhost:3000/api/db/auth/login', {
                email: form.email,
                password: form.password
            });
            login(loginRes.data.user); // log them in
            router.replace('/(tabs)/dashboard');
        } catch (err) {
            Alert.alert('Error', err.response?.data?.error || 'Registration failed.');
        }
    };


    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Register</Text>
            <TextInput placeholder="Username" onChangeText={(v) => handleChange('username', v)} style={styles.input} />
            <TextInput placeholder="Email" keyboardType="email-address" onChangeText={(v) => handleChange('email', v)} style={styles.input} />
            <TextInput placeholder="Password" secureTextEntry onChangeText={(v) => handleChange('password', v)} style={styles.input} />
            <Button title="Register" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
});
