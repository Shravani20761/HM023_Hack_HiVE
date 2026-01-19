import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const CampaignLayout = () => {
    return (
        <div className="flex h-screen bg-primary-bg overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-64 overflow-hidden">
                <TopBar title="Campaigns" />
                <main className="flex-1 overflow-y-auto p-8 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CampaignLayout;
