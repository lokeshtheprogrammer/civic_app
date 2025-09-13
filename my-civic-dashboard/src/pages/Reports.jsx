import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ISSUES } from '../data/issues';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

const Reports = () => {
    const [sortConfig, setSortConfig] = useState({ key: 'reportedAt', direction: 'descending' });
    const navigate = useNavigate();

    const sortedIssues = useMemo(() => {
        let sortableIssues = [...MOCK_ISSUES];
        if (sortConfig.key !== null) {
            sortableIssues.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableIssues;
    }, [sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        if (sortConfig.direction === 'ascending') return <ChevronUpIcon className="w-4 h-4 inline ml-1" />;
        return <ChevronDownIcon className="w-4 h-4 inline ml-1" />;
    };

    const statusClasses = {
        Submitted: 'bg-red-100 text-red-700',
        Assigned: 'bg-yellow-100 text-yellow-700',
        Resolved: 'bg-green-100 text-green-700',
    };

    return (
        <div className="p-8 lg:p-10">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Issue Reports</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full text-left table-auto">
                    <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                            <th className="p-4 font-semibold text-gray-600 cursor-pointer" onClick={() => requestSort('title')}>Title {getSortIcon('title')}</th>
                            <th className="p-4 font-semibold text-gray-600 cursor-pointer" onClick={() => requestSort('category')}>Category {getSortIcon('category')}</th>
                            <th className="p-4 font-semibold text-gray-600 cursor-pointer" onClick={() => requestSort('status')}>Status {getSortIcon('status')}</th>
                            <th className="p-4 font-semibold text-gray-600 cursor-pointer" onClick={() => requestSort('priority')}>Priority {getSortIcon('priority')}</th>
                            <th className="p-4 font-semibold text-gray-600 cursor-pointer" onClick={() => requestSort('reportedAt')}>Reported At {getSortIcon('reportedAt')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedIssues.map(issue => (
                            <tr key={issue.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/issue/${issue.id}`)}>
                                <td className="p-4 text-gray-800">{issue.title}</td>
                                <td className="p-4 text-gray-600">{issue.category}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[issue.status]}`}>
                                        {issue.status}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600">{issue.priority}</td>
                                <td className="p-4 text-gray-600">{new Date(issue.reportedAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reports;