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

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const data = await plaidService.getAccounts();
            setAccounts(data);
            setLinkedStatus(data?.length > 0);
            return data;
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
            const data = await plaidService.getTransactions();
            setTransactions(data);
            return data;
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
            const accounts = await fetchAccounts();
            if (accounts.length > 0) await fetchTransactions();
        } catch (err) {
            console.error('Error refreshing data:', err);
            setError('Unable to load your financial data.');
        } finally {
            setIsLoading(false);
        }
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
        refreshData,
        fetchAccounts,
        fetchTransactions,
        setIsLinked: setLinkedStatus,
    };

    return <PlaidContext.Provider value={value}>{children}</PlaidContext.Provider>;
}
