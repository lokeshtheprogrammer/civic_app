import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import IssueDetail from './pages/IssueDetail';
import SubmitIssue from './pages/SubmitIssue';

const App = () => {
    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/issue/:id" element={<IssueDetail />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/submit-issue" element={<SubmitIssue />} />
                    {/* Add routes for Users and Settings as placeholder pages */}
                    <Route path="/users" element={<div className="p-8"><h1 className="text-4xl font-extrabold text-gray-800">Users</h1></div>} />
                    <Route path="/settings" element={<div className="p-8"><h1 className="text-4xl font-extrabold text-gray-800">Settings</h1></div>} />
                </Routes>
            </div>
        </div>
    );
};

export default App;