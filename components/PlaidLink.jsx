import { Platform, Button, Text } from 'react-native';
import PlaidWebLink from '../modules/plaid/PlaidWeb';
import { create, open, usePlaidEmitter } from '@/modules/plaid/PlaidNative';


export default function PlaidLinkWrapper({ token, onSuccess, onExit }) {
    if (Platform.OS === 'web') {
        return (
            <PlaidWebLink token={token} onSuccess={onSuccess} onExit={onExit}>
                Connect your bank account
            </PlaidWebLink>
        );
    }

    if (!create || !open) {
        return <Text>Plaid not available on this platform.</Text>;
    }

    const handlePress = async () => {
        const link = await create({ token });
        open(link);
    };

    return <Button title="Connect your bank account" onPress={handlePress} />;
}
