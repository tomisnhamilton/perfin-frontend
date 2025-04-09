import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { API_URL } from '@/utils/env';

export default function PlaidWebLink() {
    const [linkToken, setLinkToken] = useState(null);

    useEffect(() => {
        const fetchLinkToken = async () => {
            try {
                const res = await fetch(`${API_URL}/api/create_link_token`);
                const data = await res.json();
                setLinkToken(data.link_token);
            } catch (err) {
                console.error('❌ Failed to fetch link token:', err);
            }
        };

        fetchLinkToken();
    }, []);

    const { open, ready, error } = usePlaidLink({
        token: linkToken,
        onSuccess: (public_token, metadata) => {
            console.log('✅ Success:', metadata);
            fetch(`${API_URL}/api/exchange_public_token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ public_token }),
            });
        },
        onExit: (err, metadata) => {
            console.warn('⛔️ Exit:', err, metadata);
        },
    });

    return (
        <div style={{ padding: '1rem' }}>
            <button
                onClick={() => open()}
                disabled={!ready}
                style={{
                    padding: '12px 24px',
                    fontSize: 16,
                    cursor: ready ? 'pointer' : 'not-allowed',
                    backgroundColor: '#0055ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                }}
            >
                Link Your Bank
            </button>
            {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        </div>
    );
}
