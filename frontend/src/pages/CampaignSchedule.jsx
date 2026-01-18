import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/authContext';
import CampaignLayout from '../components/CampaignLayout';
import { PageHeader, Loader, Icons, Button, Badge, EmptyState, Modal, Input } from '../components/BasicUIComponents';
import api from '../services/api.service';

const ChannelConfig = {
    instagram: {
        icon: '📸',
        label: 'Instagram',
        gradient: 'from-pink-500 via-purple-500 to-indigo-500',
        bg: 'from-pink-50 to-purple-50',
        border: 'border-pink-200',
        glow: 'shadow-pink-200'
    },
    facebook: {
        icon: '👤',
        label: 'Facebook',
        gradient: 'from-blue-500 to-blue-600',
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        glow: 'shadow-blue-200'
    },
    youtube: {
        icon: '🎬',
        label: 'YouTube',
        gradient: 'from-red-500 to-red-600',
        bg: 'from-red-50 to-orange-50',
        border: 'border-red-200',
        glow: 'shadow-red-200'
    },
    email: {
        icon: '📧',
        label: 'Email',
        gradient: 'from-emerald-500 to-teal-500',
        bg: 'from-emerald-50 to-teal-50',
        border: 'border-emerald-200',
        glow: 'shadow-emerald-200'
    }
};

const StatusConfig = {
    pending: {
        icon: '⏳',
        label: 'Scheduled',
        gradient: 'from-amber-400 to-orange-500',
        bg: 'bg-gradient-to-r from-amber-100 to-orange-100',
        text: 'text-amber-700'
    },
    published: {
        icon: '✅',
        label: 'Published',
        gradient: 'from-green-400 to-emerald-500',
        bg: 'bg-gradient-to-r from-green-100 to-emerald-100',
        text: 'text-green-700'
    },
    failed: {
        icon: '❌',
        label: 'Failed',
        gradient: 'from-red-400 to-rose-500',
        bg: 'bg-gradient-to-r from-red-100 to-rose-100',
        text: 'text-red-700'
    }
};

const ScheduleCard = ({ schedule, onClick, index }) => {
    const channel = ChannelConfig[schedule.channel] || ChannelConfig.instagram;
    const status = StatusConfig[schedule.status] || StatusConfig.pending;
    const scheduledDate = new Date(schedule.scheduled_time);
    const isUpcoming = scheduledDate > new Date();

    return (
        <div
            className={`
                relative group cursor-pointer
                bg-gradient-to-br ${channel.bg} rounded-2xl p-5
                border-2 ${channel.border} hover:border-transparent
                shadow-lg hover:shadow-xl ${channel.glow}
                transform hover:-translate-y-2 hover:scale-[1.02]
                transition-all duration-300 ease-out
                animate-slide-up overflow-hidden
            `}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={onClick}
        >
            {/* Animated gradient border on hover */}
            <div className={`
                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                bg-gradient-to-r ${channel.gradient} p-[2px]
                transition-opacity duration-300
            `}>
                <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${channel.bg}`}></div>
            </div>

            {/* Channel icon floating */}
            <div className={`
                absolute -top-2 -right-2 w-12 h-12 rounded-xl
                bg-gradient-to-br ${channel.gradient}
                flex items-center justify-center text-xl
                shadow-lg transform group-hover:scale-110 group-hover:rotate-6
                transition-all duration-300
            `}>
                {channel.icon}
            </div>

            <div className="relative z-10">
                {/* Content title */}
                <h4 className="text-base font-bold text-slate-800 mb-3 pr-10 group-hover:text-slate-900 transition-colors">
                    {schedule.content_title}
                </h4>

                {/* Status badge */}
                <div className={`
                    inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4
                    ${status.bg} ${status.text}
                `}>
                    <span>{status.icon}</span>
                    {status.label}
                </div>

                {/* Schedule details */}
                <div className="space-y-3">
                    {/* Date & Time */}
                    <div className="flex items-center gap-3">
                        <div className={`
                            w-10 h-10 rounded-xl bg-gradient-to-br ${channel.gradient}
                            flex items-center justify-center text-white shadow-md
                        `}>
                            <Icons.Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">
                                {scheduledDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-xs text-slate-500">
                                {scheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>

                    {/* Channel */}
                    <div className="flex items-center gap-3">
                        <div className={`
                            w-10 h-10 rounded-xl bg-white/80
                            flex items-center justify-center text-lg shadow-sm
                            border ${channel.border}
                        `}>
                            {channel.icon}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">{channel.label}</p>
                            <p className="text-xs text-slate-500">Platform</p>
                        </div>
                    </div>
                </div>

                {/* Footer with creator */}
                <div className="mt-4 pt-3 border-t border-white/50 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                        {schedule.created_by_name?.charAt(0) || '?'}
                    </div>
                    <span className="text-xs text-slate-500 truncate">{schedule.created_by_name}</span>

                    {isUpcoming && (
                        <span className="ml-auto flex items-center gap-1 text-xs font-bold text-amber-600">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            Upcoming
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const CreateScheduleModal = ({ isOpen, onClose, onCreated, campaignId, contents }) => {
    const { getJWT } = useContext(AuthContext);
    const [contentId, setContentId] = useState('');
    const [channel, setChannel] = useState('instagram');
    const [scheduledTime, setScheduledTime] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!contentId || !scheduledTime) return;
        setLoading(true);
        try {
            const token = await getJWT();
            await api.post(
                `/api/campaigns/${campaignId}/schedules`,
                { contentId, channel, scheduledTime },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setContentId('');
            setChannel('instagram');
            setScheduledTime('');
            onCreated();
            onClose();
        } catch (error) {
            console.error('Error creating schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const selectedChannel = ChannelConfig[channel];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Schedule Content" size="md">
            <div className="space-y-6">
                {/* Content Selection */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Select Content
                    </label>
                    <div className={`
                        relative rounded-xl border-2 transition-all duration-300
                        ${contentId ? 'border-purple-300 bg-purple-50/50' : 'border-slate-200'}
                    `}>
                        <select
                            value={contentId}
                            onChange={(e) => setContentId(e.target.value)}
                            className="w-full px-4 py-3 bg-transparent rounded-xl text-sm font-medium appearance-none cursor-pointer focus:outline-none"
                        >
                            <option value="">Choose approved content...</option>
                            {contents.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                        <Icons.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Channel Selection */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                        Select Channel
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(ChannelConfig).map(([key, cfg]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setChannel(key)}
                                className={`
                                    p-4 rounded-xl border-2 transition-all duration-300
                                    flex items-center gap-3
                                    transform hover:scale-[1.02]
                                    ${channel === key
                                        ? `bg-gradient-to-br ${cfg.bg} ${cfg.border} shadow-lg ${cfg.glow}`
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                    }
                                `}
                            >
                                <div className={`
                                    w-10 h-10 rounded-lg flex items-center justify-center text-xl
                                    ${channel === key
                                        ? `bg-gradient-to-br ${cfg.gradient} shadow-md`
                                        : 'bg-slate-100'
                                    }
                                `}>
                                    {cfg.icon}
                                </div>
                                <span className={`font-semibold ${channel === key ? 'text-slate-800' : 'text-slate-600'}`}>
                                    {cfg.label}
                                </span>
                                {channel === key && (
                                    <div className="ml-auto w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                                        <Icons.Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date & Time */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Schedule Date & Time
                    </label>
                    <div className={`
                        relative rounded-xl border-2 transition-all duration-300
                        ${scheduledTime ? `${selectedChannel.border} bg-gradient-to-br ${selectedChannel.bg}` : 'border-slate-200'}
                    `}>
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div className={`
                                w-10 h-10 rounded-lg flex items-center justify-center
                                ${scheduledTime ? `bg-gradient-to-br ${selectedChannel.gradient} text-white` : 'bg-slate-100 text-slate-400'}
                            `}>
                                <Icons.Clock className="w-5 h-5" />
                            </div>
                            <input
                                type="datetime-local"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                className="flex-1 bg-transparent text-sm font-medium focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <Button
                        variant="primary"
                        onClick={handleCreate}
                        disabled={loading || !contentId || !scheduledTime}
                        className="flex-1"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Scheduling...
                            </>
                        ) : (
                            <>
                                <Icons.Calendar className="w-4 h-4" />
                                Schedule Post
                            </>
                        )}
                    </Button>
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const CampaignSchedule = () => {
    const { id } = useParams();
    const { getJWT } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [schedules, setSchedules] = useState([]);
    const [contents, setContents] = useState([]);
    const [campaignName, setCampaignName] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

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

            const schedulesRes = await api.get(`/api/campaigns/${id}/schedules`, config).catch(() => ({ data: [] }));
            setSchedules(schedulesRes.data || []);

            const contentsRes = await api.get(`/api/campaigns/${id}/content`, config).catch(() => ({ data: [] }));
            setContents(contentsRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
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

    const upcomingSchedules = schedules.filter(s => new Date(s.scheduled_time) > new Date()).sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));
    const pastSchedules = schedules.filter(s => new Date(s.scheduled_time) <= new Date()).sort((a, b) => new Date(b.scheduled_time) - new Date(a.scheduled_time));

    return (
        <CampaignLayout campaignName={campaignName}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
                <PageHeader
                    title="Schedule"
                    subtitle="Manage when your content goes live"
                    action={
                        <Button
                            variant="primary"
                            onClick={() => setShowCreateModal(true)}
                            className="shadow-lg shadow-purple-200"
                        >
                            <Icons.Plus className="w-4 h-4" />
                            Schedule Content
                        </Button>
                    }
                />

                {/* Quick stats */}
                {schedules.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-8 animate-slide-up">
                        {[
                            { label: 'Upcoming', count: upcomingSchedules.length, gradient: 'from-amber-400 to-orange-500', icon: '⏳' },
                            { label: 'Published', count: pastSchedules.filter(s => s.status === 'published').length, gradient: 'from-green-400 to-emerald-500', icon: '✅' },
                            { label: 'Total', count: schedules.length, gradient: 'from-purple-400 to-pink-500', icon: '📊' },
                        ].map((stat, idx) => (
                            <div
                                key={stat.label}
                                className={`
                                    bg-gradient-to-br from-white to-slate-50 rounded-2xl p-5
                                    border border-slate-100 shadow-sm
                                    transform hover:-translate-y-1 hover:shadow-lg
                                    transition-all duration-300
                                `}
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`
                                        w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient}
                                        flex items-center justify-center shadow-lg text-xl
                                    `}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-slate-800">{stat.count}</p>
                                        <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {schedules.length === 0 ? (
                    <EmptyState
                        icon={Icons.Calendar}
                        title="No Scheduled Posts"
                        description="Schedule your approved content to go live on your channels."
                        action={
                            <Button
                                variant="primary"
                                onClick={() => setShowCreateModal(true)}
                            >
                                <Icons.Plus className="w-4 h-4" />
                                Schedule First Post
                            </Button>
                        }
                    />
                ) : (
                    <div className="space-y-10">
                        {/* Upcoming Section */}
                        {upcomingSchedules.length > 0 && (
                            <div className="animate-fade-in">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                                        <span className="text-lg">⏳</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Upcoming</h3>
                                        <p className="text-sm text-slate-500">{upcomingSchedules.length} posts scheduled</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {upcomingSchedules.map((schedule, index) => (
                                        <ScheduleCard key={schedule.id} schedule={schedule} index={index} onClick={() => { }} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Published Section */}
                        {pastSchedules.length > 0 && (
                            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                                        <span className="text-lg">✅</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Published</h3>
                                        <p className="text-sm text-slate-500">{pastSchedules.length} posts completed</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {pastSchedules.map((schedule, index) => (
                                        <ScheduleCard key={schedule.id} schedule={schedule} index={index} onClick={() => { }} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <CreateScheduleModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={fetchData}
                campaignId={id}
                contents={contents.filter(c => c.status === 'approved')}
            />
        </CampaignLayout>
    );
};

export default CampaignSchedule;
