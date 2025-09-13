import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_ISSUES } from '../data/issues';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const IssueDetail = () => {
    const { id } = useParams();
    // In a real app, you'd fetch this data. Here we find it in our mock data.
    const [issue, setIssue] = useState(MOCK_ISSUES.find(i => i.id === id));

    if (!issue) {
        return <div className="p-8 text-center text-red-500">Issue not found.</div>;
    }

    const handleStatusChange = (e) => {
        // This only updates the state locally. In a real app, this would be an API call.
        setIssue({ ...issue, status: e.target.value });
        // Note: This change will not persist if you navigate away and come back.
    };

    const statusClasses = {
        Submitted: 'bg-red-100 text-red-700',
        Assigned: 'bg-yellow-100 text-yellow-700',
        Resolved: 'bg-green-100 text-green-700',
    };

    return (
        <div className="p-8 lg:p-10">
            <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Dashboard
            </Link>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details & Actions */}
                    <div className="lg:col-span-2">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">{issue.title}</h1>
                            <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${statusClasses[issue.status]}`}>
                                {issue.status}
                            </span>
                        </div>

                        <p className="text-gray-600 mb-6">{issue.description}</p>

                        <div className="border-t border-b border-gray-200 py-4 mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Issue Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <p><strong className="font-medium text-gray-500">Category:</strong> <span className="text-gray-800">{issue.category}</span></p>
                                <p><strong className="font-medium text-gray-500">Priority:</strong> <span className="text-gray-800">{issue.priority}</span></p>
                                <p><strong className="font-medium text-gray-500">Reported By:</strong> <span className="text-gray-800">{issue.reportedBy}</span></p>
                                <p><strong className="font-medium text-gray-500">Reported At:</strong> <span className="text-gray-800">{new Date(issue.reportedAt).toLocaleString()}</span></p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Update Status</h3>
                            <select 
                                value={issue.status}
                                onChange={handleStatusChange}
                                className="w-full max-w-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Submitted">Submitted</option>
                                <option value="Assigned">Assigned</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-2">* In a real application, saving this would trigger a notification to the citizen.</p>
                        </div>
                    </div>

                    {/* Right Column: Image & Map */}
                    <div className="space-y-6">
                        <div>
                            <img src={issue.imageUrl} alt={issue.title} className="w-full h-auto object-cover rounded-lg shadow-md" />
                        </div>
                        <div className="h-64 w-full rounded-lg overflow-hidden shadow-md">
                            <MapContainer center={[issue.location.lat, issue.location.lng]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[issue.location.lat, issue.location.lng]}>
                                    <Popup>{issue.location.address}</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                        <p className="text-center text-sm text-gray-500">{issue.location.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetail;
