import React, { useState, useEffect } from 'react';
import { socialLinksAPI } from '../../api';
import { Link } from 'react-router-dom';

function SocialSettings() {
  const [settings, setSettings] = useState({
    telegram_url: '',
    whatsapp_url: '',
    show_telegram: false,
    show_whatsapp: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await socialLinksAPI.getAdminLinks();
      setSettings(response.data);
    } catch (err) {
      console.error('Error fetching social links:', err);
      setMessage({ type: 'error', text: 'Failed to load social links settings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await socialLinksAPI.updateLinks(settings);
      setMessage({ type: 'success', text: 'Social links settings saved successfully!' });
    } catch (err) {
      console.error('Error updating social links:', err);
      setMessage({ type: 'error', text: 'Failed to save social links settings.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading social links settings...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          to="/admin" 
          style={{ 
            color: '#525252', 
            textDecoration: 'none', 
            fontWeight: '500',
            marginBottom: '1rem',
            display: 'inline-block'
          }}
        >
          ← Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: '0.5rem 0' }}>
          Social Links Settings
        </h1>
        <p style={{ color: '#525252', margin: '0' }}>
          Configure Telegram and WhatsApp links to display in the navbar
        </p>
      </div>

      {message.text && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '4px',
          backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
          border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`,
          color: message.type === 'success' ? '#166534' : '#991b1b',
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Telegram Settings */}
        <div style={{
          padding: '1.5rem',
          border: '1px solid #d4d4d4',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 1rem 0' }}>
            📱 Telegram Settings
          </h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Telegram URL
            </label>
            <input
              type="url"
              name="telegram_url"
              value={settings.telegram_url || ''}
              onChange={handleChange}
              placeholder="https://t.me/yourchannel"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d4d4d4',
                borderRadius: '4px',
                fontSize: '1rem',
                fontFamily: 'inherit',
              }}
            />
            <p style={{ fontSize: '0.875rem', color: '#737373', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
              Your Telegram group or channel link (e.g., https://t.me/yourchannel)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              name="show_telegram"
              checked={settings.show_telegram}
              onChange={handleChange}
              id="show_telegram"
              style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
            />
            <label htmlFor="show_telegram" style={{ cursor: 'pointer', fontWeight: '500' }}>
              Show Telegram icon in navbar
            </label>
          </div>
        </div>

        {/* WhatsApp Settings */}
        <div style={{
          padding: '1.5rem',
          border: '1px solid #d4d4d4',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 1rem 0' }}>
            💬 WhatsApp Settings
          </h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              WhatsApp URL
            </label>
            <input
              type="url"
              name="whatsapp_url"
              value={settings.whatsapp_url || ''}
              onChange={handleChange}
              placeholder="https://wa.me/1234567890"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d4d4d4',
                borderRadius: '4px',
                fontSize: '1rem',
                fontFamily: 'inherit',
              }}
            />
            <p style={{ fontSize: '0.875rem', color: '#737373', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
              WhatsApp link for messaging or group (e.g., https://wa.me/1234567890)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              name="show_whatsapp"
              checked={settings.show_whatsapp}
              onChange={handleChange}
              id="show_whatsapp"
              style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
            />
            <label htmlFor="show_whatsapp" style={{ cursor: 'pointer', fontWeight: '500' }}>
              Show WhatsApp icon in navbar
            </label>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Link
            to="/admin"
            style={{
              backgroundColor: '#e5e5e5',
              color: '#000000',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            style={{
              backgroundColor: '#000000',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.5 : 1,
            }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SocialSettings;