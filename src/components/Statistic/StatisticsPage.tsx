import React, { useEffect, useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis, Legend,
    LineChart, Line, CartesianGrid,
} from "recharts";
import { fetchStatusDistribution, fetchRequestsOverTime } from "../../api";
import "./StatisticsPage.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

const PieLegend: React.FC<{ data: { name: string, value: number }[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return (
        <ul className="pie-legend">
            {data.map((entry, index) => {
                const percent = ((entry.value / total) * 100).toFixed(0);
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
    const [dataStatus, setDataStatus] = useState([]);
    const [dataOverTime, setDataOverTime] = useState([]);

    useEffect(() => {
        fetchStatusDistribution().then(setDataStatus).catch(console.error);
        fetchRequestsOverTime().then(data => {
            const formatted = data.map((item: any) => ({
                date: item.date,
                count: item.value
            }));
            setDataOverTime(formatted);
        }).catch(console.error);
    }, []);

    return (
        <div className="container my-4">
            <div className="chart-wrapper">
                <div className="chart-grid">

                    <div className="chart-item" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                        <div>
                            <h5>Status Distribution</h5>
                            <PieChart width={300} height={300}>
                                <Pie
                                    data={dataStatus}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
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
                        </div>
                        <PieLegend data={dataStatus} />
                    </div>

                    <div className="chart-item">
                        <h5>Tickets per Day</h5>
                        <BarChart width={400} height={300} data={dataOverTime}>
                            <XAxis
                                dataKey="date"
                                stroke="#ffffff"
                                tick={{ fill: "#ffffff" }}
                            />
                            <YAxis
                                stroke="#ffffff"
                                tick={{ fill: "#ffffff" }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#222",
                                    color: "#fff",
                                    border: "none"
                                }}
                            />
                            <Legend wrapperStyle={{ color: "#ffffff" }} />
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </div>

                    <div className="chart-item" style={{ flexBasis: "100%" }}>
                        <h5>Ticket Trend Over Time</h5>
                        <LineChart width={800} height={300} data={dataOverTime}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                            <XAxis
                                dataKey="date"
                                stroke="#ffffff"
                                tick={{ fill: "#ffffff" }}
                            />
                            <YAxis
                                stroke="#ffffff"
                                tick={{ fill: "#ffffff" }}
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
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;