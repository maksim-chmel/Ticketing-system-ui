import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login } from "../api";
import {
    clearStoredToken,
    getStoredToken,
    tryRefreshAccessToken,
    AUTH_UNAUTHORIZED_EVENT
} from "../axiosInstance";

interface AuthContextValue {
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getStoredToken()));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const bootstrapAuth = async () => {
            try {
                await tryRefreshAccessToken();

                if (isMounted) {
                    setIsAuthenticated(true);
                }
            } catch {
                if (isMounted) {
                    setIsAuthenticated(false);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void bootstrapAuth();

        const handleUnauthorized = () => {
            if (!isMounted) {
                return;
            }

            setIsAuthenticated(false);
            setIsLoading(false);
        };

        window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

        return () => {
            isMounted = false;
            window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
        };
    }, []);

    const value = useMemo<AuthContextValue>(() => ({
        isAuthenticated,
        isLoading,
        signIn: async (username: string, password: string) => {
            const data = await login(username, password);

            if (!data?.accessToken) {
                throw new Error("Invalid server response: token not received");
            }

            localStorage.setItem("token", data.accessToken);
            setIsAuthenticated(true);
        },
        signOut: () => {
            clearStoredToken();
            setIsAuthenticated(false);
        }
    }), [isAuthenticated, isLoading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};
