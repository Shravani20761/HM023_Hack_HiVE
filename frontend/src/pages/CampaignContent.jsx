import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/authContext';
import CampaignLayout from '../components/CampaignLayout';
import { PageHeader, Card, Loader, Icons, Button, Badge, EmptyState, Modal, Input, TextArea, StatusBadge } from '../components/BasicUIComponents';

const API_BASE_URL = 'http://localhost:5000/api';

import { aiService } from '../api/ai';

const StatusConfig = {
    draft: { gradient: 'from-slate-400 to-slate-500', bg: 'from-slate-50 to-slate-100', border: 'border-slate-300', icon: '📝', label: 'Draft' },
    review: { gradient: 'from-amber-400 to-orange-500', bg: 'from-amber-50 to-orange-50', border: 'border-amber-300', icon: '👀', label: 'In Review' },
    approved: { gradient: 'from-green-400 to-emerald-500', bg: 'from-green-50 to-emerald-50', border: 'border-green-300', icon: '✅', label: 'Approved' },
    published: { gradient: 'from-blue-400 to-cyan-500', bg: 'from-blue-50 to-cyan-50', border: 'border-blue-300', icon: '🚀', label: 'Published' }
};

const ContentCard = ({ content, onClick }) => {
    const config = StatusConfig[content.status] || StatusConfig.draft;

    return (
        <div
            onClick={onClick}
            className="
                group relative bg-white rounded-xl p-4 cursor-pointer
                border-2 border-transparent hover:border-purple-200
                shadow-sm hover:shadow-xl
                transform hover:-translate-y-1 hover:scale-[1.02]
                transition-all duration-300 ease-out
            "
        >
            {/* Gradient accent line */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient} rounded-t-xl`}></div>

            {/* Content */}
            <div className="pt-2">
                <div className="flex justify-between items-start mb-3">
                    <h4 className="text-sm font-bold text-slate-800 flex-1 group-hover:text-purple-600 transition-colors">
                        {content.title}
                    </h4>
                    <span className="text-lg ml-2 group-hover:animate-bounce">{config.icon}</span>
                </div>

                {content.body && (
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{content.body}</p>
                )}

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                            {content.created_by_name?.charAt(0) || '?'}
                        </div>
                        <span className="text-xs text-slate-400">{content.created_by_name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Icons.MessageSquare className="w-3 h-3" />
                        {content.comment_count || 0}
                    </div>
                </div>
            </div>

            {/* Hover glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
        </div>
    );
};

const KanbanColumn = ({ status, items, onCardClick }) => {
    const config = StatusConfig[status];

    return (
        <div className={`
            flex-1 min-w-[280px] bg-gradient-to-b ${config.bg}
            rounded-2xl p-4 border-2 ${config.border}
            transition-all duration-300
        `}>
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`
                        w-8 h-8 rounded-lg bg-gradient-to-br ${config.gradient}
                        flex items-center justify-center shadow-md
                    `}>
                        <span className="text-sm">{config.icon}</span>
                    </div>
                    <h3 className="font-bold text-slate-700">{config.label}</h3>
                </div>
                <span className={`
                    px-3 py-1 rounded-full text-xs font-bold text-white
                    bg-gradient-to-r ${config.gradient}
                    shadow-sm
                `}>
                    {items.length}
                </span>
            </div>

            {/* Cards */}
            <div className="space-y-3 min-h-[300px]">
                {items.map((content, index) => (
                    <div
                        key={content.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <ContentCard content={content} onClick={() => onCardClick(content)} />
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/50 flex items-center justify-center mb-3">
                            <span className="text-3xl opacity-50">{config.icon}</span>
                        </div>
                        <p className="text-sm text-slate-400">No items yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ContentDetailModal = ({ isOpen, content, onClose, onUpdate, onStatusChange, capabilities, getJWT }) => {
    const [title, setTitle] = useState(content?.title || '');
    const [body, setBody] = useState(content?.body || '');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiPlatform, setAiPlatform] = useState('instagram');
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [showAiConfig, setShowAiConfig] = useState(false);

    useEffect(() => {
        if (isOpen && content) {
            setTitle(content.title);
            setBody(content.body || '');
            fetchComments();
            setShowAiConfig(false);
        }
    }, [isOpen, content]);

    const fetchComments = async () => {
        try {
            const token = await getJWT();
            const res = await axios.get(
                `${API_BASE_URL}/campaigns/${content.campaign_id}/content/${content.id}/comments`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments(res.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) return;
        setLoading(true);
        try {
            const token = await getJWT();
            await axios.patch(
                `${API_BASE_URL}/campaigns/${content.campaign_id}/content/${content.id}`,
                { title, body },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error updating content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim()) return;
        setLoading(true);
        try {
            const token = await getJWT();
            await axios.post(
                `${API_BASE_URL}/campaigns/${content.campaign_id}/content/${content.id}/comments`,
                { comment, isInternal: true },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComment('');
            await fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        setLoading(true);
        try {
            const token = await getJWT();
            const endpoint = `/campaigns/${content.campaign_id}/content/${content.id}/${newStatus}`;
            await axios.patch(`${API_BASE_URL}${endpoint}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            onStatusChange();
            onClose();
        } catch (error) {
            console.error(`Error changing status to ${newStatus}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleAiCaption = async () => {
        setIsAiGenerating(true);
        try {
            const token = await getJWT();
            const result = await aiService.generateCaption(token, content.campaign_id, title, body, aiPlatform);
            setBody(result.caption);
            setShowAiConfig(false);
        } catch (error) {
            console.error('AI Caption Error:', error);
            alert('Failed to generate caption');
        } finally {
            setIsAiGenerating(false);
        }
    };

    if (!isOpen || !content) return null;

    const config = StatusConfig[content.status] || StatusConfig.draft;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="lg">
            <div className="space-y-6">
                {/* Status Header */}
                <div className={`-mx-6 -mt-6 px-6 py-4 bg-gradient-to-r ${config.bg} border-b ${config.border}`}>
                    <div className="flex items-center justify-between">
                        <StatusBadge status={content.status} />
                        <span className="text-sm text-slate-500">
                            Created {new Date(content.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Content title" />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-slate-700">Body</label>
                        {capabilities?.canUseAiCreator && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAiConfig(!showAiConfig)}
                                className="text-purple-600 border-purple-200 hover:bg-purple-50"
                            >
                                <Icons.Sparkles className="w-3 h-3 mr-1" /> AI Caption
                            </Button>
                        )}
                    </div>

                    {showAiConfig && (
                        <div className="mb-3 p-3 bg-purple-50 rounded-xl border border-purple-100 animate-slide-up">
                            <label className="text-xs font-bold text-purple-700 mb-2 block">Choose Platform</label>
                            <div className="flex gap-2">
                                {['instagram', 'facebook', 'youtube', 'email'].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setAiPlatform(p)}
                                        className={`
                                            px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all
                                            ${aiPlatform === p
                                                ? 'bg-purple-500 text-white shadow-md scale-105'
                                                : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-100'
                                            }
                                        `}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="ml-auto"
                                    onClick={handleAiCaption}
                                    disabled={isAiGenerating}
                                >
                                    {isAiGenerating ? 'Generating...' : 'Generate'}
                                </Button>
                            </div>
                        </div>
                    )}

                    <TextArea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Content body" rows={4} />
                </div>

                {/* Workflow Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-purple-100">
                    {content.status === 'draft' && capabilities?.canSubmitReview && (
                        <Button variant="warning" onClick={() => handleStatusChange('submit-review')} disabled={loading}>
                            <Icons.Eye className="w-4 h-4" /> Submit for Review
                        </Button>
                    )}
                    {content.status === 'review' && capabilities?.canApproveContent && (
                        <>
                            <Button variant="success" onClick={() => handleStatusChange('approve')} disabled={loading}>
                                <Icons.Check className="w-4 h-4" /> Approve
                            </Button>
                            <Button variant="danger" onClick={() => handleStatusChange('reject')} disabled={loading}>
                                <Icons.Trash className="w-4 h-4" /> Reject
                            </Button>
                        </>
                    )}
                    {content.status === 'approved' && capabilities?.canPublishContent && (
                        <Button variant="primary" onClick={() => handleStatusChange('publish')} disabled={loading}>
                            <Icons.Rocket className="w-4 h-4" /> Publish
                        </Button>
                    )}
                    <Button variant="secondary" className="ml-auto" onClick={handleSave} disabled={loading}>
                        Save Changes
                    </Button>
                </div>

                {/* Comments */}
                <div className="pt-4 border-t border-purple-100">
                    <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Icons.MessageSquare className="w-5 h-5 text-purple-500" />
                        Comments ({comments.length})
                    </h4>
                    <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                        {comments.map((c) => (
                            <div key={c.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                                            {c.user_name?.charAt(0) || '?'}
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{c.user_name}</span>
                                    </div>
                                    <span className="text-xs text-slate-400">{new Date(c.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-slate-600">{c.comment}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <TextArea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            rows={2}
                            className="flex-1"
                        />
                        <Button variant="primary" onClick={handleAddComment} disabled={loading} className="self-end">
                            <Icons.Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const CreateContentModal = ({ isOpen, onClose, onCreated, campaignId, capabilities }) => {
    const { getJWT } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [contentType, setContentType] = useState('post');
    const [loading, setLoading] = useState(false);

    // AI State
    const [showAiInput, setShowAiInput] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isAiGenerating, setIsAiGenerating] = useState(false);

    const contentTypes = [
        { value: 'post', label: '📱 Social Post', desc: 'Instagram, Facebook, Twitter' },
        { value: 'video', label: '🎥 Video', desc: 'YouTube, TikTok, Reels' },
        { value: 'story', label: '📸 Story', desc: 'Instagram/Facebook Stories' },
        { value: 'email', label: '✉️ Email', desc: 'Newsletter, Campaign' },
        { value: 'ad', label: '📢 Ad', desc: 'Paid Advertisement' },
    ];

    const handleCreate = async () => {
        if (!title.trim()) return;
        setLoading(true);
        try {
            const token = await getJWT();
            await axios.post(
                `${API_BASE_URL}/campaigns/${campaignId}/content`,
                { title, body, contentType },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTitle('');
            setBody('');
            setContentType('post');
            onCreated();
            onClose();
        } catch (error) {
            console.error('Error creating content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAiGenerate = async () => {
        if (!aiPrompt.trim()) return;
        setIsAiGenerating(true);
        try {
            const token = await getJWT();
            // Use script generator for new content creation
            const result = await aiService.generateScript(token, campaignId, aiPrompt, { type: contentType });
            setBody(result.script);
            setShowAiInput(false);
        } catch (error) {
            console.error('AI Generate Error:', error);
            alert('Failed to generate content');
        } finally {
            setIsAiGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Content" size="md">
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your content a catchy title" />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-slate-700">Body</label>
                        {capabilities?.canUseAiCreator && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAiInput(!showAiInput)}
                                className="text-purple-600 border-purple-200 hover:bg-purple-50"
                            >
                                <Icons.Sparkles className="w-3 h-3 mr-1" /> AI Write
                            </Button>
                        )}
                    </div>

                    {showAiInput && (
                        <div className="mb-3 p-3 bg-purple-50 rounded-xl border border-purple-100 animate-slide-up">
                            <label className="text-xs font-bold text-purple-700 mb-2 block">What should this content be about?</label>
                            <div className="flex gap-2">
                                <Input
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="e.g., A promotional post for our summer sale..."
                                    className="bg-white flex-1"
                                />
                                <Button onClick={handleAiGenerate} disabled={isAiGenerating || !aiPrompt.trim()}>
                                    {isAiGenerating ? '...' : 'Go'}
                                </Button>
                            </div>
                        </div>
                    )}

                    <TextArea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your content here..." rows={4} />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Content Type</label>
                    <div className="grid grid-cols-2 gap-3">
                        {contentTypes.map(type => (
                            <button
                                key={type.value}
                                onClick={() => setContentType(type.value)}
                                className={`
                                    p-4 rounded-xl border-2 text-left transition-all duration-200
                                    ${contentType === type.value
                                        ? 'border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md'
                                        : 'border-slate-200 hover:border-purple-200 hover:bg-purple-50/50'
                                    }
                                `}
                            >
                                <p className="font-bold text-slate-700">{type.label}</p>
                                <p className="text-xs text-slate-500">{type.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button variant="primary" onClick={handleCreate} disabled={loading} className="flex-1">
                        <Icons.Sparkles className="w-4 h-4" /> Create Content
                    </Button>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const CampaignContent = () => {
    const { id } = useParams();
    const { getJWT } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [contents, setContents] = useState([]);
    const [campaignName, setCampaignName] = useState('');
    const [selectedContent, setSelectedContent] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [capabilities, setCapabilities] = useState({});

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

            const contentRes = await axios.get(`${API_BASE_URL}/campaigns/${id}/content`, config);
            setContents(contentRes.data);

            const capRes = await axios.get(`${API_BASE_URL}/campaigns/${id}/capabilities`, config);
            setCapabilities(capRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleContentClick = (content) => {
        setSelectedContent(content);
        setShowDetailModal(true);
    };

    if (loading) return <Loader />;

    const statusGroups = {
        draft: contents.filter(c => c.status === 'draft'),
        review: contents.filter(c => c.status === 'review'),
        approved: contents.filter(c => c.status === 'approved'),
        published: contents.filter(c => c.status === 'published')
    };

    return (
        <CampaignLayout campaignName={campaignName}>
            <PageHeader
                title="Content Workflow"
                subtitle="Create, review, and publish amazing content"
                action={
                    capabilities?.canCreateContent && (
                        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                            <Icons.Plus className="w-4 h-4" /> Create Content
                        </Button>
                    )
                }
            />

            {contents.length === 0 ? (
                <EmptyState
                    icon={Icons.Edit}
                    title="No Content Yet"
                    description="Start creating amazing content for your campaign. Your ideas deserve to be shared!"
                    action={
                        capabilities?.canCreateContent && (
                            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                                <Icons.Sparkles className="w-4 h-4" /> Create First Content
                            </Button>
                        )
                    }
                />
            ) : (
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {Object.entries(statusGroups).map(([status, items]) => (
                        <KanbanColumn
                            key={status}
                            status={status}
                            items={items}
                            onCardClick={handleContentClick}
                        />
                    ))}
                </div>
            )}

            <CreateContentModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={fetchData}
                campaignId={id}
                capabilities={capabilities}
            />

            {selectedContent && (
                <ContentDetailModal
                    isOpen={showDetailModal}
                    content={selectedContent}
                    onClose={() => setShowDetailModal(false)}
                    onUpdate={fetchData}
                    onStatusChange={fetchData}
                    capabilities={capabilities}
                    getJWT={getJWT}
                />
            )}
        </CampaignLayout>
    );
};

export default CampaignContent;
