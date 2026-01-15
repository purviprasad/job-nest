'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ApplicationForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        platform: '',
        otherPlatform: '',
        link: '',
        company: '',
        role: '',
        status: 'Applied',
        date: new Date().toISOString().split('T')[0],
        salary: '',
        location: '',
        workMode: 'On-site',
        notes: ''
    });
    const [isExtracting, setIsExtracting] = useState(false);



    const platforms = ['LinkedIn', 'Indeed', 'Glassdoor', 'Wellfound', 'ZipRecruiter', 'Other'];

    useEffect(() => {
        if (initialData) {
            const isKnown = platforms.includes(initialData.platform);
            setFormData({
                ...initialData,
                platform: isKnown ? initialData.platform : 'Other',
                otherPlatform: isKnown ? '' : initialData.platform
            });
        } else {
            setFormData({
                platform: '',
                otherPlatform: '',
                link: '',
                company: '',
                role: '',
                status: 'Applied',
                date: new Date().toISOString().split('T')[0],
                salary: '',
                location: '',
                workMode: 'On-site',
                notes: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAutoFill = async () => {
        if (!formData.link) return;

        setIsExtracting(true);
        try {
            const res = await fetch('/api/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: formData.link })
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({
                    ...prev,
                    company: data.company || prev.company,
                    role: data.role || prev.role,
                    workMode: data.workMode || prev.workMode,
                    // location: data.location || prev.location // API doesn't robustly support loc yet
                }));
            } else {
                console.error('Extraction failed');
                // Optional: Show toast
            }
        } catch (error) {
            console.error('Error extracting:', error);
        } finally {
            setIsExtracting(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = { ...formData };

        // Normalize platform
        if (submissionData.platform === 'Other' && submissionData.otherPlatform) {
            submissionData.platform = submissionData.otherPlatform;
        }
        delete submissionData.otherPlatform;

        onSubmit(submissionData);
        onClose();
    };

    // const platforms = ['LinkedIn', 'Indeed', 'Glassdoor', 'Wellfound', 'ZipRecruiter', 'Other'];

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
            <div className="glass-card animate-fade-in" style={{
                width: '100%',
                maxWidth: '600px',
                position: 'relative',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                padding: 0, // Remove default padding to handle inner sections
                overflow: 'hidden' // proper containment
            }}>
                {/* Fixed Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--card-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.02)'
                }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
                        {initialData ? 'Edit Application' : 'Add New Application'}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', color: 'var(--text-muted)', padding: 0, display: 'flex' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div style={{
                    overflowY: 'auto',
                    padding: '1.5rem',
                    flex: 1
                }}>
                    <form id="application-form" onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {/* Platform Selection */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Platform</label>
                                <select
                                    name="platform" value={formData.platform} onChange={handleChange}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.75rem', color: 'white' }}
                                >
                                    <option value="">Select Platform</option>
                                    {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>

                            {/* Manual Platform Input */}
                            {formData.platform === 'Other' && (
                                <div className="animate-fade-in">
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Specify Platform</label>
                                    <input
                                        type="text" name="otherPlatform" value={formData.otherPlatform} onChange={handleChange} required
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.75rem', color: 'white' }}
                                        placeholder="e.g. Company Website, Referral"
                                    />
                                </div>
                            )}

                            {/* Job Link & Auto-fill */}
                            {formData.platform && (
                                <div className="animate-fade-in">
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Job Link</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            type="url" name="link" value={formData.link} onChange={handleChange}
                                            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.75rem', color: 'white' }}
                                            placeholder="Paste job link here..."
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAutoFill}
                                            disabled={!formData.link || isExtracting}
                                            style={{
                                                padding: '0 1rem',
                                                background: 'var(--accent-primary)',
                                                color: 'white',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                opacity: (!formData.link || isExtracting) ? 0.5 : 1
                                            }}
                                        >
                                            {isExtracting ? '...' : 'Auto-fill'}
                                        </button>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                        Paste link and click Auto-fill to fetch details automatically.
                                    </p>
                                </div>
                            )}

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
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Location (Optional)</label>
                                    <input
                                        type="text" name="location" value={formData.location} onChange={handleChange}
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.75rem', color: 'white' }}
                                        placeholder="e.g. New York, NY"
                                    />
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
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
                        </div>
                    </form>
                </div>

                {/* Fixed Footer */}
                <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid var(--card-border)',
                    background: 'rgba(255,255,255,0.02)'
                }}>
                    <button
                        type="submit"
                        form="application-form"
                        style={{
                            width: '100%',
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
                </div>
            </div>
        </div>
    );
};

export default ApplicationForm;
