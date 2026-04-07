import { createContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { usersApi } from "../lib/usersApi";
import {
    readAuthStorage,
    writeAuthStorage,
    clearAuthStorage,
} from "../lib/authStorage.js";

export const AuthContext = createContext();

const LOGOUT_EVENT = "bookstore-auth-logout";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const s = readAuthStorage();
        if (s?.accessToken && s?.user) {
            setUser(s.user);
            api.defaults.headers.common.Authorization = `Bearer ${s.accessToken}`;
        }
    }, []);

    useEffect(() => {
        const onForcedLogout = () => {
            setUser(null);
            delete api.defaults.headers.common.Authorization;
        };
        window.addEventListener(LOGOUT_EVENT, onForcedLogout);
        return () => window.removeEventListener(LOGOUT_EVENT, onForcedLogout);
    }, []);

    const persist = (accessToken, refreshToken, userData) => {
        writeAuthStorage({
            accessToken,
            refreshToken,
            user: userData,
        });
    };

    const login = async (email, password) => {
        const { data } = await usersApi.login({ email, password });
        setUser(data.user);
        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        persist(data.accessToken, data.refreshToken, data.user);
    };

    const register = async ({ email, password, firstName, lastName }) => {
        const { data } = await usersApi.register({
            email,
            password,
            firstName,
            lastName,
        });
        setUser(data.user);
        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        persist(data.accessToken, data.refreshToken, data.user);
    };

    const logout = () => {
        setUser(null);
        delete api.defaults.headers.common.Authorization;
        clearAuthStorage();
    };

    const setSessionUser = (userData) => {
        setUser(userData);
        const s = readAuthStorage();
        if (s?.accessToken) {
            persist(
                s.accessToken,
                s.refreshToken ?? "",
                userData
            );
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                setSessionUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
