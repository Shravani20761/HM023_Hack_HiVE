import React, { useContext } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import AuthContext from '../context/authContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    const stats = [
        { label: 'Active Campaigns', value: '12', change: '+2.5%', color: 'bg-indigo-500' },
        { label: 'Total Reach', value: '45.2k', change: '+12%', color: 'bg-purple-500' },
        { label: 'Engagement Rate', value: '4.8%', change: '-0.4%', color: 'bg-pink-500' },
        { label: 'Pending Approvals', value: '3', change: '0%', color: 'bg-orange-500' },
    ];

    return (
        <div className="flex h-screen bg-primary-bg overflow-hidden font-sans">
            {/* Sidebar (Fixed) */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col ml-64 overflow-hidden">
                <TopBar title="Dashboard" />

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-8">

                    {/* Welcome Section */}
                    <div className="mb-8 bg-gradient-to-r from-login-bg-start to-login-bg-middle rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-2">Welcome back, {user ? user.name : 'Creator'}! 👋</h2>
                            <p className="text-indigo-100 max-w-2xl text-lg">
                                You have 3 campaigns pending approval today. Check your analytics to see how your recent posts are performing.
                            </p>
                            <button className="mt-6 px-6 py-3 bg-white text-login-bg-start font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-md">
                                Create New Campaign
                            </button>
                        </div>
                        {/* Decorative background blobs */}
                        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute right-20 bottom-0 w-40 h-40 bg-login-bg-end/30 rounded-full blur-2xl"></div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-${stat.color.split('-')[1]}-600`}>
                                        <span className="text-2xl">📊</span> {/* Placeholder for actual icons */}
                                    </div>
                                    <span className={`text-sm font-bold ${stat.change.startsWith('+') ? 'text-green-500' : stat.change === '0%' ? 'text-gray-400' : 'text-red-500'}`}>
                                        {stat.change}
                                    </span>
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                                <p className="text-3xl font-bold text-login-text-primary">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Content Section Placeholder */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column (Main) */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-login-text-primary mb-4">Recent Campaigns</h3>
                                <div className="border rounded-xl p-8 text-center text-gray-400 bg-gray-50/50 border-dashed">
                                    Chart / Table Placeholder
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Side) */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-login-text-primary mb-4">Activity Log</h3>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                            <div className="w-2 h-2 mt-2 rounded-full bg-login-bg-middle"></div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">New campaign created</p>
                                                <p className="text-xs text-gray-400">2 hours ago</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Dashboard;
