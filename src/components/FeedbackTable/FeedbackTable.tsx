import React from "react";
import "./FeedbackTable.css";

import { FeedbackDto, FeedbackStatus } from "../../api";
import { formatApiUtcToLocalDateTime } from "../../utils/dates";
import AppNotice from "../Common/AppNotice";
import PageState from "../Common/PageState";
import { useFeedbackTable } from "../../hooks/useFeedbackTable";

type ActionButtonProps = {
    icon: string;
    label: string;
    onClick: () => void;
};

const ActionButton = ({ icon, label, onClick }: ActionButtonProps) => (
    <button className="action-btn" onClick={onClick} title={label} aria-label={label}>
        <span className="material-icons">{icon}</span>
    </button>
);

type StatusFilterButtonsProps = {
    statusFilter: FeedbackStatus | "all";
    statusMap: Record<FeedbackStatus, string>;
    onFilterChange: (status: FeedbackStatus | "all") => void;
};

const StatusFilterButtons = ({ statusFilter, statusMap, onFilterChange }: StatusFilterButtonsProps) => (
    <div className="status-filter-buttons">
        <button
            className={`status-filter-btn ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => onFilterChange("all")}
        >
            All
        </button>
        {(Object.keys(statusMap) as FeedbackStatus[]).map(status => (
            <button
                key={status}
                className={`status-filter-btn status-${status.toLowerCase()} ${statusFilter === status ? "active" : ""}`}
                onClick={() => onFilterChange(status)}
                title={statusMap[status]}
            >
                {statusMap[status]}
            </button>
        ))}
    </div>
);

const TERMINAL_STATUSES = new Set([FeedbackStatus.Done, FeedbackStatus.Rejected]);

const FeedbackTable = () => {
    const {
        adminName,
        cancelClaim,
        claimTicket,
        closeHistory,
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
        updateStatus,
    } = useFeedbackTable();

    const renderActions = (fb: FeedbackDto) => {
        const claimable = !TERMINAL_STATUSES.has(fb.status);
        const isMine = fb.assignedAdminName !== null && fb.assignedAdminName === adminName;

        return (
            <>
                {fb.status === FeedbackStatus.Open && (
                    <>
                        <ActionButton icon="play_arrow" label="In Progress" onClick={() => updateStatus(fb.id, FeedbackStatus.InProgress)} />
                        <ActionButton icon="close" label="Reject" onClick={() => updateStatus(fb.id, FeedbackStatus.Rejected)} />
                    </>
                )}
                {fb.status === FeedbackStatus.InProgress && (
                    <>
                        <ActionButton icon="hourglass_top" label="Waiting for Reply" onClick={() => updateStatus(fb.id, FeedbackStatus.Waiting)} />
                        <ActionButton icon="done" label="Close" onClick={() => updateStatus(fb.id, FeedbackStatus.Done)} />
                    </>
                )}
                {fb.status === FeedbackStatus.Waiting && (
                    <>
                        <ActionButton icon="done" label="Close" onClick={() => updateStatus(fb.id, FeedbackStatus.Done)} />
                        <ActionButton icon="close" label="Reject" onClick={() => updateStatus(fb.id, FeedbackStatus.Rejected)} />
                    </>
                )}
                {claimable && !isMine && (
                    <ActionButton icon="person_add" label="Claim" onClick={() => claimTicket(fb)} />
                )}
                <ActionButton icon="history" label="History" onClick={() => void openHistory(fb.id)} />
            </>
        );
    };

    return (
        <div className="feedback-container">
            <div className="page-head">
                <div>
                    <div className="page-eyebrow">Ticket management</div>
                    <h1 className="page-title">Support tickets</h1>
                    <p className="page-subtitle">Filter requests, inspect full comments and move tickets through the processing flow.</p>
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

            <StatusFilterButtons
                statusFilter={statusFilter}
                statusMap={statusMap}
                onFilterChange={setStatusFilter}
            />

            {loading ? (
                <PageState title="Loading" message="Tickets are loading. Please wait." />
            ) : (
                <div className="data-shell">
                    <table className="data-table feedback-table">
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
                                            className={`ellipsis${fb.comment ? " comment-clickable" : ""}`}
                                            onClick={fb.comment ? () => setSelectedComment(fb.comment) : undefined}
                                        >
                                            {(fb.comment ?? "").length > 60 ? `${(fb.comment ?? "").slice(0, 60)}...` : (fb.comment || "—")}
                                        </td>
                                        <td>{formatApiUtcToLocalDateTime(fb.createdDate)}</td>
                                        <td>
                                            <span className={`status-badge status-${fb.status.toLowerCase()}`}>
                                                {statusMap[fb.status] ?? "Unknown"}
                                            </span>
                                            {fb.assignedAdminName && (
                                                <div className="assigned-admin">
                                                    <span className="material-icons">person</span>
                                                    {fb.assignedAdminName === adminName ? "You" : fb.assignedAdminName}
                                                </div>
                                            )}
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
                    <div className="modal-panel" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedComment(null)} aria-label="Close">&times;</button>
                        <h3>Full ticket text</h3>
                        <p>{selectedComment || "—"}</p>
                    </div>
                </div>
            )}

            {pendingClaim !== null && (
                <div className="modal-overlay" onClick={cancelClaim}>
                    <div className="modal-panel" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={cancelClaim} aria-label="Close">&times;</button>
                        <h3>Claim ticket</h3>
                        <div className="modal-warning">
                            <span className="material-icons">warning</span>
                            <span>
                                This ticket is currently assigned to <strong>{pendingClaim.assignedTo}</strong>.
                                Claiming it will reassign it to you.
                            </span>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={cancelClaim}>Cancel</button>
                            <button className="btn-primary" onClick={confirmClaim}>Claim anyway</button>
                        </div>
                    </div>
                </div>
            )}

            {historyFeedbackId !== null && (
                <div className="modal-overlay" onClick={closeHistory}>
                    <div className="modal-panel modal-panel--wide" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeHistory} aria-label="Close">&times;</button>
                        <h3>Ticket #{historyFeedbackId} history</h3>
                        {historyLoading ? (
                            <p className="history-loading">Loading...</p>
                        ) : history.length === 0 ? (
                            <p className="history-empty">No history yet.</p>
                        ) : (
                            <ul className="history-list">
                                {history.map((item, i) => (
                                    <li key={i} className="history-item">
                                        <div className="history-item-meta">
                                            {formatApiUtcToLocalDateTime(item.createdAt)} &mdash; {item.adminName}
                                        </div>
                                        <div className="history-item-action">{item.action}</div>
                                        {(item.oldValue !== null || item.newValue !== null) && (
                                            <div className="history-item-values">
                                                {item.oldValue ?? "—"} &rarr; {item.newValue ?? "—"}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackTable;
