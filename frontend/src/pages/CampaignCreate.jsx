import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CampaignCreate = () => {
    const navigate = useNavigate();
    // Request Fields: name, objective, startDate, endDate
    const [formData, setFormData] = useState({
        name: '',
        objective: '',
        startDate: '',
        endDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Exact API: POST /api/campaigns
        fetch('/api/campaigns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to create campaign');
                return res.json();
            })
            .then(() => {
                setLoading(false);
                setMessage({ type: 'success', text: 'Campaign created successfully!' });
                // Redirect to list after success
                setTimeout(() => navigate('/campaigns'), 1500);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
                setMessage({ type: 'error', text: err.message });
            });
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-primary-text">Create Campaign</h1>

            {message && (
                <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-secondary-bg p-8 rounded-lg shadow-md space-y-6">
                <div>
                    <label className="block text-secondary-text mb-2 font-medium">Campaign Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Product Launch"
                        className="w-full p-3 rounded border border-secondary-accent bg-primary-bg text-primary-text focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent"
                    />
                </div>

                <div>
                    <label className="block text-secondary-text mb-2 font-medium">Objective</label>
                    <textarea
                        name="objective"
                        value={formData.objective}
                        onChange={handleChange}
                        required
                        placeholder="Increase awareness"
                        rows="3"
                        className="w-full p-3 rounded border border-secondary-accent bg-primary-bg text-primary-text focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-secondary-text mb-2 font-medium">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                            className="w-full p-3 rounded border border-secondary-accent bg-primary-bg text-primary-text focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent"
                        />
                    </div>
                    <div>
                        <label className="block text-secondary-text mb-2 font-medium">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                            className="w-full p-3 rounded border border-secondary-accent bg-primary-bg text-primary-text focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-accent text-white font-bold py-3 px-6 rounded hover:bg-opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating...' : 'Create Campaign'}
                </button>
            </form>
        </div>
    );
};

export default CampaignCreate;
