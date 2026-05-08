import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { guidesAPI, heroSettingsAPI } from '../api';
import Navbar from '../components/Navbar';

function Home() {
  const [featuredGuide, setFeaturedGuide] = useState(null);
  const [guides, setGuides] = useState([]);
  const [heroSettings, setHeroSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedGuide();
    fetchHeroSettings();
    fetchGuides();
  }, []);

  const fetchFeaturedGuide = async () => {
    try {
      const response = await guidesAPI.getFeatured();
      setFeaturedGuide(response.data);
    } catch (err) {
      console.error('Error fetching featured guide:', err);
    }
  };

  const fetchHeroSettings = async () => {
    try {
      const response = await heroSettingsAPI.getSettings();
      setHeroSettings(response.data);
    } catch (err) {
      console.error('Error fetching hero settings:', err);
    }
  };

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await guidesAPI.getAll();
      setGuides(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load guides. Please try again later.');
      console.error('Error fetching guides:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section - Dynamic Featured Guide */}
        <section className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left - Image */}
            <div className="relative bg-gray-200 order-2 lg:order-1 min-h-[600px] lg:min-h-auto">
              {featuredGuide?.image ? (
                <img
                  src={featuredGuide.image}
                  alt={featuredGuide.title}
                  className="w-full h-full object-cover absolute inset-0"
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=800&fit=crop"
                  alt="Default hero image"
                  className="w-full h-full object-cover absolute inset-0"
                />
              )}
            </div>

            {/* Right - Content */}
            <div className="flex flex-col justify-center p-8 lg:p-12 bg-white order-1 lg:order-2 min-h-[600px] lg:min-h-auto">
              <div className="max-w-lg">
                <h2 className="text-xs font-semibold text-gray-600 tracking-widest mb-4 uppercase">
                  {featuredGuide ? 'Featured Guide' : 'Tutorial Guides'}
                </h2>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {featuredGuide?.title || 'Learn Freelancing, Build Online Income, and Create Your Freedom Lifestyle!'}
                </h1>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  {featuredGuide?.description || 'Discover comprehensive guides on freelancing, passive income ideas, and building a sustainable online business—all in one place.'}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 w-full">
                  <Link 
                    to={featuredGuide ? `/guide/${featuredGuide.id}` : '#guides'}
                    className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-base font-semibold text-center transition-colors rounded-lg inline-block no-underline"
                  >
                    {featuredGuide ? 'Read Featured Guide' : 'Explore Guides'}
                  </Link>
                  
                  {/* Show hero button if enabled and configured */}
                  {heroSettings?.button_enabled && heroSettings.button_text && (
                    <a
                      href={heroSettings.button_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base font-semibold text-center transition-colors rounded-lg inline-block no-underline cursor-pointer"
                      style={{ 
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '1.5rem 2rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        fontSize: '1rem',
                        textAlign: 'center',
                        textDecoration: 'none',
                        display: 'inline-block',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                    >
                      {heroSettings.button_text}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guides Section */}
        <section id="guides" className="w-full bg-white py-16 lg:py-24 px-4 lg:px-8">
          <div className="w-full">
            <div className="mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Popular Guides</h2>
              <p className="text-gray-600 text-lg">Start learning with our most helpful tutorial guides</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading guides...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : guides.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No guides available yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {guides.map((guide) => (
                  <Link 
                    key={guide.id} 
                    to={`/guide/${guide.id}`}
                    className="group h-full"
                  >
                    <div className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col cursor-pointer border-0 bg-white rounded-lg">
                      {/* Guide Image */}
                      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                        {guide.image ? (
                          <img
                            src={guide.image}
                            alt={guide.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Guide Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        {guide.category && (
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                            {guide.category}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors line-clamp-2">
                          {guide.title}
                        </h3>
                        <div
                          className="text-gray-600 text-sm leading-relaxed line-clamp-2 flex-grow rich-content"
                          dangerouslySetInnerHTML={{ __html: guide.description }}
                        />
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <span className="text-green-700 font-semibold text-sm hover:text-green-800">
                            Read Guide →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;