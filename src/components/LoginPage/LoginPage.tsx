import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { useAuth } from "../../auth/AuthContext";
import AppNotice from "../Common/AppNotice";
import { getErrorMessage } from "../../utils/getErrorMessage";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, signIn } = useAuth();

    if (isLoading) {
        return (
            <div className="glass-login-container">
                <AppNotice
                    title="Checking session"
                    message="Restoring your authorization state."
                    variant="info"
                />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/feedback" replace />;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await signIn(username, password);
            navigate("/feedback", { replace: true });
        } catch (err) {
            setError(getErrorMessage(err, "Invalid username or password"));
        }
    };

    return (
        <div className="glass-login-container">
            <div className="glass-login-badge">Admin access</div>
            <h2 className="glass-login-title">Sign in to the control panel</h2>
            <p className="glass-login-subtitle">Manage tickets, operators, users and broadcast messages from one place.</p>
            <form onSubmit={handleLogin} className="glass-login-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="glass-input"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input"
                    required
                />
                <button type="submit" className="glass-button">Sign In</button>
                {error && (
                    <AppNotice
                        title="Login failed"
                        message={error}
                        variant="error"
                        className="glass-error"
                    />
                )}
            </form>
        </div>
    );
};

export default LoginPage;
