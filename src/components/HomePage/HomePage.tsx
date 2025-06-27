import React from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar glass-navbar">
            <div className="navbar-title">📋 Меню</div>

            <div className="navbar-links">
                <button onClick={() => navigate("/feedback")}>💬 Заявки</button>
                <button onClick={() => navigate("/stats")}>📊 Статистика</button>
                <button onClick={() => navigate("/users")}>👥 Пользователи</button>
                <button className="logout-btn" onClick={handleLogout}>🔄 Выйти</button>
            </div>
        </nav>
    );
};

export default HomePage;