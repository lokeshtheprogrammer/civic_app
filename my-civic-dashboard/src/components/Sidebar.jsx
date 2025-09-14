import React from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { HomeIcon, MapIcon, ChartBarIcon, Cog8ToothIcon, UsersIcon, TagIcon, PencilSquareIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { useIssues } from '../context/IssueContext';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { issues } = useIssues();
    const { user, logout } = useAuth();
    const [searchParams] = useSearchParams();
    const activeCategory = searchParams.get('category');

    const categories = ['All', ...new Set(issues.map(issue => issue.category))];

    const navLinkClasses = (isActive) =>
        `flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`;

    const buttonClasses = `flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-gray-300 hover:bg-gray-700 hover:text-white`;


    return (
        <aside className="w-64 bg-gray-800 text-white p-6 h-auto flex flex-col rounded-l-lg shadow-lg">
            <div className="flex items-center space-x-3 mb-8">
                <MapIcon className="w-8 h-8 text-blue-400" />
                <h2 className="text-2xl font-bold text-blue-300">Civic Dashboard</h2>
            </div>
            <nav className="space-y-4 flex-grow">
                {/* Main Pages */}
                <NavLink to="/" className={({isActive}) => navLinkClasses(isActive && !activeCategory)} end>
                    <HomeIcon className="w-5 h-5 mr-3" />
                    <span className="text-lg">Dashboard</span>
                </NavLink>

                <NavLink to="/submit-issue" className={({isActive}) => navLinkClasses(isActive)}>
                    <PencilSquareIcon className="w-5 h-5 mr-3" />
                    <span className="text-lg">Submit Issue</span>
                </NavLink>

                {/* Category Filters */}
                <div className="pl-4 space-y-2">
                    {categories.map(category => {
                        const to = category === 'All' ? '/' : `/?category=${category}`;
                        const isActive = category === 'All' ? !activeCategory : activeCategory === category;
                        return (
                            <NavLink key={category} to={to} className={() => navLinkClasses(isActive)}>
                                <TagIcon className="w-4 h-4 mr-2" />
                                <span className="text-sm">{category} Issues</span>
                            </NavLink>
                        );
                    })}
                </div>

                <NavLink to="/reports" className={({isActive}) => navLinkClasses(isActive)}>
                    <ChartBarIcon className="w-5 h-5 mr-3" />
                    <span className="text-lg">Reports</span>
                </NavLink>
                <NavLink to="/analytics" className={({isActive}) => navLinkClasses(isActive)}>
                    <ChartBarIcon className="w-5 h-5 mr-3" />
                    <span className="text-lg">Analytics</span>
                </NavLink>
            </nav>
            <div className="mt-8 pt-4 border-t border-gray-700">
                {user && (
                    <div className="text-center mb-4">
                        <p className="text-sm font-medium text-gray-400">{user.email}</p>
                    </div>
                )}
                <button onClick={logout} className={buttonClasses}>
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                    <span className="text-lg">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;