import React, { useState } from 'react';
import './BroadcastMessageForm.css';
import { addBroadcastMessage } from "../../api";

const BroadcastMessageForm: React.FC = () => {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            setStatus('Сообщение не может быть пустым.');
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            const result = await addBroadcastMessage({ message });
            setStatus(result);
            setMessage('');
        } catch (error: any) {
            if (error.response?.data) {
                setStatus(`Ошибка: ${error.response.data}`);
            } else {
                setStatus(`Ошибка сети: ${error.message || error.toString()}`);
            }
        }

        setLoading(false);
    };

    return (
        <div className="broadcast-container">
            <h2 className="broadcast-title">📢 Рассылка пользователям</h2>
            <form onSubmit={handleSubmit} className="broadcast-form">
        <textarea
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Введите сообщение для рассылки..."
            className="broadcast-textarea"
            disabled={loading}
        />
                <button type="submit" disabled={loading} className="broadcast-button">
                    {loading ? '⏳ Отправка...' : '📨 Отправить'}
                </button>
            </form>
            {status && <p className="broadcast-status">{status}</p>}
        </div>
    );
};

export default BroadcastMessageForm;