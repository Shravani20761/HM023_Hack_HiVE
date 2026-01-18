import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/authContext';
import { PageHeader, Card, Loader, EmptyState, Icons, Button } from '../components/BasicUIComponents';

const API_BASE_URL = 'http://localhost:5000/api';

const Dashboard = () => {
    const { getJWT } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getJWT();
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Using campaigns endpoint for now as dashboard specific might not be ready
                const res = await axios.get(`${API_BASE_URL}/campaigns`, config);
                setData({ campaigns: res.data || [] });
                setLoading(false);
            } catch (error) {
                console.error("Dashboard fetch error", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [getJWT]);

    if (loading) return <Loader />;

    const campaigns = data?.campaigns || [];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <PageHeader
                title="Dashboard"
                subtitle="Overview of your campaigns and activities"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Icons.Layers />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Active Campaigns</p>
                        <p className="text-2xl font-bold text-slate-800">{campaigns.length}</p>
                    </div>
                </Card>
                <Card className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                        <Icons.MessageSquare />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Pending Approvals</p>
                        <p className="text-2xl font-bold text-slate-800">3</p>  {/* Mocked for UI */}
                    </div>
                </Card>
                <Card className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <Icons.BarChart />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Avg Engagement</p>
                        <p className="text-2xl font-bold text-slate-800">+24%</p> {/* Mocked for UI */}
                    </div>
                </Card>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Campaigns</h3>

            {campaigns.length === 0 ? (
                <EmptyState
                    icon={Icons.Layers}
                    title="No Campaigns Yet"
                    description="Get started by creating your first marketing campaign."
                    action={<Button href="/campaigns/create">Create Campaign</Button>}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.slice(0, 6).map(campaign => (
                        <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                                        {campaign.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-bold rounded bg-green-50 text-green-700`}>
                                        ACTIVE
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-800 mb-2">{campaign.name}</h4>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{campaign.description || 'No description provided.'}</p>
                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-xs text-slate-400 font-medium">Ends {new Date(campaign.end_date).toLocaleDateString()}</span>
                                    <a href={`/campaigns/${campaign.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">View &rarr;</a>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
