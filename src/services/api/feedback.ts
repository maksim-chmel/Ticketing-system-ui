import axiosInstance from "../../axiosInstance";
import { FeedbackDto, FeedbackStatus } from "./types";

const pickCreatedDateString = (raw: any): string => {
    const direct =
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
        raw?.Created;

    if (typeof direct === "string") return direct;

    if (!raw || typeof raw !== "object") return "";

    // Case-insensitive heuristic: find first string field that looks like created date/time.
    const entries = Object.entries(raw) as Array<[string, unknown]>;
    const candidateKey = (k: string) => {
        const key = k.toLowerCase();
        return (
            (key.includes("created") && key.includes("date")) ||
            (key.includes("created") && key.includes("time")) ||
            (key.includes("created") && key.endsWith("at")) ||
            key === "createdat" ||
            key === "createddate"
        );
    };

    for (const [key, val] of entries) {
        if (candidateKey(key) && typeof val === "string") return val;
    }

    return "";
};

const normalizeStatus = (raw: any): FeedbackStatus => {
    const value = raw?.status;
    if (typeof value === "number") return value as FeedbackStatus;

    if (typeof value === "string") {
        const normalized = value.replace(/\s+/g, "").toLowerCase();
        switch (normalized) {
            case "open":
                return FeedbackStatus.Open;
            case "inprogress":
                return FeedbackStatus.InProgress;
            case "waiting":
            case "waitingforreply":
                return FeedbackStatus.Waiting;
            case "done":
            case "closed":
            case "close":
                return FeedbackStatus.Done;
            case "rejected":
            case "reject":
                return FeedbackStatus.Rejected;
        }
    }

    return FeedbackStatus.Open;
};

const normalizeFeedback = (raw: any): FeedbackDto => {
    const createdDate = pickCreatedDateString(raw);

    return {
        ...raw,
        createdDate,
        status: normalizeStatus(raw),
    } as FeedbackDto;
};

export const fetchFeedbacks = async (): Promise<FeedbackDto[]> => {
    const response = await axiosInstance.get<FeedbackDto[]>("/feedbacks");
    return (response.data as any[]).map(normalizeFeedback);
};

export const updateFeedbackStatus = async (id: number, status: FeedbackStatus): Promise<void> => {
    await axiosInstance.patch(`/feedbacks/${id}`, { status });
};
