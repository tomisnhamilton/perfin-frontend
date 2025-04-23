const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// Accounts
export async function getDbAccounts() {
    const res = await fetch(`${API_BASE_URL}/api/db/accounts`);
    return await res.json();
}


// Transactions
export async function getDbTransactions(userId, options = {}) {
    const query = new URLSearchParams(options).toString();
    const url = `${API_BASE_URL}/api/db/transactions?${query}`;
    try {
        const res = await fetch(url);
        const text = await res.text();
        console.log("🔍 Raw response from", url, "→", text.slice(0, 300)); // Log preview
        return JSON.parse(text);
    } catch (err) {
        console.error("❌ Failed to fetch transactions:", err.message);
        throw err;
    }
}

// Grouped spending
export async function getTransactionsByCategory(userId) {
    const res = await fetch(`${API_BASE_URL}/api/db/transactions/by-category?user_id=${userId}`);
    return await res.json();
}


// Institutions
export async function getInstitutions(userId) {
    const res = await fetch(`${API_BASE_URL}/api/db/institutions?user_id=${userId}`);
    return await res.json();
}

// Recurring
export async function getRecurringTransactions(userId) {
    const res = await fetch(`${API_BASE_URL}/api/db/recurring?user_id=${userId}`);
    return await res.json();
}
