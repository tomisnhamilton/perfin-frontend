import { AppBar, Toolbar, Typography, Container } from '@mui/material';

export default function MainLayout({ title = 'Perfin', children }) {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">{title}</Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                {children}
            </Container>
        </>
    );
}
