import React from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="menu-container">
            <h1 className="App-header">Main Menu</h1>
            <button className="menu-button" onClick={() => navigate("/feedback")}>
                💬 View Feedback
            </button>
            <button className="menu-button" onClick={() => navigate("/stats")}>
                📊 View Statistics
            </button>
        </div>
    );
};

export default HomePage;