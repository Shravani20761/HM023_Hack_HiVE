import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const features = [
        { icon: '✏️', title: 'Content Workflow', desc: 'Streamlined content creation from draft to approval' },
        { icon: '📂', title: 'Asset Management', desc: 'Centralized digital library for all campaign assets' },
        { icon: '📅', title: 'Smart Scheduler', desc: 'AI-powered scheduling across multiple platforms' },
        { icon: '💬', title: 'Feedback Hub', desc: 'Real-time audience sentiment analysis' },
        { icon: '📊', title: 'Analytics', desc: 'Deep insights and performance metrics' },
        { icon: '👥', title: 'Team Collaboration', desc: 'Role-based access and real-time collaboration' }
    ];

    const benefits = [
        { stat: '10x', label: 'Faster Campaign Launch' },
        { stat: '85%', label: 'Time Saved' },
        { stat: '24/7', label: 'AI Assistance' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-login-bg-start via-login-bg-middle to-login-bg-end">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-login-btn-primary to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            H
                        </div>
                        <span className="text-2xl font-bold text-white">HackHiVE</span>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-white/90 hover:text-white transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="px-6 py-2 bg-login-btn-primary text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        <span className="text-login-btn-primary font-bold text-sm">🤖 AI-Powered Marketing Platform</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Your Marketing,
                        <br />
                        <span className="bg-gradient-to-r from-login-btn-primary to-cyan-400 bg-clip-text text-transparent">
                            Supercharged
                        </span>
                    </h1>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                        HackHiVE is the collaborative marketing platform that brings teams together.
                        Plan, create, schedule, and analyze—all in one intelligent workspace.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="px-8 py-4 bg-login-btn-primary text-white font-bold rounded-xl shadow-2xl hover:shadow-login-btn-primary/50 hover:-translate-y-1 transition-all text-lg"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all text-lg"
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="text-center">
                                <div className="text-4xl font-bold text-login-btn-primary mb-2">{benefit.stat}</div>
                                <div className="text-white/70 text-sm">{benefit.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-20 px-6 bg-white/5 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
                        <p className="text-white/70 text-lg">Powerful features for modern marketing teams</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-login-btn-primary/50 hover:bg-white/10 transition-all group"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-white/60 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {['Create Content', 'Collaborate', 'Schedule', 'Analyze'].map((step, i) => (
                            <div key={i} className="relative">
                                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-login-btn-primary to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    {i + 1}
                                </div>
                                <h3 className="text-white font-bold mb-2">{step}</h3>
                                {i < 3 && (
                                    <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-login-btn-primary/50 to-transparent"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-6 bg-gradient-to-r from-login-btn-primary/20 to-cyan-400/20 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-bold text-white mb-6">Ready to Transform Your Marketing?</h2>
                    <p className="text-xl text-white/80 mb-8">Join teams already using HackHiVE to streamline their campaigns</p>
                    <Link
                        to="/signup"
                        className="inline-block px-10 py-5 bg-white text-login-bg-start font-bold rounded-xl shadow-2xl hover:shadow-white/30 hover:-translate-y-1 transition-all text-lg"
                    >
                        Get Started Free →
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-white/10">
                <div className="max-w-6xl mx-auto text-center text-white/50 text-sm">
                    <p>&copy; 2026 HackHiVE. Built for modern marketing teams.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
