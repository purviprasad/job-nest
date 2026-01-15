'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from '@/components/Dashboard';
import ApplicationCard from '@/components/ApplicationCard';
import ApplicationForm from '@/components/ApplicationForm';

export default function Home() {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, current: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPagination(p => ({ ...p, current: 1 })); // Reset to page 1 on new search
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.current,
        limit: 10,
        search: debouncedSearchTerm,
        status: filterStatus,
      });

      const res = await fetch(`/api/applications?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setApplications(data.applications);
        setPagination(data.pagination);
      } else {
        console.error('Failed to fetch applications:', data.error);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.current, debouncedSearchTerm, filterStatus]);

  // Initial fetch and fetch on dependencies change
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Create or Update
  const handleAddOrEdit = async (appData) => {
    try {
      const method = editingApp ? 'PUT' : 'POST';
      const url = editingApp
        ? `/api/applications/${editingApp._id}`
        : '/api/applications';

      // Remove _id from body if it exists for PUT (Mongoose handles it) 
      // or if it's new (Mongo generates it)
      const { _id, createdAt, updatedAt, ...body } = appData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchApplications(); // Refresh list
        setEditingApp(null);
        setIsModalOpen(false);
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving application:', error);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchApplications();
      } else {
        console.error('Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  // Status Update
  const handleStatusUpdate = async (id, currentStatus) => {
    const statuses = ['Applied', 'Interview', 'Offer', 'Rejected'];
    const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        await fetchApplications();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleEditClick = (app) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, current: newPage }));
  };

  return (
    <div className="app-container">
      <Dashboard
        applications={applications}
        onAddClick={() => { setEditingApp(null); setIsModalOpen(true); }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={(status) => { setFilterStatus(status); setPagination(p => ({ ...p, current: 1 })); }}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      <div className="application-list">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>
        ) : applications.length > 0 ? (
          applications.map(app => (
            <ApplicationCard
              key={app._id}
              application={app} // Pass the whole object, assuming _id is used
              onEdit={handleEditClick}
              onDelete={() => handleDelete(app._id)}
              onStatusUpdate={() => handleStatusUpdate(app._id, app.status)}
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
