import axiosInstance from "../axiosInstance";
import { FeedbackDto, FeedbackHistoryItem, FeedbackStatus, PaginatedResponse } from "./types";

const VALID_STATUSES = new Set<string>(Object.values(FeedbackStatus));

const normalizeStatus = (raw: any): FeedbackStatus => {
    const value = raw?.status;
    if (typeof value === "string") {
        if (VALID_STATUSES.has(value)) return value as FeedbackStatus;
        switch (value.replace(/\s+/g, "").toLowerCase()) {
            case "open":        return FeedbackStatus.Open;
            case "inprogress":  return FeedbackStatus.InProgress;
            case "waiting":
            case "waitingforreply": return FeedbackStatus.Waiting;
            case "done":
            case "closed":      return FeedbackStatus.Done;
            case "rejected":    return FeedbackStatus.Rejected;
        }
    }
    return FeedbackStatus.Open;
};

const normalizeFeedback = (raw: any): FeedbackDto => ({
    ...raw,
    createdDate: raw?.createdDate ?? "",
    status: normalizeStatus(raw),
    assignedAdminId: raw?.assignedAdminId ?? null,
    assignedAdminName: raw?.assignedAdminName ?? null,
} as FeedbackDto);

export const fetchFeedbacks = async (): Promise<PaginatedResponse<FeedbackDto>> => {
    const response = await axiosInstance.get<PaginatedResponse<FeedbackDto>>("/feedbacks");
    return {
        items: (response.data.items ?? []).map(normalizeFeedback),
        totalCount: response.data.totalCount,
    };
};

export const updateFeedbackStatus = async (id: number, status: FeedbackStatus): Promise<void> => {
    await axiosInstance.patch(`/feedbacks/${id}`, { status });
};

export const claimFeedback = async (id: number): Promise<void> => {
    await axiosInstance.post(`/feedbacks/${id}/claim`);
};

export const fetchFeedbackHistory = async (id: number): Promise<FeedbackHistoryItem[]> => {
    const response = await axiosInstance.get<FeedbackHistoryItem[]>(`/feedbacks/${id}/history`);
    return response.data;
};
