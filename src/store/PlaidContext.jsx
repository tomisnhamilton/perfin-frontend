// src/store/PlaidContext.jsx
import React, { createContext, useContext, useState } from 'react';

const PlaidContext = createContext(null);

export const usePlaid = () => {
    const context = useContext(PlaidContext);
    if (!context) throw new Error('usePlaid must be used within a PlaidProvider');
    return context;
};

export function PlaidProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false); // not used now, but safe to keep
    const [error, setError] = useState(null);
    const [linkedStatus, setLinkedStatus] = useState(false); // still relevant if you're linking Plaid

    const value = {
        isLoading,
        error,
        linkedStatus,
        setIsLinked: setLinkedStatus,
    };

    return <PlaidContext.Provider value={value}>{children}</PlaidContext.Provider>;
}
