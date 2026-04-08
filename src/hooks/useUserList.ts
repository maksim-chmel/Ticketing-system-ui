import { useEffect, useRef, useState } from "react";
import { fetchUsers, updateUserComment, UserDto } from "../api";
import { getErrorMessage } from "../utils/getErrorMessage";

export const useUserList = () => {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editingComments, setEditingComments] = useState<Record<number, string>>({});
    const [notification, setNotification] = useState<string | null>(null);
    const [notificationType, setNotificationType] = useState<"success" | "error" | null>(null);
    const notificationTimeoutRef = useRef<number | null>(null);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchUsers();
            setUsers(data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load users"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadUsers();

        return () => {
            if (notificationTimeoutRef.current !== null) {
                window.clearTimeout(notificationTimeoutRef.current);
            }
        };
    }, []);

    const showNotification = (message: string, type: "success" | "error") => {
        if (notificationTimeoutRef.current !== null) {
            window.clearTimeout(notificationTimeoutRef.current);
        }

        setNotification(message);
        setNotificationType(type);
        notificationTimeoutRef.current = window.setTimeout(() => {
            setNotification(null);
            setNotificationType(null);
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
        if (editingUserId === null) return;

        const commentText = editingComments[editingUserId] ?? "";

        try {
            const updatedUser = await updateUserComment({
                userId: editingUserId,
                comment: commentText,
            });
            setUsers(prev => prev.map(u => (u.userId === editingUserId ? updatedUser : u)));
            cancelEditing();
            showNotification("Comment saved", "success");
        } catch (err) {
            showNotification(getErrorMessage(err, "Failed to save comment"), "error");
        }
    };

    return {
        cancelEditing,
        editingComments,
        editingUserId,
        error,
        handleCommentChange,
        loadUsers,
        loading,
        notification,
        notificationType,
        saveComment,
        startEditing,
        users,
    };
};
