// src/store/PlaidContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as plaidService from '@/services/plaidService';

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
    const [userId, setUserId] = useState('demo-user-id'); // Default user ID for demo purposes

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            console.log('Fetching accounts...');
            const data = await plaidService.getAccounts();
            console.log(`Received ${data.length} accounts`);

            // Process accounts to include any additional info needed
            const processedAccounts = data.map(account => ({
                ...account,
                // Add any derived or formatted fields here
                balance: account.balances?.current || 0,
                formattedBalance: formatCurrency(account.balances?.current || 0)
            }));

            setAccounts(processedAccounts);
            setLinkedStatus(processedAccounts.length > 0);
            return processedAccounts;
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
            console.log('Fetching transactions...');
            const data = await plaidService.getTransactions();
            console.log(`Received ${data.length} transactions`);

            // Process transactions to include any additional info needed
            const processedTransactions = data.map(tx => ({
                ...tx,
                // Add any derived or formatted fields here
                formattedAmount: formatCurrency(tx.amount || 0),
                date: new Date(tx.date)
            }));

            setTransactions(processedTransactions);
            return processedTransactions;
        } catch (err) {
            console.warn('Error fetching transactions:', err);
            setTransactions([]);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const refreshData = async () => {
        setError(null);
        setIsLoading(true);
        try {
            console.log('Refreshing Plaid data...');
            const accounts = await fetchAccounts();
            if (accounts.length > 0) {
                await fetchTransactions();
            }
            console.log('Data refresh complete');
        } catch (err) {
            console.error('Error refreshing data:', err);
            setError('Unable to load your financial data.');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    useEffect(() => {
        refreshData();
    }, []);

    const value = {
        isLoading,
        error,
        accounts,
        transactions,
        linkedStatus,
        userId,
        refreshData,
        fetchAccounts,
        fetchTransactions,
        setUserId,
        setIsLinked: setLinkedStatus,
    };

    return <PlaidContext.Provider value={value}>{children}</PlaidContext.Provider>;
}