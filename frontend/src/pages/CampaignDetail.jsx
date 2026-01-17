import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CampaignDetail = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('content');

    // Simulate fetching data
    const [campaign, setCampaign] = useState({
        name: 'Summer Product Launch 2026',
        objective: 'Increase brand awareness by 20% among Gen Z demographics through targeted social media activation.',
        status: 'active',
        startDate: '2026-06-01',
        endDate: '2026-08-31',
        platform: 'Instagram'
    });

    const [activityLog, setActivityLog] = useState([
        { id: 1, user: 'Sarah M.', action: 'updated the copy', time: '2m ago', role: 'editor' },
        { id: 2, user: 'David K.', action: 'approved asset #3', time: '15m ago', role: 'manager' }
    ]);

    // Simulated "Live" Users
    const activeUsers = [
        { id: 1, name: 'You', color: 'bg-login-bg-start', initials: 'ME' },
        { id: 2, name: 'Sarah M.', color: 'bg-purple-500', initials: 'SM' },
        { id: 3, name: 'David K.', color: 'bg-orange-500', initials: 'DK' },
    ];

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            const actions = [
                { user: 'Sarah M.', action: 'is typing...', role: 'editor' },
                { user: 'David K.', action: 'viewing assets', role: 'manager' },
                { user: 'Sarah M.', action: 'completed a task', role: 'editor' },
            ];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];

            if (randomAction.action !== 'is typing...') {
                setActivityLog(prev => [{ id: Date.now(), time: 'Just now', ...randomAction }, ...prev.slice(0, 5)]);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] -m-6"> {/* Full height minus header/padding offset */}

            {/* 1. Header Section */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm z-10">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {campaign.name}
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase tracking-wide">
                            {campaign.status}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-4">
                        <span>📅 {campaign.startDate} — {campaign.endDate}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>📱 {campaign.platform}</span>
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    {/* Live Presence */}
                    <div className="flex -space-x-2">
                        {activeUsers.map(user => (
                            <div key={user.id} className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white ${user.color} ring-2 ring-transparent transition-all hover:ring-offset-1 hover:ring-login-bg-start cursor-help`} title={`${user.name} is online`}>
                                {user.initials}
                            </div>
                        ))}
                    </div>

                    <div className="h-8 w-px bg-gray-200"></div>

                    <div className="flex gap-3">
                        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all">
                            Share
                        </button>
                        <button className="px-4 py-2 text-sm font-bold text-white bg-login-btn-primary rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                            Schedule Campaign
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Main Workspace */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left: Content Tabs */}
                <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
                    {/* Tabs */}
                    <div className="px-8 pt-6">
                        <div className="flex gap-1 border-b border-gray-200">
                            {['content', 'assets', 'tasks', 'analytics'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2.5 text-sm font-bold capitalize transition-all rounded-t-lg ${activeTab === tab
                                        ? 'bg-white text-login-bg-start border-l border-r border-t border-gray-200 translate-y-[1px]'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="max-w-4xl mx-auto">
                            {activeTab === 'content' && <ContentEditor campaign={campaign} />}
                            {activeTab === 'assets' && <AssetManager />}
                            {activeTab === 'tasks' && <TaskBoard />}
                            {activeTab === 'analytics' && <AnalyticsDashboard />}
                        </div>
                    </div>
                </div>

                {/* Right: Collaboration Sidebar */}
                <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-lg z-10">
                    <CollaborationSidebar log={activityLog} />
                </div>
            </div>
        </div>
    );
};

// --- Sub-Components ---

const ContentEditor = ({ campaign }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px] p-10 relative group">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Campaign Content</label>

        {/* Simulated Live Cursor */}
        <div className="absolute top-24 right-12 flex items-center gap-2 pointer-events-none animate-bounce-slight">
            <span className="w-0.5 h-6 bg-purple-500"></span>
            <span className="bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">Sarah M.</span>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 outline-none focus:bg-gray-50" contentEditable suppressContentEditableWarning>
            {campaign.name}
        </h2>

        <div className="prose max-w-none text-gray-600 space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-yellow-800 mb-6 flex gap-3">
                <span>💡</span>
                <div>
                    <span className="font-bold">Objective:</span> {campaign.objective}
                </div>
            </div>

            <p contentEditable suppressContentEditableWarning className="outline-none focus:bg-gray-50 p-2 rounded">
                Get ready for the hottest sale of the summer! 🌞 Starting June 1st, we are dropping activewear prices by 50%.
            </p>
            <p contentEditable suppressContentEditableWarning className="outline-none focus:bg-gray-50 p-2 rounded">
                Whether you're hitting the gym or the beach, look your best with our new 'Sun & Sweat' collection.
            </p>
            <p className="text-gray-300 italic">Start typing to add more details...</p>
        </div>

        {/* Inline Comment */}
        <div className="absolute top-[280px] -right-4 w-64 bg-white shadow-xl rounded-lg border border-gray-200 p-3 transform translate-x-full transition-all md:translate-x-0 md:bg-white/90">
            <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-gray-700">David K.</span>
                <span className="text-[10px] text-gray-400">10m ago</span>
            </div>
            <p className="text-sm text-gray-600">Should we mention the "Free Shipping" offer here?</p>
            <div className="mt-2 flex gap-2">
                <button className="text-[10px] font-bold text-login-bg-start hover:underline">Reply</button>
                <button className="text-[10px] font-bold text-gray-400 hover:text-gray-600">Resolve</button>
            </div>
        </div>
    </div>
);

const AssetManager = () => {
    const [assets, setAssets] = useState([1, 2, 3, 4]);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = () => {
        setIsUploading(true);
        setTimeout(() => {
            setAssets(prev => [...prev, prev.length + 1]);
            setIsUploading(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Campaign Assets ({assets.length})</h3>
                <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="text-sm font-bold text-login-bg-start hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors border border-dashed border-login-bg-start disabled:opacity-50"
                >
                    {isUploading ? 'Uploading...' : '+ Upload New'}
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.map((i) => (
                    <div key={i} className="group relative aspect-video bg-gray-100 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all animate-fade-in-up">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold text-xl">
                            IMG_{i}.jpg
                        </div>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button className="p-2 bg-white rounded-full hover:scale-110 transition-transform text-gray-800">👁️</button>
                        </div>
                        {/* Status Pill */}
                        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold">
                            {i === 3 ? 'APPROVED ✅' : 'PENDING ⏳'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TaskBoard = () => (
    <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Workflow & Tasks</h3>
        {[
            { id: 1, text: 'Draft Initial Copy', status: 'done', assignee: 'SM' },
            { id: 2, text: 'Create Visual Assets', status: 'review', assignee: 'DK' },
            { id: 3, text: 'Manager Approval', status: 'pending', assignee: 'ME' },
            { id: 4, text: 'Schedule Posts', status: 'pending', assignee: '—' },
        ].map(task => (
            <div key={task.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-login-bg-start transaction-all group">
                <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${task.status === 'done' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                        {task.status === 'done' && '✓'}
                    </div>
                    <span className={`text-sm font-medium ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {task.text}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${task.status === 'done' ? 'bg-green-100 text-green-700' :
                        task.status === 'review' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                        {task.status}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-gray-100 text-[10px] flex items-center justify-center font-bold text-gray-600 border border-gray-200">
                        {task.assignee}
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const AnalyticsDashboard = () => (
    <div className="space-y-8 animate-fade-in-up">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { label: 'Impressions', value: '124.5k', change: '+12%', color: 'text-purple-600' },
                { label: 'Clicks', value: '3,842', change: '+5%', color: 'text-login-bg-start' },
                { label: 'CTR', value: '3.1%', change: '-0.4%', color: 'text-orange-500' },
                { label: 'Spend', value: '$450.00', change: '+2%', color: 'text-gray-700' },
            ].map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-green-600 font-medium mt-1">{stat.change} vs last week</p>
                </div>
            ))}
        </div>

        {/* Chart Area */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800">Engagement Over Time</h3>
                <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-login-bg-start focus:ring focus:ring-login-bg-start focus:ring-opacity-50">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                </select>
            </div>

            {/* CSS Chart */}
            <div className="h-64 flex items-end justify-between gap-2 px-4">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="relative group w-full bg-gray-100 rounded-t-sm hover:bg-gray-200 transition-colors h-full flex flex-col justify-end">
                        <div
                            className="w-full bg-gradient-to-t from-login-bg-start to-login-bg-middle opacity-80 group-hover:opacity-100 transition-opacity rounded-t-md relative"
                            style={{ height: `${h}%` }}
                        >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {h * 15} interactions
                            </div>
                        </div>
                        <div className="text-[10px] text-gray-400 text-center mt-2">Day {i + 1}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const CollaborationSidebar = ({ log }) => (
    <div className="flex flex-col h-full">
        {/* Readiness Section */}
        <div className="p-6 border-b border-gray-200 bg-gray-50/50">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Campaign Readiness</h4>
            <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                    <span>Progress</span>
                    <span>65%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-gradient-to-r from-login-bg-start to-login-bg-middle rounded-full"></div>
                </div>
                <button className="w-full mt-2 py-2 text-xs font-bold text-login-bg-start border border-login-bg-start rounded hover:bg-teal-50 transition-colors">
                    View Checklist
                </button>
            </div>
        </div>

        {/* Activity Feed */}
        <div className="flex-1 overflow-hidden flex flex-col p-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Activity Log</h4>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                {log.map((item) => (
                    <div key={item.id} className="relative pl-4 border-l-2 border-gray-200 hover:border-login-bg-start transition-colors pb-1">
                        <div className="absolute -left-[5px] top-0 w-2 h-2 bg-gray-300 rounded-full ring-4 ring-white"></div>
                        <p className="text-sm text-gray-800">
                            <span className="font-bold">{item.user}</span> {item.action}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-xs text-indigo-800 font-medium mb-2">Need input?</p>
                <button className="w-full py-1.5 bg-white text-indigo-600 text-xs font-bold rounded border border-indigo-200 hover:bg-indigo-50 transition-colors">
                    Request Review
                </button>
            </div>
        </div>
    </div>
);

export default CampaignDetail;
