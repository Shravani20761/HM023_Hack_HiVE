import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/authContext';
import CampaignLayout from '../components/CampaignLayout';
import { PageHeader, Loader, Icons, Button, Badge, EmptyState, Modal, Input } from '../components/BasicUIComponents';

const API_BASE_URL = 'http://localhost:5000/api';

const FileTypeConfig = {
    image: {
        icon: '🖼️',
        gradient: 'from-pink-400 to-rose-500',
        bg: 'from-pink-50 to-rose-50',
        border: 'border-pink-200',
        glow: 'shadow-pink-200'
    },
    video: {
        icon: '🎥',
        gradient: 'from-purple-400 to-indigo-500',
        bg: 'from-purple-50 to-indigo-50',
        border: 'border-purple-200',
        glow: 'shadow-purple-200'
    },
    document: {
        icon: '📄',
        gradient: 'from-blue-400 to-cyan-500',
        bg: 'from-blue-50 to-cyan-50',
        border: 'border-blue-200',
        glow: 'shadow-blue-200'
    },
    default: {
        icon: '📁',
        gradient: 'from-slate-400 to-slate-500',
        bg: 'from-slate-50 to-slate-100',
        border: 'border-slate-200',
        glow: 'shadow-slate-200'
    }
};

const AssetCard = ({ asset, onClick, onDelete, index }) => {
    const config = FileTypeConfig[asset.file_type] || FileTypeConfig.default;

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div
            className={`
                relative group cursor-pointer
                bg-gradient-to-br ${config.bg} rounded-2xl p-5
                border-2 ${config.border} hover:border-transparent
                shadow-lg hover:shadow-xl ${config.glow}
                transform hover:-translate-y-2 hover:scale-[1.02]
                transition-all duration-300 ease-out
                animate-slide-up
            `}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={onClick}
        >
            {/* Gradient overlay on hover */}
            <div className={`
                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10
                bg-gradient-to-br ${config.gradient}
                transition-opacity duration-300
            `}></div>

            {/* Floating decoration */}
            <div className={`
                absolute -top-2 -right-2 w-8 h-8 rounded-full
                bg-gradient-to-br ${config.gradient}
                flex items-center justify-center text-white text-sm
                shadow-lg transform group-hover:scale-110 group-hover:rotate-12
                transition-all duration-300
            `}>
                {config.icon}
            </div>

            <div className="relative z-10">
                {/* Preview area */}
                <div className={`
                    w-full h-32 rounded-xl mb-4
                    bg-gradient-to-br from-white/80 to-white/40
                    border border-white/50 backdrop-blur-sm
                    flex items-center justify-center
                    overflow-hidden group-hover:shadow-inner
                    transition-all duration-300
                `}>
                    {asset.file_type === 'image' && asset.file_url ? (
                        <img
                            src={asset.file_url}
                            alt={asset.file_name}
                            className="w-full h-full object-cover rounded-xl"
                        />
                    ) : (
                        <span className="text-5xl transform group-hover:scale-125 transition-transform duration-300">
                            {config.icon}
                        </span>
                    )}
                </div>

                {/* File info */}
                <div className="mb-3">
                    <h4 className="text-sm font-bold text-slate-800 truncate mb-1 group-hover:text-slate-900">
                        {asset.file_name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                        {formatFileSize(asset.file_size)}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <span className={`
                        px-3 py-1 rounded-full text-xs font-bold
                        bg-gradient-to-r ${config.gradient} text-white
                        shadow-sm
                    `}>
                        {asset.file_type}
                    </span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(asset.id);
                        }}
                        className={`
                            p-2 rounded-lg
                            bg-white/50 hover:bg-red-100
                            text-slate-400 hover:text-red-500
                            transform hover:scale-110
                            transition-all duration-200
                        `}
                    >
                        <Icons.Trash className="w-4 h-4" />
                    </button>
                </div>

                {/* Uploader info */}
                <div className="mt-3 pt-3 border-t border-white/50">
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                        <span className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-[10px] font-bold">
                            {asset.uploaded_by_name?.charAt(0) || '?'}
                        </span>
                        <span className="truncate">{asset.uploaded_by_name}</span>
                        <span className="text-slate-300">•</span>
                        <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

const AssetDetailModal = ({ isOpen, asset, onClose, onDelete }) => {
    const config = FileTypeConfig[asset?.file_type] || FileTypeConfig.default;

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (!isOpen || !asset) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
            <div className="space-y-6">
                {/* Header with icon */}
                <div className="text-center">
                    <div className={`
                        w-20 h-20 rounded-2xl mx-auto mb-4
                        bg-gradient-to-br ${config.gradient}
                        flex items-center justify-center
                        shadow-xl ${config.glow}
                        animate-bounce-slow
                    `}>
                        <span className="text-4xl">{config.icon}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 truncate px-4">{asset.file_name}</h3>
                    <span className={`
                        inline-block mt-2 px-4 py-1 rounded-full text-sm font-bold
                        bg-gradient-to-r ${config.gradient} text-white
                    `}>
                        {asset.file_type}
                    </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className={`
                        p-4 rounded-xl bg-gradient-to-br ${config.bg}
                        border ${config.border}
                    `}>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">File Size</p>
                        <p className="text-lg font-bold text-slate-800">{formatFileSize(asset.file_size)}</p>
                    </div>
                    <div className={`
                        p-4 rounded-xl bg-gradient-to-br ${config.bg}
                        border ${config.border}
                    `}>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Usage</p>
                        <p className="text-lg font-bold text-slate-800">{asset.usage_count || 0} items</p>
                    </div>
                </div>

                <div className={`
                    p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100
                    border border-slate-200
                `}>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Uploaded By</p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold shadow-lg">
                            {asset.uploaded_by_name?.charAt(0) || '?'}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">{asset.uploaded_by_name}</p>
                            <p className="text-xs text-slate-500">{new Date(asset.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <Button
                        variant="danger"
                        onClick={() => {
                            onDelete(asset.id);
                            onClose();
                        }}
                        className="flex-1"
                    >
                        <Icons.Trash className="w-4 h-4" />
                        Delete Asset
                    </Button>
                    <Button variant="ghost" onClick={onClose} className="flex-1">
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const UploadModal = ({ isOpen, onClose, onUpload, campaignId }) => {
    const { getJWT } = useContext(AuthContext);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = React.useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await uploadFile(file);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) await uploadFile(file);
    };

    const uploadFile = async (file) => {
        setUploading(true);
        try {
            const token = await getJWT();

            let fileType = 'document';
            if (file.type.startsWith('image/')) fileType = 'image';
            else if (file.type.startsWith('video/')) fileType = 'video';

            await axios.post(
                `${API_BASE_URL}/campaigns/${campaignId}/assets`,
                {
                    imageKitFileId: `temp_${Date.now()}`,
                    fileName: file.name,
                    fileUrl: URL.createObjectURL(file),
                    fileType: fileType,
                    fileSize: file.size
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            onUpload();
            onClose();
        } catch (error) {
            console.error('Error uploading asset:', error);
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload Asset" size="md">
            <div className="space-y-6">
                {/* Upload area */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    className={`
                        relative border-3 border-dashed rounded-2xl p-10 text-center
                        cursor-pointer transition-all duration-300
                        ${dragActive
                            ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 scale-[1.02]'
                            : 'border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 hover:border-purple-300 hover:from-purple-50/50 hover:to-pink-50/50'
                        }
                        ${uploading ? 'pointer-events-none opacity-60' : ''}
                    `}
                >
                    {/* Animated background */}
                    <div className={`
                        absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20
                        ${dragActive ? 'opacity-100' : 'opacity-0'}
                        transition-opacity duration-300
                    `}></div>

                    <div className="relative z-10">
                        {uploading ? (
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-4 animate-pulse">
                                    <Icons.ArrowUp className="w-8 h-8 text-white animate-bounce" />
                                </div>
                                <p className="text-sm font-bold text-purple-600">Uploading...</p>
                            </div>
                        ) : (
                            <>
                                <div className={`
                                    w-16 h-16 rounded-2xl mx-auto mb-4
                                    bg-gradient-to-br from-purple-400 to-pink-400
                                    flex items-center justify-center shadow-lg
                                    transform ${dragActive ? 'scale-110 rotate-3' : ''}
                                    transition-transform duration-300
                                `}>
                                    <Icons.Plus className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-lg font-bold text-slate-700 mb-1">
                                    {dragActive ? 'Drop it here!' : 'Click or drag to upload'}
                                </p>
                                <p className="text-sm text-slate-500">
                                    PNG, JPG, MP4, PDF up to 50MB
                                </p>
                            </>
                        )}
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,.pdf"
                    className="hidden"
                    disabled={uploading}
                />

                {/* File type hints */}
                <div className="flex justify-center gap-4">
                    {['image', 'video', 'document'].map(type => {
                        const cfg = FileTypeConfig[type];
                        return (
                            <div key={type} className="flex items-center gap-2 text-sm text-slate-500">
                                <span className={`
                                    w-8 h-8 rounded-lg bg-gradient-to-br ${cfg.gradient}
                                    flex items-center justify-center text-white shadow-sm
                                `}>
                                    {cfg.icon}
                                </span>
                                <span className="font-medium capitalize">{type}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose} disabled={uploading} className="ml-auto">
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const FilterButton = ({ type, active, onClick, count }) => {
    const config = FileTypeConfig[type] || FileTypeConfig.default;
    const label = type === 'all' ? 'All Files' : type.charAt(0).toUpperCase() + type.slice(1);

    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm
                transition-all duration-300 transform hover:scale-105
                ${active
                    ? `bg-gradient-to-r ${type === 'all' ? 'from-purple-500 to-pink-500' : config.gradient} text-white shadow-lg ${type === 'all' ? 'shadow-purple-200' : config.glow}`
                    : 'bg-white/80 text-slate-600 hover:bg-white hover:shadow-md border border-slate-200'
                }
            `}
        >
            {type !== 'all' && <span>{config.icon}</span>}
            {label}
            {count !== undefined && (
                <span className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${active ? 'bg-white/20' : 'bg-slate-100'}
                `}>
                    {count}
                </span>
            )}
        </button>
    );
};

const CampaignAssets = () => {
    const { id } = useParams();
    const { getJWT } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState([]);
    const [campaignName, setCampaignName] = useState('');
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [filterType, setFilterType] = useState('all');

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

            const assetsRes = await axios.get(`${API_BASE_URL}/campaigns/${id}/assets`, config);
            setAssets(assetsRes.data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAsset = async (assetId) => {
        if (!confirm('Are you sure you want to delete this asset?')) return;

        try {
            const token = await getJWT();
            await axios.delete(
                `${API_BASE_URL}/campaigns/${id}/assets/${assetId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
        } catch (error) {
            console.error('Error deleting asset:', error);
        }
    };

    if (loading) return (
        <CampaignLayout campaignName={campaignName}>
            <div className="flex items-center justify-center h-64">
                <Loader />
            </div>
        </CampaignLayout>
    );

    const filteredAssets = filterType === 'all' ? assets : assets.filter(a => a.file_type === filterType);

    const getCounts = () => ({
        all: assets.length,
        image: assets.filter(a => a.file_type === 'image').length,
        video: assets.filter(a => a.file_type === 'video').length,
        document: assets.filter(a => a.file_type === 'document').length,
    });
    const counts = getCounts();

    return (
        <CampaignLayout campaignName={campaignName}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
                <PageHeader
                    title="Assets"
                    subtitle="Centralized media library for your campaign"
                    action={
                        <Button
                            variant="primary"
                            onClick={() => setShowUploadModal(true)}
                            className="shadow-lg shadow-purple-200"
                        >
                            <Icons.Plus className="w-4 h-4" />
                            Upload Asset
                        </Button>
                    }
                />

                {/* Stats bar */}
                {assets.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mb-8 animate-slide-up">
                        {[
                            { label: 'Total Files', count: counts.all, gradient: 'from-purple-400 to-pink-400', icon: '📁' },
                            { label: 'Images', count: counts.image, gradient: 'from-pink-400 to-rose-500', icon: '🖼️' },
                            { label: 'Videos', count: counts.video, gradient: 'from-purple-400 to-indigo-500', icon: '🎥' },
                            { label: 'Documents', count: counts.document, gradient: 'from-blue-400 to-cyan-500', icon: '📄' },
                        ].map((stat, idx) => (
                            <div
                                key={stat.label}
                                className={`
                                    bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4
                                    border border-slate-100 shadow-sm
                                    transform hover:-translate-y-1 hover:shadow-lg
                                    transition-all duration-300
                                `}
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient}
                                        flex items-center justify-center shadow-md
                                    `}>
                                        <span className="text-lg">{stat.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-800">{stat.count}</p>
                                        <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Filter buttons */}
                {assets.length > 0 && (
                    <div className="flex gap-3 mb-8 flex-wrap animate-fade-in">
                        {['all', 'image', 'video', 'document'].map(type => (
                            <FilterButton
                                key={type}
                                type={type}
                                active={filterType === type}
                                onClick={() => setFilterType(type)}
                                count={counts[type]}
                            />
                        ))}
                    </div>
                )}

                {/* Assets grid */}
                {filteredAssets.length === 0 ? (
                    <EmptyState
                        icon={Icons.Layers}
                        title="No Assets Yet"
                        description="Upload images, videos, or documents to build your media library."
                        action={
                            <Button
                                variant="primary"
                                onClick={() => setShowUploadModal(true)}
                            >
                                <Icons.Plus className="w-4 h-4" />
                                Upload First Asset
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAssets.map((asset, index) => (
                            <AssetCard
                                key={asset.id}
                                asset={asset}
                                index={index}
                                onClick={() => {
                                    setSelectedAsset(asset);
                                    setShowDetailModal(true);
                                }}
                                onDelete={handleDeleteAsset}
                            />
                        ))}
                    </div>
                )}
            </div>

            <UploadModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onUpload={fetchData}
                campaignId={id}
            />

            {selectedAsset && (
                <AssetDetailModal
                    isOpen={showDetailModal}
                    asset={selectedAsset}
                    onClose={() => setShowDetailModal(false)}
                    onDelete={handleDeleteAsset}
                />
            )}
        </CampaignLayout>
    );
};

export default CampaignAssets;
