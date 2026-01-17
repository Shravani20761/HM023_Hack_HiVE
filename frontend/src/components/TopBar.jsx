import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
// TEMPORARY: Using mock auth for demo - switch back to '../appwrite/auth' when backend is ready
import authService from '../appwrite/mockAuth';

const TopBar = ({ title }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
            logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
            {/* Page Title / Breadcrumb */}
            <div>
                <h1 className="text-2xl font-bold text-login-text-primary tracking-tight">{title || 'Dashboard'}</h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                {/* Search Bar Placeholder */}
                <div className="hidden md:flex relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-login-focus w-64 transition-all"
                    />
                    <span className="absolute left-3.5 top-2.5 text-gray-400">🔍</span>
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-login-text-secondary transition-colors">
                    <span className="text-xl">🔔</span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* User Profile & Logout */}
                <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-login-text-primary leading-tight">
                            {user ? user.name : 'Guest User'}
                        </p>
                        <p className="text-xs text-gray-500">
                            {user ? user.email : 'Please login'}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
