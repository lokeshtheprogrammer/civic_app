import React, { useState, useEffect } from 'react';
import IssueCard from './IssueCard';
import Map from './Map';
import apiClient from '../api/client';

const TABS = {
    UNASSIGNED: 'Unassigned',
    ASSIGNED_TO_ME: 'My Issues',
    ALL: 'All Issues',
};

const OfficerDashboard = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(TABS.UNASSIGNED);

    useEffect(() => {
        const fetchIssues = async () => {
            let endpoint = '/issues/';
            if (activeTab === TABS.UNASSIGNED) {
                endpoint = '/issues/unassigned/';
            } else if (activeTab === TABS.ASSIGNED_TO_ME) {
                endpoint = '/issues/assigned/';
            }

            try {
                setLoading(true);
                const response = await apiClient.get(endpoint);
                setIssues(response.data);
            } catch (err) {
                setError(`Failed to fetch ${activeTab} issues.`);
            } finally {
                setLoading(false);
            }
        };
        fetchIssues();
    }, [activeTab]);

    const handleVote = async (issueId) => {
        try {
            const response = await apiClient.post(`/issues/${issueId}/vote`);
            setIssues(prevIssues =>
                prevIssues.map(issue =>
                    issue.id === issueId ? response.data : issue
                )
            );
        } catch (err) {
            alert('Failed to cast vote.');
        }
    };

    const renderContent = () => {
        if (loading) {
            return <div className="flex-1 p-8 lg:p-10 flex justify-center items-center"><p className="text-2xl text-gray-500">Loading issues...</p></div>;
        }

        if (error) {
            return <div className="flex-1 p-8 lg:p-10 flex justify-center items-center"><p className="text-2xl text-red-500">{error}</p></div>;
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {issues.length > 0 ? (
                    issues.map(issue => (
                        <IssueCard key={issue.id} issue={issue} onVote={handleVote} />
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full text-center py-10">No issues found for this view.</p>
                )}
            </div>
        );
    };

    const tabClasses = (tabName) =>
        `px-4 py-2 font-semibold rounded-md transition-colors duration-200 ${
            activeTab === tabName
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`;

    return (
        <>
            <section className="bg-white rounded-xl shadow-lg p-6 mb-8 flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Issue Map ({activeTab})</h2>
                <div className="w-full h-96 bg-gray-200 rounded-lg">
                    <Map issues={issues} />
                </div>
            </section>

            <section className="flex-grow">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Issue Queue
                    </h2>
                    <div className="flex space-x-2">
                        <button onClick={() => setActiveTab(TABS.UNASSIGNED)} className={tabClasses(TABS.UNASSIGNED)}>Unassigned</button>
                        <button onClick={() => setActiveTab(TABS.ASSIGNED_TO_ME)} className={tabClasses(TABS.ASSIGNED_TO_ME)}>My Issues</button>
                        <button onClick={() => setActiveTab(TABS.ALL)} className={tabClasses(TABS.ALL)}>All Issues</button>
                    </div>
                </div>
                {renderContent()}
            </section>
        </>
    );
};

export default OfficerDashboard;
