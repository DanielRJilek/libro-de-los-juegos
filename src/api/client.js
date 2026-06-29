const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, {token, method, body}) {
    const headers = {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
        const message = await response.json();
        throw new Error(message?.message || "Failed to fetch data");
    }
    return response.json();
}