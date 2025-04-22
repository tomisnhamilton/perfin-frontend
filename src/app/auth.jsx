import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Register from '../components/auth/register';
import Login from '../components/auth/login';

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <View style={styles.container}>
            {isLogin ? <Login /> : <Register />}
            <Button
                title={isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                onPress={() => setIsLogin(!isLogin)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
});
