// src/store/DBContext.jsx - Fixed version
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    getDbAccounts,
    getDbTransactions,
    getRecurringTransactions,
    getInstitutions
} from '../services/dbService';
import { useAuth } from './AuthContext';

// Create context with default values
const DBContext = createContext({
    accounts: [],
    transactions: [],
    balanceHistory: [],
    recurring: { inflow_streams: [], outflow_streams: [] },
    institutions: [],
    upcomingTransactions: [],
    loading: true,
    error: null,
    refetch: async () => false
});

export const useDB = () => {
    const context = useContext(DBContext);
    if (!context) throw new Error('useDB must be used within a DBProvider');
    return context;
};

export function DBProvider({ children }) {
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [recurring, setRecurring] = useState({ inflow_streams: [], outflow_streams: [] });
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get auth context safely
    const auth = useAuth();
    const userData = auth?.userData;
    const userToken = auth?.userToken;
    const isAuthenticated = auth?.isAuthenticated || false;

    // Load data when user is authenticated
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (!isAuthenticated || !userData?.id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                console.log("🔍 Fetching financial data for user:", userData.id);

                // Fetch all data types in parallel for better performance
                const [
                    acctData,
                    txnData,
                    recurringData,
                    institutionsData
                ] = await Promise.all([
                    getDbAccounts(userData.id, userToken).catch(err => {
                        console.warn("Failed to load accounts:", err);
                        return [];
                    }),
                    getDbTransactions(userData.id, userToken).catch(err => {
                        console.warn("Failed to load transactions:", err);
                        return [];
                    }),
                    getRecurringTransactions(userData.id, userToken).catch(err => {
                        console.warn("Failed to load recurring transactions:", err);
                        return { inflow_streams: [], outflow_streams: [] };
                    }),
                    getInstitutions(userData.id, userToken).catch(err => {
                        console.warn("Failed to load institutions:", err);
                        return [];
                    })
                ]);

                if (isMounted) {
                    console.log(`📊 Loaded ${acctData.length} accounts and ${txnData.length} transactions`);

                    // Log the recurring data structure
                    // console.log('Recurring data structure:',
                    //     typeof recurringData === 'object' ?
                    //         JSON.stringify(recurringData, null, 2) :
                    //         'Invalid data structure');

                    // Process recurring data - ensure it's in the right format
                    let processedRecurring = {
                        inflow_streams: [],
                        outflow_streams: []
                    };

                    // Safely handle different data structures that might come back
                    if (recurringData && typeof recurringData === 'object') {
                        if (Array.isArray(recurringData.inflow_streams)) {
                            processedRecurring.inflow_streams = recurringData.inflow_streams;
                        }

                        if (Array.isArray(recurringData.outflow_streams)) {
                            processedRecurring.outflow_streams = recurringData.outflow_streams;
                        }

                        // Also check for camelCase or different key names (just in case)
                        if (Array.isArray(recurringData.inflowStreams)) {
                            processedRecurring.inflow_streams = recurringData.inflowStreams;
                        }

                        if (Array.isArray(recurringData.outflowStreams)) {
                            processedRecurring.outflow_streams = recurringData.outflowStreams;
                        }
                    }

                    // Set all data in state
                    setAccounts(acctData || []);
                    setTransactions(txnData || []);
                    setRecurring(processedRecurring);
                    setInstitutions(institutionsData || []);
                    setError(null);

                    console.log('Recurring streams:',
                        `${processedRecurring.inflow_streams.length} inflows,`,
                        `${processedRecurring.outflow_streams.length} outflows`);
                }
            } catch (err) {
                console.error("❌ Error loading financial data:", err);
                if (isMounted) {
                    setError("Failed to load your financial data. Please try again.");
                    // Set empty arrays to avoid undefined errors in components
                    setAccounts([]);
                    setTransactions([]);
                    setRecurring({ inflow_streams: [], outflow_streams: [] });
                    setInstitutions([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadData();

        // Set up a refresh interval (every 5 minutes)
        const intervalId = setInterval(() => {
            if (isAuthenticated && userData?.id) {
                console.log("🔄 Refreshing financial data...");
                loadData();
            }
        }, 5 * 60 * 1000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [isAuthenticated, userData, userToken]);

    const refetchData = async () => {
        if (!isAuthenticated || !userData?.id) {
            return false;
        }

        setLoading(true);
        try {
            const [
                acctData,
                txnData,
                recurringData,
                institutionsData
            ] = await Promise.all([
                getDbAccounts(userData.id, userToken).catch(() => []),
                getDbTransactions(userData.id, userToken).catch(() => []),
                getRecurringTransactions(userData.id, userToken).catch(() => ({ inflow_streams: [], outflow_streams: [] })),
                getInstitutions(userData.id, userToken).catch(() => [])
            ]);

            // Process recurring data
            let processedRecurring = {
                inflow_streams: [],
                outflow_streams: []
            };

            // Handle different possible data structures
            if (recurringData && typeof recurringData === 'object') {
                if (Array.isArray(recurringData.inflow_streams)) {
                    processedRecurring.inflow_streams = recurringData.inflow_streams;
                }

                if (Array.isArray(recurringData.outflow_streams)) {
                    processedRecurring.outflow_streams = recurringData.outflow_streams;
                }

                // Also check for camelCase or different key names
                if (Array.isArray(recurringData.inflowStreams)) {
                    processedRecurring.inflow_streams = recurringData.inflowStreams;
                }

                if (Array.isArray(recurringData.outflowStreams)) {
                    processedRecurring.outflow_streams = recurringData.outflowStreams;
                }
            }

            // Set all data in state
            setAccounts(acctData || []);
            setTransactions(txnData || []);
            setRecurring(processedRecurring);
            setInstitutions(institutionsData || []);
            setError(null);

            return true;
        } catch (err) {
            console.error("❌ Error refetching data:", err);
            setError("Failed to refresh your financial data.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Calculate upcoming transactions from recurring streams - safely
    const getUpcomingTransactions = () => {
        try {
            const days = 30;
            const now = new Date();
            const cutoff = new Date(now);
            cutoff.setDate(now.getDate() + days);

            const upcoming = [];

            // Safely process outflow streams (expenses)
            if (recurring && Array.isArray(recurring.outflow_streams)) {
                recurring.outflow_streams.forEach(stream => {
                    try {
                        if (!stream || !stream.stream_id || !stream.description) return;

                        // Safely get amount
                        let amount = 0;
                        try {
                            amount = parseFloat(stream.average_amount || 0);
                            if (isNaN(amount)) amount = 0;
                        } catch (e) {
                            console.warn(`Invalid amount for ${stream.description}: ${stream.average_amount}`);
                            amount = 0;
                        }

                        // Safely get frequency and date
                        const frequency = stream.frequency || 'MONTHLY';
                        const lastDate = stream.last_date ? new Date(stream.last_date) : now;

                        // Calculate next date
                        let nextDate = new Date(lastDate);

                        switch(frequency.toUpperCase()) {
                            case 'WEEKLY':
                                nextDate.setDate(nextDate.getDate() + 7);
                                break;
                            case 'BIWEEKLY':
                                nextDate.setDate(nextDate.getDate() + 14);
                                break;
                            case 'SEMI_MONTHLY':
                                nextDate.setDate(nextDate.getDate() + 15);
                                break;
                            case 'MONTHLY':
                                nextDate.setMonth(nextDate.getMonth() + 1);
                                break;
                            case 'QUARTERLY':
                                nextDate.setMonth(nextDate.getMonth() + 3);
                                break;
                            case 'SEMI_ANNUALLY':
                                nextDate.setMonth(nextDate.getMonth() + 6);
                                break;
                            case 'ANNUALLY':
                            case 'YEARLY':
                                nextDate.setFullYear(nextDate.getFullYear() + 1);
                                break;
                            default:
                                nextDate.setMonth(nextDate.getMonth() + 1);
                        }

                        // Only include if it's within our window
                        if (nextDate <= cutoff) {
                            upcoming.push({
                                name: stream.description,
                                amount: amount,
                                date: nextDate.toISOString().split('T')[0],
                                frequency: frequency,
                                stream_id: stream.stream_id,
                                type: 'expense'
                            });
                        }
                    } catch (err) {
                        console.warn('Error processing outflow stream:', err);
                    }
                });
            }

            // Safely process inflow streams (income)
            if (recurring && Array.isArray(recurring.inflow_streams)) {
                recurring.inflow_streams.forEach(stream => {
                    try {
                        if (!stream || !stream.stream_id || !stream.description) return;

                        // Safely get amount
                        let amount = 0;
                        try {
                            amount = parseFloat(stream.average_amount || 0);
                            if (isNaN(amount)) amount = 0;
                        } catch (e) {
                            console.warn(`Invalid amount for ${stream.description}: ${stream.average_amount}`);
                            amount = 0;
                        }

                        // Safely get frequency and date
                        const frequency = stream.frequency || 'MONTHLY';
                        const lastDate = stream.last_date ? new Date(stream.last_date) : now;

                        // Calculate next date
                        let nextDate = new Date(lastDate);

                        switch(frequency.toUpperCase()) {
                            case 'WEEKLY':
                                nextDate.setDate(nextDate.getDate() + 7);
                                break;
                            case 'BIWEEKLY':
                                nextDate.setDate(nextDate.getDate() + 14);
                                break;
                            case 'SEMI_MONTHLY':
                                nextDate.setDate(nextDate.getDate() + 15);
                                break;
                            case 'MONTHLY':
                                nextDate.setMonth(nextDate.getMonth() + 1);
                                break;
                            case 'QUARTERLY':
                                nextDate.setMonth(nextDate.getMonth() + 3);
                                break;
                            case 'SEMI_ANNUALLY':
                                nextDate.setMonth(nextDate.getMonth() + 6);
                                break;
                            case 'ANNUALLY':
                            case 'YEARLY':
                                nextDate.setFullYear(nextDate.getFullYear() + 1);
                                break;
                            default:
                                nextDate.setMonth(nextDate.getMonth() + 1);
                        }

                        // Only include if it's within our window
                        if (nextDate <= cutoff) {
                            upcoming.push({
                                name: stream.description,
                                amount: amount,
                                date: nextDate.toISOString().split('T')[0],
                                frequency: frequency,
                                stream_id: stream.stream_id,
                                type: 'income'
                            });
                        }
                    } catch (err) {
                        console.warn('Error processing inflow stream:', err);
                    }
                });
            }

            // Sort by date (ascending) - safely
            return upcoming.sort((a, b) => {
                try {
                    return new Date(a.date) - new Date(b.date);
                } catch (err) {
                    return 0;
                }
            });
        } catch (err) {
            console.error('Error calculating upcoming transactions:', err);
            return [];
        }
    };

    const value = {
        accounts,
        transactions,
        balanceHistory: accounts, // Use accounts for balance history
        recurring,
        institutions,
        upcomingTransactions: getUpcomingTransactions(),
        loading,
        error,
        refetch: refetchData
    };

    return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
}