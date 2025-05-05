// src/theme/theme.js
import { DefaultTheme, DarkTheme } from 'react-native-paper';

// Properly structured theme objects
export const lightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#3b82f6',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#ffffff',
        text: '#1f2937',
        disabled: '#9ca3af',
        placeholder: '#6b7280',
        backdrop: 'rgba(0, 0, 0, 0.5)',
        notification: '#ef4444',
        card: '#ffffff',
        border: '#e5e7eb',
    },
};

export const darkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: '#60a5fa',
        accent: '#fbbf24',
        background: '#111827',
        surface: '#1f2937',
        text: '#f9fafb',
        disabled: '#6b7280',
        placeholder: '#9ca3af',
        backdrop: 'rgba(0, 0, 0, 0.7)',
        notification: '#f87171',
        card: '#1f2937',
        border: '#374151',
    },
};