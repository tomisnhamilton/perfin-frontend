// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
    // Initially redirect to the accounts tab
    return (
        <Redirect href="/accounts" />
    );
}