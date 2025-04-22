// src/store/PlaidContext.jsx
import React, { createContext, useContext, useState } from 'react';
import * as Linking from 'expo-linking'; // or use WebView-based route if preferred
import { getLinkToken } from '@/services/plaidService';

const PlaidContext = createContext(null);

export const usePlaid = () => {
    const context = useContext(PlaidContext);
    if (!context) throw new Error('usePlaid must be used within a PlaidProvider');
    return context;
};

export function PlaidProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [linkedStatus, setLinkedStatus] = useState(false);

    const linkBank = async () => {
        try {
            setIsLoading(true);
            const linkToken = await getLinkToken();

            // OPTION A: Use WebView screen
            await Linking.openURL(`perfin://PlaidLink?token=${linkToken}`);

        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        isLoading,
        error,
        linkedStatus,
        setIsLinked: setLinkedStatus,
        linkBank,
    };

    return <PlaidContext.Provider value={value}>{children}</PlaidContext.Provider>;
}
