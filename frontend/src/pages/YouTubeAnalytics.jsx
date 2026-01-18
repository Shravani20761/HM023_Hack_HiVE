import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import CampaignLayout from '../components/CampaignLayout';
import { PageHeader, Loader, Icons, Button, EmptyState } from '../components/BasicUIComponents';
import api from '../services/api.service';

const MetricCard = ({ label, value, icon, gradient, trend, index }) => (
    <div
        className={`
            bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6
            border border-slate-100 shadow-lg hover:shadow-xl
            transform hover:-translate-y-1 transition-all duration-300
            animate-slide-up
        `}
        style={{ animationDelay: `${index * 100}ms` }}
    >
        <div className="flex items-start justify-between mb-4">
            <div className={`
                w-12 h-12 rounded-xl bg-gradient-to-br ${gradient}
                flex items-center justify-center shadow-lg text-xl
            `}>
                {icon}
            </div>
            {trend !== undefined && (
                <span className={`
                    flex items-center gap-1 text-sm font-bold
                    ${trend >= 0 ? 'text-green-600' : 'text-red-600'}
                `}>
                    {trend >= 0 ? <Icons.TrendingUp className="w-4 h-4" /> : <Icons.TrendingDown className="w-4 h-4" />}
                    {Math.abs(trend)}%
                </span>
            )}
        </div>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
);

const SimpleChart = ({ data, color = 'purple' }) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value));
    const colors = {
        purple: 'from-purple-400 to-pink-500',
        blue: 'from-blue-400 to-cyan-500',
        green: 'from-green-400 to-emerald-500',
        red: 'from-red-400 to-rose-500'
    };

    return (
        <div className="flex items-end gap-1 h-32">
            {data.map((item, idx) => (
                <div
                    key={idx}
                    className="flex-1 flex flex-col items-center group"
                >
                    <div
                        className={`
                            w-full rounded-t-lg bg-gradient-to-t ${colors[color]}
                            transition-all duration-300 group-hover:opacity-80
                        `}
                        style={{ height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`, minHeight: '4px' }}
                    ></div>
                    <span className="text-[10px] text-slate-400 mt-1 truncate w-full text-center">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

const YouTubeAnalytics = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getJWT } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [campaignName, setCampaignName] = useState('');
    const [analytics, setAnalytics] = useState(null);
    const [channel, setChannel] = useState(null);
    const [dateRange, setDateRange] = useState('7d');

    useEffect(() => {
        fetchData();
    }, [id, getJWT, dateRange]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = await getJWT();
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [nameRes, channelRes] = await Promise.all([
                api.get(`/api/campaigns/${id}`, config),
                api.get(`/api/campaigns/${id}/youtube/channel`, config).catch(() => ({ data: null }))
            ]);

            setCampaignName(nameRes.data.name);
            setChannel(channelRes.data);

            // Get analytics with date range
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - (dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const params = new URLSearchParams(window.location.search);

            if (params.get('demo') === 'true') {
                // Demo Data
                const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
                const demoDaily = Array.from({ length: days }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (days - 1 - i));
                    return {
                        date: date.toISOString().split('T')[0],
                        views: Math.floor(Math.random() * 5000) + 1000,
                        watch_time_minutes: Math.floor(Math.random() * 20000) + 5000,
                        likes: Math.floor(Math.random() * 500) + 100,
                        comments: Math.floor(Math.random() * 50) + 10,
                        subscribers_gained: Math.floor(Math.random() * 100) + 20,
                        subscribers_lost: Math.floor(Math.random() * 10)
                    };
                });

                setAnalytics({
                    daily: demoDaily,
                    aggregate: {
                        total_views: demoDaily.reduce((acc, curr) => acc + curr.views, 0),
                        total_watch_time: demoDaily.reduce((acc, curr) => acc + curr.watch_time_minutes, 0),
                        avg_view_duration: 4.5,
                        avg_ctr: 5.2,
                        total_likes: demoDaily.reduce((acc, curr) => acc + curr.likes, 0),
                        total_comments: demoDaily.reduce((acc, curr) => acc + curr.comments, 0),
                        net_subscribers: demoDaily.reduce((acc, curr) => acc + (curr.subscribers_gained - curr.subscribers_lost), 0)
                    }
                });
            } else {
                const analyticsRes = await api.get(`/api/campaigns/${id}/youtube/analytics?startDate=${startDate}&endDate=${endDate}`, config);
                setAnalytics(analyticsRes.data);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setAnalytics({ daily: [], aggregate: {} });

            if (error.response?.status === 500) {
                navigate(`/campaigns/${id}/youtube`);
            }
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num) => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return Math.round(num).toString();
    };

    const formatDuration = (minutes) => {
        if (!minutes) return '0m';
        if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${Math.round(minutes % 60)}m`;
        return `${Math.round(minutes)}m`;
    };

    if (loading) return (
        <CampaignLayout campaignName={campaignName}>
            <div className="flex items-center justify-center h-64">
                <Loader />
            </div>
        </CampaignLayout>
    );

    const agg = analytics?.aggregate || {};

    return (
        <CampaignLayout campaignName={campaignName}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
                <PageHeader
                    title="YouTube Analytics"
                    subtitle="Track your channel performance"
                    action={
                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => navigate(`/campaigns/${id}/youtube`)}
                            >
                                <Icons.ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                        </div>
                    }
                />

                {/* Date Range Selector */}
                <div className="flex gap-2 mb-8">
                    {[
                        { value: '7d', label: 'Last 7 Days' },
                        { value: '30d', label: 'Last 30 Days' },
                        { value: '90d', label: 'Last 90 Days' }
                    ].map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setDateRange(opt.value)}
                            className={`
                                px-4 py-2 rounded-xl font-semibold text-sm
                                transition-all duration-300 transform hover:scale-105
                                ${dateRange === opt.value
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }
                            `}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Channel Overview */}
                {channel && (
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100 mb-8 animate-fade-in">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg">
                                {channel.thumbnail ? (
                                    <img src={channel.thumbnail} alt={channel.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold">
                                        {channel.title?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{channel.title}</h3>
                                <div className="flex gap-4 mt-1 text-sm text-slate-600">
                                    <span>{formatNumber(channel.subscriberCount)} subscribers</span>
                                    <span>{formatNumber(channel.videoCount)} videos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <MetricCard
                        label="Total Views"
                        value={formatNumber(agg.total_views)}
                        icon="👁️"
                        gradient="from-blue-400 to-cyan-500"
                        index={0}
                    />
                    <MetricCard
                        label="Watch Time"
                        value={formatDuration(agg.total_watch_time)}
                        icon="⏱️"
                        gradient="from-purple-400 to-pink-500"
                        index={1}
                    />
                    <MetricCard
                        label="Avg. View Duration"
                        value={formatDuration(agg.avg_view_duration)}
                        icon="📊"
                        gradient="from-green-400 to-emerald-500"
                        index={2}
                    />
                    <MetricCard
                        label="CTR"
                        value={`${(agg.avg_ctr || 0).toFixed(1)}%`}
                        icon="🎯"
                        gradient="from-amber-400 to-orange-500"
                        index={3}
                    />
                </div>

                {/* Engagement Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <MetricCard
                        label="Total Likes"
                        value={formatNumber(agg.total_likes)}
                        icon="👍"
                        gradient="from-pink-400 to-rose-500"
                        index={4}
                    />
                    <MetricCard
                        label="Comments"
                        value={formatNumber(agg.total_comments)}
                        icon="💬"
                        gradient="from-indigo-400 to-purple-500"
                        index={5}
                    />
                    <MetricCard
                        label="Net Subscribers"
                        value={formatNumber(agg.net_subscribers)}
                        icon="👥"
                        gradient="from-red-400 to-rose-500"
                        index={6}
                    />
                </div>

                {/* Charts */}
                {analytics?.daily && analytics.daily.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Views Chart */}
                        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-100 shadow-lg">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-sm">
                                    👁️
                                </span>
                                Views Over Time
                            </h3>
                            <SimpleChart
                                data={analytics.daily.slice(-14).map(d => ({
                                    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                    value: d.views || 0
                                }))}
                                color="blue"
                            />
                        </div>

                        {/* Watch Time Chart */}
                        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-100 shadow-lg">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm">
                                    ⏱️
                                </span>
                                Watch Time (minutes)
                            </h3>
                            <SimpleChart
                                data={analytics.daily.slice(-14).map(d => ({
                                    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                    value: d.watch_time_minutes || 0
                                }))}
                                color="purple"
                            />
                        </div>

                        {/* Engagement Chart */}
                        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-100 shadow-lg">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm">
                                    💬
                                </span>
                                Engagement (Likes + Comments)
                            </h3>
                            <SimpleChart
                                data={analytics.daily.slice(-14).map(d => ({
                                    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                    value: (d.likes || 0) + (d.comments || 0)
                                }))}
                                color="green"
                            />
                        </div>

                        {/* Subscribers Chart */}
                        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-100 shadow-lg">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white text-sm">
                                    👥
                                </span>
                                Net Subscribers
                            </h3>
                            <SimpleChart
                                data={analytics.daily.slice(-14).map(d => ({
                                    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                    value: (d.subscribers_gained || 0) - (d.subscribers_lost || 0)
                                }))}
                                color="red"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-12 border border-slate-100 shadow-lg text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-4">
                            <Icons.BarChart className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Analytics Data Yet</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Analytics data will appear here once your videos start getting views.
                            Data may take 24-48 hours to sync from YouTube.
                        </p>
                    </div>
                )}
            </div>
        </CampaignLayout>
    );
};

export default YouTubeAnalytics;
