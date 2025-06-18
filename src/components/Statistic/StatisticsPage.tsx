import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
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
            <button className="back-button mb-3" onClick={() => navigate(-1)}>
                ← Назад
            </button>
            <h2 className="mb-4 text-center">Статистика заявок</h2>
            <div className="chart-wrapper">
                <div className="chart-grid">
                    <div className="chart-item" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                        <div>
                            <h5>Распределение по статусам</h5>
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
                                <Tooltip />
                            </PieChart>
                        </div>
                        <PieLegend data={dataStatus} />
                    </div>

                    <div className="chart-item">
                        <h5>Количество заявок по дням</h5>
                        <BarChart width={400} height={300} data={dataOverTime}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </div>

                    <div className="chart-item" style={{ flexBasis: "100%" }}>
                        <h5>Динамика заявок за период</h5>
                        <LineChart width={800} height={300} data={dataOverTime}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2.5} activeDot={{ r: 6 }} />
                        </LineChart>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;