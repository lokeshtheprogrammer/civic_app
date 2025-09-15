import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ArrowLeftIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';

const IssueDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/issues/${id}`);
                setIssue(response.data);
                setNewStatus(response.data.status);
            } catch (err) {
                setError('Failed to fetch issue details.');
            } finally {
                setLoading(false);
            }
        };
        fetchIssue();
    }, [id]);

    const handleAssignToMe = async () => {
        try {
            const response = await apiClient.patch(`/issues/${issue.id}/assign`);
            setIssue(response.data);
        } catch (err) {
            alert('Failed to assign issue. It might already be assigned.');
        }
    };

    const handleStatusUpdate = async () => {
        try {
            const response = await apiClient.patch(`/issues/${issue.id}/status`, { status: newStatus });
            setIssue(response.data);
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    const handleVote = async () => {
        try {
            const response = await apiClient.post(`/issues/${issue.id}/vote`);
            setIssue(response.data);
        } catch (err) {
            alert('Failed to cast vote.');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!issue) return <div className="p-8 text-center text-red-500">Issue not found.</div>;

    const statusClasses = {
        Submitted: 'bg-red-100 text-red-700',
        Assigned: 'bg-yellow-100 text-yellow-700',
        Resolved: 'bg-green-100 text-green-700',
    };

    const OfficerActions = () => (
        <div className="mt-6 p-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Officer Actions</h3>
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleAssignToMe}
                    disabled={!!issue.assignee_id}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {issue.assignee_id ? `Assigned to ${issue.assignee.full_name}` : 'Assign to Me'}
                </button>
                <div className="flex items-center gap-2">
                     <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Submitted">Submitted</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                    <button
                        onClick={handleStatusUpdate}
                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
                    >
                        Update Status
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8 lg:p-10">
            <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Dashboard
            </Link>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">{issue.title}</h1>
                            <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${statusClasses[issue.status]}`}>
                                {issue.status}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={handleVote}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                                    issue.has_voted ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                <HandThumbUpIcon className="w-5 h-5" />
                                <span>{issue.has_voted ? 'Voted' : 'Upvote'}</span>
                            </button>
                            <span className="font-bold text-gray-800">{issue.vote_count} Votes</span>
                        </div>


                        <p className="text-gray-600 mb-6">{issue.description}</p>

                        <div className="border-t border-b border-gray-200 py-4 mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Issue Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <p><strong className="font-medium text-gray-500">Category:</strong> <span className="text-gray-800">{issue.category}</span></p>
                                <p><strong className="font-medium text-gray-500">Priority:</strong> <span className="text-gray-800">{issue.priority}</span></p>
                                <p><strong className="font-medium text-gray-500">Reported By:</strong> <span className="text-gray-800">{issue.reporter.full_name}</span></p>
                                <p><strong className="font-medium text-gray-500">Reported At:</strong> <span className="text-gray-800">{new Date(issue.reportedAt).toLocaleString()}</span></p>
                                {issue.assignee && <p><strong className="font-medium text-gray-500">Assigned To:</strong> <span className="text-gray-800">{issue.assignee.full_name}</span></p>}
                            </div>
                        </div>

                        {user?.role === 'officer' && <OfficerActions />}
                    </div>

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
