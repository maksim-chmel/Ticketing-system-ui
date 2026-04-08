export interface StatusDistributionItem {
    name: string;
    value: number;
}

export interface RequestsOverTimeItem {
    date: string;
    value: number;
}

export enum FeedbackStatus {
    Open = 0,
    InProgress = 1,
    Waiting = 2,
    Done = 3,
    Rejected = 4,
}

export interface FeedbackDto {
    id: number;
    userId: number;
    comment: string;
    username: string | null;
    phone: string | null;
    createdDate: string;
    status: FeedbackStatus;
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
