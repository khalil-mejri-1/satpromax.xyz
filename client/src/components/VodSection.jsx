import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { IconStar, IconFilm, IconChevronLeft, IconChevronRight, IconPlayCircle } from './Icons';

export const VodSection = ({ onOpenOrderModal }) => {
  const { content } = useContent();
  const vodData = content?.vod || {};

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const isHoveredRef = useRef(false);
  const scrollPosRef = useRef(0);

  // High quality fallback items matching the theme if TMDB is temporarily unavailable
  const fallbackMovies = [
    {
      id: 101,
      title: "Mutiny",
      poster_path: null,
      cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
      rating: "8.4",
      vote_average: 8.4,
      year: "2024",
      genre: "Action / Thriller",
      quality: "4K UHD",
      description: "After his cargo ship is ambushed in international waters, Cole finds himself framed for treason and must fight to clear his name."
    },
    {
      id: 102,
      title: "Toy Story 5",
      poster_path: null,
      cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
      rating: "8.7",
      vote_average: 8.7,
      year: "2025",
      genre: "Animation / Adventure",
      quality: "4K HDR",
      description: "Woody and Buzz Lightyear reunite for their greatest adventure yet in an ever-changing technological landscape."
    },
    {
      id: 103,
      title: "Just Play Dead",
      poster_path: null,
      cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      rating: "8.1",
      vote_average: 8.1,
      year: "2024",
      genre: "Crime / Drama",
      quality: "4K UHD",
      description: "A dangerous game of survival unfolds where staying alive means convincing everyone you are already gone."
    },
    {
      id: 104,
      title: "The Runner",
      poster_path: null,
      cover: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=600&auto=format&fit=crop&q=80",
      rating: "8.3",
      vote_average: 8.3,
      year: "2024",
      genre: "Action / Suspense",
      quality: "4K UHD",
      description: "An operative with only hours to spare races against the clock across Europe to prevent an international crisis."
    },
    {
      id: 105,
      title: "Coyote vs Acme",
      poster_path: null,
      cover: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
      rating: "8.6",
      vote_average: 8.6,
      year: "2024",
      genre: "Comedy / Adventure",
      quality: "4K UHD",
      description: "The cartoon courtroom battle of the century with cutting-edge visual effects and non-stop laughter."
    },
    {
      id: 106,
      title: "L'Odyssée",
      poster_path: null,
      cover: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80",
      rating: "8.9",
      vote_average: 8.9,
      year: "2024",
      genre: "Adventure / Epic",
      quality: "4K UHD",
      description: "A breathtaking cinematic journey capturing the boundless mysteries and majesty of the world's deepest oceans."
    }
  ];

  // Fetch trending movies from TMDB API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.themoviedb.org/3/trending/movie/week?api_key=4d039cadaa42a698f4bb258d94dc4181&language=fr-FR');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setMovies(data.results.slice(0, 10)); // جلب أول 10 أفلام تريند
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const baseMovies = movies.length > 0 ? movies : fallbackMovies;

  // Build duplicated list (3x) for seamless infinite looping
  const displayMovies = baseMovies.length > 0
    ? [...baseMovies, ...baseMovies, ...baseMovies]
    : [];

  // Continuous smooth auto-scrolling loop using requestAnimationFrame (Guaranteed to move automatically)
  useEffect(() => {
    const el = carouselRef.current;
    if (!el || loading || displayMovies.length === 0) return;

    let animId;
    let lastTime = performance.now();
    const speed = 46; // 46 pixels per second: ultra smooth, steady, elegant

    const step = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isHoveredRef.current && el) {
        const oneSetWidth = el.scrollWidth / 3;
        if (oneSetWidth > 0) {
          scrollPosRef.current += speed * delta;
          // When we pass the first set, seamlessly subtract one set width (imperceptible reset)
          if (scrollPosRef.current >= oneSetWidth * 2) {
            scrollPosRef.current -= oneSetWidth;
          }
          el.scrollLeft = scrollPosRef.current;
        }
      } else if (el) {
        // Keep scrollPosRef updated when user manually scrolls or hovers
        scrollPosRef.current = el.scrollLeft;
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [loading, displayMovies.length]);

  // Smooth Carousel manual arrow buttons
  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const el = carouselRef.current;
      const shift = 230 * 2; // 2 cards
      const target = direction === 'left' ? el.scrollLeft - shift : el.scrollLeft + shift;
      el.scrollTo({
        left: target,
        behavior: 'smooth'
      });
      scrollPosRef.current = target;
    }
  };

  // Titles: default to screenshot text, but allow Admin overrides if edited
  const titlePrefix = vodData.titlePrefix && vodData.titlePrefix !== "Watch The Latest" 
    ? vodData.titlePrefix 
    : "Derniers";
  const titleHighlight = vodData.titleHighlight && vodData.titleHighlight !== "Series & Movies" 
    ? vodData.titleHighlight 
    : "Films Ajoutés";
  const titleSuffix = vodData.titleSuffix && vodData.titleSuffix !== "with VOD on IPTV" 
    ? vodData.titleSuffix 
    : "";
  const descriptionText = vodData.description && !vodData.description.startsWith("We have a vast list") 
    ? vodData.description 
    : "Découvrez les nouveautés disponibles sur notre plateforme VOD";

  return (
    <AdminEditWrapper sectionKey="vod" sectionTitle="مكتبة الأفلام والمسلسلات VOD (VOD Section)">
      <section id="vod" className="vod-section">
        <div className="vod-container">
          {/* Section Header (Matching Screenshot) */}
          <div className="section-header-center">
            <h2 className="section-main-title vod-headline">
              <span className="vod-title-white">{titlePrefix}</span>{' '}
              <span className="highlight-vod-purple">{titleHighlight}</span>{' '}
              {titleSuffix && <span className="vod-title-suffix">{titleSuffix}</span>}
            </h2>
            <p className="vod-description-text">
              {descriptionText}
            </p>
          </div>

          {/* Carousel Showcase Container */}
          <div className="vod-carousel-outer">
            {/* Left Nav Arrow */}
            <button 
              type="button" 
              className="vod-arrow-btn left"
              onClick={() => handleScroll('left')}
              aria-label="Previous movies"
            >
              <IconChevronLeft size={22} />
            </button>

            {/* Scrollable Carousel Track with continuous automatic motion */}
            <div 
              className="vod-carousel-track" 
              ref={carouselRef}
              onMouseEnter={() => { isHoveredRef.current = true; }}
              onMouseLeave={() => { 
                isHoveredRef.current = false;
                if (carouselRef.current) scrollPosRef.current = carouselRef.current.scrollLeft;
              }}
              onTouchStart={() => { isHoveredRef.current = true; }}
              onTouchEnd={() => { 
                setTimeout(() => {
                  isHoveredRef.current = false;
                  if (carouselRef.current) scrollPosRef.current = carouselRef.current.scrollLeft;
                }, 1000);
              }}
            >
              {loading ? (
                // Skeletons while loading
                [...Array(6)].map((_, i) => (
                  <div key={i} className="vod-card-skeleton animate-pulse">
                    <div className="skeleton-vod-badge"></div>
                  </div>
                ))
              ) : (
                displayMovies.map((movie, idx) => {
                  const posterSrc = movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                    : (movie.cover || fallbackMovies[0].cover);
                  const ratingVal = movie.vote_average 
                    ? Number(movie.vote_average).toFixed(1) 
                    : (movie.rating || '8.5');
                  const movieYear = movie.release_date 
                    ? movie.release_date.split('-')[0] 
                    : (movie.year || '2025');

                  return (
                    <div 
                      key={`${movie.id}-${idx}`} 
                      className="vod-poster-card-modern"
                      onClick={() => handleMovieClick(movie)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleMovieClick(movie); }}
                    >
                      {/* Top-Right VOD Badge (Matching exact screenshot) */}
                      <div className="vod-badge-top-right">VOD</div>

                      {/* Poster Cover Box */}
                      <div className="vod-poster-box">
                        <img 
                          src={posterSrc} 
                          alt={movie.title || movie.name} 
                          className="vod-poster-img-element"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = fallbackMovies[0].cover;
                          }}
                        />

                        {/* Interactive Dark Gradient & Play Overlay */}
                        <div className="vod-poster-hover-overlay">
                          <button 
                            type="button" 
                            className="btn-vod-play-circle" 
                            aria-label={`Play preview for ${movie.title || movie.name}`}
                          >
                            <IconPlayCircle size={48} />
                          </button>
                          
                          <div className="vod-card-details-overlay">
                            <div className="vod-card-rating-row">
                              <span className="vod-star-pill">
                                <IconStar size={12} className="star-icon" /> {ratingVal}
                              </span>
                              <span className="vod-year-chip">{movieYear}</span>
                            </div>
                            <h4 className="vod-card-title-overlay">{movie.title || movie.name}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Nav Arrow */}
            <button 
              type="button" 
              className="vod-arrow-btn right"
              onClick={() => handleScroll('right')}
              aria-label="Next movies"
            >
              <IconChevronRight size={22} />
            </button>
          </div>

          {/* Bottom Banner: Request Any Title */}
          <div className="vod-request-banner">
            <div className="vod-banner-text">
              <h4>{vodData.ctaTitle || 'Want to request a movie or series?'}</h4>
              <p>{vodData.ctaDesc || 'Our VOD library updates daily with cinema releases and trending shows.'}</p>
            </div>
            <button 
              type="button" 
              className="btn-vod-request"
              onClick={() => onOpenOrderModal && onOpenOrderModal({ plan: '12-months', title: 'Get Instant VOD Access' })}
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
