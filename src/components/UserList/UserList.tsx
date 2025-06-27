import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editingComments, setEditingComments] = useState<Record<number, string>>({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get<UserDto[]>("/user/users-to-list");
            setUsers(res.data);
        } catch {
            setError("Ошибка при загрузке пользователей");
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
            alert("Комментарий сохранён");
        } catch {
            alert("Ошибка при сохранении комментария");
        }
    };

    if (loading) return <p>⏳ Загрузка...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="user-list">
            <button className="back-button mb-3" onClick={() => navigate(-1)}>
                ← Назад
            </button>
            <h2>👥 Список пользователей</h2>
            <table>
                <thead>
                <tr>
                    <th>Имя</th>
                    <th>Фамилия</th>
                    <th>Логин</th>
                    <th>Телефон</th>
                    <th>Комментарий</th>
                    <th>Действия</th>
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
                                    <button onClick={saveComment}>💾 Сохранить</button>
                                    <button onClick={cancelEditing} style={{ marginLeft: 8 }}>
                                        ❌ Отмена
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => startEditing(user)}>✏️ Редактировать</button>
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