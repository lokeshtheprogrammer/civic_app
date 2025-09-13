import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { MOCK_ISSUES } from '../data/issues';

// --- Data Processing for Charts ---

// 1. Data for Issues by Category Bar Chart
const categoryCounts = MOCK_ISSUES.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
}, {});
const categoryData = Object.keys(categoryCounts).map(category => ({
    name: category,
    count: categoryCounts[category],
}));

// 2. Data for Issues by Status Pie Chart
const statusCounts = MOCK_ISSUES.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
}, {});
const statusData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status],
}));

const COLORS = { Submitted: '#F87171', Assigned: '#FBBF24', Resolved: '#34D399' };

const Analytics = () => {
    return (
        <div className="p-8 lg:p-10">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Issues by Category Chart */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Issues by Category</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#3B82F6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Issues by Status Chart */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Issues by Status</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;