import React from 'react';

import { Link } from 'react-router-dom';

const IssueCard = ({ issue }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 flex flex-col">
        <img src={issue.imageUrl} alt={issue.title} className="w-full h-40 object-cover rounded-md mb-4 border border-gray-200" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x250/9CA3AF/FFFFFF?text=Image+Not+Found'; }} />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{issue.title}</h3>
        <p className="text-gray-600 text-sm mb-3 flex-grow">{issue.description}</p>
        <div className="flex flex-wrap gap-2 text-sm mb-3">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">Category: {issue.category}</span>
            <span className={`px-3 py-1 rounded-full font-medium ${
                issue.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                issue.status === 'Assigned' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
            }`}>Status: {issue.status}</span>
            <span className={`px-3 py-1 rounded-full font-medium ${
                issue.priority === 'High' ? 'bg-red-100 text-red-700' :
                issue.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
            }`}>Priority: {issue.priority}</span>
        </div>
        <p className="text-gray-500 text-xs mt-auto">Reported by: {issue.reportedBy} at {new Date(issue.reportedAt).toLocaleDateString()}</p>
        <p className="text-gray-500 text-xs">Location: {issue.location.address}</p>
        <Link to={`/issue/${issue.id}`} className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center">
            View Details
        </Link>
    </div>
);

export default IssueCard;
