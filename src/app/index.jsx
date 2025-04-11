// src/app/index.js
import { Redirect } from 'expo-router';

// This file is needed for the app structure, but we'll redirect to the dashboard
export default function Index() {
    return <Redirect href="/(tabs)/dashboard" />;
}