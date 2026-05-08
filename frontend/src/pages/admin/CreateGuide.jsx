import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminGuidesAPI } from '../../api';
import GuideForm from '../../components/GuideForm';

function CreateGuide() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      await adminGuidesAPI.create(formData);
      navigate('/admin/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object' && !data.detail) {
        const flatten = (val) => {
          if (typeof val === 'string') return val;
          if (Array.isArray(val)) return val.map(flatten).join(', ');
          if (typeof val === 'object') return Object.entries(val).map(([k, v]) => `${k}: ${flatten(v)}`).join('; ');
          return String(val);
        };
        const messages = Object.entries(data).map(([field, errors]) => `${field}: ${flatten(errors)}`).join(' | ');
        setError(messages);
      } else {
        setError(data?.detail || 'Failed to create guide');
      }
      console.error('Error creating guide:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="container">
      <header className="admin-header">
        <h1>Create New Guide</h1>
      </header>

      {error && <div className="error-message">{error}</div>}

      <GuideForm
        guide={null}
        onSave={handleSave}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}

export default CreateGuide;