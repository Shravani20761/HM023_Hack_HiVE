import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/authContext';
import CampaignLayout from '../components/CampaignLayout';
import { PageHeader, Card, Loader, Icons, Button, Badge, EmptyState } from '../components/BasicUIComponents';

const API_BASE_URL = 'http://localhost:5000/api';

const CampaignContent = () => {
    const { id } = useParams();
    const { getJWT } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [contents, setContents] = useState([]);
    const [campaignName, setCampaignName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getJWT();
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Stub endpoints
                const nameRes = await axios.get(`${API_BASE_URL}/campaigns/${id}`, config).catch(() => ({ data: { name: 'Campaign' } }));
                setCampaignName(nameRes.data.name);

                setContents([
                    { id: 1, title: 'Q4 Social Post 1', status: 'draft', type: 'image' },
                    { id: 2, title: 'Blog Post Launch', status: 'review', type: 'text' },
                    { id: 3, title: 'Email Blast', status: 'approved', type: 'email' },
                ]); // Mock data until API is real

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id, getJWT]);

    if (loading) return <Loader />;

    return (
        <CampaignLayout campaignName={campaignName}>
            <PageHeader
                title="Content Workflow"
                subtitle="Manage and approve content"
                action={<Button><Icons.Plus className="w-4 h-4" /> Create Content</Button>}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {['Draft', 'Review', 'Approved'].map(status => (
                    <div key={status} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-500 uppercase mb-3">{status}</h4>
                        <div className="space-y-3">
                            {contents.filter(c => c.status === status.toLowerCase()).map(c => (
                                <Card key={c.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer bg-white">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-bold text-slate-800">{c.title}</span>
                                        <Badge color="blue">{c.type}</Badge>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><Icons.Edit className="w-4 h-4" /></button>
                                    </div>
                                </Card>
                            ))}
                            {contents.filter(c => c.status === status.toLowerCase()).length === 0 && (
                                <div className="text-center py-4 text-xs text-slate-400 italic">No items</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </CampaignLayout>
    );
};

export default CampaignContent;
