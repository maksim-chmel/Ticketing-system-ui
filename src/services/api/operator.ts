import axiosInstance from "../../axiosInstance";
import { FeedbackDto, UserDto } from "./types";

export interface UsersMessageDto {
    userId: number;
    comment: string;
    createdDate: string;
    status: number;
}

export const operatorPostFeedback = async (payload: UsersMessageDto): Promise<void> => {
    await axiosInstance.post("/operator/feedbacks", payload);
};

export const operatorGetUserIds = async (): Promise<number[]> => {
    const response = await axiosInstance.get<number[]>("/operator/user-ids");
    return response.data;
};

export const operatorGetUserById = async (userId: number): Promise<UserDto> => {
    const response = await axiosInstance.get<UserDto>(`/operator/users/${userId}`);
    return response.data;
};

export const operatorUpsertUser = async (userId: number, payload: UserDto): Promise<void> => {
    await axiosInstance.put(`/operator/users/${userId}`, payload);
};

export const operatorGetUserFeedbacks = async (userId: number): Promise<FeedbackDto[]> => {
    const response = await axiosInstance.get<FeedbackDto[]>(`/operator/users/${userId}/feedbacks`);
    return (response.data as any[]).map(raw => ({
        ...raw,
        createdDate:
            raw?.date ??
            raw?.Date ??
            raw?.createdDate ??
            raw?.CreatedDate ??
            raw?.created_date ??
            raw?.createdAt ??
            raw?.CreatedAt ??
            raw?.created_at ??
            raw?.createdDateUtc ??
            raw?.CreatedDateUtc ??
            raw?.created_date_utc ??
            raw?.createdOn ??
            raw?.CreatedOn ??
            raw?.created ??
            raw?.Created ??
            "",
        status: (() => {
            const value = raw?.status;
            if (typeof value === "number") return value;
            if (typeof value === "string") {
                const normalized = value.replace(/\s+/g, "").toLowerCase();
                switch (normalized) {
                    case "open":
                        return 0;
                    case "inprogress":
                        return 1;
                    case "waiting":
                    case "waitingforreply":
                        return 2;
                    case "done":
                    case "closed":
                    case "close":
                        return 3;
                    case "rejected":
                    case "reject":
                        return 4;
                }
            }
            return 0;
        })(),
    })) as FeedbackDto[];
};

export const operatorPullBroadcastMessages = async (): Promise<Array<{ id: number; message: string }>> => {
    const response = await axiosInstance.post<Array<{ id: number; message: string }>>("/operator/broadcast-message-pulls");
    return response.data;
};

export const operatorPullUnnotifiedFeedbacks = async (): Promise<FeedbackDto[]> => {
    const response = await axiosInstance.post<FeedbackDto[]>("/operator/unnotified-feedback-pulls");
    return response.data;
};

