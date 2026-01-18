import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import { PageHeader, Card, Loader, EmptyState, Icons, Button, Badge } from '../components/BasicUIComponents';
import api from '../services/api.service';

const CampaignList = () => {
    const { getJWT } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [campaigns, setCampaigns] = useState([]);
    const [canCreate, setCanCreate] = useState(false);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const token = await getJWT();
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [campRes, capRes] = await Promise.all([
                    api.get('/api/campaigns', config),
                    api.get('/api/system/capabilities', config)
                ]);

                setCampaigns(campRes.data || []);
                setCanCreate(capRes.data.canCreateCampaign);
                setLoading(false);
            } catch (error) {
                console.error("Fetch error", error);
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, [getJWT]);

    if (loading) return <Loader />;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <PageHeader
                title="Campaigns"
                subtitle="Manage all your marketing campaigns"
                action={
                    canCreate && (
                        <Button onClick={() => navigate('/campaigns/create')}>
                            <Icons.Plus className="w-4 h-4" /> New Campaign
                        </Button>
                    )
                }
            />

            {campaigns.length === 0 ? (
                <EmptyState
                    icon={Icons.Layers}
                    title="No Campaigns Found"
                    description="You haven't participated in any campaigns yet."
                    action={canCreate && <Button onClick={() => navigate('/campaigns/create')}>Create One</Button>}
                />
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Campaign</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dates</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {campaigns.map((camp) => (
                                <tr key={camp.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800">{camp.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(camp.start_date).toLocaleDateString()} - {new Date(camp.end_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                                        {camp.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Mock Role - Backend should return My Role in this list */}
                                        <Badge color="blue">Member</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => navigate(`/campaigns/${camp.id}`)}>
                                            Manage
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CampaignList;
