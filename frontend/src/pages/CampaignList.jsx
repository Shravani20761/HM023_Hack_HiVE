import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CampaignList = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Exact API: GET /api/campaigns
    useEffect(() => {
        fetch('/api/campaigns')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch campaigns');
                return res.json();
            })
            .then((data) => {
                // Expected Response: { "campaigns": [ { "id": "uuid", "name": "Campaign A", "status": "active" } ] }
                setCampaigns(data.campaigns || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-center text-secondary-text">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-primary-text">Campaign List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-secondary-bg p-6 rounded-lg shadow-md border-l-4 border-primary-accent">
                        <h2 className="text-xl font-semibold text-primary-text mb-2">{campaign.name}</h2>
                        <div className="flex justify-between items-center mt-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                                }`}>
                                {campaign.status}
                            </span>
                            <Link to={`/campaigns/${campaign.id}`} className="text-primary-accent hover:text-primary-text font-medium text-sm">
                                View Details &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            {campaigns.length === 0 && (
                <div className="text-center mt-10">
                    <p className="text-secondary-text mb-4">No campaigns found.</p>
                    <Link to="/campaigns/create" className="bg-primary-accent text-white px-6 py-2 rounded shadow hover:bg-opacity-90">
                        Create New Campaign
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CampaignList;
