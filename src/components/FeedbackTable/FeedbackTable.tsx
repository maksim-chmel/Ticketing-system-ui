import React from "react";
import "./FeedbackTable.css";

import { Feedback, FeedbackStatus } from "../../api";
import AppNotice from "../Common/AppNotice";
import PageState from "../Common/PageState";
import { useFeedbackTable } from "../../hooks/useFeedbackTable";

const FeedbackTable = () => {
    const {
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
        updateStatus,
    } = useFeedbackTable();

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
                        <ActionButton icon="play_arrow" label="In Progress" onClick={() => updateStatus(fb.id, FeedbackStatus.InProgress)} />
                        <ActionButton icon="close" label="Reject" onClick={() => updateStatus(fb.id, FeedbackStatus.Rejected)} />
                    </>
                );
            case FeedbackStatus.InProgress:
                return (
                    <>
                        <ActionButton icon="hourglass_top" label="Waiting for Reply" onClick={() => updateStatus(fb.id, FeedbackStatus.Waiting)} />
                        <ActionButton icon="done" label="Close" onClick={() => updateStatus(fb.id, FeedbackStatus.Done)} />
                    </>
                );
            case FeedbackStatus.Waiting:
                return (
                    <>
                        <ActionButton icon="done" label="Close" onClick={() => updateStatus(fb.id, FeedbackStatus.Done)} />
                        <ActionButton icon="close" label="Reject" onClick={() => updateStatus(fb.id, FeedbackStatus.Rejected)} />
                    </>
                );
            default:
                return null;
        }
    };

    const StatusFilterButtons = () => (
        <div className="status-filter-buttons">
            <button
                className={`status-filter-btn ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => setStatusFilter("all")}
            >
                All
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
            <div className="feedback-page-head">
                <div>
                    <div className="feedback-eyebrow">Ticket management</div>
                    <h1>Support tickets</h1>
                    <p className="feedback-subtitle">Filter requests, inspect full comments and move tickets through the processing flow.</p>
                </div>
            </div>

            {error && (
                <AppNotice
                    title="Ticket data unavailable"
                    message={error}
                    variant="error"
                    actionLabel="Try again"
                    onAction={() => void loadFeedbacks()}
                    className="feedback-error"
                />
            )}

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by ID, name, phone..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <StatusFilterButtons />

            {loading ? (
                <PageState title="Loading" message="Tickets are loading. Please wait." />
            ) : (
                <div className="table-shell">
                    <table className="feedback-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>Name / Phone</th>
                            <th>Comment</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredFeedbacks.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="no-data">No data</td>
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
                                        onClick={() => setSelectedComment(fb.comment ?? "")}
                                    >
                                        {(fb.comment ?? "").length > 60 ? `${(fb.comment ?? "").slice(0, 60)}...` : (fb.comment ?? "—")}
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
                </div>
            )}

            {selectedComment !== null && (
                <div className="modal-overlay" onClick={() => setSelectedComment(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close-button" onClick={() => setSelectedComment(null)}>&times;</span>
                        <h3>Full ticket text</h3>
                        <p>{selectedComment || "—"}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackTable;
