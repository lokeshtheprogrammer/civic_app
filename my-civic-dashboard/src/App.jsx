import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import IssueDetail from './pages/IssueDetail';
import SubmitIssue from './pages/SubmitIssue';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationHandler from './components/NotificationHandler';

const App = () => {
    const location = useLocation();
    const noSidebarRoutes = ['/login', '/register'];

    const showSidebar = !noSidebarRoutes.includes(location.pathname);

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex">
            {showSidebar && <Sidebar />}
            <div className="flex-1 flex flex-col">
                <NotificationHandler />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/issue/:id" element={<ProtectedRoute><IssueDetail /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                    <Route path="/submit-issue" element={<ProtectedRoute><SubmitIssue /></ProtectedRoute>} />
                    {/* Add routes for Users and Settings as placeholder pages */}
                    <Route path="/users" element={<ProtectedRoute><div className="p-8"><h1 className="text-4xl font-extrabold text-gray-800">Users</h1></div></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><div className="p-8"><h1 className="text-4xl font-extrabold text-gray-800">Settings</h1></div></ProtectedRoute>} />
                </Routes>
            </div>
        </div>
    );
};

export default App;