import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./Navbar.css";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut } = useAuth();

    const handleLogout = () => {
        signOut();
        navigate("/login");
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <div className="navbar-logo">ITSM Panel</div>
                <div className="navbar-caption">Coordinator workspace</div>
            </div>
            <div className="navbar-buttons">
                <button
                    className={`nav-button ${isActive("/feedback") ? "active" : ""}`}
                    onClick={() => navigate("/feedback")}
                    type="button"
                >
                    💬 Tickets
                </button>
                <button
                    className={`nav-button ${isActive("/stats") ? "active" : ""}`}
                    onClick={() => navigate("/stats")}
                    type="button"
                >
                    📊 Statistics
                </button>
                <button
                    className={`nav-button ${isActive("/users") ? "active" : ""}`}
                    onClick={() => navigate("/users")}
                    type="button"
                >
                    👥 Users
                </button>
                <button
                    className={`nav-button ${isActive("/broadcast") ? "active" : ""}`}
                    onClick={() => navigate("/broadcast")}
                    type="button"
                >
                    📣 Broadcast
                </button>
            </div>
            <button className="logout-button" onClick={handleLogout} type="button">
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
