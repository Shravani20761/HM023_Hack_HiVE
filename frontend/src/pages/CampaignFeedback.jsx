import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/authContext';
import CampaignLayout from '../components/CampaignLayout';
import { PageHeader, Loader, Icons, Button, EmptyState } from '../components/BasicUIComponents';

const API_BASE_URL = 'http://localhost:5000/api';

const SentimentConfig = {
    positive: {
        icon: '😊',
        label: 'Positive',
        gradient: 'from-green-400 to-emerald-500',
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        glow: 'shadow-green-200',
        text: 'text-green-700'
    },
    neutral: {
        icon: '😐',
        label: 'Neutral',
        gradient: 'from-slate-400 to-slate-500',
        bg: 'from-slate-50 to-slate-100',
        border: 'border-slate-200',
        glow: 'shadow-slate-200',
        text: 'text-slate-700'
    },
    negative: {
        icon: '😞',
        label: 'Negative',
        gradient: 'from-red-400 to-rose-500',
        bg: 'from-red-50 to-rose-50',
        border: 'border-red-200',
        glow: 'shadow-red-200',
        text: 'text-red-700'
    }
};

const SourceConfig = {
    instagram: {
        icon: '📸',
        label: 'Instagram',
        gradient: 'from-pink-500 via-purple-500 to-indigo-500',
        bg: 'bg-gradient-to-br from-pink-50 to-purple-50'
    },
    facebook: {
        icon: '👤',
        label: 'Facebook',
        gradient: 'from-blue-500 to-blue-600',
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50'
    },
    youtube: {
        icon: '🎬',
        label: 'YouTube',
        gradient: 'from-red-500 to-red-600',
        bg: 'bg-gradient-to-br from-red-50 to-orange-50'
    },
    email: {
        icon: '📧',
        label: 'Email',
        gradient: 'from-emerald-500 to-teal-500',
        bg: 'bg-gradient-to-br from-emerald-50 to-teal-50'
    }
};

const StatusConfig = {
    unread: {
        icon: '📩',
        label: 'Unread',
        gradient: 'from-amber-400 to-orange-500',
        dot: 'bg-amber-400'
    },
    read: {
        icon: '📖',
        label: 'Read',
        gradient: 'from-blue-400 to-cyan-500',
        dot: 'bg-blue-400'
    },
    replied: {
        icon: '✅',
        label: 'Replied',
        gradient: 'from-green-400 to-emerald-500',
        dot: 'bg-green-400'
    }
};

const SentimentBadge = ({ sentiment }) => {
    const config = SentimentConfig[sentiment] || SentimentConfig.neutral;

    return (
        <span className={`
            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
            bg-gradient-to-r ${config.gradient} text-white
            shadow-sm ${config.glow}
        `}>
            <span>{config.icon}</span>
            {config.label}
        </span>
    );
};

const FeedbackCard = ({ feedback, onClick, index }) => {
    const source = SourceConfig[feedback.source] || SourceConfig.email;
    const sentiment = SentimentConfig[feedback.sentiment] || SentimentConfig.neutral;
    const status = StatusConfig[feedback.status] || StatusConfig.unread;

    return (
        <div
            className={`
                relative group cursor-pointer
                bg-gradient-to-br ${sentiment.bg} rounded-2xl p-5
                border-2 ${sentiment.border} hover:border-transparent
                shadow-lg hover:shadow-xl ${sentiment.glow}
                transform hover:-translate-y-2 hover:scale-[1.02]
                transition-all duration-300 ease-out
                animate-slide-up overflow-hidden
            `}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={onClick}
        >
            {/* Gradient overlay on hover */}
            <div className={`
                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10
                bg-gradient-to-br ${sentiment.gradient}
                transition-opacity duration-300
            `}></div>

            {/* Status indicator */}
            {feedback.status === 'unread' && (
                <div className="absolute top-3 right-3">
                    <span className={`w-3 h-3 rounded-full ${status.dot} animate-pulse shadow-lg`}></span>
                </div>
            )}

            <div className="relative z-10">
                {/* Header with source and author */}
                <div className="flex items-start gap-3 mb-4">
                    <div className={`
                        w-12 h-12 rounded-xl bg-gradient-to-br ${source.gradient}
                        flex items-center justify-center text-xl shadow-lg
                        transform group-hover:scale-110 group-hover:rotate-3
                        transition-all duration-300
                    `}>
                        {source.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-slate-800 truncate group-hover:text-slate-900">
                            {feedback.author_name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <span>{source.label}</span>
                            <span className="text-slate-300">•</span>
                            <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
                        </p>
                    </div>
                </div>

                {/* Message */}
                <div className={`
                    bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-4
                    border border-white/50
                    group-hover:bg-white/80 transition-colors duration-300
                `}>
                    <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed">
                        "{feedback.message}"
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <SentimentBadge sentiment={feedback.sentiment} />

                    <div className="flex items-center gap-2">
                        <span className={`
                            inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
                            bg-white/60 ${status.dot ? sentiment.text : 'text-slate-600'}
                        `}>
                            <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
                            {status.label}
                        </span>
                    </div>
                </div>

                {/* Quick actions on hover */}
                <div className={`
                    absolute bottom-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100
                    transform translate-y-2 group-hover:translate-y-0
                    transition-all duration-300
                `}>
                    <button className="p-2 rounded-lg bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all">
                        <Icons.MessageSquare className="w-4 h-4 text-purple-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, gradient, index }) => (
    <div
        className={`
            bg-gradient-to-br from-white to-slate-50 rounded-2xl p-5
            border border-slate-100 shadow-sm
            transform hover:-translate-y-1 hover:shadow-lg
            transition-all duration-300 animate-slide-up
        `}
        style={{ animationDelay: `${index * 100}ms` }}
    >
        <div className="flex items-center gap-4">
            <div className={`
                w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient}
                flex items-center justify-center shadow-lg text-2xl
            `}>
                {icon}
            </div>
            <div>
                <p className="text-3xl font-bold text-slate-800">{value}</p>
                <p className="text-sm text-slate-500 font-medium">{label}</p>
            </div>
        </div>
    </div>
);

const FilterButton = ({ label, active, onClick, icon, color = 'purple' }) => {
    const colorClasses = {
        purple: 'from-purple-500 to-pink-500 shadow-purple-200',
        green: 'from-green-400 to-emerald-500 shadow-green-200',
        slate: 'from-slate-400 to-slate-500 shadow-slate-200',
        red: 'from-red-400 to-rose-500 shadow-red-200',
        amber: 'from-amber-400 to-orange-500 shadow-amber-200',
        blue: 'from-blue-400 to-cyan-500 shadow-blue-200'
    };

    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm
                transition-all duration-300 transform hover:scale-105
                ${active
                    ? `bg-gradient-to-r ${colorClasses[color]} text-white shadow-lg`
                    : 'bg-white/80 text-slate-600 hover:bg-white hover:shadow-md border border-slate-200'
                }
            `}
        >
            {icon && <span>{icon}</span>}
            {label}
        </button>
    );
};

const CampaignFeedback = () => {
    const { id } = useParams();
    const { getJWT } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState([]);
    const [campaignName, setCampaignName] = useState('');
    const [stats, setStats] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterSentiment, setFilterSentiment] = useState('all');

    useEffect(() => {
        fetchData();
    }, [id, getJWT]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = await getJWT();
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const nameRes = await axios.get(`${API_BASE_URL}/campaigns/${id}`, config);
            setCampaignName(nameRes.data.name);

            const feedbackRes = await axios.get(`${API_BASE_URL}/campaigns/${id}/feedback`, config).catch(() => ({ data: [] }));
            setFeedback(feedbackRes.data || []);

            const statsRes = await axios.get(`${API_BASE_URL}/campaigns/${id}/feedback/stats/summary`, config).catch(() => ({ data: {} }));
            setStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <CampaignLayout campaignName={campaignName}>
            <div className="flex items-center justify-center h-64">
                <Loader />
            </div>
        </CampaignLayout>
    );

    let filtered = feedback;
    if (filterStatus !== 'all') {
        filtered = filtered.filter(f => f.status === filterStatus);
    }
    if (filterSentiment !== 'all') {
        filtered = filtered.filter(f => f.sentiment === filterSentiment);
    }

    return (
        <CampaignLayout campaignName={campaignName}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
                <PageHeader
                    title="Feedback"
                    subtitle="Monitor audience sentiment and engagement"
                />

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            label="Total Feedback"
                            value={stats.total || 0}
                            icon="💬"
                            gradient="from-purple-400 to-pink-500"
                            index={0}
                        />
                        <StatCard
                            label="Positive"
                            value={stats.positive || 0}
                            icon="😊"
                            gradient="from-green-400 to-emerald-500"
                            index={1}
                        />
                        <StatCard
                            label="Neutral"
                            value={stats.neutral || 0}
                            icon="😐"
                            gradient="from-slate-400 to-slate-500"
                            index={2}
                        />
                        <StatCard
                            label="Negative"
                            value={stats.negative || 0}
                            icon="😞"
                            gradient="from-red-400 to-rose-500"
                            index={3}
                        />
                    </div>
                )}

                {/* Filters */}
                {feedback.length > 0 && (
                    <div className="mb-8 animate-fade-in">
                        {/* Status filters */}
                        <div className="flex flex-wrap gap-3 mb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider self-center mr-2">Status:</span>
                            <FilterButton
                                label="All"
                                active={filterStatus === 'all'}
                                onClick={() => setFilterStatus('all')}
                            />
                            <FilterButton
                                label="Unread"
                                icon="📩"
                                active={filterStatus === 'unread'}
                                onClick={() => setFilterStatus('unread')}
                                color="amber"
                            />
                            <FilterButton
                                label="Read"
                                icon="📖"
                                active={filterStatus === 'read'}
                                onClick={() => setFilterStatus('read')}
                                color="blue"
                            />
                            <FilterButton
                                label="Replied"
                                icon="✅"
                                active={filterStatus === 'replied'}
                                onClick={() => setFilterStatus('replied')}
                                color="green"
                            />
                        </div>

                        {/* Sentiment filters */}
                        <div className="flex flex-wrap gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider self-center mr-2">Sentiment:</span>
                            <FilterButton
                                label="All"
                                active={filterSentiment === 'all'}
                                onClick={() => setFilterSentiment('all')}
                            />
                            <FilterButton
                                label="Positive"
                                icon="😊"
                                active={filterSentiment === 'positive'}
                                onClick={() => setFilterSentiment('positive')}
                                color="green"
                            />
                            <FilterButton
                                label="Neutral"
                                icon="😐"
                                active={filterSentiment === 'neutral'}
                                onClick={() => setFilterSentiment('neutral')}
                                color="slate"
                            />
                            <FilterButton
                                label="Negative"
                                icon="😞"
                                active={filterSentiment === 'negative'}
                                onClick={() => setFilterSentiment('negative')}
                                color="red"
                            />
                        </div>
                    </div>
                )}

                {/* Feedback Grid */}
                {filtered.length === 0 ? (
                    <EmptyState
                        icon={Icons.MessageSquare}
                        title="No Feedback Yet"
                        description={feedback.length === 0
                            ? "No comments or feedback received yet. They'll appear here when your audience starts engaging."
                            : "No feedback matches your current filters. Try adjusting your filters."
                        }
                    />
                ) : (
                    <>
                        {/* Results count */}
                        <div className="mb-6 animate-fade-in">
                            <p className="text-sm text-slate-500">
                                Showing <span className="font-bold text-slate-700">{filtered.length}</span> of {feedback.length} feedback items
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filtered.map((item, index) => (
                                <FeedbackCard
                                    key={item.id}
                                    feedback={item}
                                    index={index}
                                    onClick={() => {}}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </CampaignLayout>
    );
};

export default CampaignFeedback;
