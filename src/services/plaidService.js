// src/services/plaidService.js
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/**
 * Get a link token from our backend server
 * The backend will communicate with Plaid to generate this token
 */
export const getLinkToken = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/create_link_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: 'demo-user-id' }), // or your actual user ID
        });

        if (!response.ok) {
            throw new Error(`Failed to get link token: ${response.status}`);
        }

        const data = await response.json();
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
export const exchangePublicToken = async (public_token) => {
    console.log("📨 Sending public_token to backend:", public_token);
    const res = await fetch(`${API_BASE_URL}/exchange_public_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token }),
    });

    if (!res.ok) throw new Error("Token exchange failed");
    return await res.json();
};


/**
 * Fetch transactions from our backend server
 * The backend will use the stored access token to get transactions from Plaid
 */
export const getTransactions = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions`);

        if (!response.ok) {
            throw new Error(`Failed to get transactions: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error getting transactions:', error);
        throw error;
    }
};

/**
 * Fetch accounts from our backend server
 */
export const getAccounts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/accounts`);

        if (!response.ok) {
            throw new Error(`Failed to get accounts: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error getting accounts:', error);
        throw error;
    }
};