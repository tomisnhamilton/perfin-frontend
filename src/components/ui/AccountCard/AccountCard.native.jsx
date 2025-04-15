import React from 'react';
import { Card, Text } from 'react-native-paper';

export default function AccountCard({ account }) {
    return (
        <Card style={{ marginVertical: 8, marginHorizontal: 16 }}>
            <Card.Content>
                <Text variant="titleMedium">{account.name}</Text>
                <Text variant="bodySmall">{account.subtype}</Text>
                <Text variant="titleLarge">
                    ${account.balances?.available?.toFixed(2) ?? '—'}
                </Text>
            </Card.Content>
        </Card>
    );
}
