import React from 'react';
import './BroadcastForm.css';
import AppNotice from "../Common/AppNotice";
import { useBroadcastForm } from "../../hooks/useBroadcastForm";

const BroadcastMessageForm: React.FC = () => {
    const { loading, message, setMessage, status, submit } = useBroadcastForm();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submit();
    };

    return (
        <div className="broadcast-container">
            <div className="page-eyebrow">Messaging</div>
            <h2 className="page-title">Broadcast to users</h2>
            <p className="page-subtitle">Compose a concise announcement and send it to all connected users in one action.</p>
            <form onSubmit={handleSubmit} className="broadcast-form">
                <textarea
                    rows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Enter your message..."
                    className="broadcast-textarea"
                    disabled={loading}
                />
                <button type="submit" disabled={loading} className="broadcast-button">
                    {loading ? 'Sending...' : 'Send broadcast'}
                </button>
            </form>
            {status && (
                <AppNotice
                    title={status.type === "error" ? "Broadcast failed" : "Broadcast sent"}
                    message={status.message}
                    variant={status.type}
                />
            )}
        </div>
    );
};

export default BroadcastMessageForm;
