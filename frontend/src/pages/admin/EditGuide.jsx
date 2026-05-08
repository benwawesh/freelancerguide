import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminGuidesAPI } from '../../api';
import GuideForm from '../../components/GuideForm';

function EditGuide() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGuide();
  }, [id]);

  const fetchGuide = async () => {
    try {
      setLoading(true);
      const response = await adminGuidesAPI.getById(id);
      setGuide(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load guide');
      console.error('Error fetching guide:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      setError(null);
      
      await adminGuidesAPI.update(id, formData);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update guide');
      console.error('Error updating guide:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading guide...</div>
      </div>
    );
  }

  if (error && !guide) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <button onClick={handleCancel} className="back-button">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="admin-header">
        <h1>Edit Guide</h1>
      </header>

      {error && <div className="error-message">{error}</div>}

      <GuideForm
        guide={guide}
        onSave={handleSave}
        onCancel={handleCancel}
        loading={saving}
      />
    </div>
  );
}

export default EditGuide;