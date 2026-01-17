import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(isLogin ? 'Logging in' : 'Creating account', formData);
        // Add authentication logic here
        // navigate('/dashboard'); // example
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800 p-4">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-zinc-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 overflow-hidden transform transition-all hover:scale-[1.005] duration-300">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        {isLogin ? 'Enter your credentials to access your account' : 'Sign up to get started with our platform'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div className="relative group">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all text-gray-800 placeholder-transparent peer"
                                placeholder="Full Name"
                            />
                            <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-slate-600 bg-white peer-focus:bg-white px-1 pointer-events-none">
                                Full Name
                            </label>
                        </div>
                    )}

                    <div className="relative group">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all text-gray-800 placeholder-transparent peer"
                            placeholder="Email"
                        />
                        <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-slate-600 bg-white peer-focus:bg-white px-1 pointer-events-none">
                            Email
                        </label>
                    </div>

                    <div className="relative group">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all text-gray-800 placeholder-transparent peer"
                            placeholder="Password"
                        />
                        <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-slate-600 bg-white peer-focus:bg-white px-1 pointer-events-none">
                            Password
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-gray-800 hover:bg-gray-900 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-slate-600 hover:text-slate-800 font-medium transition-colors hover:underline decoration-slate-400/30 underline-offset-4"
                        >
                            {isLogin ? 'Create one' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
