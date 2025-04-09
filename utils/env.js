// utils/env.js
import Constants from 'expo-constants';

// Default development values
const DEV_API_URL = 'http://localhost:3000';

// Get values from environment if available
const ENV = {
    API_URL: Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || DEV_API_URL,
    ENV: Constants.expoConfig?.extra?.env || process.env.EXPO_PUBLIC_ENV || 'development',
};

// For debugging during development
if (__DEV__) {
    console.log('Environment:', ENV);
}

export const { API_URL, ENV: APP_ENV } = ENV;