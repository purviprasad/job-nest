'use client';
import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import ApplicationCard from '@/components/ApplicationCard';
import ApplicationForm from '@/components/ApplicationForm';

export default function Home() {
  const [applications, setApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('interview_apps');
    if (saved) {
      setApplications(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('interview_apps', JSON.stringify(applications));
    }
  }, [applications, isLoaded]);

  const handleAddOrEdit = (appData) => {
    if (editingApp) {
      setApplications(prev => prev.map(app => app.id === editingApp.id ? { ...appData, id: app.id } : app));
    } else {
      setApplications(prev => [...prev, { ...appData, id: Date.now().toString() }]);
    }
    setEditingApp(null);
  };

  const handleDelete = (id) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const handleEditClick = (app) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (id) => {
    const statuses = ['Applied', 'Interview', 'Offer', 'Rejected'];
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        const nextIndex = (statuses.indexOf(app.status) + 1) % statuses.length;
        return { ...app, status: statuses[nextIndex] };
      }
      return app;
    }));
  };

  const filteredApps = applications
    .filter(app => {
      const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'All' || app.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!isLoaded) return null;

  return (
    <div className="app-container">
      <Dashboard
        applications={applications}
        onAddClick={() => { setEditingApp(null); setIsModalOpen(true); }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <div className="application-list">
        {filteredApps.length > 0 ? (
          filteredApps.map(app => (
            <ApplicationCard
              key={app.id}
              application={app}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onStatusUpdate={handleStatusUpdate}
            />
          ))
        ) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem' }}>No applications found. Start by adding your first one!</p>
          </div>
        )}
      </div>

      <ApplicationForm
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingApp(null); }}
        onSubmit={handleAddOrEdit}
        initialData={editingApp}
      />

      <footer style={{ marginTop: '4rem', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem', borderTop: '1px solid var(--card-border)' }}>
        <p>&copy; {new Date().getFullYear()} Interview Tracker. Built for career success.</p>
      </footer>
    </div>
  );
}
