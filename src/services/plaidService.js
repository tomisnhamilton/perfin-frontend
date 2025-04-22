// src/services/plaidService.js
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Get a link token from our backend server
 */
export const getLinkToken = async (userId = 'demo-user-id') => {
    try {
        console.log(`Requesting link token from: ${API_BASE_URL}/api/create_link_token`);

        const response = await fetch(`${API_BASE_URL}/api/create_link_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to get link token (${response.status}):`, errorText);
            throw new Error(`Failed to get link token: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received link token successfully');
        return data.link_token;
    } catch (error) {
        console.error('Error getting link token:', error);
        throw error;
    }
};

/**
 * Exchange a public token for an access token via our backend
 */
export const exchangePublicToken = async (public_token, user_id = 'demo-user-id') => {
    console.log("📨 Sending public_token to backend:", public_token);
    try {
        const res = await fetch(`${API_BASE_URL}/api/exchange_public_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                public_token,
                user_id
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Token exchange failed (${res.status}):`, errorText);
            throw new Error(`Token exchange failed: ${res.status}`);
        }

        const data = await res.json();
        console.log('Token exchange successful:', data);
        return data;
    } catch (error) {
        console.error('Error during token exchange:', error);
        throw error;
    }
};

/**
 * Fetch accounts from our backend server
 */
export const getAccounts = async () => {
    try {
        console.log(`Fetching accounts from: ${API_BASE_URL}/api/db/accounts`);
        const response = await fetch(`${API_BASE_URL}/api/db/accounts`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to get accounts (${response.status}):`, errorText);
            throw new Error(`Failed to get accounts: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Retrieved ${data.length} accounts`);
        return data;
    } catch (error) {
        console.error('Error getting accounts:', error);
        throw error;
    }
};

/**
 * Fetch transactions from our backend server
 */
export const getTransactions = async () => {
    try {
        console.log(`Fetching transactions from: ${API_BASE_URL}/api/db/transactions`);
        const response = await fetch(`${API_BASE_URL}/api/db/transactions`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to get transactions (${response.status}):`, errorText);
            throw new Error(`Failed to get transactions: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Retrieved ${data.length} transactions`);
        return data;
    } catch (error) {
        console.error('Error getting transactions:', error);
        throw error;
    }
};