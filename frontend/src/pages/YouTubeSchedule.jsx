import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import CampaignLayout from '../components/CampaignLayout';
import { PageHeader, Loader, Icons, Button, Modal, Input, TextArea, EmptyState } from '../components/BasicUIComponents';
import api from '../services/api.service';

const StatusConfig = {
    pending: { icon: '⏳', label: 'Scheduled', gradient: 'from-amber-400 to-orange-500', bg: 'bg-amber-100', text: 'text-amber-700' },
    uploading: { icon: '📤', label: 'Uploading', gradient: 'from-blue-400 to-cyan-500', bg: 'bg-blue-100', text: 'text-blue-700' },
    processing: { icon: '⚙️', label: 'Processing', gradient: 'from-purple-400 to-indigo-500', bg: 'bg-purple-100', text: 'text-purple-700' },
    published: { icon: '✅', label: 'Published', gradient: 'from-green-400 to-emerald-500', bg: 'bg-green-100', text: 'text-green-700' },
    failed: { icon: '❌', label: 'Failed', gradient: 'from-red-400 to-rose-500', bg: 'bg-red-100', text: 'text-red-700' }
};

// Demo scheduled uploads for demonstration
const DEMO_SCHEDULES = [
    {
        id: 'demo_sched_1',
        title: 'Ultimate Guide to Content Marketing in 2025',
        description: 'Comprehensive guide covering all aspects of content marketing strategy.',
        scheduled_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        status: 'pending',
        privacy_status: 'public',
        category_id: '28',
        tags: ['marketing', 'content', 'strategy'],
        asset_name: 'content_marketing_guide.mp4'
    },
    {
        id: 'demo_sched_2',
        title: 'Behind the Scenes: Our Creative Process',
        description: 'Take a look at how we create engaging content for our audience.',
        scheduled_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        status: 'pending',
        privacy_status: 'unlisted',
        category_id: '24',
        tags: ['bts', 'creative', 'process'],
        asset_name: 'bts_creative.mp4'
    },
    {
        id: 'demo_sched_3',
        title: 'Weekly Marketing Tips #47',
        description: 'Quick tips to boost your marketing game this week.',
        scheduled_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        status: 'pending',
        privacy_status: 'public',
        category_id: '22',
        tags: ['tips', 'marketing', 'weekly'],
        asset_name: 'weekly_tips_47.mp4'
    },
    {
        id: 'demo_sched_4',
        title: 'Product Launch Teaser - Summer Collection',
        description: 'Exciting teaser for our upcoming summer product collection.',
        scheduled_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        status: 'published',
        privacy_status: 'public',
        category_id: '24',
        tags: ['product', 'launch', 'summer'],
        asset_name: 'summer_teaser.mp4'
    },
    {
        id: 'demo_sched_5',
        title: 'Customer Success Story: TechCorp',
        description: 'How TechCorp increased their engagement by 300% with our strategies.',
        scheduled_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        status: 'published',
        privacy_status: 'public',
        category_id: '28',
        tags: ['success', 'case study', 'testimonial'],
        asset_name: 'techcorp_success.mp4'
    },
    {
        id: 'demo_sched_6',
        title: 'Live Q&A Recording - January Edition',
        description: 'Full recording of our monthly live Q&A session.',
        scheduled_time: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        status: 'published',
        privacy_status: 'public',
        category_id: '22',
        tags: ['live', 'qa', 'community'],
        asset_name: 'qa_january.mp4'
    }
];

const PrivacyOptions = [
    { value: 'private', label: 'Private', icon: '🔒' },
    { value: 'unlisted', label: 'Unlisted', icon: '🔗' },
    { value: 'public', label: 'Public', icon: '🌍' }
];

// Calendar Component
const Calendar = ({ selectedDate, onDateSelect, scheduledDates = [] }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date) => {
        if (!date || !selectedDate) return false;
        return date.toDateString() === new Date(selectedDate).toDateString();
    };

    const hasSchedule = (date) => {
        if (!date) return false;
        return scheduledDates.some(d => new Date(d).toDateString() === date.toDateString());
    };

    const isPast = (date) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const days = getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-100 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                    <Icons.ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h3 className="text-lg font-bold text-slate-800">{monthName}</h3>
                <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                    <Icons.ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-bold text-slate-400 py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((date, idx) => (
                    <button
                        key={idx}
                        onClick={() => date && !isPast(date) && onDateSelect(date)}
                        disabled={!date || isPast(date)}
                        className={`
                            relative aspect-square rounded-xl text-sm font-medium
                            transition-all duration-200 transform hover:scale-105
                            ${!date ? '' :
                                isPast(date) ? 'text-slate-300 cursor-not-allowed' :
                                isSelected(date) ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200' :
                                isToday(date) ? 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 font-bold' :
                                'hover:bg-slate-100 text-slate-700'
                            }
                        `}
                    >
                        {date?.getDate()}
                        {hasSchedule(date) && (
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Schedule Card
const ScheduleCard = ({ schedule, onEdit, onDelete, index }) => {
    const status = StatusConfig[schedule.status] || StatusConfig.pending;
    const scheduledDate = new Date(schedule.scheduled_time);

    return (
        <div
            className={`
                group relative bg-gradient-to-br from-white to-slate-50 rounded-2xl p-5
                border border-slate-100 shadow-lg hover:shadow-xl
                transform hover:-translate-y-1 transition-all duration-300
                animate-slide-up
            `}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-start gap-4">
                {/* Date badge */}
                <div className="flex-shrink-0 w-16 text-center">
                    <div className={`
                        w-16 h-16 rounded-xl bg-gradient-to-br ${status.gradient}
                        flex flex-col items-center justify-center text-white shadow-lg
                    `}>
                        <span className="text-2xl font-bold">{scheduledDate.getDate()}</span>
                        <span className="text-xs uppercase">{scheduledDate.toLocaleString('default', { month: 'short' })}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${status.bg} ${status.text}`}>
                            {status.icon} {status.label}
                        </span>
                    </div>
                    <h4 className="font-bold text-slate-800 truncate">{schedule.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">
                        {scheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {schedule.asset_name && (
                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                            <Icons.Video className="w-3 h-3" />
                            {schedule.asset_name}
                        </p>
                    )}
                </div>

                {/* Actions */}
                {schedule.status === 'pending' && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(schedule)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-500 hover:text-purple-600 transition-colors"
                        >
                            <Icons.Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(schedule.id)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors"
                        >
                            <Icons.Trash className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Create/Edit Modal
const ScheduleModal = ({ isOpen, schedule, assets, categories, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [categoryId, setCategoryId] = useState('22');
    const [privacyStatus, setPrivacyStatus] = useState('private');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('12:00');
    const [assetId, setAssetId] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (schedule) {
            setTitle(schedule.title || '');
            setDescription(schedule.description || '');
            setTags(schedule.tags?.join(', ') || '');
            setCategoryId(schedule.category_id || '22');
            setPrivacyStatus(schedule.privacy_status || 'private');
            const dt = new Date(schedule.scheduled_time);
            setScheduledDate(dt.toISOString().split('T')[0]);
            setScheduledTime(dt.toTimeString().slice(0, 5));
            setAssetId(schedule.asset_id || '');
        } else {
            setTitle('');
            setDescription('');
            setTags('');
            setCategoryId('22');
            setPrivacyStatus('private');
            setScheduledDate('');
            setScheduledTime('12:00');
            setAssetId('');
        }
    }, [schedule, isOpen]);

    const handleSave = async () => {
        if (!title || !scheduledDate || !scheduledTime) {
            alert('Please fill in title and schedule time');
            return;
        }

        setSaving(true);
        try {
            const scheduledTimeISO = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
            await onSave({
                title,
                description,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                categoryId,
                privacyStatus,
                scheduledTime: scheduledTimeISO,
                assetId: assetId || null
            }, schedule?.id);
            onClose();
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={schedule ? 'Edit Scheduled Upload' : 'Schedule New Upload'} size="lg">
            <div className="space-y-6">
                <Input
                    label="Video Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter video title"
                    required
                />

                <TextArea
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter video description"
                    rows={4}
                />

                <Input
                    label="Tags (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                />

                {/* Category */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all bg-white"
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                    </select>
                </div>

                {/* Privacy */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Privacy Status</label>
                    <div className="grid grid-cols-3 gap-3">
                        {PrivacyOptions.map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setPrivacyStatus(opt.value)}
                                className={`
                                    p-3 rounded-xl border-2 transition-all duration-300
                                    flex items-center justify-center gap-2
                                    ${privacyStatus === opt.value
                                        ? 'border-purple-400 bg-purple-50 text-purple-700'
                                        : 'border-slate-200 hover:border-slate-300'
                                    }
                                `}
                            >
                                <span>{opt.icon}</span>
                                <span className="font-semibold text-sm">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                        <input
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Time</label>
                        <input
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                        />
                    </div>
                </div>

                {/* Asset selection */}
                {assets.length > 0 && (
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Video File (from Assets)</label>
                        <select
                            value={assetId}
                            onChange={(e) => setAssetId(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all bg-white"
                        >
                            <option value="">Select a video file...</option>
                            {assets.filter(a => a.file_type === 'video').map(asset => (
                                <option key={asset.id} value={asset.id}>{asset.file_name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={saving || !title || !scheduledDate}
                        className="flex-1"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Icons.Calendar className="w-4 h-4" />
                                {schedule ? 'Update Schedule' : 'Schedule Upload'}
                            </>
                        )}
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </div>
            </div>
        </Modal>
    );
};

const YouTubeSchedule = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getJWT } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [schedules, setSchedules] = useState([]);
    const [assets, setAssets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [campaignName, setCampaignName] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [capabilities, setCapabilities] = useState({});
    const [demoMode, setDemoMode] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id, getJWT]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = await getJWT();
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [nameRes, schedulesRes, assetsRes, capRes] = await Promise.all([
                api.get(`/api/campaigns/${id}`, config),
                api.get(`/api/campaigns/${id}/youtube/scheduled-uploads`, config).catch(() => ({ data: [] })),
                api.get(`/api/campaigns/${id}/assets`, config).catch(() => ({ data: [] })),
                api.get(`/api/campaigns/${id}/capabilities`, config)
            ]);

            setCampaignName(nameRes.data.name);
            setSchedules(schedulesRes.data || []);
            setAssets(assetsRes.data || []);
            setCapabilities(capRes.data);

            // Try to get categories
            try {
                const catRes = await api.get(`/api/campaigns/${id}/youtube/categories`, config);
                setCategories(catRes.data || []);
            } catch (err) {
                // Default categories if fetch fails
                setCategories([
                    { id: '22', title: 'People & Blogs' },
                    { id: '24', title: 'Entertainment' },
                    { id: '28', title: 'Science & Technology' },
                    { id: '10', title: 'Music' },
                    { id: '20', title: 'Gaming' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSchedule = async (data, scheduleId) => {
        try {
            const token = await getJWT();
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (scheduleId) {
                await api.patch(`/api/campaigns/${id}/youtube/scheduled-uploads/${scheduleId}`, data, config);
            } else {
                await api.post(`/api/campaigns/${id}/youtube/scheduled-uploads`, data, config);
            }
            fetchData();
        } catch (error) {
            console.error('Error saving schedule:', error);
            alert('Failed to save schedule');
            throw error;
        }
    };

    const handleDeleteSchedule = async (scheduleId) => {
        if (!confirm('Are you sure you want to delete this scheduled upload?')) return;

        try {
            const token = await getJWT();
            await api.delete(`/api/campaigns/${id}/youtube/scheduled-uploads/${scheduleId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    };

    if (loading) return (
        <CampaignLayout campaignName={campaignName}>
            <div className="flex items-center justify-center h-64">
                <Loader />
            </div>
        </CampaignLayout>
    );

    // Use demo data when in demo mode
    const activeSchedules = demoMode ? DEMO_SCHEDULES : schedules;
    const scheduledDates = activeSchedules.map(s => s.scheduled_time);
    const filteredSchedules = selectedDate
        ? activeSchedules.filter(s => new Date(s.scheduled_time).toDateString() === selectedDate.toDateString())
        : activeSchedules;

    const upcomingSchedules = filteredSchedules.filter(s => new Date(s.scheduled_time) > new Date() && s.status === 'pending');
    const pastSchedules = filteredSchedules.filter(s => new Date(s.scheduled_time) <= new Date() || s.status !== 'pending');

    return (
        <CampaignLayout campaignName={campaignName}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
                <PageHeader
                    title="Upload Schedule"
                    subtitle="Plan and schedule your YouTube uploads"
                    action={
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDemoMode(!demoMode)}
                                className={`
                                    px-4 py-2 rounded-xl font-semibold text-sm
                                    transition-all duration-300 transform hover:scale-105
                                    flex items-center gap-2
                                    ${demoMode
                                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-200'
                                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                    }
                                `}
                            >
                                <span>🎭</span>
                                {demoMode ? 'Demo Mode ON' : 'Demo Mode'}
                            </button>
                            <Button
                                variant="ghost"
                                onClick={() => navigate(`/campaigns/${id}/youtube`)}
                            >
                                <Icons.ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            {capabilities.canScheduleYoutube && !demoMode && (
                                <Button
                                    variant="primary"
                                    onClick={() => setShowCreateModal(true)}
                                >
                                    <Icons.Plus className="w-4 h-4" />
                                    Schedule Upload
                                </Button>
                            )}
                        </div>
                    }
                />

                {/* Demo Mode Banner */}
                {demoMode && (
                    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 animate-fade-in">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🎭</span>
                            <div>
                                <p className="font-bold text-amber-800">Demo Mode Active</p>
                                <p className="text-sm text-amber-600">Showing sample scheduled uploads. This data is for demonstration only.</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar */}
                    <div className="lg:col-span-1">
                        <Calendar
                            selectedDate={selectedDate}
                            onDateSelect={(date) => setSelectedDate(date.toDateString() === selectedDate?.toDateString() ? null : date)}
                            scheduledDates={scheduledDates}
                        />

                        {selectedDate && (
                            <button
                                onClick={() => setSelectedDate(null)}
                                className="mt-4 w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                Clear selection
                            </button>
                        )}
                    </div>

                    {/* Schedule list */}
                    <div className="lg:col-span-2 space-y-6">
                        {filteredSchedules.length === 0 ? (
                            <EmptyState
                                icon={Icons.Calendar}
                                title={selectedDate ? 'No uploads scheduled' : 'No scheduled uploads'}
                                description={selectedDate
                                    ? `No uploads scheduled for ${selectedDate.toLocaleDateString()}`
                                    : 'Schedule your first YouTube video upload'
                                }
                                action={capabilities.canScheduleYoutube && !demoMode && (
                                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                                        <Icons.Plus className="w-4 h-4" />
                                        Schedule Upload
                                    </Button>
                                )}
                            />
                        ) : (
                            <>
                                {upcomingSchedules.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm">
                                                ⏳
                                            </span>
                                            Upcoming ({upcomingSchedules.length})
                                        </h3>
                                        <div className="space-y-4">
                                            {upcomingSchedules.map((schedule, idx) => (
                                                <ScheduleCard
                                                    key={schedule.id}
                                                    schedule={schedule}
                                                    index={idx}
                                                    onEdit={setEditingSchedule}
                                                    onDelete={handleDeleteSchedule}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {pastSchedules.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white text-sm">
                                                📋
                                            </span>
                                            Past & Completed ({pastSchedules.length})
                                        </h3>
                                        <div className="space-y-4">
                                            {pastSchedules.map((schedule, idx) => (
                                                <ScheduleCard
                                                    key={schedule.id}
                                                    schedule={schedule}
                                                    index={idx}
                                                    onEdit={setEditingSchedule}
                                                    onDelete={handleDeleteSchedule}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <ScheduleModal
                isOpen={showCreateModal || !!editingSchedule}
                schedule={editingSchedule}
                assets={assets}
                categories={categories}
                onClose={() => {
                    setShowCreateModal(false);
                    setEditingSchedule(null);
                }}
                onSave={handleSaveSchedule}
            />
        </CampaignLayout>
    );
};

export default YouTubeSchedule;
