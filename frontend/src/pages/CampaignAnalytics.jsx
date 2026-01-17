import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analyticsService } from '../api/analytics';

const CampaignAnalytics = () => {
    const { id } = useParams();
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7days');

    useEffect(() => {
        loadAnalytics();
    }, [id, timeRange]);

    const loadAnalytics = async () => {
        setIsLoading(true);
        try {
            const data = await analyticsService.getAnalytics(id, timeRange);
            setAnalytics(data);
        } catch (error) {
            console.error("Failed to load analytics:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] -m-6 bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <Link to={`/campaigns/${id}`} className="text-gray-500 hover:text-gray-700">← Back</Link>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Campaign Analytics</h1>
                        <p className="text-xs text-gray-500">Performance overview & insights</p>
                    </div>
                </div>
                <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                    {['7days', '30days', 'all'].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${timeRange === range
                                    ? 'bg-white text-login-bg-start shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            {range === '7days' ? 'Last 7 Days' : range === '30days' ? 'Last 30 Days' : 'All Time'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {isLoading ? (
                        <div className="text-center text-gray-400 mt-20">Loading analytics...</div>
                    ) : (
                        <>
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Likes', value: analytics.metrics.likes, icon: '❤️', color: 'from-red-500 to-pink-500' },
                                    { label: 'Comments', value: analytics.metrics.comments, icon: '💬', color: 'from-blue-500 to-cyan-500' },
                                    { label: 'Total Views', value: analytics.metrics.views, icon: '👁️', color: 'from-purple-500 to-indigo-500' },
                                    { label: 'Shares', value: analytics.metrics.shares, icon: '📤', color: 'from-green-500 to-teal-500' }
                                ].map((kpi, i) => (
                                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-3xl">{kpi.icon}</span>
                                            <div className={`p-2 rounded-lg bg-gradient-to-br ${kpi.color} opacity-10`}></div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">{kpi.label}</p>
                                        <p className="text-3xl font-bold text-gray-900">{formatNumber(kpi.value)}</p>
                                        <p className="text-xs text-green-600 font-medium mt-2">↗ +12% vs last period</p>
                                    </div>
                                ))}
                            </div>

                            {/* Engagement Trend Chart */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-gray-800">Engagement Trends</h3>
                                    <div className="flex gap-4 text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <span className="text-gray-600">Likes</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span className="text-gray-600">Comments</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-64 flex items-end justify-between gap-2">
                                    {analytics.trends.daily.map((day, i) => {
                                        const maxLikes = Math.max(...analytics.trends.daily.map(d => d.likes));
                                        const maxComments = Math.max(...analytics.trends.daily.map(d => d.comments));
                                        const likesHeight = (day.likes / maxLikes) * 100;
                                        const commentsHeight = (day.comments / maxComments) * 100;

                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                                <div className="w-full flex justify-center items-end gap-1 h-full">
                                                    <div className="w-full bg-red-100 rounded-t-md relative flex items-end hover:bg-red-200 transition-colors" style={{ height: `${likesHeight}%` }}>
                                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                            {day.likes} likes
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-blue-100 rounded-t-md hover:bg-blue-200 transition-colors" style={{ height: `${commentsHeight}%` }}></div>
                                                </div>
                                                <span className="text-xs text-gray-400 mt-2">{new Date(day.date).getDate()}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* AI Insights */}
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-2xl">🤖</span>
                                        <h3 className="text-lg font-bold text-gray-800">AI Insights</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {analytics.insights.map((insight, i) => (
                                            <div key={i} className="flex gap-3 bg-white rounded-lg p-3 shadow-sm">
                                                <span className="text-lg">
                                                    {insight.type === 'positive' ? '✅' : '💡'}
                                                </span>
                                                <p className="text-sm text-gray-700 flex-1">{insight.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Platform Breakdown */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Platform Performance</h3>
                                    <div className="space-y-4">
                                        {analytics.platforms.map((platform, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-bold text-gray-700">{platform.name}</span>
                                                    <span className="text-xs text-gray-500">{formatNumber(platform.views)} views</span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${platform.color} rounded-full transition-all`}
                                                        style={{ width: `${(platform.views / analytics.metrics.views) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                                    <span>❤️ {formatNumber(platform.likes)}</span>
                                                    <span>💬 {formatNumber(platform.comments)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampaignAnalytics;
