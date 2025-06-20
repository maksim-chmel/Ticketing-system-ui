import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { login } from "../../api";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const data = await login(username, password);
            localStorage.setItem("token", data.token);
            navigate("/");
        } catch (err) {
            setError("Неверный логин или пароль");
        }
    };

    return (
        <div className="glass-login-container">
            <h2 className="glass-login-title">Вход</h2>
            <form onSubmit={handleLogin} className="glass-login-form">
                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="glass-input"
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="glass-input"
                    required
                />
                <button type="submit" className="glass-button">Войти</button>
                {error && <p className="glass-error">{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;