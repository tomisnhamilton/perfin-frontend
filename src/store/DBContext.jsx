import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    getDbAccounts,
    getDbTransactions,
    getBalanceHistory,
    getRecurringTransactions,
    getInstitutions
} from '../services/dbService';
import { useAuth } from './AuthContext';

const DBContext = createContext(null);

export const useDB = () => {
    const context = useContext(DBContext);
    if (!context) throw new Error('useDB must be used within a DBProvider');
    return context;
};

export function DBProvider({ children }) {
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [balanceHistory, setBalanceHistory] = useState([]);
    const [recurring, setRecurring] = useState({ inflow: [], outflow: [] });
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userData, userToken, isAuthenticated } = useAuth();

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
                    balanceData,
                    recurringData,
                    institutionsData
                ] = await Promise.all([
                    getDbAccounts(userData.id, userToken),
                    getDbTransactions(userData.id, userToken),
                    getBalanceHistory(userData.id, userToken).catch(err => {
                        console.warn("Failed to load balance history:", err);
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

                    // Process recurring transactions data
                    const processedRecurring = {
                        inflow: recurringData.inflow_streams || [],
                        outflow: recurringData.outflow_streams || []
                    };

                    // Set all data in state
                    setAccounts(acctData);
                    setTransactions(txnData);
                    setBalanceHistory(balanceData);
                    setRecurring(processedRecurring);
                    setInstitutions(institutionsData);
                    setError(null);
                }
            } catch (err) {
                console.error("❌ Error loading financial data:", err);
                if (isMounted) {
                    setError("Failed to load your financial data. Please try again.");
                    // Set empty arrays to avoid undefined errors in components
                    setAccounts([]);
                    setTransactions([]);
                    setBalanceHistory([]);
                    setRecurring({ inflow: [], outflow: [] });
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
                balanceData,
                recurringData,
                institutionsData
            ] = await Promise.all([
                getDbAccounts(userData.id, userToken),
                getDbTransactions(userData.id, userToken),
                getBalanceHistory(userData.id, userToken).catch(() => []),
                getRecurringTransactions(userData.id, userToken).catch(() => ({ inflow_streams: [], outflow_streams: [] })),
                getInstitutions(userData.id, userToken).catch(() => [])
            ]);

            // Process recurring transactions data
            const processedRecurring = {
                inflow: recurringData.inflow_streams || [],
                outflow: recurringData.outflow_streams || []
            };

            // Set all data in state
            setAccounts(acctData);
            setTransactions(txnData);
            setBalanceHistory(balanceData);
            setRecurring(processedRecurring);
            setInstitutions(institutionsData);
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

    // Calculate upcoming transactions from recurring streams
    const getUpcomingTransactions = (days = 30) => {
        const now = new Date();
        const cutoff = new Date(now);
        cutoff.setDate(now.getDate() + days);

        // Process outflow streams (expenses)
        const upcoming = recurring.outflow.reduce((result, stream) => {
            if (!stream || !stream.stream_id) return result;

            // Get next occurrence
            const frequency = stream.frequency || 'UNKNOWN';
            const lastDate = stream.last_date ? new Date(stream.last_date) : now;

            // Skip if there's no meaningful data
            if (!stream.description || !stream.average_amount) return result;

            // Calculate next date based on frequency
            let nextDate = new Date(lastDate);

            switch(frequency.toUpperCase()) {
                case 'WEEKLY':
                    nextDate.setDate(nextDate.getDate() + 7);
                    break;
                case 'BIWEEKLY':
                    nextDate.setDate(nextDate.getDate() + 14);
                    break;
                case 'MONTHLY':
                    nextDate.setMonth(nextDate.getMonth() + 1);
                    break;
                case 'QUARTERLY':
                    nextDate.setMonth(nextDate.getMonth() + 3);
                    break;
                case 'ANNUALLY':
                    nextDate.setFullYear(nextDate.getFullYear() + 1);
                    break;
                default:
                    nextDate.setMonth(nextDate.getMonth() + 1); // Default to monthly
            }

            // Only include if it's within our window
            if (nextDate <= cutoff) {
                result.push({
                    name: stream.description,
                    amount: stream.average_amount,
                    date: nextDate.toISOString().split('T')[0],
                    frequency: frequency,
                    stream_id: stream.stream_id
                });
            }

            return result;
        }, []);

        // Sort by date (ascending)
        return upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const value = {
        accounts,
        transactions,
        balanceHistory,
        recurring,
        institutions,
        upcomingTransactions: getUpcomingTransactions(),
        loading,
        error,
        refetch: refetchData
    };

    return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
}