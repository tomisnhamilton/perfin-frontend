import { View, Text } from 'react-native';
import LinkScreen from "@/app/link";



export default function HomeScreen() {
    return (
        <View style={{ padding: 20 }}>
            <Text>Welcome to Perfin</Text>
            <LinkScreen/>
        </View>
    );
}
