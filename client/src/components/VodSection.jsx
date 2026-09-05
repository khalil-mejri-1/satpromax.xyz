import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { IconPlayCircle, IconStar, IconFilm, IconSparkles } from './Icons';

export const VodSection = ({ onOpenVodPlayer, onOpenOrderModal }) => {
  const { content } = useContent();
  const vodData = content?.vod || {};

  const [selectedCategory, setSelectedCategory] = useState('All');

  const defaultCovers = [
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80",
  ];

  const vodItems = (vodData.items || []).map((item, idx) => ({
    ...item,
    cover: item.cover || defaultCovers[idx % defaultCovers.length],
    platformLogo: item.platform === 'NETFLIX' ? 'N' : item.platform === 'HBO MAX' ? 'HBO' : 'VOD',
    badge: item.badge || item.genre || 'TRENDING',
  }));

  const platforms = [
    { name: "All VOD", count: "56,000+" },
    { name: "Netflix", count: "14,500+" },
    { name: "HBO Max", count: "8,900+" },
    { name: "Prime Video", count: "12,200+" },
    { name: "Disney+", count: "6,400+" },
    { name: "Apple TV+", count: "3,800+" },
  ];

  return (
    <AdminEditWrapper sectionKey="vod" sectionTitle="مكتبة الأفلام والمسلسلات VOD (VOD Section)">
      <section id="vod" className="vod-section">
        <div className="vod-container">
          {/* Section Title */}
          <div className="section-header-center">
            <h2 className="section-main-title vod-headline">
              {vodData.titlePrefix || 'Watch The Latest'}{' '}
              <span className="highlight-vod-gradient">{vodData.titleHighlight || 'Series & Movies'}</span>{' '}
              {vodData.titleSuffix || 'with VOD on IPTV'}
            </h2>
            <p className="vod-description-text">
              {vodData.description || 'We have a vast list of vod (series & movies) updated monthly. You can watch your favorite TV shows and documentaries at any time. All of it is from multiple platforms like Prime, HBO, Netflix, Hulu, Disney, Sling TV, Apple TV, and more.'}
            </p>
          </div>

          {/* Platform tags */}
          <div className="vod-platform-tags-bar">
            {platforms.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className={`vod-platform-chip ${selectedCategory === p.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(p.name)}
              >
                <span>{p.name}</span>
                <span className="platform-count">{p.count}</span>
              </button>
            ))}
          </div>

          {/* Poster Cards Row / Carousel (Matching Image 5) */}
          <div className="vod-posters-showcase-row">
            {vodItems.map((movie) => (
              <div 
                key={movie.id} 
                className="vod-poster-card"
                onClick={() => onOpenVodPlayer(movie)}
              >
                {/* Platform Ribbon Badge */}
                <div className={`vod-platform-badge ${movie.platform.toLowerCase().replace(' ', '-')}`}>
                  {movie.platformLogo}
                </div>

                {/* Poster Image Cover */}
                <div className="vod-poster-cover-box">
                  <img 
                    src={movie.cover} 
                    alt={movie.title} 
                    className="vod-poster-img"
                    loading="lazy" 
                  />

                  {/* Poster Overlay Gradient & Play Button */}
                  <div className="vod-card-hover-overlay">
                    <button type="button" className="btn-poster-play" aria-label={`Play ${movie.title}`}>
                      <IconPlayCircle size={42} />
                    </button>
                    <span className="play-label-text">Watch Preview</span>
                  </div>

                  {/* Top Quality Badge */}
                  <div className="poster-top-badge">
                    <span className="badge-quality">{movie.quality}</span>
                  </div>
                </div>

                {/* Bottom Metadata */}
                <div className="vod-poster-info">
                  <div className="vod-rating-row">
                    <div className="rating-pill">
                      <IconStar size={12} className="star-icon" />
                      <span>{movie.rating}</span>
                    </div>
                    <span className="vod-year-tag">{movie.year}</span>
                  </div>
                  <h4 className="vod-movie-title">{movie.title}</h4>
                  <p className="vod-genre-desc">{movie.genre}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Banner: Request Any Title */}
          <div className="vod-request-banner">
            <div className="vod-banner-text">
              <h4>{vodData.ctaTitle || 'Want to request a movie or series?'}</h4>
              <p>{vodData.ctaDesc || 'Our VOD library updates daily. Request any TV show or cinema release anytime.'}</p>
            </div>
            <button 
              type="button" 
              className="btn-vod-request"
              onClick={() => onOpenOrderModal({ plan: '12-months', title: 'Get Instant VOD Access' })}
            >
              <IconFilm size={18} />
              <span>{vodData.ctaBtn || 'Get Instant VOD Access'}</span>
            </button>
          </div>
        </div>
      </section>
    </AdminEditWrapper>
  );
};
