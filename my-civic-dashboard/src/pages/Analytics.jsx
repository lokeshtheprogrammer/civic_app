import React from 'react';
import IssuesByStatusChart from '../components/charts/IssuesByStatusChart';
import IssuesByCategoryChart from '../components/charts/IssuesByCategoryChart';

const Analytics = () => {
    return (
        <main className="flex-1 p-8 lg:p-10">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800">Analytics Dashboard</h1>
                <p className="text-lg text-gray-500 mt-2">An overview of civic issues based on live data.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Issues by Status</h2>
                    <IssuesByStatusChart />
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Issues by Category</h2>
                    <IssuesByCategoryChart />
                </div>
            </div>
        </main>
    );
};

export default Analytics;