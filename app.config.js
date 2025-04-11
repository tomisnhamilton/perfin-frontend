// app.config.js - place this in the project root
import 'dotenv/config';

// Export a function that returns the config
export default ({ config }) => {
    return {
        ...config,
        extra: {
            ...(config.extra || {}),

            // Load environment variables from .env file
            API_URL: process.env.API_URL,

            // Add more environment variables here as needed
            // OTHER_VAR: process.env.OTHER_VAR,
        }
    };
};