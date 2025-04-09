import { View, Text } from 'react-native';
import PlaidLink from '@/components/PlaidLink';

export default function LinkScreen() {
    return (
        <View style={{ padding: 24 }}>
            <Text style={{ fontSize: 20, marginBottom: 12 }}>Link Your Account</Text>
            <PlaidLink />
        </View>
    );
}
