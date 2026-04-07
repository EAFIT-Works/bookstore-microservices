import axios from "axios";
import {
    readAuthStorage,
    writeAuthStorage,
    clearAuthStorage,
} from "./authStorage.js";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "",
});

const LOGOUT_EVENT = "bookstore-auth-logout";

function refreshUrl() {
    const base = (api.defaults.baseURL ?? "").replace(/\/$/, "");
    const path = "/api/users/auth/refresh";
    return base ? `${base}${path}` : path;
}

let isRefreshing = false;
let queue = [];

function flushQueue(error, token) {
    queue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    queue = [];
}

function setAuthHeader(config, token) {
    if (!config.headers) {
        config.headers = {};
    }
    if (typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${token}`);
    } else {
        config.headers.Authorization = `Bearer ${token}`;
    }
}

api.interceptors.response.use(
    (r) => r,
    async (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        const originalRequest = error.config;

        if (
            status !== 401 ||
            message !== "Token expired" ||
            !originalRequest
        ) {
            return Promise.reject(error);
        }

        if (originalRequest.url?.includes("/api/users/auth/refresh")) {
            clearAuthStorage();
            delete api.defaults.headers.common.Authorization;
            window.dispatchEvent(new Event(LOGOUT_EVENT));
            return Promise.reject(error);
        }

        if (originalRequest._authRetry) {
            return Promise.reject(error);
        }
        originalRequest._authRetry = true;

        const session = readAuthStorage();
        if (!session?.refreshToken) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                queue.push({ resolve, reject });
            }).then((token) => {
                setAuthHeader(originalRequest, token);
                return api(originalRequest);
            });
        }

        isRefreshing = true;
        try {
            const { data } = await axios.post(
                refreshUrl(),
                { refreshToken: session.refreshToken },
                { headers: { "Content-Type": "application/json" } }
            );
            const newAccess = data.accessToken;
            writeAuthStorage({ ...session, accessToken: newAccess });
            api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
            flushQueue(null, newAccess);
            setAuthHeader(originalRequest, newAccess);
            return api(originalRequest);
        } catch (refreshErr) {
            flushQueue(refreshErr, "");
            clearAuthStorage();
            delete api.defaults.headers.common.Authorization;
            window.dispatchEvent(new Event(LOGOUT_EVENT));
            return Promise.reject(refreshErr);
        } finally {
            isRefreshing = false;
        }
    }
);
