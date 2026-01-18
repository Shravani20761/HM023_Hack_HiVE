import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/authContext';
import CampaignLayout from '../components/CampaignLayout';
import { PageHeader, Card, Loader, Icons, Button, Badge, EmptyState } from '../components/BasicUIComponents';

const API_BASE_URL = 'http://localhost:5000/api';

const CampaignTeam = () => {
    const { id } = useParams();
    const { getJWT } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [team, setTeam] = useState([]);
    const [canAssign, setCanAssign] = useState(false);
    const [campaignName, setCampaignName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getJWT();
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // 1. Get Campaign Capabilities
                const capRes = await axios.get(`${API_BASE_URL}/campaigns/${id}/capabilities`, config).catch(() => ({ data: { canAssignRoles: false } }));
                setCanAssign(capRes.data.canAssignRoles);

                // 2. Get Team
                // Note: API might vary, assuming /campaigns/:id (which might return team) or /campaigns/:id/team
                // The plan says GET /api/campaigns/:id/team
                const teamRes = await axios.get(`${API_BASE_URL}/campaigns/${id}/team`, config).catch(() => ({ data: [] }));
                setTeam(teamRes.data || []);

                // 3. Get generic info for layout
                const campRes = await axios.get(`${API_BASE_URL}/campaigns/${id}`, config).catch(() => ({ data: { name: 'Campaign' } }));
                setCampaignName(campRes.data.name);

                setLoading(false);
            } catch (error) {
                console.error("Team fetch error", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, getJWT]);

    if (loading) return <Loader />;

    return (
        <CampaignLayout campaignName={campaignName}>
            <PageHeader
                title="Team Members"
                subtitle="Manage access and roles for this campaign"
                action={canAssign && <Button><Icons.Plus className="w-4 h-4" /> Add Member</Button>}
            />

            {team.length === 0 ? (
                <EmptyState
                    icon={Icons.Users}
                    title="No Team Members"
                    description="This campaign doesn't have any assigned members yet."
                />
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Roles</th>
                                {canAssign && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {team.map((member, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-bold text-slate-800">{member.name || 'Unknown'}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{member.email || '-'}</td>
                                    <td className="px-6 py-4 flex gap-1">
                                        {(member.roles || []).map(r => (
                                            <Badge key={r} color="purple">{r}</Badge>
                                        ))}
                                    </td>
                                    {canAssign && (
                                        <td className="px-6 py-4">
                                            <button className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </CampaignLayout>
    );
};

export default CampaignTeam;
