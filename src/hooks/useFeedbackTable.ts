import { useEffect, useMemo, useRef, useState } from "react";
import {
    claimFeedback,
    fetchFeedbackHistory,
    fetchFeedbacks,
    FeedbackDto,
    FeedbackHistoryItem,
    FeedbackStatus,
    updateFeedbackStatus
} from "../api";
import { useAuth } from "../auth/AuthContext";
import { getErrorMessage } from "../utils/getErrorMessage";
import { formatApiUtcToLocalDateTime } from "../utils/dates";

const normalizeSearchValue = (value: string) => value.trim().toLowerCase();
const normalizePhoneValue = (value: string) => value.replace(/\D/g, "");

const statusMap: Record<FeedbackStatus, string> = {
    [FeedbackStatus.Open]: "Open",
    [FeedbackStatus.InProgress]: "In Progress",
    [FeedbackStatus.Waiting]: "Waiting for Reply",
    [FeedbackStatus.Done]: "Closed",
    [FeedbackStatus.Rejected]: "Rejected"
};

const formatDate = (dateStr: string) => formatApiUtcToLocalDateTime(dateStr);

export const useFeedbackTable = () => {
    const { adminName } = useAuth();

    const [feedbacks, setFeedbacks] = useState<FeedbackDto[]>([]);
    const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedComment, setSelectedComment] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [pendingClaim, setPendingClaim] = useState<{ id: number; assignedTo: string } | null>(null);
    const [historyFeedbackId, setHistoryFeedbackId] = useState<number | null>(null);
    const [history, setHistory] = useState<FeedbackHistoryItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const isMountedRef = useRef(true);

    const loadFeedbacks = async () => {
        try {
            setLoading(true);
            setError(null);
            const { items } = await fetchFeedbacks();
            if (!isMountedRef.current) return;
            setFeedbacks(items);
        } catch (err) {
            if (!isMountedRef.current) return;
            setError(getErrorMessage(err, "Failed to load tickets"));
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        void loadFeedbacks();
        return () => { isMountedRef.current = false; };
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

    const executeClaim = async (id: number) => {
        try {
            setError(null);
            await claimFeedback(id);
            const { items } = await fetchFeedbacks();
            if (isMountedRef.current) setFeedbacks(items);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to claim ticket"));
        }
    };

    const claimTicket = (fb: FeedbackDto) => {
        if (fb.assignedAdminName !== null && fb.assignedAdminName !== adminName) {
            setPendingClaim({ id: fb.id, assignedTo: fb.assignedAdminName });
        } else {
            void executeClaim(fb.id);
        }
    };

    const confirmClaim = () => {
        if (pendingClaim !== null) {
            const id = pendingClaim.id;
            setPendingClaim(null);
            void executeClaim(id);
        }
    };

    const cancelClaim = () => setPendingClaim(null);

    const openHistory = async (id: number) => {
        setHistoryFeedbackId(id);
        setHistoryLoading(true);
        setHistory([]);
        try {
            const items = await fetchFeedbackHistory(id);
            if (isMountedRef.current) setHistory(items);
        } catch (err) {
            if (isMountedRef.current) setError(getErrorMessage(err, "Failed to load history"));
        } finally {
            if (isMountedRef.current) setHistoryLoading(false);
        }
    };

    const closeHistory = () => {
        setHistoryFeedbackId(null);
        setHistory([]);
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
                    formatDate(fb.createdDate),
                    fb.assignedAdminName ?? "",
                ]
                    .map(normalizeSearchValue)
                    .join(" ");

                return searchIndex.includes(query) || normalizePhoneValue(rawPhone).includes(normalizePhoneValue(query));
            })
    ), [feedbacks, searchQuery, statusFilter]);

    return {
        adminName,
        cancelClaim,
        closeHistory,
        claimTicket,
        confirmClaim,
        error,
        filteredFeedbacks,
        history,
        historyFeedbackId,
        historyLoading,
        loadFeedbacks,
        loading,
        openHistory,
        pendingClaim,
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
