// services/api.js or wherever you're storing this
export async function exchangePublicToken(publicToken) {
    try {
        const res = await fetch('http://localhost:3000/api/exchange_public_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ public_token: publicToken }),
        });

        const text = await res.text(); // 👈 fetch raw response
        console.log('🔍 Raw response:', text);

        try {
            const data = JSON.parse(text); // 👈 attempt to parse it
            console.log('✅ Token exchanged:', data);
            return data;
        } catch (jsonErr) {
            console.error('❌ JSON parse error:', jsonErr.message);
            throw new Error('Server did not return valid JSON.');
        }
    } catch (err) {
        console.error('❌ Network or server error:', err.message);
        throw err;
    }
}
