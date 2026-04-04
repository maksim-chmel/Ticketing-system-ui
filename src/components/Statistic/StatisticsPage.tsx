import React from "react";
import {
    PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis, Legend,
    LineChart, Line, CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import {
    StatusDistributionItem
} from "../../api";
import { useStatisticsData } from "../../hooks/useStatisticsData";
import PageState from "../Common/PageState";
import "./StatisticsPage.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

const PieLegend: React.FC<{ data: StatusDistributionItem[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return (
        <ul className="pie-legend">
            {data.map((entry, index) => {
                const percent = total === 0 ? "0" : ((entry.value / total) * 100).toFixed(0);
                return (
                    <li key={entry.name} className="pie-legend-item">
                        <span
                            className="legend-color"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></span>
                        {entry.name}: {percent}%
                    </li>
                );
            })}
        </ul>
    );
};

const StatisticsPage: React.FC = () => {
    const { dataOverTime, dataStatus, error, loadStatistics, loading } = useStatisticsData();

    if (loading) {
        return (
            <div className="container my-4">
                <PageState title="Loading" message="Statistics are loading. This may take a moment." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container my-4">
                <PageState
                    title="Statistics unavailable"
                    message={error}
                    variant="error"
                    actionLabel="Try again"
                    onAction={() => void loadStatistics()}
                />
            </div>
        );
    }

    return (
        <div className="container my-4">
            <div className="stats-head">
                <div>
                    <div className="stats-eyebrow">Analytics</div>
                    <h1 className="stats-title">Ticket performance overview</h1>
                    <p className="stats-subtitle">Track status distribution and daily dynamics without losing readability on smaller screens.</p>
                </div>
            </div>
            <div className="chart-wrapper">
                <div className="chart-grid">

                    <div className="chart-item chart-item-split">
                        <div className="chart-visual">
                            <h5>Status Distribution</h5>
                            <div className="chart-canvas chart-canvas-square">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dataStatus}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius="74%"
                                            innerRadius="46%"
                                            dataKey="value"
                                            labelLine={false}
                                        >
                                            {dataStatus.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#222",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "8px",
                                                boxShadow: "0 2px 10px rgba(0,0,0,0.7)",
                                                fontWeight: 500,
                                                fontSize: "0.9rem"
                                            }}
                                            itemStyle={{
                                                color: "#fff"
                                            }}
                                            cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <PieLegend data={dataStatus} />
                    </div>

                    <div className="chart-item">
                        <h5>Tickets per Day</h5>
                        <div className="chart-canvas">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dataOverTime}>
                                    <XAxis
                                        dataKey="date"
                                        stroke="#ffffff"
                                        tick={{ fill: "#ffffff", fontSize: 12 }}
                                    />
                                    <YAxis
                                        stroke="#ffffff"
                                        tick={{ fill: "#ffffff", fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#222",
                                            color: "#fff",
                                            border: "none"
                                        }}
                                    />
                                    <Legend wrapperStyle={{ color: "#ffffff" }} />
                                    <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="chart-item chart-item-wide">
                        <h5>Ticket Trend Over Time</h5>
                        <div className="chart-canvas chart-canvas-wide">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dataOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#ffffff"
                                        tick={{ fill: "#ffffff", fontSize: 12 }}
                                    />
                                    <YAxis
                                        stroke="#ffffff"
                                        tick={{ fill: "#ffffff", fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#222",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "8px",
                                            boxShadow: "0 2px 10px rgba(0,0,0,0.7)",
                                            fontWeight: 500,
                                            fontSize: "0.9rem"
                                        }}
                                        itemStyle={{
                                            color: "#fff"
                                        }}
                                        cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
                                    />
                                    <Legend wrapperStyle={{ color: "#ffffff" }} />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#8884d8"
                                        strokeWidth={2.5}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;
