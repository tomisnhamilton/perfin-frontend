import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDbAccounts, getDbTransactions } from '../services/dbService';

const DBContext = createContext(null);

export const useDB = () => {
    const context = useContext(DBContext);
    if (!context) throw new Error('useDB must be used within a DBProvider');
    return context;
};

export function DBProvider({ children }) {
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let stop = false;

        const loadDataUntilSuccess = async () => {
            while (!stop) {
                try {
                    console.log("🔁 Trying to fetch backend data...");
                    const [acctData, txnData] = await Promise.all([
                        getDbAccounts(),
                        getDbTransactions('mock-user') // TODO: replace with actual user ID
                    ]);
                    setAccounts(acctData);
                    setTransactions(txnData);
                    setError(null);
                    break; // ✅ Success!
                } catch (err) {
                    console.warn("❌ Backend not ready, retrying in 5s...");
                    setError("Backend temporarily unavailable. Retrying...");
                    await new Promise(res => setTimeout(res, 5000));
                }
            }

            setLoading(false);
        };

        loadDataUntilSuccess();

        return () => { stop = true; }; // Cleanup
    }, []);

    const value = {
        accounts,
        transactions,
        loading,
        error,
        refetch: async () => {
            setLoading(true);
            try {
                const data = await getDbTransactions('mock-user');
                setTransactions(data);
                setError(null);
            } catch (err) {
                setError("Failed to refetch transactions.");
            } finally {
                setLoading(false);
            }
        },
    };

    return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
}
