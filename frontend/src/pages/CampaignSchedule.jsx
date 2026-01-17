import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { schedulingService } from '../api/scheduling';
import { contentService } from '../api/content';

const CampaignSchedule = () => {
    const { id } = useParams();
    const [events, setEvents] = useState([]);
    const [approvedContent, setApprovedContent] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date('2026-01-01'));

    // Modal State
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedContent, setSelectedContent] = useState(null);
    const [scheduleForm, setScheduleForm] = useState({ date: '', platform: 'instagram' });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [eventsData, contentData] = await Promise.all([
                    schedulingService.listEvents(id),
                    contentService.listContent(id)
                ]);
                setEvents(eventsData.events);
                setApprovedContent(contentData.content.filter(For => For.status === 'approved'));
            } catch (error) {
                console.error("Failed to load data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [id]);

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const generateCalendarDays = () => {
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);
        const days = [];

        for (let i = 0; i < startDay; i++) days.push({ day: null });

        for (let i = 1; i <= totalDays; i++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            days.push({
                day: i,
                date: dateStr,
                events: events.filter(e => e.date === dateStr)
            });
        }
        return days;
    };

    const handleScheduleClick = (content) => {
        setSelectedContent(content);
        setScheduleForm({ date: '', platform: 'instagram' });
        setShowScheduleModal(true);
    };

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedContent) return;

        try {
            const newEvent = await schedulingService.scheduleContent({
                contentId: selectedContent.id,
                contentTitle: selectedContent.title,
                platform: scheduleForm.platform,
                scheduledAt: `${scheduleForm.date}T10:00:00Z`
            });
            setEvents([...events, newEvent]);
            setShowScheduleModal(false);
        } catch (error) {
            alert('Failed to schedule content');
        }
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'instagram': return <span className="text-pink-600">📸</span>;
            case 'youtube': return <span className="text-red-600">▶️</span>;
            case 'linkedin': return <span className="text-blue-700">💼</span>;
            case 'twitter': return <span className="text-blue-400">🐦</span>;
            default: return <span>📅</span>;
        }
    };

    const getPlatformColor = (platform) => {
        switch (platform) {
            case 'instagram': return 'bg-pink-50 border-pink-200 text-pink-700';
            case 'youtube': return 'bg-red-50 border-red-200 text-red-700';
            case 'linkedin': return 'bg-blue-50 border-blue-200 text-blue-700';
            default: return 'bg-gray-100 border-gray-200 text-gray-700';
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] -m-6 bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <Link to={`/campaigns/${id}`} className="text-gray-500 hover:text-gray-700">← Back</Link>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Scheduler</h1>
                        <p className="text-xs text-gray-500">Plan and schedule approved content</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button className="px-3 py-1 text-gray-600 hover:bg-white rounded-md transition-all">Month</button>
                        <button className="px-3 py-1 text-gray-600 hover:bg-white rounded-md transition-all">Week</button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* 1. Calendar View (Left) */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden">
                    <div className="px-8 py-4 flex items-center justify-between border-b border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 border rounded hover:bg-gray-50">◀</button>
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 border rounded hover:bg-gray-50">▶</button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden min-h-[600px]">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="bg-gray-50 p-2 text-center text-xs font-bold text-gray-500 uppercase">{day}</div>
                            ))}
                            {isLoading ? <div className="col-span-7 p-10 text-center text-gray-400">Loading...</div> : generateCalendarDays().map((dateObj, index) => (
                                <div key={index} className="bg-white p-1 min-h-[100px] hover:bg-gray-50 transition-colors flex flex-col gap-1">
                                    {dateObj.day && (
                                        <>
                                            <span className={`text-xs font-bold p-1 ${dateObj.day === 1 ? 'text-login-bg-start' : 'text-gray-400'}`}>{dateObj.day}</span>
                                            <div className="flex flex-col gap-1">
                                                {dateObj.events.map(event => (
                                                    <div key={event.id} className={`flex items-center gap-1 px-1.5 py-1 rounded border text-[10px] font-bold truncate cursor-pointer ${getPlatformColor(event.type)}`}>
                                                        {getPlatformIcon(event.type)}
                                                        <span className="truncate">{event.title}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Approved Content List (Right) */}
                <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col shadow-xl z-10">
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <h3 className="font-bold text-gray-800">Approved Content</h3>
                        <p className="text-xs text-gray-500">Ready to schedule</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {isLoading ? (
                            <div className="text-center text-gray-400 text-sm">Loading content...</div>
                        ) : approvedContent.length === 0 ? (
                            <div className="text-center text-gray-400 text-sm mt-10">
                                <p>No approved content yet.</p>
                                <Link to={`/campaigns/${id}/content`} className="text-login-bg-start hover:underline text-xs">Go to Content Workflow</Link>
                            </div>
                        ) : (
                            approvedContent.map(content => (
                                <div key={content.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${content.type === 'video' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                                            }`}>{content.type}</span>
                                        <span className="text-[10px] text-gray-400">v{content.version}</span>
                                    </div>
                                    <h4 className="font-bold text-sm text-gray-800 mb-1">{content.title}</h4>
                                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{content.metadata?.caption || 'No caption'}</p>
                                    <button
                                        onClick={() => handleScheduleClick(content)}
                                        className="w-full py-1.5 bg-login-btn-primary text-white text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Schedule Post
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Schedule Modal */}
            {showScheduleModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-96 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Schedule Content</h3>
                        <p className="text-sm text-gray-500 mb-4">Publishing <span className="font-bold text-gray-800">{selectedContent?.title}</span></p>

                        <form onSubmit={handleScheduleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Platform</label>
                                <select
                                    value={scheduleForm.platform}
                                    onChange={e => setScheduleForm({ ...scheduleForm, platform: e.target.value })}
                                    className="w-full p-2 border border-gray-200 rounded text-sm outline-none"
                                >
                                    <option value="instagram">Instagram</option>
                                    <option value="youtube">YouTube</option>
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="twitter">X (Twitter)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                                <input
                                    type="date"
                                    required
                                    value={scheduleForm.date}
                                    onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                                    className="w-full p-2 border border-gray-200 rounded text-sm outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowScheduleModal(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-bold bg-login-btn-primary text-white rounded shadow-sm hover:shadow-md">Confirm Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignSchedule;
