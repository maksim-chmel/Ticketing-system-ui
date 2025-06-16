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
    status: number;
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
        console.log("Кнопка нажата, id:", id);  // <-- Добавил лог
        try {
            await axios.put(`http://100.70.1.11:8082/api/Feedback/make-done/${id}`);
            console.log("Запрос выполнен успешно");
            fetchFeedbacks(); // обновим список
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
                    <th>Действие</th> {/* ✅ новая колонка */}
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
                            <td>{fb.status === 1 ? "Открыта" : "Закрыта"}</td>
                            <td>
                                {fb.status === 1 && (
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