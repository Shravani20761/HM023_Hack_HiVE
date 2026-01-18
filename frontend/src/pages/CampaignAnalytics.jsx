import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/authContext';
import CampaignLayout from '../components/CampaignLayout';
import { PageHeader, Loader, Icons, Card, EmptyState } from '../components/BasicUIComponents';
import api from '../services/api.service';

const MetricCard = ({ icon: Icon, label, value, color = 'blue' }) => {
    const colorGradients = {
        blue: 'from-blue-50 to-blue-100',
        green: 'from-green-50 to-green-100',
        purple: 'from-purple-50 to-purple-100',
        amber: 'from-amber-50 to-amber-100',
        pink: 'from-pink-50 to-pink-100',
    };

    const textColors = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        purple: 'text-purple-600',
        amber: 'text-amber-600',
        pink: 'text-pink-600',
    };

    return (
        <Card className={`p-6 bg-gradient-to-br ${colorGradients[color]} border border-${color}-200 hover:shadow-lg transition-all`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase mb-1">{label}</p>
                    <p className={`text-3xl font-bold ${textColors[color]}`}>{value}</p>
                </div>
                {Icon && <Icon className={`w-8 h-8 ${textColors[color]} opacity-50`} />}
            </div>
        </Card>
    );
};

const CampaignAnalytics = () => {
    const { id } = useParams();
    const { getJWT } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [campaignName, setCampaignName] = useState('');
    const [analytics, setAnalytics] = useState([]);
    const [channelPerformance, setChannelPerformance] = useState([]);
    const [topContent, setTopContent] = useState([]);

    useEffect(() => {
        fetchData();
    }, [id, getJWT]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = await getJWT();
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const nameRes = await api.get(`/api/campaigns/${id}`, config);
            setCampaignName(nameRes.data.name);

            const analyticsRes = await api.get(`/api/campaigns/${id}/analytics`, config).catch(() => ({ data: [] }));
            setAnalytics(analyticsRes.data || []);

            const channelRes = await api.get(`/api/campaigns/${id}/analytics/channels`, config).catch(() => ({ data: [] }));
            setChannelPerformance(channelRes.data || []);

            const topRes = await api.get(`/api/campaigns/${id}/analytics/top-content?limit=5`, config).catch(() => ({ data: [] }));
            setTopContent(topRes.data || []);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    const totalViews = analytics.find(a => a.metric_type === 'views')?.total || 0;
    const totalLikes = analytics.find(a => a.metric_type === 'likes')?.total || 0;
    const totalComments = analytics.find(a => a.metric_type === 'comments')?.total || 0;
    const totalShares = analytics.find(a => a.metric_type === 'shares')?.total || 0;
    const totalReach = analytics.find(a => a.metric_type === 'reach')?.total || 0;
    const totalEngagement = analytics.find(a => a.metric_type === 'engagement')?.total || 0;

    return (
        <CampaignLayout campaignName={campaignName}>
            <PageHeader
                title="Analytics"
                subtitle="Track your campaign's performance across channels"
            />

            {analytics.length === 0 ? (
                <EmptyState
                    icon={Icons.BarChart}
                    title="No Data Available"
                    description="Analytics will appear here once your content goes live and starts getting engagement."
                />
            ) : (
                <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <MetricCard icon={Icons.BarChart} label="Total Views" value={totalViews.toLocaleString()} color="blue" />
                        <MetricCard icon={Icons.Heart} label="Total Likes" value={totalLikes.toLocaleString()} color="pink" />
                        <MetricCard icon={Icons.MessageSquare} label="Total Comments" value={totalComments.toLocaleString()} color="purple" />
                        <MetricCard icon={Icons.Share} label="Total Shares" value={totalShares.toLocaleString()} color="green" />
                        <MetricCard icon={Icons.Users} label="Total Reach" value={totalReach.toLocaleString()} color="amber" />
                        <MetricCard icon={Icons.Zap} label="Engagement Rate" value={`${totalEngagement}%`} color="blue" />
                    </div>

                    {/* Channel Performance */}
                    {channelPerformance.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Performance by Channel</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Array.from(new Set(channelPerformance.map(c => c.channel))).map(channel => {
                                    const channelData = channelPerformance.filter(c => c.channel === channel);
                                    const totalValue = channelData.reduce((sum, c) => sum + (c.total || 0), 0);
                                    const channelIcons = {
                                        instagram: '📷',
                                        facebook: '👍',
                                        youtube: '▶️',
                                        email: '✉️'
                                    };

                                    return (
                                        <Card key={channel} className="p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-2xl">{channelIcons[channel] || '📱'}</span>
                                                <h4 className="text-sm font-semibold text-slate-800">{channel.toUpperCase()}</h4>
                                            </div>
                                            <p className="text-2xl font-bold text-blue-600">{totalValue.toLocaleString()}</p>
                                            <p className="text-xs text-slate-600 mt-2">Total interactions</p>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Top Content */}
                    {topContent.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Top Performing Content</h3>
                            <div className="space-y-3">
                                {topContent.map((content, index) => (
                                    <Card key={content.id} className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                                                #{index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-semibold text-slate-800">{content.title}</h4>
                                                <p className="text-xs text-slate-600">{content.metric_type}</p>
                                            </div>
                                            <p className="text-2xl font-bold text-slate-800">{content.total_metric.toLocaleString()}</p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </CampaignLayout>
    );
};

export default CampaignAnalytics;
