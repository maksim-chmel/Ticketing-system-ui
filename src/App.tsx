import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeedbackTable from "./components/FeedbackTable/FeedbackTable";
import HomePage from "./components/HomePage/HomePage";
import StatsPage from "./components/Statistic/StatisticsPage";
import "./App.css";

function App() {
    return (
        <div className="App"> {/* ВАЖЛИВО: обгортка для стилів */}
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/feedback" element={<FeedbackTable />} />
                    <Route path="/stats" element={<StatsPage />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;