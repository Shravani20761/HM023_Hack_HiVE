import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import CampaignLayout from '../components/CampaignLayout';
import { PageHeader, Loader, Icons, Button, EmptyState } from '../components/BasicUIComponents';
import api from '../services/api.service';

// Demo data for showcase
const DEMO_CHANNEL = {
    connected: true,
    channel_id: 'UC_demo_channel_id',
    channel_title: 'HackMatrix Marketing',
    channel_thumbnail: '/assets/demo_thumbnail.svg',
    subscriber_count: 125400,
    video_count: 247,
    view_count: 8945000,
    connected_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    connected_by_name: 'Demo Admin'
};

const DEMO_STATS = {
    recentViews: 45200,
    watchTimeHours: 1240,
    avgViewDuration: '4:32',
    topVideoViews: 12500
};

const YouTubeDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getJWT } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [connection, setConnection] = useState(null);
    const [channel, setChannel] = useState(null);
    const [campaignName, setCampaignName] = useState('');
    const [capabilities, setCapabilities] = useState({});
    const [demoMode, setDemoMode] = useState(false);

    useEffect(() => {
        fetchData();
        const params = new URLSearchParams(window.location.search);
        if (params.get('connected') === 'true') {
            window.history.replaceState({}, '', window.location.pathname);
        }
        if (params.get('demo') === 'true') {
            setDemoMode(true);
        }
    }, [id, getJWT]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = await getJWT();
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [nameRes, capRes] = await Promise.all([
                api.get(`/api/campaigns/${id}`, config),
                api.get(`/api/campaigns/${id}/capabilities`, config)
            ]);

            setCampaignName(nameRes.data.name);
            setCapabilities(capRes.data);

            try {
                const statusRes = await api.get(`/api/campaigns/${id}/youtube/status`, config);
                if (statusRes.data.connected) {
                    setConnection(statusRes.data);
                    try {
                        const channelRes = await api.get(`/api/campaigns/${id}/youtube/channel`, config);
                        setChannel(channelRes.data);
                    } catch (err) {
                        console.error('Error fetching channel:', err);
                    }
                }
            } catch (err) {
                console.log('YouTube not connected');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        setConnecting(true);
        try {
            const token = await getJWT();
            const res = await api.get(`/api/campaigns/${id}/youtube/auth`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.href = res.data.authUrl;
        } catch (error) {
            console.error('Error starting OAuth:', error);
            setConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        if (demoMode) {
            setDemoMode(false);
            return;
        }
        if (!confirm('Are you sure you want to disconnect YouTube? This will remove all cached data.')) return;

        try {
            const token = await getJWT();
            await api.delete(`/api/campaigns/${id}/youtube/disconnect`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConnection(null);
            setChannel(null);
        } catch (error) {
            console.error('Error disconnecting:', error);
        }
    };

    const enableDemoMode = () => {
        setDemoMode(true);
        setConnection(DEMO_CHANNEL);
    };

    if (loading) return (
        <CampaignLayout campaignName={campaignName}>
            <div className="flex items-center justify-center h-64">
                <Loader />
            </div>
        </CampaignLayout>
    );

    const formatNumber = (num) => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const isConnected = connection?.connected || demoMode;
    const displayConnection = demoMode ? DEMO_CHANNEL : connection;
    const displayChannel = demoMode ? DEMO_CHANNEL : channel;

    return (
        <CampaignLayout campaignName={campaignName}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
                <PageHeader
                    title="YouTube Studio"
                    subtitle="Manage your YouTube channel and content"
                    action={demoMode && (
                        <span className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold animate-pulse">
                            Demo Mode
                        </span>
                    )}
                />

                {!isConnected ? (
                    // Not connected state
                    <div className="max-w-2xl mx-auto mt-12 animate-fade-in">
                        <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-10 border border-slate-100 shadow-xl text-center">
                            {/* YouTube Icon */}
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-200 animate-bounce-slow">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-bold text-slate-800 mb-3">
                                Connect Your YouTube Channel
                            </h2>
                            <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                Link your YouTube account to manage videos, view analytics, and schedule uploads directly from your campaign dashboard.
                            </p>

                            {/* Features */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {[
                                    { icon: '🎬', label: 'Manage Videos', desc: 'Edit titles, descriptions, tags' },
                                    { icon: '📊', label: 'View Analytics', desc: 'Track views, watch time, CTR' },
                                    { icon: '📅', label: 'Schedule Uploads', desc: 'Plan content in advance' },
                                ].map((feature, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
                                        <span className="text-3xl mb-2 block">{feature.icon}</span>
                                        <p className="font-bold text-slate-800 text-sm">{feature.label}</p>
                                        <p className="text-xs text-slate-500">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3">
                                {capabilities.canConnectYoutube && (
                                    <Button
                                        variant="primary"
                                        onClick={handleConnect}
                                        disabled={connecting}
                                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-200"
                                    >
                                        {connecting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                </svg>
                                                Connect YouTube Channel
                                            </>
                                        )}
                                    </Button>
                                )}

                                {/* Demo Mode Button */}
                                <Button
                                    variant="outline"
                                    onClick={enableDemoMode}
                                    className="border-amber-400 text-amber-600 hover:bg-amber-50"
                                >
                                    <span className="text-lg">🎭</span>
                                    View Demo (Sample Data)
                                </Button>
                            </div>

                            {!capabilities.canConnectYoutube && (
                                <p className="text-sm text-slate-500 mt-4">
                                    You don't have permission to connect YouTube. Contact your campaign admin.
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    // Connected state
                    <div className="space-y-8 animate-fade-in">
                        {/* Demo Mode Banner */}
                        {demoMode && (
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl">
                                    🎭
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-amber-800">Demo Mode Active</h4>
                                    <p className="text-sm text-amber-600">You're viewing sample data. Connect a real YouTube channel for actual data.</p>
                                </div>
                                <Button variant="ghost" onClick={() => setDemoMode(false)} className="text-amber-600">
                                    Exit Demo
                                </Button>
                            </div>
                        )}

                        {/* Channel Overview Card */}
                        <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 border border-slate-100 shadow-xl">
                            <div className="flex items-start gap-6">
                                {/* Channel Avatar */}
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                                        {displayConnection.channel_thumbnail ? (
                                            <img
                                                src={displayConnection.channel_thumbnail}
                                                alt={displayConnection.channel_title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-3xl font-bold">
                                                {displayConnection.channel_title?.charAt(0) || 'Y'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                                        <Icons.Check className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                {/* Channel Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold text-slate-800">{displayConnection.channel_title}</h2>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white">
                                            Connected
                                        </span>
                                        {demoMode && (
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                                                Demo
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4">
                                        Connected by {displayConnection.connected_by_name} on {new Date(displayConnection.connected_at).toLocaleDateString()}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex gap-6">
                                        <div>
                                            <p className="text-2xl font-bold text-slate-800">{formatNumber(displayChannel?.subscriberCount || displayConnection.subscriber_count)}</p>
                                            <p className="text-xs text-slate-500">Subscribers</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-800">{formatNumber(displayChannel?.videoCount || displayConnection.video_count)}</p>
                                            <p className="text-xs text-slate-500">Videos</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-800">{formatNumber(displayChannel?.viewCount || displayConnection.view_count)}</p>
                                            <p className="text-xs text-slate-500">Total Views</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {(capabilities.canDisconnectYoutube || demoMode) && (
                                    <Button
                                        variant="ghost"
                                        onClick={handleDisconnect}
                                        className="text-red-500 hover:bg-red-50"
                                    >
                                        {demoMode ? 'Exit Demo' : 'Disconnect'}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats (Demo) */}
                        {demoMode && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Views (Last 28 days)', value: formatNumber(DEMO_STATS.recentViews), icon: '👁️', gradient: 'from-blue-400 to-cyan-500' },
                                    { label: 'Watch Time (Hours)', value: formatNumber(DEMO_STATS.watchTimeHours), icon: '⏱️', gradient: 'from-purple-400 to-pink-500' },
                                    { label: 'Avg View Duration', value: DEMO_STATS.avgViewDuration, icon: '📊', gradient: 'from-green-400 to-emerald-500' },
                                    { label: 'Top Video Views', value: formatNumber(DEMO_STATS.topVideoViews), icon: '🏆', gradient: 'from-amber-400 to-orange-500' },
                                ].map((stat, idx) => (
                                    <div key={idx} className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-5 border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}>
                                                <span className="text-lg">{stat.icon}</span>
                                            </div>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                                        <p className="text-xs text-slate-500">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'Video Manager',
                                    description: 'View and edit your uploaded videos',
                                    icon: '🎬',
                                    gradient: 'from-red-400 to-rose-500',
                                    bg: 'from-red-50 to-rose-50',
                                    border: 'border-red-200',
                                    path: `/campaigns/${id}/youtube/videos${demoMode ? '?demo=true' : ''}`
                                },
                                {
                                    title: 'Schedule Uploads',
                                    description: 'Plan and schedule future video uploads',
                                    icon: '📅',
                                    gradient: 'from-purple-400 to-indigo-500',
                                    bg: 'from-purple-50 to-indigo-50',
                                    border: 'border-purple-200',
                                    path: `/campaigns/${id}/youtube/schedule${demoMode ? '?demo=true' : ''}`
                                },
                                {
                                    title: 'Analytics',
                                    description: 'Track performance and audience insights',
                                    icon: '📊',
                                    gradient: 'from-emerald-400 to-teal-500',
                                    bg: 'from-emerald-50 to-teal-50',
                                    border: 'border-emerald-200',
                                    path: `/campaigns/${id}/youtube/analytics${demoMode ? '?demo=true' : ''}`
                                }
                            ].map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => navigate(action.path)}
                                    className={`
                                        group text-left p-6 rounded-2xl
                                        bg-gradient-to-br ${action.bg}
                                        border-2 ${action.border} hover:border-transparent
                                        shadow-lg hover:shadow-xl
                                        transform hover:-translate-y-2 hover:scale-[1.02]
                                        transition-all duration-300
                                    `}
                                >
                                    <div className={`
                                        w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient}
                                        flex items-center justify-center text-2xl mb-4
                                        shadow-lg group-hover:scale-110 group-hover:rotate-3
                                        transition-transform duration-300
                                    `}>
                                        {action.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">{action.title}</h3>
                                    <p className="text-sm text-slate-500">{action.description}</p>
                                    <div className="mt-4 flex items-center text-sm font-semibold text-slate-600 group-hover:text-slate-800">
                                        Open
                                        <Icons.ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </CampaignLayout>
    );
};

export default YouTubeDashboard;
