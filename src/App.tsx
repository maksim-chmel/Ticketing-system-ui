import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import FeedbackTable from "./components/FeedbackTable/FeedbackTable";
import HomePage from "./components/HomePage/HomePage";
import StatsPage from "./components/Statistic/StatisticsPage";
import LoginPage from "./components/LoginPage/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UserList from "./components/UserList/UserList";

import "./App.css";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    {/* Страница логина — доступна всем */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Главная — защищена */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute>
                                <UserList />
                            </ProtectedRoute>
                        }
                    />

                    {/* Защищённые страницы */}
                    <Route
                        path="/feedback"
                        element={
                            <ProtectedRoute>
                                <FeedbackTable />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/stats"
                        element={
                            <ProtectedRoute>
                                <StatsPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </div>
    );
}

export default App;