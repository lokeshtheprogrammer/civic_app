import React, { createContext, useState, useContext } from 'react';
import apiClient from '../api/client';

const IssueContext = createContext();

export const useIssues = () => {
    return useContext(IssueContext);
};

export const IssueProvider = ({ children }) => {
    const [issues, setIssues] = useState([]);
    // Note: Loading and error state management will be moved to the components
    // that actually do the fetching, to be more granular.

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
            // We can't just add to the list anymore, as the list is now role-specific.
            // The component will need to refetch its data after a successful submission.
            return response.data;
        } catch (err) {
            console.error("Failed to add issue:", err);
            throw err; // Re-throw to be caught in the component
        }
    };

    const value = {
        addIssue,
    };

    return (
        <IssueContext.Provider value={value}>
            {children}
        </IssueContext.Provider>
    );
};
