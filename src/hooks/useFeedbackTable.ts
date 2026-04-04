import { useEffect, useMemo, useState } from "react";
import {
    fetchFeedbacks,
    Feedback,
    FeedbackStatus,
    updateFeedbackStatus
} from "../api";
import { getErrorMessage } from "../utils/getErrorMessage";

const normalizeSearchValue = (value: string) => value.trim().toLowerCase();
const normalizePhoneValue = (value: string) => value.replace(/\D/g, "");

const statusMap: Record<FeedbackStatus, string> = {
    [FeedbackStatus.Open]: "Open",
    [FeedbackStatus.InProgress]: "In Progress",
    [FeedbackStatus.Waiting]: "Waiting for Reply",
    [FeedbackStatus.Done]: "Closed",
    [FeedbackStatus.Rejected]: "Rejected"
};

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString("en-GB");
};

export const useFeedbackTable = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedComment, setSelectedComment] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const loadFeedbacks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchFeedbacks();
            setFeedbacks(data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load tickets"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadFeedbacks();
    }, []);

    const changeStatus = async (id: number, newStatus: FeedbackStatus) => {
        try {
            setError(null);
            await updateFeedbackStatus(id, newStatus);
            setFeedbacks(prev =>
                prev.map(fb => fb.id === id ? { ...fb, status: newStatus } : fb)
            );
        } catch (err) {
            setError(getErrorMessage(err, "Failed to update status"));
        }
    };

    const filteredFeedbacks = useMemo(() => (
        feedbacks
            .filter(fb => (statusFilter === "all" ? true : fb.status === statusFilter))
            .filter(fb => {
                const query = normalizeSearchValue(searchQuery);

                if (!query) {
                    return true;
                }

                const rawPhone = fb.phone ?? "";
                const searchIndex = [
                    fb.id.toString(),
                    fb.userId.toString(),
                    fb.username ?? "",
                    rawPhone,
                    normalizePhoneValue(rawPhone),
                    fb.comment ?? "",
                    statusMap[fb.status],
                    formatDate(fb.date),
                ]
                    .map(normalizeSearchValue)
                    .join(" ");

                return searchIndex.includes(query) || normalizePhoneValue(rawPhone).includes(normalizePhoneValue(query));
            })
    ), [feedbacks, searchQuery, statusFilter]);

    return {
        error,
        filteredFeedbacks,
        formatDate,
        loadFeedbacks,
        loading,
        searchQuery,
        selectedComment,
        setSearchQuery,
        setSelectedComment,
        setStatusFilter,
        statusFilter,
        statusMap,
        updateStatus: changeStatus,
    };
};
