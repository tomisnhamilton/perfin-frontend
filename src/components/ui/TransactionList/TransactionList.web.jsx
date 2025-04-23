import { List, ListItem, ListItemText, Typography } from '@mui/material';

export default function TransactionList({ transactions }) {
    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Recent Transactions
            </Typography>
            <List>
                {transactions.map(txn => (
                    <ListItem key={txn.transaction_id} divider>
                        <ListItemText
                            primary={txn.name}
                            secondary={new Date(txn.date).toLocaleDateString()}
                        />
                        <Typography>${txn.amount.toFixed(2)}</Typography>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}
