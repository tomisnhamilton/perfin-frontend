// src/services/dbService.js
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Accounts
export async function getDbAccounts(userId, authToken) {
    try {
        const queryParams = userId ? `?user_id=${userId}` : '';
        const url = `${API_BASE_URL}/api/db/accounts${queryParams}`;

        const headers = {};
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        console.log(`Fetching accounts from: ${url}`);
        const res = await fetch(url, { headers });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch accounts: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        console.log(`Retrieved ${data.length} accounts from the database`);
        return data;
    } catch (err) {
        console.error('Error fetching accounts:', err);
        throw err;
    }
}

// Transactions
export async function getDbTransactions(userId, authToken, options = {}) {
    try {
        // Add user_id to options
        const queryOptions = { ...options };
        if (userId) {
            queryOptions.user_id = userId;
        }

        const query = new URLSearchParams(queryOptions).toString();
        const url = `${API_BASE_URL}/api/db/transactions?${query}`;

        const headers = {};
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        console.log(`Fetching transactions from: ${url}`);
        const res = await fetch(url, { headers });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch transactions: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        console.log(`Retrieved ${data.length} transactions from the database`);
        return data;
    } catch (err) {
        console.error('Error fetching transactions:', err);
        throw err;
    }
}

// Grouped spending
export async function getTransactionsByCategory(userId, authToken) {
    try {
        const queryParams = userId ? `?user_id=${userId}` : '';
        const url = `${API_BASE_URL}/api/db/transactions/by-category${queryParams}`;

        const headers = {};
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const res = await fetch(url, { headers });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch transactions by category: ${res.status} - ${errorText}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error fetching transactions by category:', err);
        throw err;
    }
}

// Institutions
export async function getInstitutions(userId, authToken) {
    try {
        const queryParams = userId ? `?user_id=${userId}` : '';
        const url = `${API_BASE_URL}/api/db/institutions${queryParams}`;

        const headers = {};
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const res = await fetch(url, { headers });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch institutions: ${res.status} - ${errorText}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error fetching institutions:', err);
        throw err;
    }
}

// Recurring
export async function getRecurringTransactions(userId, authToken) {
    try {
        const queryParams = userId ? `?user_id=${userId}` : '';
        const url = `${API_BASE_URL}/api/db/recurring${queryParams}`;

        const headers = {};
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const res = await fetch(url, { headers });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch recurring transactions: ${res.status} - ${errorText}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error fetching recurring transactions:', err);
        throw err;
    }
}

// Balance history
export async function getBalanceHistory(userId, authToken) {
    try {
        const queryParams = userId ? `?user_id=${userId}` : '';
        const url = `${API_BASE_URL}/api/db/balances${queryParams}`;

        const headers = {};
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const res = await fetch(url, { headers });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch balance history: ${res.status} - ${errorText}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error fetching balance history:', err);
        throw err;
    }
}