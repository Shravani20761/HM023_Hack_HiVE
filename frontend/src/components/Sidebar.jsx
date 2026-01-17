import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Campaigns', path: '/campaigns', icon: '🚀' },
        { name: 'Analytics', path: '/analytics', icon: '📈' },
        { name: 'Broadcasts', path: '/broadcasts', icon: '📢' },
        { name: 'Settings', path: '/settings', icon: '⚙️' },
    ];

    return (
        <div className="h-screen w-64 bg-gradient-to-b from-login-bg-start via-login-bg-middle to-login-bg-end text-white fixed left-0 top-0 flex flex-col shadow-2xl z-20">
            {/* Logo Area */}
            <div className="p-8 border-b border-white/10">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-login-bg-start font-bold text-xl shadow-lg">
                        H
                    </div>
                    <span className="text-2xl font-bold tracking-tight">HackHiVE</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? 'bg-white text-login-bg-start font-bold shadow-lg transform translate-x-1'
                                    : 'text-indigo-100 hover:bg-white/10 hover:translate-x-1'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-login-bg-start"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-6 border-t border-white/10 bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                        <span className="text-lg">👤</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">My Account</p>
                        <p className="text-xs text-indigo-200">View Profile</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
