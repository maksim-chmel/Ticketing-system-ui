import React from "react";
import AppNotice from "../Common/AppNotice";
import PageState from "../Common/PageState";
import { useUserList } from "../../hooks/useUserList";
import "./UserList.css";

const UserList: React.FC = () => {
    const {
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
    } = useUserList();

    if (loading) {
        return <PageState title="Loading" message="Users are loading. Please wait." />;
    }

    if (error) {
        return (
            <PageState
                title="User list unavailable"
                message={error}
                variant="error"
                actionLabel="Try again"
                onAction={() => void loadUsers()}
            />
        );
    }

    return (
        <div className="user-list">
            <div className="page-head">
                <div>
                    <div className="page-eyebrow">User directory</div>
                    <h1 className="page-title">Users and internal notes</h1>
                    <p className="page-subtitle">Keep operator comments structured and easy to update without losing context.</p>
                </div>
            </div>

            {notification && (
                <div className="notification-anchor">
                    <AppNotice
                        title={notification.type === "error" ? "Action failed" : "Saved"}
                        message={notification.message}
                        variant={notification.type}
                    />
                </div>
            )}

            <div className="data-shell">
                <table className="data-table user-table">
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
                                        <button
                                            className="action-btn action-btn-save"
                                            onClick={saveComment}
                                            disabled={isSaving}
                                            title="Save"
                                            aria-label="Save"
                                        >
                                            <span className="material-icons">check</span>
                                        </button>
                                        <button
                                            className="action-btn action-btn-danger"
                                            onClick={cancelEditing}
                                            title="Cancel"
                                            aria-label="Cancel"
                                        >
                                            <span className="material-icons">close</span>
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="action-btn action-btn-edit"
                                        onClick={() => startEditing(user)}
                                        title="Edit comment"
                                        aria-label="Edit comment"
                                    >
                                        <span className="material-icons">edit</span>
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
