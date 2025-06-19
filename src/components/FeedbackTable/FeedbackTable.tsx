import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FeedbackTable.css";

import {
    fetchFeedbacks,
    updateFeedbackStatus,
    Feedback,
    FeedbackStatus
} from "../../api"; // поправь путь под свой проект

const statusMap: Record<FeedbackStatus, string> = {
    [FeedbackStatus.Open]: "Открыта",
    [FeedbackStatus.InProgress]: "В обработке",
    [FeedbackStatus.WaitingForReply]: "Ожидает ответа",
    [FeedbackStatus.Closed]: "Закрыта",
    [FeedbackStatus.Rejected]: "Отклонена"
};

const FeedbackTable = () => {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedComment, setSelectedComment] = useState<string | null>(null);

    useEffect(() => {
        loadFeedbacks();
    }, []);

    const loadFeedbacks = async () => {
        try {
            const data = await fetchFeedbacks();
            setFeedbacks(data);
        } catch (error) {
            console.error("Ошибка загрузки заявок", error);
        }
    };

    const updateStatus = async (id: number, newStatus: FeedbackStatus) => {
        try {
            await updateFeedbackStatus(id, newStatus);
            setFeedbacks(prev =>
                prev.map(fb => fb.id === id ? { ...fb, status: newStatus } : fb)
            );
        } catch (error) {
            console.error("Ошибка при обновлении статуса", error);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? "Неверная дата" : date.toLocaleDateString("ru-RU");
    };

    type ActionButtonProps = {
        icon: string;
        label: string;
        onClick: () => void;
    };

    const ActionButton = ({ icon, label, onClick }: ActionButtonProps) => (
        <button className="action-button" onClick={onClick} title={label} aria-label={label}>
            <span className="material-icons action-icon">{icon}</span>
        </button>
    );

    const renderActions = (fb: Feedback) => {
        switch (fb.status) {
            case FeedbackStatus.Open:
                return (
                    <>
                        <ActionButton icon="play_arrow" label="В обработке" onClick={() => updateStatus(fb.id, FeedbackStatus.InProgress)} />
                        <ActionButton icon="close" label="Отклонить" onClick={() => updateStatus(fb.id, FeedbackStatus.Rejected)} />
                    </>
                );
            case FeedbackStatus.InProgress:
                return (
                    <>
                        <ActionButton icon="hourglass_top" label="Ожидает ответа" onClick={() => updateStatus(fb.id, FeedbackStatus.WaitingForReply)} />
                        <ActionButton icon="done" label="Закрыть" onClick={() => updateStatus(fb.id, FeedbackStatus.Closed)} />
                    </>
                );
            case FeedbackStatus.WaitingForReply:
                return (
                    <>
                        <ActionButton icon="done" label="Закрыть" onClick={() => updateStatus(fb.id, FeedbackStatus.Closed)} />
                        <ActionButton icon="close" label="Отклонить" onClick={() => updateStatus(fb.id, FeedbackStatus.Rejected)} />
                    </>
                );
            default:
                return null;
        }
    };

    const filteredFeedbacks = feedbacks
        .filter(fb => {
            if (statusFilter === "all") return true;
            return fb.status === statusFilter;
        })
        .filter(fb => {
            const query = searchQuery.toLowerCase();
            return (
                fb.id.toString().includes(query) ||
                fb.userId?.toString().includes(query) ||
                fb.username?.toLowerCase().includes(query) ||
                fb.phone?.toLowerCase().includes(query)
            );
        });

    const StatusFilterButtons = () => (
        <div className="status-filter-buttons">
            <button
                className={`status-filter-btn ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => setStatusFilter("all")}
            >
                Все
            </button>
            {(Object.keys(statusMap) as unknown as Array<keyof typeof statusMap>).map(key => {
                const status = Number(key) as FeedbackStatus;
                return (
                    <button
                        key={status}
                        className={`status-filter-btn status-${FeedbackStatus[status].toLowerCase()} ${statusFilter === status ? "active" : ""}`}
                        onClick={() => setStatusFilter(status)}
                        title={statusMap[status]}
                    >
                        {statusMap[status]}
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className="feedback-container">
            <button className="back-button mb-3" onClick={() => navigate(-1)}>
                ← Назад
            </button>
            <h1>Заявки</h1>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Поиск по ID, имени, телефону..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <StatusFilterButtons />

            <table className="feedback-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Имя / Телефон</th>
                    <th>Комментарий</th>
                    <th>Дата</th>
                    <th>Статус</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {filteredFeedbacks.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="no-data">Нет данных</td>
                    </tr>
                ) : (
                    filteredFeedbacks.map(fb => (
                        <tr key={fb.id}>
                            <td>{fb.id}</td>
                            <td>{fb.userId}</td>
                            <td className="user-phone-cell" title={`${fb.username ?? "—"} / ${fb.phone ?? "—"}`}>
                                <div className="username">{fb.username ?? "—"}</div>
                                <div className="phone">{fb.phone ?? "—"}</div>
                            </td>
                            <td
                                className="ellipsis comment-clickable"
                                onClick={() => setSelectedComment(fb.comment)}
                            >
                                {fb.comment.length > 60 ? fb.comment.slice(0, 60) + "..." : fb.comment}
                            </td>
                            <td>{formatDate(fb.date)}</td>
                            <td>
                                <span className={`status-badge status-${FeedbackStatus[fb.status].toLowerCase()}`}>
                                    {statusMap[fb.status]}
                                </span>
                            </td>
                            <td>{renderActions(fb)}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            {selectedComment && (
                <div className="modal-overlay" onClick={() => setSelectedComment(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close-button" onClick={() => setSelectedComment(null)}>&times;</span>
                        <h3>Полный текст заявки</h3>
                        <p>{selectedComment}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackTable;