// LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api"; // импорт функции логина

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
        <div style={{ maxWidth: 320, margin: "auto", paddingTop: 50 }}>
            <h2>Вход</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    style={{ width: "100%", padding: 8, marginBottom: 12 }}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ width: "100%", padding: 8, marginBottom: 12 }}
                />
                <button type="submit" style={{ width: "100%", padding: 10 }}>Войти</button>
                {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;