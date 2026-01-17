import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Icons } from './BasicUIComponents';

const SidebarItem = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all mb-1 ${active
            ? "bg-blue-50 text-blue-700 shadow-sm"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
    >
        <Icon className={`w-5 h-5 ${active ? "text-blue-600" : "text-slate-400"}`} />
        {label}
    </Link>
);

const CampaignLayout = ({ children, campaignName = "Loading..." }) => {
    const { id } = useParams();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex min-h-[calc(100vh-80px)] max-w-7xl mx-auto">
            {/* Sidebar */}
            <aside className="w-64 py-8 pr-8 border-r border-slate-100 block">
                <div className="mb-8 px-4">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Campaign</h5>
                    <h3 className="text-lg font-bold text-slate-800 truncate" title={campaignName}>{campaignName}</h3>
                </div>

                <nav>
                    <SidebarItem
                        to={`/campaigns/${id}`}
                        icon={Icons.Layers}
                        label="Overview"
                        active={isActive(`/campaigns/${id}`)}
                    />
                    <SidebarItem
                        to={`/campaigns/${id}/content`}
                        icon={Icons.Edit}
                        label="Content Workflow"
                        active={isActive(`/campaigns/${id}/content`)}
                    />
                    <SidebarItem
                        to={`/campaigns/${id}/schedule`}
                        icon={Icons.Calendar}
                        label="Schedule"
                        active={isActive(`/campaigns/${id}/schedule`)}
                    />
                    <SidebarItem
                        to={`/campaigns/${id}/assets`}
                        icon={Icons.Layers}
                        label="Assets"
                        active={isActive(`/campaigns/${id}/assets`)}
                    />
                    <SidebarItem
                        to={`/campaigns/${id}/team`}
                        icon={Icons.Users}
                        label="Team & Roles"
                        active={isActive(`/campaigns/${id}/team`)}
                    />
                    <SidebarItem
                        to={`/campaigns/${id}/analytics`}
                        icon={Icons.BarChart}
                        label="Analytics"
                        active={isActive(`/campaigns/${id}/analytics`)}
                    />
                    <div className="my-4 border-t border-slate-100 mx-4"></div>
                    <SidebarItem
                        to={`/campaigns/${id}/settings`}
                        icon={Icons.Settings}
                        label="Settings"
                        active={isActive(`/campaigns/${id}/settings`)}
                    />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 py-8 md:pl-8">
                {children}
            </main>
        </div>
    );
};

export default CampaignLayout;
