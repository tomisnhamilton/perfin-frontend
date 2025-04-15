import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    getDbAccounts,
    getDbTransactions,
    getTransactionsByCategory,
} from '@/services/dbService';

const DBContext = createContext();

export function DBProvider({ children }) {
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [groupedByCategory, setGroupedByCategory] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = 'lEkmnGQD1XIrvPbQ7LQQclxJzL9dXpCZJLxjB'; // 🔐 You’ll want to replace this with actual user session ID

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [accs, txns, grouped] = await Promise.all([
                    getDbAccounts(),
                    getDbTransactions({ item_id: userId }),
                    getTransactionsByCategory(userId),
                ]);
                setAccounts(accs);
                setTransactions(txns);
                setGroupedByCategory(grouped);
            } catch (err) {
                console.error('DBContext error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <DBContext.Provider value={{ accounts, transactions, groupedByCategory, loading }}>
            {children || null}
        </DBContext.Provider>
    );
}

export function useDB() {
    return useContext(DBContext);
}
