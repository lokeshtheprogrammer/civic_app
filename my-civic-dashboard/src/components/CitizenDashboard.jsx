import React, { useState, useEffect } from 'react';
import IssueCard from './IssueCard';
import Map from './Map';
import apiClient from '../api/client';

const CitizenDashboard = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMyIssues = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/issues/me/');
            setIssues(response.data);
        } catch (err) {
            setError('Failed to fetch your reported issues.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyIssues();
    }, []);

    const handleVote = async (issueId) => {
        try {
            const response = await apiClient.post(`/issues/${issueId}/vote`);
            // Update the specific issue in the list
            setIssues(prevIssues =>
                prevIssues.map(issue =>
                    issue.id === issueId ? response.data : issue
                )
            );
        } catch (err) {
            alert('Failed to cast vote.');
        }
    };

    if (loading) {
        return <div className="flex-1 p-8 lg:p-10 flex justify-center items-center"><p className="text-2xl text-gray-500">Loading your issues...</p></div>;
    }

    if (error) {
        return <div className="flex-1 p-8 lg:p-10 flex justify-center items-center"><p className="text-2xl text-red-500">{error}</p></div>;
    }

    return (
        <>
            <section className="bg-white rounded-xl shadow-lg p-6 mb-8 flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Map of Your Reported Issues</h2>
                <div className="w-full h-96 bg-gray-200 rounded-lg">
                    <Map issues={issues} />
                </div>
            </section>

            <section className="flex-grow">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    My Reported Issues ({issues.length} found)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {issues.length > 0 ? (
                        issues.map(issue => (
                            <IssueCard key={issue.id} issue={issue} onVote={handleVote} />
                        ))
                    ) : (
                        <p className="text-gray-500 col-span-full text-center py-10">You have not reported any issues yet.</p>
                    )}
                </div>
            </section>
        </>
    );
};

export default CitizenDashboard;
