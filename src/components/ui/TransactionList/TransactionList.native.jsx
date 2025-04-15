import React from 'react';
import { FlatList, View } from 'react-native';
import { List, Text } from 'react-native-paper';

export default function TransactionList({ transactions }) {
    return (
        <View style={{ margin: 16 }}>
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>
                Recent Transactions
            </Text>
            <FlatList
                data={transactions}
                keyExtractor={item => item.transaction_id}
                renderItem={({ item }) => (
                    <List.Item
                        title={item.name}
                        description={new Date(item.date).toLocaleDateString()}
                        right={() => (
                            <Text style={{ alignSelf: 'center' }}>
                                ${item.amount.toFixed(2)}
                            </Text>
                        )}
                    />
                )}
            />
        </View>
    );
}
