import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';

const API_BASE_URL = 'http://localhost:5000/api';

// --- Icons ---
const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);
const IconCheckCallback = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

const CampaignCreate = () => {
    const navigate = useNavigate();
    const { getJWT } = useContext(AuthContext);

    // State
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [unauthorized, setUnauthorized] = useState(false);
    const [users, setUsers] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        objective: '',
        description: '',
        startDate: '',
        endDate: ''
    });

    // Team State
    const [team, setTeam] = useState([]);

    // Role selection
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRoles, setSelectedRoles] = useState([]);

    const AVAILABLE_ROLES = [
        { id: 'creator', label: 'Creator', color: 'bg-purple-100 text-purple-700 border-purple-200' },
        { id: 'editor', label: 'Editor', color: 'bg-blue-100 text-blue-700 border-blue-200' },
        { id: 'marketer', label: 'Marketer', color: 'bg-pink-100 text-pink-700 border-pink-200' },
        { id: 'manager', label: 'Manager', color: 'bg-orange-100 text-orange-700 border-orange-200' },
        { id: 'admin', label: 'Admin', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    ];

    useEffect(() => {
        const init = async () => {
            try {
                const token = await getJWT();
                if (!token) {
                    setUnauthorized(true);
                    setLoading(false);
                    return;
                }

                const config = {
                    headers: { 'Authorization': `Bearer ${token}` },
                    withCredentials: true
                };

                // Check Capabilities
                const capRes = await axios.get(`${API_BASE_URL}/system/capabilities`, config);
                if (!capRes.data.canCreateCampaign) {
                    setUnauthorized(true);
                    setLoading(false);
                    return;
                }

                // Fetch Users
                const userRes = await axios.get(`${API_BASE_URL}/users`, config);
                setUsers(userRes.data.users);

                setLoading(false);
            } catch (error) {
                console.error("Initialization failed", error);
                if (error.response && error.response.status === 401) {
                    setUnauthorized(true);
                }
                setLoading(false);
            }
        };

        if (loading) {
            init();
        }
    }, [getJWT]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleToggle = (roleId) => {
        if (selectedRoles.includes(roleId)) {
            setSelectedRoles(selectedRoles.filter(r => r !== roleId));
        } else {
            setSelectedRoles([...selectedRoles, roleId]);
        }
    };

    const addTeamMember = () => {
        if (!selectedUser || selectedRoles.length === 0) return;

        const existingIndex = team.findIndex(m => m.userId === selectedUser);
        if (existingIndex >= 0) {
            const updatedTeam = [...team];
            const newRoles = [...new Set([...updatedTeam[existingIndex].roles, ...selectedRoles])];
            updatedTeam[existingIndex].roles = newRoles;
            setTeam(updatedTeam);
        } else {
            setTeam([...team, { userId: selectedUser, roles: selectedRoles }]);
        }

        setSelectedUser('');
        setSelectedRoles([]);
    };

    const removeTeamMember = (index) => {
        const newTeam = [...team];
        newTeam.splice(index, 1);
        setTeam(newTeam);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            alert("End date must be after start date");
            return;
        }

        try {
            setSubmitting(true);
            const token = await getJWT();
            const config = {
                headers: { 'Authorization': `Bearer ${token}` },
                withCredentials: true
            };

            await axios.post(`${API_BASE_URL}/campaigns`, { ...formData, team }, config);

            navigate('/campaigns');
        } catch (error) {
            console.error("Creation failed", error);
            alert("Failed: " + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (unauthorized) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-red-100">
                    <div className="h-16 w-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-2xl font-bold">!</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Restricted Access</h2>
                    <p className="text-gray-500 mb-6">You do not have the required system permissions to create campaigns.</p>
                    <button onClick={() => navigate('/dashboard')} className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FC] font-sans text-slate-800">
            <main className="max-w-5xl mx-auto px-6 py-10">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Metadata */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Card: Basic Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                            <div className="px-8 py-6 border-b border-slate-50 bg-white">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                                    Campaign Details
                                </h3>
                            </div>
                            <div className="p-8 space-y-8">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">Name</label>
                                    <input
                                        type="text" name="name" required minLength={3}
                                        value={formData.name} onChange={handleChange}
                                        placeholder="e.g. Q4 Product Launch"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-800 placeholder-slate-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">Objective</label>
                                    <input
                                        type="text" name="objective" required
                                        value={formData.objective} onChange={handleChange}
                                        placeholder="What is the goal?"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-800 placeholder-slate-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">Description</label>
                                    <textarea
                                        name="description" rows="4"
                                        value={formData.description} onChange={handleChange}
                                        placeholder="Brief summary..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-800 placeholder-slate-400 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Card: Schedule */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                            <div className="px-8 py-6 border-b border-slate-50 bg-white">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
                                    Schedule
                                </h3>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">Start Date</label>
                                    <input
                                        type="date" name="startDate" required
                                        value={formData.startDate} onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none text-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">End Date</label>
                                    <input
                                        type="date" name="endDate" required
                                        value={formData.endDate} onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none text-slate-800"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Team & Submit */}
                    <div className="space-y-6">
                        {/* Card: Team */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md h-fit">
                            <div className="px-6 py-5 border-b border-slate-50 bg-white">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                                    Team Formation
                                </h3>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* User Select */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Add Member</label>
                                    <div className="relative">
                                        <select
                                            value={selectedUser}
                                            onChange={(e) => setSelectedUser(e.target.value)}
                                            className="w-full px-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-800 appearance-none cursor-pointer"
                                        >
                                            <option value="">Select a user...</option>
                                            {users.map(u => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-4 text-indigo-400 pointer-events-none">
                                            <IconPlus />
                                        </div>
                                    </div>
                                </div>

                                {/* Roles Select */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Assign Roles</label>
                                    <div className="flex flex-wrap gap-2">
                                        {AVAILABLE_ROLES.map(role => {
                                            const isSelected = selectedRoles.includes(role.id);
                                            return (
                                                <button
                                                    type="button"
                                                    key={role.id}
                                                    onClick={() => handleRoleToggle(role.id)}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all transform active:scale-95 ${isSelected
                                                            ? `${role.color} border-current shadow-sm`
                                                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {role.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={addTeamMember}
                                    disabled={!selectedUser || selectedRoles.length === 0}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 flex items-center justify-center gap-2"
                                >
                                    <IconPlus /> Add to Team
                                </button>

                                {/* List */}
                                <div className="space-y-3 pt-2">
                                    {team.map((member, idx) => {
                                        const u = users.find(user => user.id === member.userId);
                                        return (
                                            <div key={idx} className="flex items-start justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 group hover:border-indigo-100 transition-colors">
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800">{u?.name || 'Unknown'}</div>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {member.roles.map(rId => {
                                                            const r = AVAILABLE_ROLES.find(ar => ar.id === rId);
                                                            return (
                                                                <span key={rId} className="px-1.5 py-0.5 text-[10px] uppercase font-bold bg-white border border-slate-200 rounded text-slate-500">
                                                                    {r?.label || rId}
                                                                </span>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTeamMember(idx)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <IconTrash />
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {team.length === 0 && (
                                        <div className="text-center py-4 text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-xl">
                                            No team members added yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Action */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-gray-900 text-white text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:transform-none flex items-center justify-center gap-3"
                            >
                                {submitting ? (
                                    <span className="animate-pulse">Creating...</span>
                                ) : (
                                    <>
                                        <IconCheckCallback /> Launch Campaign
                                    </>
                                )}
                            </button>
                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/campaigns')}
                                    className="text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default CampaignCreate;
