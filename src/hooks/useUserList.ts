import { useEffect, useRef, useState } from "react";
import { fetchUsers, updateUserComment, UserDto } from "../api";
import { getErrorMessage } from "../utils/getErrorMessage";

export const useUserList = () => {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editingComments, setEditingComments] = useState<Record<number, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const isMountedRef = useRef(true);
    const notificationTimeoutRef = useRef<number | null>(null);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const { items } = await fetchUsers();
            if (!isMountedRef.current) return;
            setUsers(items);
        } catch (err) {
            if (!isMountedRef.current) return;
            setError(getErrorMessage(err, "Failed to load users"));
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        void loadUsers();

        return () => {
            isMountedRef.current = false;
            if (notificationTimeoutRef.current !== null) {
                window.clearTimeout(notificationTimeoutRef.current);
            }
        };
    }, []);

    const showNotification = (message: string, type: "success" | "error") => {
        if (notificationTimeoutRef.current !== null) {
            window.clearTimeout(notificationTimeoutRef.current);
        }

        setNotification({ message, type });
        notificationTimeoutRef.current = window.setTimeout(() => {
            setNotification(null);
            notificationTimeoutRef.current = null;
        }, 3500);
    };

    const startEditing = (user: UserDto) => {
        setEditingUserId(user.userId);
        setEditingComments(prev => ({
            ...prev,
            [user.userId]: user.comments || "",
        }));
    };

    const cancelEditing = () => {
        setEditingUserId(null);
    };

    const handleCommentChange = (userId: number, value: string) => {
        setEditingComments(prev => ({
            ...prev,
            [userId]: value,
        }));
    };

    const saveComment = async () => {
        if (editingUserId === null || isSaving) return;

        setIsSaving(true);
        const commentText = editingComments[editingUserId] ?? "";

        try {
            const updatedUser = await updateUserComment({
                userId: editingUserId,
                comment: commentText,
            });
            if (!isMountedRef.current) return;
            setUsers(prev => prev.map(u => (u.userId === editingUserId ? { ...u, ...updatedUser } : u)));
            cancelEditing();
            showNotification("Comment saved", "success");
        } catch (err) {
            if (!isMountedRef.current) return;
            showNotification(getErrorMessage(err, "Failed to save comment"), "error");
        } finally {
            if (isMountedRef.current) {
                setIsSaving(false);
            }
        }
    };

    return {
        cancelEditing,
        editingComments,
        editingUserId,
        error,
        handleCommentChange,
        isSaving,
        loadUsers,
        loading,
        notification,
        saveComment,
        startEditing,
        users,
    };
};
