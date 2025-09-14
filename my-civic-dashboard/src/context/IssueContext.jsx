import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/client';

const IssueContext = createContext();

export const useIssues = () => {
    return useContext(IssueContext);
};

export const IssueProvider = ({ children }) => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await apiClient.get('/issues');
                setIssues(response.data);
            } catch (err) {
                setError(err);
                console.error("Failed to fetch issues:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchIssues();
    }, []);

    const addIssue = async (issueData) => {
        try {
            const response = await apiClient.post('/issues', issueData);
            setIssues(prevIssues => [response.data, ...prevIssues]);
        } catch (err) {
            setError(err);
            console.error("Failed to add issue:", err);
            // Optionally re-throw or handle the error in the UI
        }
    };

    const value = {
        issues,
        addIssue,
        loading,
        error,
    };

    return (
        <IssueContext.Provider value={value}>
            {children}
        </IssueContext.Provider>
    );
};
