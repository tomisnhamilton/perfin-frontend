import { Card, CardContent, Typography } from '@mui/material';

export default function AccountCard({ account }) {
    return (
        <Card sx={{ marginBottom: 2 }}>
            <CardContent>
                <Typography variant="h6">{account.name}</Typography>
                <Typography variant="body2">{account.subtype}</Typography>
                <Typography variant="subtitle1">
                    ${account.balances?.available?.toFixed(2) ?? '—'}
                </Typography>
            </CardContent>
        </Card>
    );
}
