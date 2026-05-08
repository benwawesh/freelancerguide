
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminGuidesAPI, authAPI } from '../../api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
    fetchGuides();
  }, []);

  const checkAuth = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/admin/login');
    }
  };

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await adminGuidesAPI.getAll();
      setGuides(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load guides');
      console.error('Error fetching guides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this guide?')) {
      return;
    }

    try {
      await adminGuidesAPI.delete(id);
      setGuides(guides.filter(g => g.id !== id));
    } catch (err) {
      alert('Failed to delete guide');
      console.error('Error deleting guide:', err);
    }
  };

  const handleTogglePublished = async (id) => {
    try {
      await adminGuidesAPI.togglePublished(id);
      setGuides(guides.map(g => 
        g.id === id ? { ...g, is_published: !g.is_published } : g
      ));
    } catch (err) {
      alert('Failed to update guide status');
      console.error('Error toggling published status:', err);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/admin/login');
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage your tutorial guides</p>
        </div>
        <div className="admin-header-actions">
          <span className="admin-user">{user?.email}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-actions">
          <button 
            onClick={() => navigate('/admin/guides/create')}
            className="create-button"
          >
            + Create New Guide
          </button>
          <button 
            onClick={() => navigate('/admin/settings')}
            className="settings-button"
          >
            ⚙️ Hero Settings
          </button>
          <button 
            onClick={() => navigate('/admin/social-settings')}
            className="settings-button"
          >
            📱 Social Links
          </button>
          <button 
            onClick={() => navigate('/')}
            className="view-site-button"
          >
            View Public Site
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {guides.length === 0 ? (
          <div className="no-guides-admin">
            <h2>No guides yet</h2>
            <p>Create your first tutorial guide to get started!</p>
          </div>
        ) : (
          <div className="admin-guides-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Links</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {guides.map((guide) => (
                  <tr key={guide.id}>
                    <td>{guide.title}</td>
                    <td>{guide.category || '-'}</td>
                    <td>
                      <span className={`status-badge ${guide.is_published ? 'published' : 'draft'}`}>
                        {guide.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>{guide.link_count}</td>
                    <td>{new Date(guide.created_at).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button 
                        onClick={() => handleTogglePublished(guide.id)}
                        className="action-button toggle-button"
                        title={guide.is_published ? 'Unpublish' : 'Publish'}
                      >
                        {guide.is_published ? '🔒' : '🔓'}
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/guides/edit/${guide.id}`)}
                        className="action-button edit-button"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(guide.id)}
                        className="action-button delete-button"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;