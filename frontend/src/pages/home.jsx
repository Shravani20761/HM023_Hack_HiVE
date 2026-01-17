import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/authContext';
import TopBar from '../components/TopBar';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <TopBar title="Home" />

            <main className="flex-grow container mx-auto px-6 py-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Welcome back, {user ? user.name : 'User'}!
                        </h1>
                        <p className="text-lg text-gray-600">
                            You are now logged in. What would you like to do today?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link to="/dashboard" className="group">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-login-btn-primary/30 transition-all duration-300">
                                <div className="text-4xl mb-4">📊</div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-login-btn-primary transition-colors">Go to Dashboard</h2>
                                <p className="text-gray-500">View your analytics and performance metrics.</p>
                            </div>
                        </Link>

                        <Link to="/campaigns" className="group">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-login-btn-primary/30 transition-all duration-300">
                                <div className="text-4xl mb-4">🚀</div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-login-btn-primary transition-colors">Manage Campaigns</h2>
                                <p className="text-gray-500">Create, schedule, and track your marketing campaigns.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;