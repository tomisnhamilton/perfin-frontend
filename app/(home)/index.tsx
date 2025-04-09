import { View, Text } from 'react-native';
import LinkScreen from "@/components/link";



export default function HomeScreen() {
    return (
        <View style={{ padding: 20 }}>
            <Text>Welcome to Perfin</Text>
            <LinkScreen/>
        </View>
    );
}
