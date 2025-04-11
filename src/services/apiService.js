// src/services/apiService.js
import { ENV } from '@/constants';

// Using the API_URL from our constants, which come from .env
const API_BASE_URL = `http://${ENV.API_URL}/api`;

/**
 * Get a link token from the server
 */
export const getLinkToken = async () => {
    try {
        console.log('Fetching link token from:', `${API_BASE_URL}/create_link_token`);

        const response = await fetch(`${API_BASE_URL}/create_link_token`);

        // Log more details about the response
        console.log('Response status:', response.status);

        if (!response.ok) {
            // Try to get error details from the response
            let errorMsg = `Failed to get link token: ${response.status}`;
            try {
                const errorData = await response.json();
                console.log('Error details from server:', errorData);
                if (errorData.error) {
                    errorMsg += ` - ${errorData.error}`;
                }
            } catch (e) {
                console.log('Could not parse error response:', e);
            }

            throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log('Successfully received link token:', data.link_token ? 'Token received' : 'No token in response');
        return data.link_token;
    } catch (error) {
        console.error('Error getting link token:', error);
        throw error;
    }
};

/**
 * Exchange a public token for an access token
 */
export const exchangePublicToken = async (publicToken) => {
    try {
        console.log('Exchanging public token with backend');

        const response = await fetch(`${API_BASE_URL}/exchange_public_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ public_token: publicToken }),
        });

        if (!response.ok) {
            throw new Error(`Failed to exchange token: ${response.status}`);
        }

        console.log('Successfully exchanged public token');
        return response.json();
    } catch (error) {
        console.error('Error exchanging public token:', error);
        throw error;
    }
};

/**
 * Fetch accounts from the server
 */
export const getAccounts = async () => {
    try {
        console.log('Fetching accounts');

        const response = await fetch(`${API_BASE_URL}/accounts`);

        if (!response.ok) {
            throw new Error(`Failed to get accounts: ${response.status}`);
        }

        const data = await response.json();
        console.log('Successfully received accounts:', data.length);
        return data;
    } catch (error) {
        console.error('Error getting accounts:', error);
        throw error;
    }
};

/**
 * Fetch transactions from the server
 */
export const getTransactions = async () => {
    try {
        console.log('Fetching transactions');

        const response = await fetch(`${API_BASE_URL}/transactions`);

        if (!response.ok) {
            throw new Error(`Failed to get transactions: ${response.status}`);
        }

        const data = await response.json();
        console.log('Successfully received transactions:', data.length);
        return data;
    } catch (error) {
        console.error('Error getting transactions:', error);
        throw error;
    }
};