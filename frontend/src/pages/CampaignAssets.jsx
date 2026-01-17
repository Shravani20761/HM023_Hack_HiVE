import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/authContext';
import CampaignLayout from '../components/CampaignLayout';
import { PageHeader, Card, Loader, Icons, Button, EmptyState } from '../components/BasicUIComponents';

const API_BASE_URL = 'http://localhost:5000/api';

const CampaignAssets = () => {
    const { id } = useParams();
    const { getJWT } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [campaignName, setCampaignName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getJWT();
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const nameRes = await axios.get(`${API_BASE_URL}/campaigns/${id}`, config).catch(() => ({ data: { name: 'Campaign' } }));
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
                title="Assets"
                subtitle="Centralized media library"
                action={<Button><Icons.Plus className="w-4 h-4" /> Upload Asset</Button>}
            />
            <EmptyState icon={Icons.Layers} title="No Assets" description="Upload images, videos, or documents." />
        </CampaignLayout>
    );
};

export default CampaignAssets;
