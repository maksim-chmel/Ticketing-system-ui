// src/axiosInstance.ts
import axios from "axios";
import BASE_URL from "./config";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// Добавляем токен к каждому запросу (если он есть)
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;