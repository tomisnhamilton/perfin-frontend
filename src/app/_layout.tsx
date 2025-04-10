import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import "@/assets/css/global.css";
import { useNavigationTheme } from "@/navigation/useNavigationTheme";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const navigationTheme = useNavigationTheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: navigationTheme.headerBackground,
                },
                headerTintColor: navigationTheme.headerTint,
                headerShadowVisible: false,
                headerBackTitle: "Back",
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
}