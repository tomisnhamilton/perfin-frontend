// src/store/PlaidContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as plaidService from '@/services/plaidService';

// Create the context with a default value
const PlaidContext = createContext(null);

// Custom hook to use the Plaid context
export const usePlaid = () => {
    const context = useContext(PlaidContext);

    if (context === null || context === undefined) {
        throw new Error('usePlaid must be used within a PlaidProvider');
    }

    return context;
};

// Plaid Provider component
export function PlaidProvider({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [linkedStatus, setLinkedStatus] = useState(false);

    // Check if user has any linked accounts
    const fetchAccounts = async () => {
        try {
            setIsLoading(true);

            // Try to fetch accounts from backend
            let fetchedAccounts = [];
            try {
                fetchedAccounts = await plaidService.getAccounts();
            } catch (err) {
                console.warn('Error fetching accounts:', err);
                // Fallback to empty array if API is not available
                fetchedAccounts = [];
            }

            setAccounts(fetchedAccounts);
            setLinkedStatus(fetchedAccounts && fetchedAccounts.length > 0);

            return fetchedAccounts;
        } catch (err) {
            console.error('Error in fetchAccounts:', err);
            setAccounts([]);
            setLinkedStatus(false);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch transactions from the backend
    const fetchTransactions = async () => {
        try {
            setIsLoading(true);

            // Try to fetch transactions from backend
            let fetchedTransactions = [];
            try {
                fetchedTransactions = await plaidService.getTransactions();
            } catch (err) {
                console.warn('Error fetching transactions:', err);
                // Fallback to empty array if API is not available
                fetchedTransactions = [];
            }

            setTransactions(fetchedTransactions || []);

            return fetchedTransactions;
        } catch (err) {
            console.error('Error in fetchTransactions:', err);
            setTransactions([]);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Refresh all data
    const refreshData = async () => {
        setError(null);
        setIsLoading(true);

        try {
            // Try to fetch accounts first
            const accounts = await fetchAccounts();

            // If we have accounts, try to fetch transactions
            if (accounts && accounts.length > 0) {
                await fetchTransactions();
            }
        } catch (err) {
            console.error('Error refreshing data:', err);
            setError('Unable to load your financial data. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        refreshData().catch(err => {
            console.error('Error during initial data load:', err);
        });
    }, []);

    // Value to be provided by the context
    const value = {
        isLoading,
        error,
        accounts,
        transactions,
        linkedStatus,
        refreshData
    };

    console.log('PlaidProvider rendering with context value:', value);

    return <PlaidContext.Provider value={value}>{children}</PlaidContext.Provider>;
}