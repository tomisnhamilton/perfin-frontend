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
    const [allAccounts, setAllAccounts] = useState([]);
    const [userAccounts, setUserAccounts] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [userTransactions, setUserTransactions] = useState([]);
    const [linkedStatus, setLinkedStatus] = useState(false);

    // Get the auth context to access the current user
    const { user, isAuthenticated } = useAuth();

    // Get the current user's ID, or use demo if not authenticated
    const getCurrentUserId = () => {
        if (isAuthenticated && user && user.id) {
            return user.id;
        }
        return 'demo-user-id';
    };

    // Filter accounts to only show those belonging to the current user
    const filterAccountsForUser = async (accounts, userId) => {
        if (!userId || !accounts || accounts.length === 0) return [];

        try {
            // Fetch user items
            const response = await fetch(`http://localhost:3000/api/db/items?user_id=${userId}`, {
                headers: { 'X-User-ID': userId }
            });

            if (!response.ok) {
                console.warn('Failed to fetch user items');
                return [];
            }

            const userItems = await response.json();
            const userItemIds = userItems.map(item => item.item_id);

            // Filter accounts that belong to user's items
            return accounts.filter(account => {
                // Make sure account has an item_id property
                return account.item_id && userItemIds.includes(account.item_id);
            });
        } catch (err) {
            console.error('Error filtering accounts for user:', err);
            return [];
        }
    };

    // Filter transactions to only show those belonging to the current user
    const filterTransactionsForUser = async (transactions, userId) => {
        if (!userId || !transactions || transactions.length === 0) return [];

        try {
            // Fetch user items
            const response = await fetch(`http://localhost:3000/api/db/items?user_id=${userId}`, {
                headers: { 'X-User-ID': userId }
            });

            if (!response.ok) {
                console.warn('Failed to fetch user items');
                return [];
            }

            const userItems = await response.json();
            const userItemIds = userItems.map(item => item.item_id);

            // Filter transactions that belong to user's items
            return transactions.filter(transaction => {
                // Make sure transaction has an item_id property
                return transaction.item_id && userItemIds.includes(transaction.item_id);
            });
        } catch (err) {
            console.error('Error filtering transactions for user:', err);
            return [];
        }
    };

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            // Use the existing function to get all accounts
            const data = await plaidService.getAccounts();
            setAllAccounts(data);

            // Filter accounts for the current user
            const userId = getCurrentUserId();
            const filtered = await filterAccountsForUser(data, userId);
            setUserAccounts(filtered);

            // Set linked status based on user accounts
            const isLinked = filtered && filtered.length > 0;
            setLinkedStatus(isLinked);

            return filtered;
        } catch (err) {
            console.warn('Error fetching accounts:', err);
            setAllAccounts([]);
            setUserAccounts([]);
            setLinkedStatus(false);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            // Use the existing function to get all transactions
            const data = await plaidService.getTransactions();
            setAllTransactions(data);

            // Filter transactions for the current user
            const userId = getCurrentUserId();
            const filtered = await filterTransactionsForUser(data, userId);
            setUserTransactions(filtered);

            return filtered;
        } catch (err) {
            console.warn('Error fetching transactions:', err);
            setAllTransactions([]);
            setUserTransactions([]);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const refreshData = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const accounts = await fetchAccounts();
            if (accounts.length > 0) await fetchTransactions();
        } catch (err) {
            console.error('Error refreshing data:', err);
            setError('Unable to load your financial data.');
        } finally {
            setIsLoading(false);
        }
    };

    // Refresh data when user changes
    useEffect(() => {
        console.log('User authentication changed, refreshing data...');
        refreshData();
    }, [isAuthenticated, user]);

    // Make sure to use the filtered accounts and transactions for the UI
    const value = {
        isLoading,
        error,
        accounts: userAccounts, // Use filtered accounts
        transactions: userTransactions, // Use filtered transactions
        allAccounts, // Provide access to all accounts for admin purposes
        allTransactions, // Provide access to all transactions for admin purposes
        linkedStatus,
        getCurrentUserId,
        refreshData,
        fetchAccounts,
        fetchTransactions,
        setIsLinked: setLinkedStatus,
    };

    return <PlaidContext.Provider value={value}>{children}</PlaidContext.Provider>;
}