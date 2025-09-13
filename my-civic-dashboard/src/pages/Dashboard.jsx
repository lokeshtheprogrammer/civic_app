import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useIssues } from '../context/IssueContext';
import IssueCard from '../components/IssueCard';
import Map from '../components/Map';

const Dashboard = () => {
    const { issues, loading, error } = useIssues();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');

    const filteredIssues = useMemo(() => {
        let filtered = issues;

        // Filter by category
        if (categoryFilter) {
            filtered = filtered.filter(issue => issue.category === categoryFilter);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(issue =>
                issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (issue.location.address && issue.location.address.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        return filtered;
    }, [issues, searchTerm, categoryFilter]);

    const pageTitle = categoryFilter ? `${categoryFilter} Issues` : 'All Civic Issues';

    if (loading) {
        return <div className="flex-1 p-8 lg:p-10 flex justify-center items-center"><p className="text-2xl text-gray-500">Loading issues...</p></div>;
    }

    if (error) {
        return <div className="flex-1 p-8 lg:p-10 flex justify-center items-center"><p className="text-2xl text-red-500">Error loading issues. Please try again later.</p></div>;
    }

    return (
        <main className="flex-1 p-8 lg:p-10 flex flex-col">
            <header className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-4 sm:mb-0">Dashboard</h1>
                <div className="relative w-full max-w-xs sm:w-72">
                    <input
                        type="text"
                        placeholder="Search issues..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            </header>

            <section className="bg-white rounded-xl shadow-lg p-6 mb-8 flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Issue Map</h2>
                <div className="w-full h-96 bg-gray-200 rounded-lg">
                    <Map issues={filteredIssues} />
                </div>
            </section>

            <section className="flex-grow">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {pageTitle} ({filteredIssues.length} found)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIssues.length > 0 ? (
                        filteredIssues.map(issue => (
                            <IssueCard key={issue.id} issue={issue} />
                        ))
                    ) : (
                        <p className="text-gray-500 col-span-full text-center py-10">No issues found for the current filters.</p>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Dashboard;
