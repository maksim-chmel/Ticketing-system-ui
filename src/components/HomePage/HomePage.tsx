import React from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); // удалить токен
        navigate("/login"); // перейти на страницу логина
    };

    return (
        <div className="menu-container">
            <h1 className="main-title">📋 Меню</h1>

            <button className="menu-button" onClick={() => navigate("/feedback")}>
                💬 Заявки
            </button>

            <button className="menu-button" onClick={() => navigate("/stats")}>
                📊 Статистика
            </button>

            <button className="menu-button" onClick={() => navigate("/users")}>
                👥 Пользователи
            </button>

            <button className="menu-button" onClick={handleLogout} style={{ backgroundColor: "#f44336", color: "#fff" }}>
                🔄 Переавторизироваться
            </button>
        </div>
    );
};

export default HomePage;