'use client';
import React from 'react';
import { Building2, Briefcase, Calendar, DollarSign, ExternalLink, Trash2, Edit3, ChevronDown, Globe, MapPin, Laptop } from 'lucide-react';

const ApplicationCard = ({ application, onEdit, onDelete, onStatusUpdate }) => {
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'applied': return 'status-applied';
            case 'interview': return 'status-interview';
            case 'offer': return 'status-offer';
            case 'rejected': return 'status-rejected';
            default: return '';
        }
    };

    return (
        <div className="glass-card animate-fade-in" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{application.company}</h3>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Briefcase size={14} /> {application.role}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={14} /> {new Date(application.date).toLocaleDateString()}
                            </span>
                            {application.salary && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <DollarSign size={14} /> {application.salary}
                                </span>
                            )}
                            {application.platform && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Globe size={14} /> {application.platform}
                                </span>
                            )}
                            {application.location && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <MapPin size={14} /> {application.location}
                                </span>
                            )}
                            {application.workMode && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Laptop size={14} /> {application.workMode}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className={`status-badge ${getStatusClass(application.status)}`}>
                        {application.status}
                    </span>
                    <div style={{ display: 'inline-block', position: 'relative' }}>
                        <button
                            onClick={() => onStatusUpdate(application.id)}
                            style={{ background: 'transparent', color: 'var(--text-muted)', padding: '0.5rem' }}
                        >
                            <ChevronDown size={18} />
                        </button>
                    </div>
                    <button
                        onClick={() => onEdit(application)}
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', padding: '0.5rem', borderRadius: '8px' }}
                    >
                        <Edit3 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(application.id)}
                        style={{ background: 'rgba(248,113,113,0.1)', color: 'var(--status-rejected)', padding: '0.5rem', borderRadius: '8px' }}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {application.notes && (
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
                    {application.notes}
                </p>
            )}

            {application.link && (
                <a
                    href={application.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        marginTop: '1rem',
                        color: 'var(--accent-primary)',
                        textDecoration: 'none',
                        fontSize: '0.875rem'
                    }}
                >
                    View Job Description <ExternalLink size={14} />
                </a>
            )}
        </div>
    );
};

export default ApplicationCard;
