import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { contentService } from '../api/content';

const CampaignContent = () => {
    const { id } = useParams();
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [contentList, setContentList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Activity Log State
    const [activityLog, setActivityLog] = useState([
        { id: 1, user: 'System', action: 'Version 1 created', time: '2h ago', role: 'admin' },
        { id: 2, user: 'Sarah M.', action: 'submitted for review', time: '1h ago', role: 'editor' }
    ]);

    // Fetch Content
    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await contentService.listContent(id);
                setContentList(data.content);
                if (data.content.length > 0) setSelectedItemId(data.content[0].id);
            } catch (error) {
                console.error("Failed to load content:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, [id]);

    // Simulated "Live" Users
    const activeUsers = [
        { id: 1, name: 'You', color: 'bg-login-bg-start', initials: 'ME' },
        { id: 2, name: 'Sarah M.', color: 'bg-purple-500', initials: 'SM' },
    ];

    const selectedItem = contentList.find(item => item.id === selectedItemId) || {};

    // Status Transition Handler
    const handleStatusChange = async (newStatus, newStage) => {
        try {
            await contentService.updateStatus(selectedItemId, newStatus, newStage);

            // Optimistic Update
            setContentList(prev => prev.map(item =>
                item.id === selectedItemId ? { ...item, status: newStatus, stage: newStage, version: item.version + 1 } : item
            ));
            setActivityLog(prev => [{ id: Date.now(), user: 'You', action: `moved to ${newStatus}`, time: 'Just now', role: 'admin' }, ...prev]);
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (isLoading) return <div className="flex items-center justify-center h-screen text-gray-400">Loading content...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] -m-6 bg-gray-50">
            {/* 1. Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <Link to={`/campaigns/${id}`} className="text-gray-500 hover:text-gray-700">
                        ← Back
                    </Link>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Content Workflow</h1>
                        <p className="text-xs text-gray-500">Collaborate, Review, Approve</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {activeUsers.map(user => (
                            <div key={user.id} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white ${user.color}`} title={user.name}>
                                {user.initials}
                            </div>
                        ))}
                    </div>
                    <button className="px-3 py-1.5 bg-login-btn-primary text-white text-sm font-bold rounded-lg shadow-sm hover:shadow hover:-translate-y-0.5 transition-all">
                        + New Content
                    </button>
                </div>
            </div>

            {/* 2. Main 3-Pane Layout */}
            <div className="flex-1 flex overflow-hidden">

                {/* PANE 1: Content List (Left) */}
                <div className="w-72 bg-white border-r border-gray-200 flex flex-col z-10">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <input type="text" placeholder="Search content..." className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:border-login-bg-start" />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {contentList.map(item => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItemId(item.id)}
                                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${selectedItemId === item.id ? 'bg-indigo-50 border-l-4 border-l-login-bg-start' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${item.type === 'video' ? 'bg-blue-100 text-blue-700' :
                                            item.type === 'image' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700'
                                        }`}>{item.type}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            item.status === 'review' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-500'
                                        }`}>{item.status}</span>
                                </div>
                                <h3 className={`font-bold text-sm mb-1 ${selectedItemId === item.id ? 'text-login-bg-start' : 'text-gray-800'}`}>{item.title}</h3>
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>v{item.version}</span>
                                    <span>{item.author}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PANE 2: Editor (Center) */}
                <div className="flex-1 bg-gray-100 flex flex-col overflow-hidden relative">
                    {selectedItem && selectedItem.id ? (
                        <>
                            {/* Toolbar */}
                            <div className="bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-4 text-gray-500 text-sm">
                                    <span className="font-bold text-gray-900">{selectedItem.title}</span>
                                    <span>v{selectedItem.version}</span>
                                </div>
                                <div className="text-xs text-gray-400 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Saved
                                </div>
                            </div>

                            {/* Preview Area */}
                            <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                                <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-2xl w-full flex flex-col min-h-[500px]">
                                    {/* Visual Preview */}
                                    <div className="h-64 bg-gray-800 flex items-center justify-center relative group">
                                        {selectedItem.type === 'video' && <span className="text-4xl">▶️</span>}
                                        {selectedItem.type === 'image' && <span className="text-4xl">🖼️</span>}
                                        {selectedItem.type === 'text' && <span className="text-4xl text-white">📝</span>}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button className="px-4 py-2 bg-white text-gray-900 font-bold rounded shadow-md hover:scale-105 transition-transform">Preview File</button>
                                        </div>
                                    </div>

                                    {/* Metadata / Fields */}
                                    <div className="p-8 flex-1 space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Caption / Body</label>
                                            <textarea
                                                className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-login-bg-start focus:border-transparent outline-none resize-none"
                                                defaultValue={`Draft content for ${selectedItem.title}...`}
                                            ></textarea>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Internal Notes</label>
                                                <input type="text" className="w-full p-2 border border-gray-200 rounded text-sm" placeholder="Add notes for the team..." />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">Select an item to edit</div>
                    )}
                </div>

                {/* PANE 3: Workflow Sidebar (Right) */}
                <div className="w-80 bg-white border-l border-gray-200 flex flex-col z-10 shadow-lg">
                    {/* Workflow Actions */}
                    <div className="p-6 border-b border-gray-200 bg-indigo-50/30">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Workflow Actions</h4>

                        <div className="space-y-3">
                            {selectedItem.status === 'draft' && (
                                <button
                                    onClick={() => handleStatusChange('review', 'editor')}
                                    className="w-full py-2 bg-login-btn-primary text-white font-bold rounded-lg shadow-sm hover:shadow hover:-translate-y-0.5 transition-all text-sm"
                                >
                                    Submit for Review
                                </button>
                            )}
                            {selectedItem.status === 'review' && (
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => handleStatusChange('draft', 'creator')}
                                        className="py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 text-sm"
                                    >
                                        Request Changes
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange('approved', 'marketer')}
                                        className="py-2 bg-green-600 text-white font-bold rounded-lg shadow-sm hover:bg-green-700 text-sm"
                                    >
                                        Approve
                                    </button>
                                </div>
                            )}
                            {selectedItem.status === 'approved' && (
                                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                                    <p className="text-green-700 font-bold text-sm">✓ Ready for Scheduling</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex-1 overflow-hidden flex flex-col p-6">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Activity & Version History</h4>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                            {activityLog.map((log) => (
                                <div key={log.id} className="relative pl-4 border-l-2 border-gray-200 text-sm">
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 bg-gray-400 rounded-full ring-4 ring-white"></div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-bold text-gray-900">{log.user}</span>
                                        <span className="text-[10px] text-gray-400">{log.time}</span>
                                    </div>
                                    <p className="text-gray-600">{log.action}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CampaignContent;
