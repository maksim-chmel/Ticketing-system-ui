export interface StatusDistributionItem {
    name: string;
    value: number;
}

export interface RequestsOverTimeItem {
    date: string;
    value: number;
}

export enum FeedbackStatus {
    Open = "Open",
    InProgress = "InProgress",
    Waiting = "Waiting",
    Done = "Done",
    Rejected = "Rejected",
}

export interface FeedbackDto {
    id: number;
    userId: number;
    comment: string;
    username: string | null;
    phone: string | null;
    createdDate: string;
    status: FeedbackStatus;
    assignedAdminId: string | null;
    assignedAdminName: string | null;
}

export interface FeedbackHistoryItem {
    adminName: string;
    action: string;
    oldValue: string | null;
    newValue: string | null;
    createdAt: string;
}

export interface UserDto {
    userId: number;
    phone?: string;
    firstName?: string;
    lastName?: string | null;
    username?: string | null;
    comments?: string | null;
}

export interface AuthResponse {
    accessToken: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
}
