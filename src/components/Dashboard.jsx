'use client';
import React from 'react';
import { Target, CheckCircle2, Clock, XCircle, Search, Filter, Plus } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <div className="glass-card animate-fade-in" style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        minWidth: '200px',
        animationDelay: `${delay}s`
    }}>
        <div style={{
            padding: '0.75rem',
            borderRadius: '12px',
            background: `${color}20`,
            color: color
        }}>
            <Icon size={24} />
        </div>
        <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{title}</p>
            <h3 style={{ fontSize: '1.5rem' }}>{value}</h3>
        </div>
    </div>
);

const Dashboard = ({ applications, onAddClick, searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
    const stats = {
        total: applications.length,
        interview: applications.filter(a => a.status === 'Interview').length,
        offers: applications.filter(a => a.status === 'Offer').length,
        rejected: applications.filter(a => a.status === 'Rejected').length
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, white, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Interview Tracker
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Keep track of your career progress</p>
                </div>
                <button
                    onClick={onAddClick}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        color: 'white',
                        borderRadius: '12px',
                        fontWeight: '600',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                    }}
                >
                    <Plus size={20} /> Add Application
                </button>
            </header>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                <StatCard title="Total Applied" value={stats.total} icon={Target} color="#60a5fa" delay={0.1} />
                <StatCard title="Interviews" value={stats.interview} icon={Clock} color="#fbbf24" delay={0.2} />
                <StatCard title="Offers" value={stats.offers} icon={CheckCircle2} color="#34d399" delay={0.3} />
                <StatCard title="Rejected" value={stats.rejected} icon={XCircle} color="#f87171" delay={0.4} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search by company or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 3rem',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '12px',
                            color: 'white'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--card-bg)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                    <Filter size={18} style={{ margin: '0 0.5rem', color: 'var(--text-muted)' }} />
                    {['All', 'Applied', 'Interview', 'Offer', 'Rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            style={{
                                padding: '0.4rem 0.8rem',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                background: filterStatus === status ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: filterStatus === status ? 'white' : 'var(--text-muted)'
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
