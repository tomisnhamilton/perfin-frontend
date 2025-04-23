// src/services/plaidSyncService.js
import { Alert } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Trigger a full sync of Plaid data for a user
 * This will fetch all data types from Plaid and store in our database
 */
export const syncPlaidData = async (userToken, userId) => {
    try {
        console.log('Starting full Plaid data sync for user:', userId);

        const response = await fetch(`${API_BASE_URL}/api/sync_plaid_data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken ? `Bearer ${userToken}` : '',
            },
            body: JSON.stringify({ user_id: userId }),
        });

        if (!response.ok) {
            throw new Error(`Failed to sync Plaid data: ${response.status}`);
        }

        const data = await response.json();
        console.log('Plaid sync successful:', data);

        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Error syncing Plaid data:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Trigger a specific Plaid API endpoint to sync individual data type
 */
export const syncSpecificPlaidData = async (dataType, userToken, userId) => {
    try {
        if (!['accounts', 'transactions', 'balances', 'recurring', 'institution', 'liabilities'].includes(dataType)) {
            throw new Error(`Invalid data type: ${dataType}`);
        }

        console.log(`Syncing Plaid ${dataType} for user:`, userId);

        const response = await fetch(`${API_BASE_URL}/api/${dataType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken ? `Bearer ${userToken}` : '',
            },
            body: JSON.stringify({ user_id: userId }),
        });

        if (!response.ok) {
            throw new Error(`Failed to sync ${dataType}: ${response.status}`);
        }

        const data = await response.json();
        console.log(`${dataType} sync successful:`, data);

        return {
            success: true,
            data
        };
    } catch (error) {
        console.error(`Error syncing ${dataType}:`, error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Fetch recurring transactions from the database
 */
export const getRecurringTransactions = async (userToken, userId) => {
    try {
        const queryParams = userId ? `?user_id=${userId}` : '';
        const url = `${API_BASE_URL}/api/db/recurring${queryParams}`;

        const headers = {};
        if (userToken) {
            headers['Authorization'] = `Bearer ${userToken}`;
        }

        console.log(`Fetching recurring transactions from: ${url}`);
        const response = await fetch(url, { headers });

        if (!response.ok) {
            throw new Error(`Failed to fetch recurring transactions: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Retrieved ${data.length} recurring transactions`);
        return data;
    } catch (error) {
        console.error('Error fetching recurring transactions:', error);
        throw error;
    }
};

/**
 * Fetch balance history from the database
 */
export const getBalanceHistory = async (userToken, userId) => {
    try {
        const queryParams = userId ? `?user_id=${userId}` : '';
        const url = `${API_BASE_URL}/api/db/balances${queryParams}`;

        const headers = {};
        if (userToken) {
            headers['Authorization'] = `Bearer ${userToken}`;
        }

        console.log(`Fetching balance history from: ${url}`);
        const response = await fetch(url, { headers });

        if (!response.ok) {
            throw new Error(`Failed to fetch balance history: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Retrieved ${data.length} balance records`);
        return data;
    } catch (error) {
        console.error('Error fetching balance history:', error);
        throw error;
    }
};