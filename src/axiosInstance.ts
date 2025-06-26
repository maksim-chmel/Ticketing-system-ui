import axios from "axios";
import BASE_URL from "./config";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true // нужно, чтобы куки (refreshToken) отправлялись автоматически
});

// Добавляем access token в каждый запрос
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Перехватываем 401 и пробуем обновить токен
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });

                const newToken = refreshResponse.data.accessToken;
                localStorage.setItem("token", newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest); // повторный запрос
            } catch (refreshError) {
                console.error("🔒 Не удалось обновить токен:", refreshError);
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;