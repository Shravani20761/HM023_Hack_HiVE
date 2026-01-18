import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import CampaignLayout from '../components/CampaignLayout';
import { PageHeader, Loader, Icons, Button, Modal, Input, TextArea, EmptyState } from '../components/BasicUIComponents';
import api from '../services/api.service';

// Demo videos data
const DEMO_VIDEOS = [
    {
        id: 'demo_vid_1',
        title: 'How to Build a Marketing Strategy That Actually Works in 2024',
        description: 'In this comprehensive guide, we break down the essential components of a successful marketing strategy...',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        privacyStatus: 'public',
        duration: 'PT12M34S',
        viewCount: 45200,
        likeCount: 3200,
        commentCount: 456,
        tags: ['marketing', 'strategy', 'business', '2024'],
        categoryId: '22'
    },
    {
        id: 'demo_vid_2',
        title: 'Social Media Tips: 10 Hacks to Grow Your Following Fast',
        description: 'Discover the top 10 social media hacks that influencers use to rapidly grow their audience...',
        thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        privacyStatus: 'public',
        duration: 'PT8M22S',
        viewCount: 78400,
        likeCount: 5600,
        commentCount: 892,
        tags: ['social media', 'growth', 'tips', 'instagram'],
        categoryId: '22'
    },
    {
        id: 'demo_vid_3',
        title: 'Content Creation Masterclass - From Idea to Viral Video',
        description: 'Learn the complete process of creating content that resonates with your audience...',
        thumbnail: 'https://i.ytimg.com/vi/L_jWHffIx5E/maxresdefault.jpg',
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        privacyStatus: 'public',
        duration: 'PT25M18S',
        viewCount: 125000,
        likeCount: 8900,
        commentCount: 1245,
        tags: ['content creation', 'viral', 'masterclass'],
        categoryId: '27'
    },
    {
        id: 'demo_vid_4',
        title: 'Behind the Scenes: Our Campaign Workflow Revealed',
        description: 'Take a peek behind the curtain and see how we manage our marketing campaigns...',
        thumbnail: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg',
        publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        privacyStatus: 'unlisted',
        duration: 'PT15M45S',
        viewCount: 23400,
        likeCount: 1800,
        commentCount: 234,
        tags: ['behind the scenes', 'workflow', 'marketing'],
        categoryId: '22'
    },
    {
        id: 'demo_vid_5',
        title: 'Q&A: Answering Your Top Marketing Questions',
        description: 'We answer the most frequently asked questions from our community about marketing...',
        thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
        publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        privacyStatus: 'public',
        duration: 'PT32M10S',
        viewCount: 56700,
        likeCount: 4200,
        commentCount: 678,
        tags: ['Q&A', 'marketing', 'questions'],
        categoryId: '22'
    },
    {
        id: 'demo_vid_6',
        title: 'Draft: Upcoming Product Launch Teaser',
        description: 'Sneak peek at our upcoming product launch campaign...',
        thumbnail: 'https://i.ytimg.com/vi/60ItHLz5WEA/maxresdefault.jpg',
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        privacyStatus: 'private',
        duration: 'PT2M30S',
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        tags: ['teaser', 'product launch'],
        categoryId: '22'
    }
];

const PrivacyConfig = {
    public: { icon: '🌍', label: 'Public', gradient: 'from-green-400 to-emerald-500', text: 'text-green-600' },
    unlisted: { icon: '🔗', label: 'Unlisted', gradient: 'from-amber-400 to-orange-500', text: 'text-amber-600' },
    private: { icon: '🔒', label: 'Private', gradient: 'from-slate-400 to-slate-500', text: 'text-slate-600' }
};

const VideoCard = ({ video, onEdit, index }) => {
    const privacy = PrivacyConfig[video.privacyStatus] || PrivacyConfig.private;

    const formatDuration = (duration) => {
        if (!duration) return '0:00';
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return duration;
        const hours = match[1] ? parseInt(match[1]) : 0;
        const minutes = match[2] ? parseInt(match[2]) : 0;
        const seconds = match[3] ? parseInt(match[3]) : 0;
        if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatNumber = (num) => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div
            className={`
                group relative bg-gradient-to-br from-white to-slate-50 rounded-2xl
                border border-slate-100 shadow-lg hover:shadow-xl
                transform hover:-translate-y-1 transition-all duration-300
                animate-slide-up overflow-hidden
            `}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-slate-200 overflow-hidden">
                {video.thumbnail ? (
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/640x360?text=Video'; }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-400 to-red-500">
                        <svg className="w-12 h-12 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                        </svg>
                    </div>
                )}
                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/80 text-white text-xs font-bold">
                    {formatDuration(video.duration)}
                </div>
                {/* Privacy badge */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg bg-gradient-to-r ${privacy.gradient} text-white text-xs font-bold flex items-center gap-1`}>
                    <span>{privacy.icon}</span>
                    {privacy.label}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-slate-900">
                    {video.title}
                </h3>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                        <Icons.Eye className="w-4 h-4" />
                        {formatNumber(video.viewCount)}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="text-xs">👍</span>
                        {formatNumber(video.likeCount)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Icons.MessageSquare className="w-4 h-4" />
                        {formatNumber(video.commentCount)}
                    </span>
                </div>

                <p className="text-xs text-slate-400 mt-2">
                    Published {new Date(video.publishedAt).toLocaleDateString()}
                </p>

                {/* Edit button */}
                <button
                    onClick={() => onEdit(video)}
                    className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200"
                >
                    Edit Video
                </button>
            </div>
        </div>
    );
};

const EditVideoModal = ({ isOpen, video, onClose, onSave, demoMode }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [privacyStatus, setPrivacyStatus] = useState('private');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (video) {
            setTitle(video.title || '');
            setDescription(video.description || '');
            setTags(video.tags?.join(', ') || '');
            setPrivacyStatus(video.privacyStatus || 'private');
        }
    }, [video]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave({
                title,
                description,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                privacyStatus
            });
            onClose();
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen || !video) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Video" size="lg">
            <div className="space-y-6">
                {demoMode && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                        Demo mode: Changes won't be saved to YouTube
                    </div>
                )}

                {/* Video preview */}
                <div className="flex gap-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100">
                    <div className="w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                        {video.thumbnail && (
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Video ID</p>
                        <p className="font-mono text-sm text-slate-600">{video.id}</p>
                    </div>
                </div>

                <Input
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter video title"
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

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Privacy Status</label>
                    <div className="grid grid-cols-3 gap-3">
                        {Object.entries(PrivacyConfig).map(([key, cfg]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setPrivacyStatus(key)}
                                className={`
                                    p-4 rounded-xl border-2 transition-all duration-300
                                    flex flex-col items-center gap-2
                                    ${privacyStatus === key
                                        ? `border-transparent bg-gradient-to-r ${cfg.gradient} text-white shadow-lg`
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                    }
                                `}
                            >
                                <span className="text-2xl">{cfg.icon}</span>
                                <span className="font-semibold text-sm">{cfg.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={saving || !title}
                        className="flex-1"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </div>
            </div>
        </Modal>
    );
};

const YouTubeVideos = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getJWT } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState([]);
    const [campaignName, setCampaignName] = useState('');
    const [nextPageToken, setNextPageToken] = useState(null);
    const [totalResults, setTotalResults] = useState(0);
    const [editingVideo, setEditingVideo] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [capabilities, setCapabilities] = useState({});
    const [demoMode, setDemoMode] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('demo') === 'true') {
            setDemoMode(true);
        }
        fetchData();
    }, [id, getJWT]);

    const fetchData = async (pageToken = null) => {
        try {
            if (!pageToken) setLoading(true);
            else setLoadingMore(true);

            const token = await getJWT();
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (!pageToken) {
                const [nameRes, capRes] = await Promise.all([
                    api.get(`/api/campaigns/${id}`, config),
                    api.get(`/api/campaigns/${id}/capabilities`, config)
                ]);
                setCampaignName(nameRes.data.name);
                setCapabilities(capRes.data);
            }

            // Check for demo mode
            const params = new URLSearchParams(window.location.search);
            if (params.get('demo') === 'true') {
                setVideos(DEMO_VIDEOS);
                setTotalResults(DEMO_VIDEOS.length);
                setLoading(false);
                return;
            }

            const urlParams = new URLSearchParams();
            if (pageToken) urlParams.append('pageToken', pageToken);

            const videosRes = await api.get(`/api/campaigns/${id}/youtube/videos?${urlParams}`, config);

            if (pageToken) {
                setVideos(prev => [...prev, ...videosRes.data.videos]);
            } else {
                setVideos(videosRes.data.videos || []);
            }
            setNextPageToken(videosRes.data.nextPageToken);
            setTotalResults(videosRes.data.totalResults || 0);
        } catch (error) {
            console.error('Error fetching videos:', error);
            // If not connected, check if demo mode
            const params = new URLSearchParams(window.location.search);
            if (params.get('demo') === 'true') {
                setVideos(DEMO_VIDEOS);
                setTotalResults(DEMO_VIDEOS.length);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleEditVideo = async (updates) => {
        if (demoMode) {
            // Demo mode: just update local state
            setVideos(prev => prev.map(v =>
                v.id === editingVideo.id ? { ...v, ...updates } : v
            ));
            return;
        }

        try {
            const token = await getJWT();
            await api.patch(
                `/api/campaigns/${id}/youtube/videos/${editingVideo.id}`,
                updates,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setVideos(prev => prev.map(v =>
                v.id === editingVideo.id ? { ...v, ...updates } : v
            ));
        } catch (error) {
            console.error('Error updating video:', error);
            alert('Failed to update video');
            throw error;
        }
    };

    if (loading) return (
        <CampaignLayout campaignName={campaignName}>
            <div className="flex items-center justify-center h-64">
                <Loader />
            </div>
        </CampaignLayout>
    );

    return (
        <CampaignLayout campaignName={campaignName}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
                <PageHeader
                    title="Video Manager"
                    subtitle={`${totalResults} videos in your channel`}
                    action={
                        <div className="flex items-center gap-3">
                            {demoMode && (
                                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold">
                                    Demo Mode
                                </span>
                            )}
                            <Button
                                variant="ghost"
                                onClick={() => navigate(`/campaigns/${id}/youtube${demoMode ? '?demo=true' : ''}`)}
                            >
                                <Icons.ArrowLeft className="w-4 h-4" />
                                Back to YouTube
                            </Button>
                        </div>
                    }
                />

                {/* Demo Mode Banner */}
                {demoMode && (
                    <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg">
                            🎭
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-amber-800">Demo Mode</h4>
                            <p className="text-sm text-amber-600">Viewing sample video data. Connect YouTube for real data.</p>
                        </div>
                    </div>
                )}

                {videos.length === 0 ? (
                    <EmptyState
                        icon={Icons.Video}
                        title="No Videos Found"
                        description="Your YouTube channel doesn't have any videos yet, or we couldn't fetch them."
                    />
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map((video, index) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    index={index}
                                    onEdit={setEditingVideo}
                                />
                            ))}
                        </div>

                        {nextPageToken && !demoMode && (
                            <div className="mt-8 text-center">
                                <Button
                                    variant="secondary"
                                    onClick={() => fetchData(nextPageToken)}
                                    disabled={loadingMore}
                                >
                                    {loadingMore ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                                            Loading...
                                        </>
                                    ) : (
                                        'Load More Videos'
                                    )}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <EditVideoModal
                isOpen={!!editingVideo}
                video={editingVideo}
                onClose={() => setEditingVideo(null)}
                onSave={handleEditVideo}
                demoMode={demoMode}
            />
        </CampaignLayout>
    );
};

export default YouTubeVideos;
