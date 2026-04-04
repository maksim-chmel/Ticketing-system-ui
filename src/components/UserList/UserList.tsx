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
        loadUsers,
        loading,
        notification,
        notificationType,
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
            <div className="user-list-head">
                <div>
                    <div className="user-list-eyebrow">User directory</div>
                    <h1 className="user-list-title">Users and internal notes</h1>
                    <p className="user-list-subtitle">Keep operator comments structured and easy to update without losing context.</p>
                </div>
            </div>
            {notification && (
                <AppNotice
                    title={notificationType === "error" ? "Action failed" : "Saved"}
                    message={notification}
                    variant={notificationType ?? "info"}
                    className="notification"
                />
            )}
            <div className="user-table-shell">
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
        </div>
    );
};

export default UserList;
