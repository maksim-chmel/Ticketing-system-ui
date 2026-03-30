import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./UserList.css";

interface UserDto {
    userId: number;
    phone: string;
    firstName: string;
    lastName?: string | null;
    username?: string | null;
    comments?: string | null;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editingComments, setEditingComments] = useState<Record<number, string>>({});

    const [notification, setNotification] = useState<string | null>(null);
    const [notificationType, setNotificationType] = useState<"success" | "error" | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get<UserDto[]>("/user/users-to-list");
            setUsers(res.data);
        } catch {
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
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

        const commentText = editingComments[editingUserId];
        try {
            await axiosInstance.post("/user/update-comment", {
                userId: editingUserId,
                comment: commentText,
            });
            setUsers(prev =>
                prev.map(u =>
                    u.userId === editingUserId ? { ...u, comments: commentText } : u
                )
            );
            cancelEditing();
            showNotification("Comment saved", "success");
        } catch {
            showNotification("Failed to save comment", "error");
        }
    };

    const showNotification = (message: string, type: "success" | "error") => {
        setNotification(message);
        setNotificationType(type);
        setTimeout(() => {
            setNotification(null);
            setNotificationType(null);
        }, 3500);
    };

    if (loading) return <p>⏳ Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="user-list">
            {notification && (
                <div className={`notification ${notificationType}`}>
                    {notification}
                </div>
            )}
            <table>
                <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    <th>Phone</th>
                    <th>Comment</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.userId}>
                        <td>{user.firstName}</td>
                        <td>{user.lastName || "—"}</td>
                        <td>{user.username || "—"}</td>
                        <td>{user.phone}</td>
                        <td>
                            {editingUserId === user.userId ? (
                                <textarea
                                    value={editingComments[user.userId] || ""}
                                    onChange={e => handleCommentChange(user.userId, e.target.value)}
                                    rows={3}
                                    cols={40}
                                />
                            ) : (
                                user.comments || "—"
                            )}
                        </td>
                        <td>
                            {editingUserId === user.userId ? (
                                <>
                                    <button className="btn save-btn" onClick={saveComment} title="Save">💾</button>
                                    <button className="btn cancel-btn" onClick={cancelEditing} title="Cancel" style={{ marginLeft: 8 }}>❌</button>
                                </>
                            ) : (
                                <button className="btn edit-btn" onClick={() => startEditing(user)} title="Edit">✏️</button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;