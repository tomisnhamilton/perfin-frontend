// app/(tabs)/link-bank.js
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function LinkBankScreen() {
    const handleLinkBank = () => {
        // This will be replaced with actual Plaid Link functionality later
        console.log('Link bank pressed - Plaid functionality will go here');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Link Your Bank</Text>
            <Text style={styles.subtitle}>
                Connect your bank account to start tracking your finances
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={handleLinkBank}
            >
                <Text style={styles.buttonText}>Connect Bank Account</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#0055ff',
        padding: 16,
        borderRadius: 8,
        width: '100%',
        maxWidth: 300,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});