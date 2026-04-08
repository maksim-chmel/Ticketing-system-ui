import axiosInstance from "../../axiosInstance";
import { FeedbackDto, FeedbackStatus } from "./types";

export const fetchFeedbacks = async (): Promise<FeedbackDto[]> => {
    const response = await axiosInstance.get<FeedbackDto[]>("/feedbacks");
    return response.data;
};

export const updateFeedbackStatus = async (id: number, status: FeedbackStatus): Promise<void> => {
    await axiosInstance.patch(`/feedbacks/${id}`, { status });
};
