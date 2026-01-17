import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { feedbackService } from '../api/feedback';

const CampaignFeedback = () => {
    const { id } = useParams();
    const [feedback, setFeedback] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterPlatform, setFilterPlatform] = useState('all');
    const [filterSentiment, setFilterSentiment] = useState('all');

    useEffect(() => {
        loadFeedback();
    }, [id]);

    const loadFeedback = async () => {
        try {
            const data = await feedbackService.listFeedback(id);
            setFeedback(data.feedback);
        } catch (error) {
            console.error("Failed to load feedback:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkReviewed = async (itemId) => {
        try {
            await feedbackService.updateFeedback(itemId, { status: 'reviewed' });
            setFeedback(prev => prev.map(item =>
                item.id === itemId ? { ...item, status: 'reviewed' } : item
            ));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    // Filter Logic
    const filteredFeedback = feedback.filter(item => {
        if (filterPlatform !== 'all' && item.platform !== filterPlatform) return false;
        if (filterSentiment !== 'all' && item.sentiment !== filterSentiment) return false;
        return true;
    });

    // Stats
    const positiveCount = feedback.filter(f => f.sentiment === 'positive').length;
    const negativeCount = feedback.filter(f => f.sentiment === 'negative').length;

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'youtube': return <span className="text-red-600 text-lg">▶️</span>;
            case 'instagram': return <span className="text-pink-600 text-lg">📸</span>;
            case 'twitter': return <span className="text-blue-400 text-lg">🐦</span>;
            case 'linkedin': return <span className="text-blue-700 text-lg">💼</span>;
            default: return <span>💬</span>;
        }
    };

    const getSentimentBadge = (sentiment) => {
        switch (sentiment) {
            case 'positive': return <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">Positive</span>;
            case 'negative': return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase">Negative</span>;
            default: return <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">Neutral</span>;
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
                        <h1 className="text-lg font-bold text-gray-900">Feedback Inbox</h1>
                        <p className="text-xs text-gray-500">Audience sentiment & responses</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">
                        <span>👍 {positiveCount} Positive</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-100">
                        <span>👎 {negativeCount} Negative</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Filters Sidebar */}
                <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-6 z-10">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Filter by Platform</h3>
                        <div className="space-y-1">
                            {['all', 'youtube', 'instagram', 'twitter', 'linkedin'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setFilterPlatform(p)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${filterPlatform === p ? 'bg-login-bg-start text-white' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Filter by Sentiment</h3>
                        <div className="space-y-1">
                            {['all', 'positive', 'neutral', 'negative'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilterSentiment(s)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${filterSentiment === s ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feedback List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="text-center text-gray-400 mt-20">Loading feedback...</div>
                    ) : (
                        <div className="max-w-3xl mx-auto space-y-4">
                            {filteredFeedback.length === 0 ? (
                                <div className="text-center text-gray-400 mt-20">No feedback found matching filters.</div>
                            ) : (
                                filteredFeedback.map(item => (
                                    <div key={item.id} className={`bg-white rounded-xl shadow-sm border p-4 transition-all hover:shadow-md ${item.status === 'new' ? 'border-l-4 border-l-login-bg-start' : 'border-gray-200 opacity-75'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {item.user.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-gray-900">{item.user}</span>
                                                        <span className="text-xs text-gray-400">• {item.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        {getPlatformIcon(item.platform)}
                                                        <span className="text-xs text-gray-500 capitalize">{item.platform}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {getSentimentBadge(item.sentiment)}
                                        </div>

                                        <p className="text-gray-700 text-sm ml-11 mb-3 bg-gray-50 p-3 rounded-lg">
                                            "{item.text}"
                                        </p>

                                        <div className="flex justify-end gap-2 ml-11">
                                            <button className="text-gray-400 text-xs hover:text-gray-600">Reply</button>
                                            <span className="text-gray-300">|</span>
                                            {item.status === 'new' ? (
                                                <button
                                                    onClick={() => handleMarkReviewed(item.id)}
                                                    className="text-login-bg-start text-xs font-bold hover:underline"
                                                >
                                                    Mark as Reviewed
                                                </button>
                                            ) : (
                                                <span className="text-green-600 text-xs font-bold">✓ Reviewed</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampaignFeedback;
