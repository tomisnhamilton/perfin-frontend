// src/utils/debugHelper.js
/**
 * Helper utility to debug network connectivity issues
 */

export const checkServerConnection = async (url = 'http://localhost:3000') => {
    console.log(`Checking server connection to: ${url}`);

    try {
        const startTime = Date.now();
        const response = await fetch(`${url}/health`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const elapsed = Date.now() - startTime;

        const responseText = await response.text();

        console.log(`✅ Server responded in ${elapsed}ms with status: ${response.status}`);
        console.log(`Response: ${responseText}`);

        return {
            success: response.ok,
            status: response.status,
            text: responseText,
            time: elapsed
        };
    } catch (error) {
        console.error(`❌ Server connection failed: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Add this to your server.js file to enable the health check endpoint:
 *
 * app.get('/health', (req, res) => {
 *   res.status(200).send('OK');
 * });
 */