// src/store/PlaidContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as plaidService from '@/services/plaidService';
import { useAuth } from './AuthContext';

const PlaidContext = createContext(null);

export const usePlaid = () => {
    const context = useContext(PlaidContext);
    if (!context) throw new Error('usePlaid must be used within a PlaidProvider');
    return context;
};

export function PlaidProvider({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [linkedStatus, setLinkedStatus] = useState(false);

    // Get auth context
    const { userData, userToken, isAuthenticated } = useAuth();

    // When auth status changes, refresh plaid data
    useEffect(() => {
        console.log('User authentication changed, refreshing data...');
        if (isAuthenticated) {
            refreshData();
        } else {
            // Reset Plaid data when logged out
            setAccounts([]);
            setTransactions([]);
            setLinkedStatus(false);
            setIsLoading(false);
        }
    }, [isAuthenticated, userToken]);

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const userId = userData?.id;
            console.log('Fetching accounts for user:', userId);

            // Fetch accounts from backend
            const data = await plaidService.getAccounts(userToken);
            console.log('Retrieved', data?.length || 0, 'accounts');

            if (data && data.length > 0) {
                setAccounts(data);
                setLinkedStatus(true);
                return data;
            } else {
                console.warn('No accounts found for user');
                setAccounts([]);
                return [];
            }
        } catch (err) {
            console.error('Error fetching accounts:', err);
            setError('Failed to fetch account data. Please try again.');
            setAccounts([]);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            const userId = userData?.id;
            console.log('Fetching transactions for user:', userId);

            // Fetch transactions from backend
            const data = await plaidService.getTransactions(userToken);
            console.log('Retrieved', data?.length || 0, 'transactions');

            if (data && data.length > 0) {
                setTransactions(data);
                return data;
            } else {
                console.warn('No transactions found for user');
                setTransactions([]);
                return [];
            }
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError('Failed to fetch transaction data. Please try again.');
            setTransactions([]);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const refreshData = async () => {
        console.log('🔄 Refreshing Plaid data...');
        setError(null);
        setIsLoading(true);

        try {
            // First check if user has linked accounts
            const accounts = await fetchAccounts();

            if (accounts && accounts.length > 0) {
                // If accounts exist, fetch transactions
                await fetchTransactions();
                setLinkedStatus(true);
            } else {
                // If no accounts found, user hasn't linked yet
                setLinkedStatus(false);
            }
        } catch (err) {
            console.error('Error refreshing data:', err);
            setError('Unable to load your financial data.');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to initiate a full sync with Plaid
    const syncWithPlaid = async () => {
        console.log('🔄 Starting full Plaid sync...');
        setIsLoading(true);
        setError(null);

        try {
            // Make API call to backend to trigger Plaid data sync
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/sync_plaid_data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    user_id: userData?.id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to sync with Plaid');
            }

            // Refresh our local data
            await refreshData();
            return true;
        } catch (err) {
            console.error('Error during Plaid sync:', err);
            setError('Failed to sync with Plaid. Please try again later.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        isLoading,
        error,
        accounts,
        transactions,
        linkedStatus,
        refreshData,
        fetchAccounts,
        fetchTransactions,
        syncWithPlaid,
        setIsLinked: setLinkedStatus,
    };

    return <PlaidContext.Provider value={value}>{children}</PlaidContext.Provider>;
}