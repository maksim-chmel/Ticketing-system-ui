import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FeedbackTable.css";

interface Feedback {
    id: number;
    userId: number;
    comment: string;
    username: string | null;
    phone: string | null;
    date: string;
    isDone: boolean;  // Используем булево поле для статуса
}

const FeedbackTable = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = () => {
        axios.get<Feedback[]>("http://100.70.1.11:8082/api/Feedback")
            .then(response => setFeedbacks(response.data))
            .catch(console.error);
    };

    const handleMarkDone = async (id: number) => {
        try {
            await axios.post(`http://100.70.1.11:8082/api/Feedback/make-done/${id}`);
            // Обновляем локально состояние для быстрой реакции UI
            setFeedbacks(prev =>
                prev.map(fb => fb.id === id ? { ...fb, isDone: true } : fb)
            );
        } catch (error) {
            console.error("Ошибка при изменении статуса", error);
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return "Неверная дата";
            return date.toLocaleDateString("ru-RU");
        } catch {
            return "Ошибка даты";
        }
    };

    return (
        <div className="feedback-container">
            <h1>Заявки</h1>
            <table className="feedback-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Phone</th>
                    <th>Comment</th>
                    <th>Дата</th>
                    <th>Status</th>
                    <th>Действие</th>
                </tr>
                </thead>
                <tbody>
                {feedbacks.length === 0 ? (
                    <tr>
                        <td colSpan={8} className="no-data">Нет данных</td>
                    </tr>
                ) : (
                    feedbacks.map(fb => (
                        <tr key={fb.id}>
                            <td>{fb.id}</td>
                            <td>{fb.userId}</td>
                            <td>{fb.username ?? "—"}</td>
                            <td>{fb.phone ?? "—"}</td>
                            <td>{fb.comment}</td>
                            <td>{formatDate(fb.date)}</td>
                            <td>{fb.isDone ? "Закрыта" : "Открыта"}</td>
                            <td>
                                {!fb.isDone && (
                                    <button onClick={() => handleMarkDone(fb.id)}>Закрыть</button>
                                )}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default FeedbackTable;