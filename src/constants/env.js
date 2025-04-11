// src/constants/env.js
import Constants from 'expo-constants';

// Get environment variables from Expo config
// These values are injected by app.config.js from the .env file
const getEnvVars = () => {
    // Determine which environment we're in
    const releaseChannel = Constants.expoConfig?.releaseChannel || 'development';

    // Get values from Expo's extra configuration
    const envVariables = {
        // Default to localhost if API_URL is not set in .env
        API_URL: Constants.expoConfig?.extra?.API_URL || 'localhost:3000',

        // Add other environment variables here

        // Include the current environment for debugging
        ENVIRONMENT: releaseChannel
    };

    // Log environment in development only
    if (__DEV__) {
        console.log(`Running in ${envVariables.ENVIRONMENT} environment`);
        console.log('API URL:', envVariables.API_URL);
    }

    return envVariables;
};

export default getEnvVars();