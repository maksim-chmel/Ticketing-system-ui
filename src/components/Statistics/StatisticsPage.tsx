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

const tooltipStyle = {
    backgroundColor: "rgba(11, 23, 48, 0.92)",
    color: "#f4f7fb",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    fontWeight: 500,
    fontSize: "0.9rem",
};

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
                        />
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
        return <PageState title="Loading" message="Statistics are loading. This may take a moment." />;
    }

    if (error) {
        return (
            <PageState
                title="Statistics unavailable"
                message={error}
                variant="error"
                actionLabel="Try again"
                onAction={() => void loadStatistics()}
            />
        );
    }

    return (
        <div className="stats-page">
            <div className="page-head">
                <div>
                    <div className="page-eyebrow">Analytics</div>
                    <h1 className="page-title">Ticket performance overview</h1>
                    <p className="page-subtitle">Track status distribution and daily dynamics without losing readability on smaller screens.</p>
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
                                            contentStyle={tooltipStyle}
                                            itemStyle={{ color: "#f4f7fb" }}
                                            cursor={{ fill: "rgba(255, 255, 255, 0.08)" }}
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
                                        stroke="rgba(231,238,248,0.4)"
                                        tick={{ fill: "rgba(231,238,248,0.74)", fontSize: 12 }}
                                    />
                                    <YAxis
                                        stroke="rgba(231,238,248,0.4)"
                                        tick={{ fill: "rgba(231,238,248,0.74)", fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        itemStyle={{ color: "#f4f7fb" }}
                                    />
                                    <Legend wrapperStyle={{ color: "rgba(231,238,248,0.74)" }} />
                                    <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#7dd3fc" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="chart-item chart-item-wide">
                        <h5>Ticket Trend Over Time</h5>
                        <div className="chart-canvas chart-canvas-wide">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dataOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="rgba(231,238,248,0.4)"
                                        tick={{ fill: "rgba(231,238,248,0.74)", fontSize: 12 }}
                                    />
                                    <YAxis
                                        stroke="rgba(231,238,248,0.4)"
                                        tick={{ fill: "rgba(231,238,248,0.74)", fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        itemStyle={{ color: "#f4f7fb" }}
                                        cursor={{ fill: "rgba(255, 255, 255, 0.06)" }}
                                    />
                                    <Legend wrapperStyle={{ color: "rgba(231,238,248,0.74)" }} />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="var(--accent)"
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
