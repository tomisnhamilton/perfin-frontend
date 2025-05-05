// src/navigation/useNavigationTheme.js
import { useColorScheme } from 'react-native';

export function useNavigationTheme() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    return {
        headerBackground: isDarkMode ? '#1f2937' : '#ffffff', // gray-800 or white
        headerTint: isDarkMode ? '#f9fafb' : '#1f2937', // gray-50 or gray-800
        tabBackground: isDarkMode ? '#111827' : '#ffffff', // gray-900 or white
        tabActiveColor: isDarkMode ? '#60a5fa' : '#3b82f6', // blue-400 or blue-500
        tabInactiveColor: isDarkMode ? '#6b7280' : '#9ca3af', // gray-500 or gray-400
    };
}