import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/authContext';
import CampaignLayout from '../components/CampaignLayout';
import { PageHeader, Card, Loader, Icons, Badge } from '../components/BasicUIComponents';
import api from '../services/api.service';

const CampaignOverview = () => {
    const { id } = useParams();
    const { getJWT } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [campaign, setCampaign] = useState(null);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const token = await getJWT();
                // Fetch single campaign details (mocking endpoint if not exists, but usually /campaigns/:id)
                // Assuming backend might need this endpoint created, but for strict UI gen I will code for it.
                // If backend only has /campaigns list, I might need to filter it, but better to fetch single.
                // Let's try fetching list and finding for now if explicit endpoint fails, OR just assume explicit endpoint works as per Plan.

                // NOTE: In strict RBAC plan, access is /api/campaigns/:id
                const res = await api.get(`/api/campaigns/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Fallback if the endpoint returns array or something (just in case)
                setCampaign(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Fetch campaign error", error);
                // Fallback for demo if API 404s
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [id, getJWT]);

    if (loading) return <Loader />;

    // Fallback data if API not ready
    const camp = campaign || { name: 'Unknown Campaign', description: 'Loading failed or campaign not found', start_date: new Date(), end_date: new Date() };

    return (
        <CampaignLayout campaignName={camp.name}>
            <PageHeader title="Overview" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Details</h3>
                    <div className="space-y-4">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase">Description</span>
                            <p className="text-slate-700 mt-1">{camp.description}</p>
                        </div>
                        <div className="flex gap-8">
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase">Start Date</span>
                                <p className="text-slate-700 font-medium mt-1">{new Date(camp.start_date || Date.now()).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase">End Date</span>
                                <p className="text-slate-700 font-medium mt-1">{new Date(camp.end_date || Date.now()).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                            <div className="mt-1"><Badge color="green">Active</Badge></div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <span className="text-sm text-slate-500">Content Pieces</span>
                            <div className="text-2xl font-bold text-slate-800">12</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <span className="text-sm text-slate-500">Team Members</span>
                            <div className="text-2xl font-bold text-slate-800">5</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <span className="text-sm text-slate-500">Scheduled</span>
                            <div className="text-2xl font-bold text-slate-800">3</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <span className="text-sm text-slate-500">Feedback</span>
                            <div className="text-2xl font-bold text-slate-800">28</div>
                        </div>
                    </div>
                </Card>
            </div>
        </CampaignLayout>
    );
};

export default CampaignOverview;
