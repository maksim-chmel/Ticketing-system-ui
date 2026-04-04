import axiosInstance from "../../axiosInstance";
import { Feedback, FeedbackStatus } from "./types";

export const fetchFeedbacks = async (): Promise<Feedback[]> => {
    const response = await axiosInstance.get<Feedback[]>("/Feedback");
    return response.data;
};

export const updateFeedbackStatus = async (id: number, status: FeedbackStatus): Promise<void> => {
    await axiosInstance.post(`/Feedback/update-status/${id}?status=${status}`);
};
