import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../appwrite/auth';
import { useContext } from 'react';
import AuthContext from '../context/authContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [error, setError] = useState("");
    const isLogin = true; // Forced to Login mode

    const [formData, setFormData] = useState({
        name: '', // Kept for consistency if needed, though unused in login
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Login Logic
            const session = await authService.login(formData);
            if (session) {
                const userData = await authService.getCurrentUser();
                if (userData) login(userData);
                navigate("/dashboard");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex w-full font-sans overflow-hidden">
            {/* Left Side - Abstract Graphic */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-login-bg-start via-login-bg-middle to-login-bg-end items-center justify-center overflow-hidden">
                <div className="absolute w-[800px] h-[800px] bg-login-bg-middle rounded-full mix-blend-overlay filter blur-[100px] opacity-30 animate-blob top-[-20%] left-[-20%]"></div>
                <div className="absolute w-[600px] h-[600px] bg-login-bg-end rounded-full mix-blend-overlay filter blur-[80px] opacity-40 animate-blob animation-delay-2000 bottom-[-10%] right-[-10%]"></div>

                <div className="relative z-10 text-white p-12 text-center">
                    <h1 className="text-5xl font-bold mb-4 tracking-tight">HackHiVE</h1>
                    <p className="text-xl text-indigo-100 font-light max-w-md mx-auto">Welcome back! Log in to access your campaigns.</p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12 relative">
                <div className="w-full max-w-md bg-login-card rounded-2xl shadow-xl p-8 lg:p-10 border border-gray-100/50">

                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-login-text-primary tracking-tight mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-login-text-secondary text-sm font-medium">
                            Login to your account
                        </p>
                    </div>

                    {error && <p className="text-red-500 text-center mb-5 bg-red-50 py-2 rounded-lg text-sm">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1" htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className="w-full bg-login-input-bg border-transparent border-2 focus:border-login-focus focus:bg-white rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-teal-800/30 text-login-text-primary"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="flex justify-between items-center mb-1 ml-1">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                                <a href="#" className="text-xs text-login-text-secondary hover:underline">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-login-input-bg border-transparent border-2 focus:border-login-focus focus:bg-white rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-teal-800/30 text-login-text-primary"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-login-btn-primary hover:bg-login-btn-hover text-white font-bold rounded-xl shadow-lg hover:shadow-login-btn-primary/40 transform hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="text-login-text-secondary font-bold hover:underline transition-all"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
