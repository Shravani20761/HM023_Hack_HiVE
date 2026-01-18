import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/authContext';
import CampaignLayout from '../components/CampaignLayout';
import { PageHeader, Loader, Icons, EmptyState } from '../components/BasicUIComponents';
import api from '../services/api.service';

const CampaignSettings = () => {
    const { id } = useParams();
    const { getJWT } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [campaignName, setCampaignName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getJWT();
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const nameRes = await api.get(`/api/campaigns/${id}`, config).catch(() => ({ data: { name: 'Campaign' } }));
                setCampaignName(nameRes.data.name);
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
                title="Settings"
                subtitle="Campaign configuration"
            />
            <EmptyState icon={Icons.Settings} title="Settings" description="Configuration options here." />
        </CampaignLayout>
    );
};

export default CampaignSettings;
