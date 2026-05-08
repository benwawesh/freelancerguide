import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { heroSettingsAPI } from '../../api';

function HeroSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    button_text: '',
    button_url: '',
    button_enabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await heroSettingsAPI.getAdminSettings();
      setSettings(response.data);
      setMessage(null);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load hero settings' });
      console.error('Error fetching hero settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await heroSettingsAPI.updateSettings(settings);
      setMessage({ type: 'success', text: 'Hero settings updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update hero settings' });
      console.error('Error updating hero settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container admin-page">
      <div className="admin-page-header">
        <button 
          onClick={() => navigate('/admin')}
          className="back-button"
        >
          ← Back to Dashboard
        </button>
        <h1>Hero Settings</h1>
        <p>Configure the hero section button</p>
      </div>

      <div className="admin-content">
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="settings-form-container">
          <form onSubmit={handleSubmit} className="settings-form">
            <div className="form-group">
              <label htmlFor="button_text">
                Button Text *
              </label>
              <input
                type="text"
                id="button_text"
                name="button_text"
                value={settings.button_text}
                onChange={handleChange}
                required
                placeholder="e.g., Get Started, Learn More"
                className="form-input"
              />
              <small className="form-help">
                The text that will appear on the hero button
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="button_url">
                Button URL *
              </label>
              <input
                type="url"
                id="button_url"
                name="button_url"
                value={settings.button_url}
                onChange={handleChange}
                required
                placeholder="https://example.com"
                className="form-input"
              />
              <small className="form-help">
                The external URL where the button should link to
              </small>
            </div>

            <div className="form-group checkbox-group">
              <label htmlFor="button_enabled" className="checkbox-label">
                <input
                  type="checkbox"
                  id="button_enabled"
                  name="button_enabled"
                  checked={settings.button_enabled}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span>Enable Hero Button</span>
              </label>
              <small className="form-help">
                Uncheck to hide the button from the hero section
              </small>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="save-button"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
              <button 
                type="button"
                onClick={() => navigate('/admin')}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="preview-section">
          <h3>Preview</h3>
          <div className="hero-preview">
            {settings.button_enabled ? (
              <a 
                href={settings.button_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hero-button-preview"
              >
                {settings.button_text || 'Button Text'}
              </a>
            ) : (
              <p className="preview-disabled">Button is disabled</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSettings;