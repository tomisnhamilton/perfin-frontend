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
            console.log('Fetching accounts from:', `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/db/accounts${userId ? `?user_id=${userId}` : ''}`);

            const data = await plaidService.getAccounts(userToken);
            console.log('Retrieved', data?.length || 0, 'accounts');

            setAccounts(data || []);
            setLinkedStatus(data?.length > 0);
            return data || [];
        } catch (err) {
            console.warn('Error fetching accounts:', err);
            setAccounts([]);
            setLinkedStatus(false);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            const userId = userData?.id;
            console.log(`🔍 Raw response from ${process.env.EXPO_PUBLIC_API_BASE_URL}/api/db/transactions${userId ? `?user_id=${userId}` : ''} → ${JSON.stringify(await plaidService.getTransactions(userToken))}`);

            const data = await plaidService.getTransactions(userToken);
            setTransactions(data || []);
            return data || [];
        } catch (err) {
            console.warn('Error fetching transactions:', err);
            setTransactions([]);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const refreshData = async () => {
        console.log('🔁 Trying to fetch backend data...');
        setError(null);
        setIsLoading(true);
        try {
            const accounts = await fetchAccounts();
            if (accounts.length > 0) {
                await fetchTransactions();
            }
        } catch (err) {
            console.error('Error refreshing data:', err);
            setError('Unable to load your financial data.');
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
        setIsLinked: setLinkedStatus,
    };

    return <PlaidContext.Provider value={value}>{children}</PlaidContext.Provider>;
}