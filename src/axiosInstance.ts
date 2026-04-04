import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import BASE_URL from "./config";

type RetryableAxiosRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

let refreshPromise: Promise<string> | null = null;

export const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized";

export const getStoredToken = () => localStorage.getItem("token");

const notifyUnauthorized = () => {
    window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
};

const storeToken = (token: string) => {
    localStorage.setItem("token", token);
};

export const clearStoredToken = () => {
    localStorage.removeItem("token");
};

export const tryRefreshAccessToken = async (): Promise<string> => {
    if (!refreshPromise) {
        refreshPromise = axios
            .post<{ accessToken: string }>(`${BASE_URL}/Auth/refresh`, {}, { withCredentials: true })
            .then(response => {
                const nextToken = response.data.accessToken;

                if (!nextToken) {
                    throw new Error("Refresh response did not include access token");
                }

                storeToken(nextToken);
                return nextToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
};

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});


axiosInstance.interceptors.request.use(config => {
    const token = getStoredToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


axiosInstance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await tryRefreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest as AxiosRequestConfig);
            } catch (refreshError) {
                console.error("Error refreshing token:", refreshError);
                clearStoredToken();
                notifyUnauthorized();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
