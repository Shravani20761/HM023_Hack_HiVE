import React from 'react';
import { Outlet, NavLink, useParams, Link } from 'react-router-dom';

const CampaignDetailLayout = () => {
    const { id } = useParams();

    const tabs = [
        { name: 'Content', path: 'content' },
        { name: 'Assets', path: 'assets' },
        { name: 'Schedule', path: 'schedule' },
        { name: 'Feedback', path: 'feedback' },
        { name: 'Analytics', path: 'analytics' },
        { name: 'Team', path: 'team' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <Link to="/campaigns" className="text-secondary-text hover:text-primary-text mb-4 inline-block">&larr; Back to Campaigns</Link>
                <h1 className="text-3xl font-bold text-primary-text">Campaign Detail <span className="text-secondary-text text-xl font-normal">#{id}</span></h1>
            </div>

            <div className="bg-secondary-bg rounded-lg shadow-sm mb-6">
                <nav className="flex overflow-x-auto">
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.path}
                            to={`/campaigns/${id}/${tab.path}`}
                            className={({ isActive }) =>
                                `px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${isActive
                                    ? 'border-primary-accent text-primary-text bg-white bg-opacity-30'
                                    : 'border-transparent text-secondary-text hover:text-primary-text hover:bg-white hover:bg-opacity-10'
                                }`
                            }
                        >
                            {tab.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="bg-white bg-opacity-50 rounded-lg p-6 min-h-[400px]">
                <Outlet />
            </div>
        </div>
    );
};

export default CampaignDetailLayout;
