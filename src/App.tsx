import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import LoginPage from "./components/LoginPage/LoginPage";
import FeedbackTable from "./components/FeedbackTable/FeedbackTable";
import StatsPage from "./components/Statistic/StatisticsPage";
import UserList from "./components/UserList/UserList";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout/MainLayout";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    {/* Страница логина вне общего макета */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Все защищённые маршруты внутри MainLayout */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<div>🏠 Добро пожаловать!</div>} />
                        <Route path="feedback" element={<FeedbackTable />} />
                        <Route path="stats" element={<StatsPage />} />
                        <Route path="users" element={<UserList />} />
                    </Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;