import { Link } from 'react-router-dom';

function GuideCard({ guide }) {
  return (
    <article className="guide-card">
      <div className="guide-card-header">
        {guide.category && (
          <span className="guide-category">{guide.category}</span>
        )}
      </div>
      
      <Link to={`/guide/${guide.id}`} className="guide-link-wrap">
        <h2 className="guide-title">{guide.title}</h2>
      </Link>
      
      <p className="guide-description">{guide.description}</p>
      
      <div className="guide-footer">
        <span className="guide-links-count">{guide.link_count} {guide.link_count === 1 ? 'link' : 'links'}</span>
        <Link to={`/guide/${guide.id}`} className="read-more">
          Read more →
        </Link>
      </div>
    </article>
  );
}

export default GuideCard;
