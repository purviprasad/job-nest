'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ApplicationForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        status: 'Applied',
        date: new Date().toISOString().split('T')[0],
        salary: '',
        notes: '',
        link: '',
        platform: '',
        location: '',
        workMode: 'On-site'
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                company: '',
                role: '',
                status: 'Applied',
                date: new Date().toISOString().split('T')[0],
                salary: '',
                notes: '',
                link: '',
                platform: '',
                location: '',
                workMode: 'On-site'
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }}>
            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', color: 'var(--text-muted)' }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                    {initialData ? 'Edit Application' : 'Add New Application'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Company Name</label>
                            <input
                                type="text" name="company" value={formData.company} onChange={handleChange} required
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.75rem', color: 'white' }}
                                placeholder="e.g. Google"
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Role</label>
                            <input
                                type="text" name="role" value={formData.role} onChange={handleChange} required
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.75rem', color: 'white' }}
                                placeholder="e.g. Frontend Engineer"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Status</label>
                            <select
                                name="status" value={formData.status} onChange={handleChange}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.75rem', color: 'white' }}
                            >
                                <option value="Applied">Applied</option>
                                <option value="Interview">Interview</option>
                                <option value="Offer">Offer</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Date Applied</label>
                            <input
                                type="date" name="date" value={formData.date} onChange={handleChange} required
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.75rem', color: 'white' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Salary (Optional)</label>
                            <input
                                type="text" name="salary" value={formData.salary} onChange={handleChange}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.75rem', color: 'white' }}
                                placeholder="e.g. $120k"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Job Link (Optional)</label>
                            <input
                                type="url" name="link" value={formData.link} onChange={handleChange}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.75rem', color: 'white' }}
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Platform (Optional)</label>
                            <input
                                type="text" name="platform" value={formData.platform} onChange={handleChange}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.75rem', color: 'white' }}
                                placeholder="e.g. LinkedIn, Indeed"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Location (Optional)</label>
                            <input
                                type="text" name="location" value={formData.location} onChange={handleChange}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.75rem', color: 'white' }}
                                placeholder="e.g. New York, NY"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Work Mode</label>
                            <select
                                name="workMode" value={formData.workMode} onChange={handleChange}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.75rem', color: 'white' }}
                            >
                                <option value="On-site">On-site</option>
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Notes</label>
                            <textarea
                                name="notes" value={formData.notes} onChange={handleChange} rows="3"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.75rem', color: 'white', resize: 'none' }}
                                placeholder="Any special notes or follow-ups..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            marginTop: '1.5rem',
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '1rem'
                        }}
                    >
                        {initialData ? 'Save Changes' : 'Add Application'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplicationForm;
