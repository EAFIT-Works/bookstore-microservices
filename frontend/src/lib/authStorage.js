export const AUTH_STORAGE_KEY = "bookstore_auth";

export function readAuthStorage() {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function writeAuthStorage(data) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

export function clearAuthStorage() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
}
