import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { teamService } from '../api/team';

const CampaignTeam = () => {
    const { id } = useParams();
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAssignPanel, setShowAssignPanel] = useState(false);
    const [selectedMember, setSelectedMember] = useState('');
    const [selectedRole, setSelectedRole] = useState('editor');

    useEffect(() => {
        loadTeam();
    }, [id]);

    const loadTeam = async () => {
        try {
            const data = await teamService.getTeamMembers(id);
            setMembers(data.members);
        } catch (error) {
            console.error("Failed to load team:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignRole = async (e) => {
        e.preventDefault();
        if (!selectedMember) return;

        try {
            await teamService.assignRole(id, parseInt(selectedMember), selectedRole);
            setMembers(prev => prev.map(m =>
                m.id === parseInt(selectedMember) ? { ...m, role: selectedRole } : m
            ));
            setShowAssignPanel(false);
            setSelectedMember('');
        } catch (error) {
            alert('Failed to assign role');
        }
    };

    const roleConfig = {
        admin: { label: 'Admin', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '👑' },
        manager: { label: 'Manager', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '📊' },
        editor: { label: 'Editor', color: 'bg-green-100 text-green-700 border-green-200', icon: '✏️' },
        creator: { label: 'Creator', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '🎨' },
        marketer: { label: 'Marketer', color: 'bg-pink-100 text-pink-700 border-pink-200', icon: '📢' }
    };

    const rolePermissions = {
        admin: ['Full access', 'Manage team', 'Approve budgets', 'Delete campaigns'],
        manager: ['Approve content', 'View analytics', 'Assign tasks', 'Edit schedules'],
        editor: ['Edit content', 'Upload assets', 'Comment on drafts'],
        creator: ['Create content', 'Upload drafts', 'View feedback'],
        marketer: ['Schedule posts', 'View analytics', 'Access feedback']
    };

    const groupedMembers = {
        admin: members.filter(m => m.role === 'admin'),
        manager: members.filter(m => m.role === 'manager'),
        editor: members.filter(m => m.role === 'editor'),
        creator: members.filter(m => m.role === 'creator'),
        marketer: members.filter(m => m.role === 'marketer')
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] -m-6 bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <Link to={`/campaigns/${id}`} className="text-gray-500 hover:text-gray-700">← Back</Link>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Campaign Team</h1>
                        <p className="text-xs text-gray-500">Manage roles and collaboration access</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowAssignPanel(true)}
                    className="px-4 py-2 bg-login-btn-primary text-white text-sm font-bold rounded-lg shadow-sm hover:shadow hover:-translate-y-0.5 transition-all"
                >
                    + Assign Role
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto">
                    {isLoading ? (
                        <div className="text-center text-gray-400 mt-20">Loading team...</div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Team Members List */}
                            <div className="lg:col-span-2 space-y-6">
                                {Object.entries(groupedMembers).map(([role, roleMembers]) => {
                                    if (roleMembers.length === 0) return null;
                                    const config = roleConfig[role];

                                    return (
                                        <div key={role} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-2xl">{config.icon}</span>
                                                <h3 className="text-lg font-bold text-gray-800">{config.label}s</h3>
                                                <span className="text-xs text-gray-400">({roleMembers.length})</span>
                                            </div>
                                            <div className="space-y-3">
                                                {roleMembers.map(member => (
                                                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-login-bg-start to-login-bg-middle flex items-center justify-center text-white font-bold text-sm">
                                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                                </div>
                                                                {member.isActive && (
                                                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900">{member.name}</p>
                                                                <p className="text-xs text-gray-500">{member.email}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs text-gray-400">{member.lastSeen}</span>
                                                            <span className={`px-2 py-1 rounded-full border text-xs font-bold ${config.color}`}>
                                                                {config.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Role Permissions */}
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 shadow-sm h-fit sticky top-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span>🔐</span> Role Permissions
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(rolePermissions).map(([role, permissions]) => {
                                        const config = roleConfig[role];
                                        return (
                                            <div key={role} className="bg-white rounded-lg p-3 shadow-sm">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span>{config.icon}</span>
                                                    <span className="text-sm font-bold text-gray-700">{config.label}</span>
                                                </div>
                                                <ul className="space-y-1 text-xs text-gray-600 ml-6">
                                                    {permissions.map((perm, i) => (
                                                        <li key={i} className="flex items-center gap-2">
                                                            <span className="text-green-500">✓</span> {perm}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Assign Role Modal */}
            {showAssignPanel && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-96 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Assign Team Role</h3>
                        <form onSubmit={handleAssignRole} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Team Member</label>
                                <select
                                    value={selectedMember}
                                    onChange={e => setSelectedMember(e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-200 rounded text-sm outline-none"
                                >
                                    <option value="">Select member...</option>
                                    {members.map(m => (
                                        <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Role</label>
                                <select
                                    value={selectedRole}
                                    onChange={e => setSelectedRole(e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded text-sm outline-none"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="editor">Editor</option>
                                    <option value="creator">Creator</option>
                                    <option value="marketer">Marketer</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAssignPanel(false)}
                                    className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-bold bg-login-btn-primary text-white rounded shadow-sm hover:shadow-md"
                                >
                                    Assign Role
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignTeam;
