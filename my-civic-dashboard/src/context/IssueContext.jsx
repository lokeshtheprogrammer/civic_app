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
            let imageUrl = null;
            if (issueData.imageFile) {
                const formData = new FormData();
                formData.append('file', issueData.imageFile);
                const imageResponse = await apiClient.post('/issues/upload-image/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                imageUrl = imageResponse.data.url;
            }

            const finalIssueData = {
                title: issueData.title,
                description: issueData.description,
                category: issueData.category,
                location: issueData.location,
                priority: issueData.priority,
                imageUrl: imageUrl,
            };

            const response = await apiClient.post('/issues/', finalIssueData);
            setIssues(prevIssues => [response.data, ...prevIssues]);
        } catch (err) {
            setError(err);
            console.error("Failed to add issue:", err);
            throw err; // Re-throw to be caught in the component
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
