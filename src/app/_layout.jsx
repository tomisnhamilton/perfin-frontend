import React from "react";
import { Stack, Redirect } from "expo-router";
import { useColorScheme } from "react-native";
import "@/assets/css/global.css";
import { useNavigationTheme } from "@/navigation/useNavigationTheme";
import { PlaidProvider } from "../store/PlaidContext";
import { DBProvider } from "../store/DBContext";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const navigationTheme = useNavigationTheme();

    return (
        <DBProvider>
            <PlaidProvider colorScheme={colorScheme}>
                <>
                    <Redirect href="/(tabs)/dashboard" />
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            headerStyle: {
                                backgroundColor: navigationTheme.headerBackground,
                            },
                            headerTintColor: navigationTheme.headerTint,
                        }}
                    />
                </>
            </PlaidProvider>
        </DBProvider>
    );
}
