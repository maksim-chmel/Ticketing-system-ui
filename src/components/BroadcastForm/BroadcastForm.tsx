import React, { useState } from 'react';
import './BroadcastMessageForm.css';

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
            const response = await fetch('http://localhost:5101/api/Broadcast/add-broadcastMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });

            if (response.ok) {
                const text = await response.text();
                setStatus(text);
                setMessage('');
            } else {
                const error = await response.text();
                setStatus(`Ошибка: ${error}`);
            }
        } catch (error) {
            setStatus(`Ошибка сети: ${(error as Error).message}`);
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