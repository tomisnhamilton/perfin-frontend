// app/index.tsx
import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
    return (
        <View style={{ padding: 20 }}>
            <Text>Welcome to Perfin</Text>
            <Link href="/connect" asChild>
                <Button title="Connect Bank Account" />
            </Link>
        </View>
    );
}
