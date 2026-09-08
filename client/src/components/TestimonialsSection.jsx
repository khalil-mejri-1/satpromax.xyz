import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { IconChevronLeft, IconChevronRight } from './Icons';

export const TestimonialsSection = () => {
  const { content } = useContent();
  const testimonialsData = content?.testimonials || {};

  const items = (testimonialsData.defaultItems && testimonialsData.defaultItems.length > 0)
    ? testimonialsData.defaultItems
    : (testimonialsData.items && testimonialsData.items.length > 0
      ? testimonialsData.items
      : [
        {
          id: 1,
          name: "Barbara Schaden",
          location: "United States",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
          rating: 5,
          text: "Best IPTV service I've ever used. The channel selection is huge and the streaming quality is excellent. Very satisfied customer!",
        },
        {
          id: 2,
          name: "Zelma Luettgen",
          location: "Canada",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
          rating: 5,
          text: "The VOD collection is massive and always updated with the latest content. Their customer service team is very responsive and helpful.",
        },
        {
          id: 3,
          name: "Adolf Turner",
          location: "United Kingdom",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          rating: 5,
          text: "Absolutely amazing service! The quality is outstanding and customer support is always helpful. I've been using it for 6 months now without any issues.",
        },
        {
          id: 4,
          name: "Marc Fontaine",
          location: "France",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          rating: 5,
          text: "Excellente qualité 4K sans aucune coupure pendant les matchs de Champions League ! Support WhatsApp ultra rapide.",
        },
        {
          id: 5,
          name: "David Miller",
          location: "Australia",
          avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
          rating: 5,
          text: "Switching to this IPTV was the best decision. Setup took less than 2 minutes on my FireStick. Highly recommended!",
        },
      ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play coverflow slider
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, items.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <AdminEditWrapper sectionKey="testimonials" sectionTitle="آراء العملاء (What Our Customers Say)">
      <section className="testimonials-coverflow-section" id="reviews">
        <div className="testimonials-coverflow-container">
          
          {/* Section Header matching Image 1 */}
          <div className="section-header-center">
            <h2 className="section-main-title testimonials-main-title">
              {testimonialsData.titlePrefix || 'What Our'}{' '}
              <span className="highlight-text-pink-gradient">
                {testimonialsData.titleHighlight || 'Customers'}
              </span>{' '}
              <span className="highlight-text-cyan-gradient">
                {testimonialsData.titleSuffix || 'Say'}
              </span>
            </h2>
            <p className="section-sub-desc testimonials-sub-desc">
              {testimonialsData.subtitle || "Don't just take our word for it - check out what our satisfied customers have to say"}
            </p>
          </div>

          {/* 3D Coverflow Carousel Area */}
          <div 
            className="testimonials-carousel-stage"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Navigation Arrows */}
            <button 
              type="button"
              className="carousel-nav-btn btn-prev" 
              onClick={handlePrev}
              aria-label="Previous review"
            >
              <IconChevronLeft size={20} />
            </button>
            <button 
              type="button"
              className="carousel-nav-btn btn-next" 
              onClick={handleNext}
              aria-label="Next review"
            >
              <IconChevronRight size={20} />
            </button>

            {/* Cards Track */}
            <div className="testimonials-cards-viewport">
              {items.map((item, idx) => {
                let offset = idx - activeIndex;
                const count = items.length;
                if (offset > count / 2) offset -= count;
                if (offset < -count / 2) offset += count;

                // Determine position classes
                let posClass = 'card-hidden';
                if (offset === 0) posClass = 'card-active';
                else if (offset === 1) posClass = 'card-next-1';
                else if (offset === -1) posClass = 'card-prev-1';
                else if (offset === 2) posClass = 'card-next-2';
                else if (offset === -2) posClass = 'card-prev-2';

                return (
                  <div
                    key={item.id || idx}
                    className={`testimonial-coverflow-card ${posClass}`}
                    onClick={() => setActiveIndex(idx)}
                  >
                    {/* Five Gold Stars */}
                    <div className="testimonial-stars-bar">
                      {[...Array(Number(item.rating) || 5)].map((_, starIdx) => (
                        <span key={starIdx} className="testimonial-star-gold">★</span>
                      ))}
                    </div>

                    {/* Review Quote Text */}
                    <p className="testimonial-card-quote">
                      "{item.text}"
                    </p>

                    {/* Author Info */}
                    <div className="testimonial-author-row">
                      <div className="testimonial-avatar-box">
                        <img
                          src={item.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'User')}&background=1e293b&color=fff`}
                          alt={item.name}
                          className="testimonial-avatar-image"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'User')}&background=1e293b&color=fff`;
                          }}
                        />
                      </div>
                      <div className="testimonial-author-meta">
                        <h4 className="testimonial-author-name">{item.name}</h4>
                        <span className="testimonial-author-country">{item.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dots Pagination */}
            <div className="testimonials-dots-indicator">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`testimonial-dot ${idx === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>
    </AdminEditWrapper>
  );
};
