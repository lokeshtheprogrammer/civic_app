import React from 'react';
import { useAuth } from '../context/AuthContext';
import CitizenDashboard from '../components/CitizenDashboard';
import OfficerDashboard from '../components/OfficerDashboard';

const Dashboard = () => {
    const { user, token } = useAuth();

    // The user object might be loading, so we check for the token first
    // to avoid a flash of the wrong dashboard.
    if (!token || !user) {
        return <div className="flex-1 p-8 lg:p-10 flex justify-center items-center"><p className="text-2xl text-gray-500">Loading user data...</p></div>;
    }

    return (
        <main className="flex-1 p-8 lg:p-10 flex flex-col">
            <header className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-4 sm:mb-0">Dashboard</h1>
                <div className="text-lg text-gray-600">
                    Welcome, <span className="font-bold">{user.full_name}</span> ({user.role})
                </div>
            </header>

            {user.role === 'officer' ? <OfficerDashboard /> : <CitizenDashboard />}
        </main>
    );
};

export default Dashboard;
