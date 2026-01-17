import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CampaignCreate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        objective: '',
        startDate: '',
        endDate: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [activityLog, setActivityLog] = useState([
        { id: 1, user: 'System', action: 'Workspace created', time: 'Just now', role: 'admin' }
    ]);

    // Simulated Active Users
    const activeUsers = [
        { id: 1, name: 'You', color: 'bg-login-bg-start', initials: 'ME' },
        { id: 2, name: 'Sarah M.', color: 'bg-purple-500', initials: 'SM' },
        { id: 3, name: 'David K.', color: 'bg-orange-500', initials: 'DK' },
    ];

    // Simulate "Real-time" Activity
    useEffect(() => {
        const interval = setInterval(() => {
            const actions = [
                { user: 'Sarah M.', action: 'viewing campaign details', role: 'editor' },
                { user: 'David K.', action: 'added a comment on "Budget"', role: 'manager' },
                { user: 'Sarah M.', action: 'updated the target audience', role: 'editor' },
            ];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];

            setActivityLog(prev => [
                { id: Date.now(), time: 'Just now', ...randomAction },
                ...prev.slice(0, 4) // Keep last 5 items
            ]);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsSaving(true);

        // Debounce save simulation
        const timeoutId = setTimeout(() => {
            setIsSaving(false);
            setLastSaved(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearTimeout(timeoutId);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting Campaign Data:", formData);
        // Simulate API call
        setTimeout(() => {
            navigate('/campaigns');
        }, 1000);
    };

    return (
        <div className="max-w-6xl mx-auto h-full flex flex-col">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Campaign</h1>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live Collaboration Workspace
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Presence Indicators */}
                    <div className="flex -space-x-2">
                        {activeUsers.map(user => (
                            <div key={user.id} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white ${user.color}`} title={user.name}>
                                {user.initials}
                            </div>
                        ))}
                        <button className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 bg-white transition-colors">
                            +
                        </button>
                    </div>

                    {/* Save Status */}
                    <div className="text-xs text-gray-400 font-medium">
                        {isSaving ? 'Saving...' : lastSaved ? `Saved at ${lastSaved}` : 'All changes saved'}
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Campaign Form */}
                <div className="lg:col-span-2 space-y-6">
                    <form id="campaign-form" onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6 relative overflow-hidden">
                        {/* Decorative top border */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-login-bg-start to-purple-500"></div>

                        <div className="space-y-4">
                            <div className="relative group">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Campaign Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Summer Product Launch 2026"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-login-focus focus:border-transparent transition-all outline-none"
                                    required
                                />
                                {/* Simulated collaborative cursor */}
                                <div className="absolute right-3 top-[38px] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <span className="text-xs text-purple-500 font-medium">Sarah M. is viewing</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Objective</label>
                                <textarea
                                    name="objective"
                                    value={formData.objective}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Describe the main goal of this campaign..."
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-login-focus focus:border-transparent transition-all outline-none resize-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-login-focus focus:border-transparent transition-all outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-login-focus focus:border-transparent transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button type="button" className="px-6 py-2.5 text-gray-600 font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            Save as Draft
                        </button>
                        <button
                            type="submit"
                            form="campaign-form"
                            className="px-6 py-2.5 text-white font-bold bg-login-bg-start hover:bg-login-bg-middle rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                        >
                            Create Campaign
                        </button>
                    </div>
                </div>

                {/* RIGHT: Collaboration Panel */}
                <div className="space-y-6">

                    {/* Roles Panel */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Team Roles</h3>
                            <button className="text-xs text-login-bg-start font-bold hover:underline">+ Assign</button>
                        </div>

                        <div className="space-y-4">
                            {[
                                { role: 'Creator', count: 1, desc: 'Can edit content', users: ['active'] },
                                { role: 'Editor', count: 2, desc: 'Can review & edit', users: ['active', 'inactive'] },
                                { role: 'Manager', count: 1, desc: 'Full access', users: ['active'] },
                            ].map((role) => (
                                <div key={role.role} className="flex items-start justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-lg -mx-2 transition-colors">
                                    <div>
                                        <p className="font-semibold text-gray-700 text-sm">{role.role}</p>
                                        <p className="text-xs text-gray-400">{role.desc}</p>
                                    </div>
                                    <div className="flex -space-x-1">
                                        {role.users.map((u, i) => (
                                            <div key={i} className={`w-6 h-6 rounded-full border border-white ${u === 'active' ? 'bg-indigo-100' : 'bg-gray-100'} flex items-center justify-center text-[10px]`}>
                                                👤
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 h-80 flex flex-col">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Live Layout</h3>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {activityLog.map((log) => (
                                <div key={log.id} className="flex gap-3 text-sm animate-fade-in-up">
                                    <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${log.role === 'admin' ? 'bg-login-bg-start' :
                                            log.role === 'editor' ? 'bg-purple-500' : 'bg-orange-500'
                                        }`}></div>
                                    <div>
                                        <p className="text-gray-900 leading-snug">
                                            <span className="font-bold">{log.user}</span> {log.action}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">{log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CampaignCreate;
