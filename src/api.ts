// src/api.ts
import axiosInstance from "./axiosInstance";
import BASE_URL from "./config";
import axios from "axios";

export const login = async (
    username: string,
    password: string
): Promise<{ accessToken: string }> => {
    const response = await axios.post(
        `${BASE_URL}/Auth/login`,
        { username, password },
        { withCredentials: true }
    );

    return response.data; // должен содержать { accessToken }
};
export const fetchStatusDistribution = async () => {
    const response = await axiosInstance.get("/statistics/status-distribution");
    return response.data;
};

export const fetchRequestsOverTime = async () => {
    const response = await axiosInstance.get("/statistics/requests-over-time");
    return response.data;
};

export enum FeedbackStatus {
    Open = 0,
    InProgress = 1,
    WaitingForReply = 2,
    Closed = 3,
    Rejected = 4
}

export interface Feedback {
    id: number;
    userId: number;
    comment: string;
    username: string | null;
    phone: string | null;
    date: string;
    status: FeedbackStatus;
}

export const fetchFeedbacks = async (): Promise<Feedback[]> => {
    const response = await axiosInstance.get<Feedback[]>("/Feedback");
    return response.data;
};

export const updateFeedbackStatus = async (id: number, status: FeedbackStatus): Promise<void> => {
    await axiosInstance.post(`/Feedback/update-status/${id}?status=${status}`);
};