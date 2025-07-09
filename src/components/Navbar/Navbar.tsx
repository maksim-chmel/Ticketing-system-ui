import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-logo">🔧 ITSM Панель</div>
            <div className="navbar-buttons">
                <button
                    className={`nav-button ${isActive("/feedback") ? "active" : ""}`}
                    onClick={() => navigate("/feedback")}
                    type="button"
                >
                    💬 Заявки
                </button>
                <button
                    className={`nav-button ${isActive("/stats") ? "active" : ""}`}
                    onClick={() => navigate("/stats")}
                    type="button"
                >
                    📊 Статистика
                </button>
                <button
                    className={`nav-button ${isActive("/users") ? "active" : ""}`}
                    onClick={() => navigate("/users")}
                    type="button"
                >
                    👥 Пользователи
                </button>
                <button
                    className={`nav-button ${isActive("/broadcast") ? "active" : ""}`}
                    onClick={() => navigate("/broadcast")}
                    type="button"
                >
                    📣 Рассылка
                </button>
            </div>
            <button className="logout-button" onClick={handleLogout} type="button">
                🚪 Выйти
            </button>
        </nav>
    );
};

export default Navbar;