import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { guidesAPI } from '../api';
import Navbar from '../components/Navbar';

function GuideDetail() {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGuide();
  }, [id]);

  const fetchGuide = async () => {
    try {
      setLoading(true);
      const response = await guidesAPI.getById(id);
      setGuide(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load guide. It may not exist or has been removed.');
    } finally {
      setLoading(false);
    }
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading guide...</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !guide) {
    return (
      <>
        <Navbar />
        <main className="main-content">
          <Link to="/" className="back-link">← Back to Guides</Link>
          <div className="error-container"><p>{error || 'Guide not found'}</p></div>
        </main>
      </>
    );
  }

  const youtubeId = extractYouTubeId(guide.youtube_url);
  const hasInvalidVideoUrl = guide.youtube_url && !youtubeId;

  return (
    <>
      <Navbar />

      <main className="main-content">
        <article className="guide-detail">

          {/* ── Header: title + back button ── */}
          <header className="guide-detail-header">
            <h1 className="guide-detail-title">{guide.title}</h1>
            <Link to="/" className="back-link">← Back to Guides</Link>
          </header>

          {/* ── YouTube Video Player ── */}
          {youtubeId ? (
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '10px',
                backgroundColor: '#000',
                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              }}>
                <iframe
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%', border: 0,
                  }}
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={guide.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          ) : hasInvalidVideoUrl ? (
            <div style={{
              marginBottom: '2rem', padding: '1rem 1.25rem',
              background: '#fff8e1', border: '1px solid #f5c842',
              borderRadius: '8px', color: '#7a5c00', fontSize: '0.9rem',
            }}>
              <strong>Video not embeddable:</strong> The YouTube URL saved for this guide is a search link, not a video link. Go to the edit page and paste a direct video URL — e.g. <code>https://www.youtube.com/watch?v=VIDEO_ID</code>
            </div>
          ) : null}

          <div className="guide-detail-content">

            {/* ── Description ── */}
            {guide.description && (
              <div className="content-section">
                <h2>About This Guide</h2>
                <div
                  className="guide-text rich-content"
                  dangerouslySetInnerHTML={{ __html: guide.description }}
                />
              </div>
            )}

            {/* ── Main content ── */}
            {guide.content && (
              <div className="content-section">
                <h2>Guide Content</h2>
                <div
                  className="guide-text rich-content"
                  dangerouslySetInnerHTML={{ __html: guide.content }}
                />
              </div>
            )}

            {/* ── External links ── */}
            {guide.external_links && guide.external_links.length > 0 && (
              <div className="content-section">
                <h2>Useful Links</h2>
                <div className="external-links">
                  {guide.external_links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link-card"
                    >
                      <div className="link-header">
                        <h3>{link.title}</h3>
                        <span className="external-icon">↗</span>
                      </div>
                      {link.description && (
                        <div className="link-description rich-content" dangerouslySetInnerHTML={{ __html: link.description }} />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>
        </article>
      </main>
    </>
  );
}

export default GuideDetail;
