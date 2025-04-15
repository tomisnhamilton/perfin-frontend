import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import { Appbar } from 'react-native-paper';

export default function MainLayout({ title, children }) {
    return (
        <SafeAreaView style={styles.container}>
            {title && (
                <Appbar.Header>
                    <Appbar.Content title={title} />
                </Appbar.Header>
            )}
            <View style={styles.content}>
                {children}
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 16,
    },
});
