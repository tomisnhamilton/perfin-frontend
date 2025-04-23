// src/services/plaidService.js
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Get a link token from our backend server
 * The backend will communicate with Plaid to generate this token
 */
export const getLinkToken = async (userToken, userId) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
        };

        // Add auth token if available
        if (userToken) {
            headers['Authorization'] = `Bearer ${userToken}`;
        }

        console.log(`Fetching Plaid link token for user: ${userId || 'unknown'}`);
        console.log(`Requesting link token from: ${API_BASE_URL}/api/create_link_token`);

        const response = await fetch(`${API_BASE_URL}/api/create_link_token`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ userId }), // Pass user ID if available
        });

        if (!response.ok) {
            throw new Error(`Failed to get link token: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received link token successfully');
        console.log('Received token:', data.link_token);
        return data.link_token;
    } catch (error) {
        console.error('Error getting link token:', error);
        throw error;
    }
};


/**
 * Exchange a public token for an access token via our backend
 * The backend will handle the communication with Plaid
 */
export const exchangePublicToken = async (public_token, userToken, userId) => {
    try {
        console.log("📨 Sending public_token to backend:", public_token);

        const headers = {
            'Content-Type': 'application/json',
        };

        // Add auth token if available
        if (userToken) {
            headers['Authorization'] = `Bearer ${userToken}`;
        }

        const res = await fetch(`${API_BASE_URL}/api/exchange_public_token`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                public_token,
                user_id: userId
            }),
        });

        if (!res.ok) throw new Error("Token exchange failed");

        const data = await res.json();
        console.log("Token exchange successful:", data);
        return data;
    } catch (error) {
        console.error("Error exchanging public token:", error);
        throw error;
    }
};


/**
 * Fetch transactions from our backend server
 * The backend will use the stored access token to get transactions from Plaid
 */
export const getTransactions = async (userToken) => {
    try {
        const userId = getUserIdFromToken(userToken);
        const queryParams = userId ? `?user_id=${userId}` : '';

        const headers = {};

        // Add auth token if available
        if (userToken) {
            headers['Authorization'] = `Bearer ${userToken}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/db/transactions${queryParams}`, {
            headers
        });

        if (!response.ok) {
            throw new Error(`Failed to get transactions: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting transactions:', error);
        return [];
    }
};

/**
 * Fetch accounts from our backend server
 */
export const getAccounts = async (userToken) => {
    try {
        const userId = getUserIdFromToken(userToken);
        const queryParams = userId ? `?user_id=${userId}` : '';

        const headers = {};

        // Add auth token if available
        if (userToken) {
            headers['Authorization'] = `Bearer ${userToken}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/db/accounts${queryParams}`, {
            headers
        });

        if (!response.ok) {
            throw new Error(`Failed to get accounts: ${response.status}`);
        }

        const data = await response.json();
        console.log('Retrieved', data.length, 'accounts');
        return data;
    } catch (error) {
        console.error('Error getting accounts:', error);
        return [];
    }
};

/**
 * Helper function to extract user ID from JWT token
 * This is a simple implementation - in production you'd want to use a proper JWT library
 */
function getUserIdFromToken(token) {
    if (!token) return null;

    try {
        // JWT tokens have three parts: header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        // Decode the payload (middle part)
        const payload = JSON.parse(atob(parts[1]));
        return payload.id || null;
    } catch (e) {
        console.error('Error parsing JWT token:', e);
        return null;
    }
}