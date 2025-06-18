/// src/api.ts
import axios from "axios";
import BASE_URL from "./config";

export const fetchStatusDistribution = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/statistics/status-distribution`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch status distribution");
    }
};

export const fetchRequestsOverTime = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/statistics/requests-over-time`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch requests over time");
    }
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
    const response = await axios.get<Feedback[]>(`${BASE_URL}/Feedback`);
    return response.data;
};

export const updateFeedbackStatus = async (id: number, status: FeedbackStatus): Promise<void> => {
    await axios.post(`${BASE_URL}/Feedback/update-status/${id}?status=${status}`);
};