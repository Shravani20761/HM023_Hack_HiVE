import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Icons replaced with inline SVGs to avoid dependency issues

// Mock Data Service
const fetchCampaigns = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, name: 'Summer Sale 2026', status: 'active', createdAt: '2026-01-15', audience: '24k', engagement: '12%' },
                { id: 2, name: 'Product Launch Alpha', status: 'draft', createdAt: '2026-01-10', audience: '-', engagement: '-' },
                { id: 3, name: 'Holiday Special', status: 'archived', createdAt: '2025-12-20', audience: '150k', engagement: '45%' },
                { id: 4, name: 'Newsletter #42', status: 'active', createdAt: '2026-01-17', audience: '5.2k', engagement: '8.5%' },
                { id: 5, name: 'Re-engagement Flow', status: 'paused', createdAt: '2025-11-05', audience: '12k', engagement: '3.2%' },
            ]);
        }, 800);
    });
};

const StatusBadge = ({ status }) => {
    const styles = {
        active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        draft: 'bg-slate-100 text-slate-700 border-slate-200',
        archived: 'bg-amber-50 text-amber-700 border-amber-200',
        paused: 'bg-orange-100 text-orange-700 border-orange-200',
    };

    const statusStyle = styles[status] || 'bg-gray-100 text-gray-700';

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle} capitalize`}>
            {status}
        </span>
    );
};

const CampaignList = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetchCampaigns()
            .then(data => {
                setCampaigns(data);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to load campaigns.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-login-bg-start"></div>
                <span className="ml-3 text-gray-500 font-medium">Loading campaigns...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-login-bg-start hover:underline font-medium"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Campaigns</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage all your marketing campaigns in one place.</p>
                </div>
                <Link
                    to="/campaigns/create"
                    className="flex items-center gap-2 bg-login-bg-start hover:bg-login-bg-middle text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition-all transform hover:-translate-y-0.5"
                >
                    <span className="text-lg font-bold">+</span> Create Campaign
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-login-focus focus:bg-white transition-all"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        Status: All
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                </div>
            </div>

            {/* Campaign Table */}
            <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">Campaign Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Stats</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Created</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {campaigns.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No campaigns found. Create your first one!
                                    </td>
                                </tr>
                            ) : (
                                campaigns.map((campaign) => (
                                    <tr key={campaign.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-indigo-500 font-bold text-xs border border-indigo-100">
                                                    {campaign.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900">{campaign.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={campaign.status} />
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex items-center gap-4 text-xs">
                                                <span title="Audience Size">👥 {campaign.audience}</span>
                                                <span title="Engagement Rate">⚡ {campaign.engagement}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(campaign.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    to={`/campaigns/${campaign.id}`}
                                                    className="p-1.5 text-gray-400 hover:text-login-bg-start hover:bg-teal-50 rounded-md transition-colors"
                                                    title="View Details"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                </Link>
                                                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CampaignList;
