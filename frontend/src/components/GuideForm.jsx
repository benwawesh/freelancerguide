import React, { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';

function GuideForm({ guide, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: null,
    youtube_url: '',
    category: '',
    is_published: true,
    is_featured: false,
    order: 0,
    external_links_data: []
  });

  const [imagePreview, setImagePreview] = useState(null);

  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: ''
  });

  useEffect(() => {
    if (guide) {
      setFormData({
        title: guide.title || '',
        description: guide.description || '',
        content: guide.content || '',
        image: null,
        youtube_url: guide.youtube_url || '',
        category: guide.category || '',
        is_published: guide.is_published !== undefined ? guide.is_published : true,
        is_featured: guide.is_featured || false,
        order: guide.order || 0,
        external_links_data: guide.external_links || []
      });
      if (guide.image) {
        setImagePreview(guide.image);
      }
    }
  }, [guide]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert('Image size must be less than 20MB');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      setFormData(prev => ({
        ...prev,
        external_links_data: [...prev.external_links_data, { ...newLink }]
      }));
      setNewLink({ title: '', url: '', description: '' });
    }
  };

  const handleRemoveLink = (index) => {
    setFormData(prev => ({
      ...prev,
      external_links_data: prev.external_links_data.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="guide-form">
      <div className="form-section">
        <h3>Basic Information</h3>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Guide title"
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <RichTextEditor
            value={formData.description}
            onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
          />
        </div>

        <div className="form-group">
          <label>Content *</label>
          <RichTextEditor
            value={formData.content}
            onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Media</h3>
        <div className="form-group">
          <label htmlFor="image">Image (Max 20MB)</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
          {imagePreview && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '200px' }}
              />
            </div>
          )}
          <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
            Upload an image file (JPG, PNG, etc.). Max size: 20MB.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="youtube_url">YouTube Video URL</label>
          <input
            type="url"
            id="youtube_url"
            name="youtube_url"
            value={formData.youtube_url}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
            Paste YouTube video URL to embed it in the guide detail page
          </small>
        </div>
      </div>

      <div className="form-section">
        <h3>Organization</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Getting Started"
            />
          </div>

          <div className="form-group">
            <label htmlFor="order">Order</label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="is_published"
              checked={formData.is_published}
              onChange={handleChange}
            />
            <span>Publish this guide (visible to public)</span>
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
            />
            <span>Feature in Hero Section (only one guide can be featured)</span>
          </label>
        </div>
      </div>

      <div className="form-section">
        <h3>External Links</h3>
        <div className="external-links-list">
          {formData.external_links_data.map((link, index) => (
            <div key={index} className="external-link-item">
              <div className="link-info">
                <strong>{link.title}</strong>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
                {link.description && <p>{link.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveLink(index)}
                className="remove-link-button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="add-link-form">
          <div className="form-group">
            <label htmlFor="link_title">Link Title</label>
            <input
              type="text"
              id="link_title"
              value={newLink.title}
              onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              placeholder="Link title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="link_url">Link URL</label>
            <input
              type="url"
              id="link_url"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          <div className="form-group">
            <label>Link Description</label>
            <RichTextEditor
              value={newLink.description}
              onChange={(html) => setNewLink({ ...newLink, description: html })}
            />
          </div>
          <button
            type="button"
            onClick={handleAddLink}
            className="add-link-button"
            disabled={!newLink.title || !newLink.url}
          >
            + Add Link
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-button">
          Cancel
        </button>
        <button type="submit" className="save-button" disabled={loading}>
          {loading ? 'Saving...' : 'Save Guide'}
        </button>
      </div>
    </form>
  );
}

export default GuideForm;