// src/services/plaidService.js

/**
 * Service for interacting with our backend API for Plaid operations
 */

// Update this to your backend URL (use environment variables in production)
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Get a link token from our backend server
 * The backend will communicate with Plaid to generate this token
 */
export const getLinkToken = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/create_link_token`);

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
export const exchangePublicToken = async (publicToken) => {
    try {
        console.log('Sending public token to backend for exchange:', publicToken);

        const response = await fetch(`${API_BASE_URL}/exchange_public_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ public_token: publicToken }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to exchange token: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error exchanging public token:', error);
        throw error;
    }
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