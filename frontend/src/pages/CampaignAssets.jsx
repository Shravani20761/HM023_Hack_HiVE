import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assetsService } from '../api/assets';

const CampaignAssets = () => {
    const { id } = useParams();
    const [assets, setAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [filter, setFilter] = useState('all');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Fetch Assets
    useEffect(() => {
        const loadAssets = async () => {
            try {
                const data = await assetsService.listAssets(id);
                setAssets(data.assets);
                if (data.assets.length > 0) setSelectedAsset(data.assets[0]);
            } catch (error) {
                console.error("Failed to load assets:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadAssets();
    }, [id]);

    // Handle File Upload
    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('campaignId', id);

        try {
            const newAsset = await assetsService.uploadAsset(formData);
            setAssets(prev => [newAsset, ...prev]);
            setSelectedAsset(newAsset);
        } catch (error) {
            alert('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const filteredAssets = assets.filter(asset => filter === 'all' || asset.type === filter);

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
                        <h1 className="text-lg font-bold text-gray-900">Asset Manager</h1>
                        <p className="text-xs text-gray-500">Centralized Creative Library</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-4 py-2 bg-login-btn-primary text-white text-sm font-bold rounded-lg shadow-sm hover:shadow hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-wait"
                    >
                        {isUploading ? 'Uploading...' : '☁ Upload Asset'}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                </div>
            </div>

            {/* 2. Main Layout */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left: Asset Grid */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Toolbar */}
                    <div className="px-6 py-4 flex gap-4 items-center bg-white border-b border-gray-100">
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            {['all', 'image', 'video', 'document'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilter(type)}
                                    className={`px-4 py-1.5 text-xs font-bold capitalize rounded-md transition-all ${filter === type ? 'bg-white text-login-bg-start shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {type}s
                                </button>
                            ))}
                        </div>
                        <input type="text" placeholder="Search assets..." className="ml-auto px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-login-bg-start w-64" />
                    </div>

                    {/* Grid */}
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full text-gray-400">Loading library...</div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredAssets.map(asset => (
                                    <div
                                        key={asset.id}
                                        onClick={() => setSelectedAsset(asset)}
                                        className={`group relative bg-white rounded-xl border-2 transition-all cursor-pointer overflow-hidden hover:shadow-lg ${selectedAsset?.id === asset.id ? 'border-login-bg-start shadow-md' : 'border-transparent hover:border-gray-200'}`}
                                    >
                                        <div className="aspect-square bg-gray-100 flex items-center justify-center text-4xl relative">
                                            {asset.url && asset.type === 'image' ? (
                                                <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{asset.type === 'image' ? '🖼️' : asset.type === 'video' ? '▶️' : '📄'}</span>
                                            )}

                                            {/* Status Badge */}
                                            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${asset.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    asset.status === 'review' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                {asset.status}
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-sm font-bold text-gray-800 truncate" title={asset.name}>{asset.name}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{asset.size} • {asset.uploadedBy}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Details Sidebar */}
                <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-xl z-10">
                    {selectedAsset ? (
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-gray-200 text-center bg-gray-50/30">
                                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center text-5xl mb-4 shadow-inner border border-gray-200">
                                    {selectedAsset.url && selectedAsset.type === 'image' ? (
                                        <img src={selectedAsset.url} alt={selectedAsset.name} className="w-full h-full object-cover rounded-lg" />
                                    ) : (
                                        <span>{selectedAsset.type === 'image' ? '🖼️' : selectedAsset.type === 'video' ? '▶️' : '📄'}</span>
                                    )}
                                </div>
                                <h3 className="font-bold text-gray-900 break-words px-2">{selectedAsset.name}</h3>
                                <p className="text-xs text-gray-500 uppercase font-bold mt-1">{selectedAsset.type}</p>
                            </div>

                            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Information</label>
                                    <div className="mt-3 space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Size</span>
                                            <span className="font-medium text-gray-900">{selectedAsset.size}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Dimensions</span>
                                            <span className="font-medium text-gray-900">1920 x 1080</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Uploaded</span>
                                            <span className="font-medium text-gray-900">{selectedAsset.date}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">By</span>
                                            <span className="font-medium text-gray-900">{selectedAsset.uploadedBy}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Usage</label>
                                    <div className="mt-2 p-3 bg-indigo-50 rounded border border-indigo-100 text-xs text-indigo-700">
                                        Used in <strong>Main Promo Video</strong> task.
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Actions</label>
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <button className="py-2 border border-gray-300 rounded hover:bg-gray-50 text-xs font-bold text-gray-700">Download</button>
                                        <button className="py-2 border border-red-200 text-red-600 rounded hover:bg-red-50 text-xs font-bold">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300 p-8 text-center">
                            <span className="text-4xl mb-4">👈</span>
                            <p>Select an asset to view details</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CampaignAssets;
