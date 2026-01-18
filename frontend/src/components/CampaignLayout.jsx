import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Icons } from './BasicUIComponents';

const SidebarItem = ({ to, icon: Icon, label, active, color = "purple" }) => {
    const colors = {
        purple: { active: "from-purple-500 to-pink-500", hover: "hover:from-purple-50 hover:to-pink-50" },
        blue: { active: "from-blue-500 to-cyan-500", hover: "hover:from-blue-50 hover:to-cyan-50" },
        green: { active: "from-green-500 to-emerald-500", hover: "hover:from-green-50 hover:to-emerald-50" },
        amber: { active: "from-amber-500 to-orange-500", hover: "hover:from-amber-50 hover:to-orange-50" },
    };

    return (
        <Link
            to={to}
            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                transition-all duration-300 mb-2 group relative overflow-hidden
                ${active
                    ? `bg-gradient-to-r ${colors[color].active} text-white shadow-lg shadow-purple-200`
                    : `text-slate-600 bg-gradient-to-r from-transparent to-transparent ${colors[color].hover} hover:text-purple-600`
                }
            `}
        >
            {/* Animated background on hover */}
            {!active && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100/0 via-purple-100/50 to-purple-100/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            )}

            <div className={`
                w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300
                ${active
                    ? 'bg-white/20'
                    : 'bg-gradient-to-br from-purple-100 to-pink-100 group-hover:scale-110 group-hover:rotate-3'
                }
            `}>
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-purple-500'}`} />
            </div>

            <span className="relative z-10">{label}</span>

            {/* Active indicator dot */}
            {active && (
                <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse"></div>
            )}
        </Link>
    );
};

const CampaignLayout = ({ children, campaignName = "Loading..." }) => {
    const { id } = useParams();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex min-h-[calc(100vh-80px)] max-w-7xl mx-auto relative">
            {/* Decorative blobs */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

            {/* Sidebar */}
            <aside className="w-72 py-8 pr-6 border-r border-purple-100/50 block relative z-10">
                {/* Campaign Header */}
                <div className="mb-8 px-4">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-25"></div>
                        <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                    <Icons.Rocket className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Campaign</p>
                                    <h3 className="text-base font-bold text-slate-800 truncate max-w-[150px]" title={campaignName}>
                                        {campaignName}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="px-2 space-y-1">
                    <p className="px-4 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-4 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full"></span>
                        Main
                    </p>

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

                    <p className="px-4 mt-6 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-4 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full"></span>
                        Insights
                    </p>

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
                    <SidebarItem
                        to={`/campaigns/${id}/feedback`}
                        icon={Icons.MessageSquare}
                        label="Feedback"
                        active={isActive(`/campaigns/${id}/feedback`)}
                    />

                    <div className="my-6 mx-4 border-t border-purple-100"></div>

                    <SidebarItem
                        to={`/campaigns/${id}/settings`}
                        icon={Icons.Settings}
                        label="Settings"
                        active={isActive(`/campaigns/${id}/settings`)}
                    />
                </nav>

                {/* Pro Tip Card */}
                <div className="mt-8 mx-4">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur opacity-25"></div>
                        <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">💡</span>
                                <div>
                                    <p className="text-xs font-bold text-amber-700 mb-1">Pro Tip</p>
                                    <p className="text-xs text-amber-600">Use AI to generate engaging captions for your content!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 py-8 md:pl-8 relative z-10 animate-fade-in">
                {children}
            </main>
        </div>
    );
};

export default CampaignLayout;
