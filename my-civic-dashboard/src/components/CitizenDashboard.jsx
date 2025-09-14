import React from 'react';
import IssueCard from './IssueCard';
import Map from './Map';
import { useIssues } from '../context/IssueContext';

const CitizenDashboard = () => {
    const { issues, loading, error } = useIssues();

    if (loading) {
        return <div className="flex-1 p-8 lg:p-10 flex justify-center items-center"><p className="text-2xl text-gray-500">Loading issues...</p></div>;
    }

    if (error) {
        return <div className="flex-1 p-8 lg:p-10 flex justify-center items-center"><p className="text-2xl text-red-500">Error loading issues. Please try again later.</p></div>;
    }

    // In a future step, we can filter issues to show only those reported by the current user.
    const filteredIssues = issues;

    return (
        <>
            <section className="bg-white rounded-xl shadow-lg p-6 mb-8 flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Issue Map</h2>
                <div className="w-full h-96 bg-gray-200 rounded-lg">
                    <Map issues={filteredIssues} />
                </div>
            </section>

            <section className="flex-grow">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    All Reported Issues ({filteredIssues.length} found)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIssues.length > 0 ? (
                        filteredIssues.map(issue => (
                            <IssueCard key={issue.id} issue={issue} />
                        ))
                    ) : (
                        <p className="text-gray-500 col-span-full text-center py-10">No issues found.</p>
                    )}
                </div>
            </section>
        </>
    );
};

export default CitizenDashboard;
