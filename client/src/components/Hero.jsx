import React, { useState, useRef, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { IconCheck } from './Icons';

export const Hero = ({ onOpenOrderModal, onExploreChannels }) => {
  const { content } = useContent();
  const heroData = content?.hero || {};

  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const videoUrl = heroData.videoUrl || "https://video.wixstatic.com/video/efc10d_86cfb8f22c6e4f2ebcfef8215df8b72e/1080p/mp4/file.mp4";

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Handled silently for browser autoplay restrictions
      });
    }
  }, [videoUrl]);

  return (
    <AdminEditWrapper sectionKey="hero" sectionTitle="Section Hero">
      <section className="hero-section">
        {/* Ambient background glows */}
        <div className="hero-glow-blob blob-yellow"></div>
        <div className="hero-glow-blob blob-purple"></div>
        <div className="hero-glow-blob blob-pink"></div>
        <div className="hero-glow-blob blob-blue"></div>

        <div className="hero-container">
          {/* Left Column: Content */}
          <div className="hero-left-content">
            {/* Dual Offer Badges */}
            <div className="hero-badges-row">
              <span className="badge-pill badge-special-offer">
                {heroData.badgeOffer || 'Special Offer'}
              </span>
              <span className="badge-pill badge-discount">
                {heroData.badgeDiscount || '62% OFF'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
              {heroData.titlePrefix || 'Best IPTV Service with'}{' '}
              <span className="highlight-channels">{heroData.titleChannels || '19,000+ Channels'}</span>{' '}
              {heroData.titleMiddle || 'and'}{' '}
              <span className="highlight-vod">{heroData.titleVod || '+56K movies and series'}</span>{' '}
              {heroData.titleSuffix || 'on-demand (VOD) from around the Globe'}
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle">
              {heroData.subtitle || 'Watch your favorite channels, latest movies, and TV series in high quality without interruption'}
            </p>

            {/* Action CTAs */}
            <div className="hero-cta-group">
              <button 
                type="button" 
                className="btn-hero-subscribe"
                onClick={() => onOpenOrderModal({ plan: '12-months', title: '12 Months IPTV Subscription' })}
              >
                {heroData.btnSubscribe || 'Subscribe Now'}
              </button>
              <a 
                href="#pricing" 
                className="btn-hero-plans"
              >
                {heroData.btnPlans || 'Premium Plans'}
              </a>
            </div>

            {/* Feature Highlights micro-bar */}
            <div className="hero-perks-row">
              <div className="perk-item">
                <span className="perk-icon"><IconCheck size={13} /></span>
                <span>{heroData.perk1 || 'Instant Activation'}</span>
              </div>
              <div className="perk-item">
                <span className="perk-icon"><IconCheck size={13} /></span>
                <span>{heroData.perk2 || 'Anti-Freeze™ 9.0'}</span>
              </div>
              <div className="perk-item">
                <span className="perk-icon"><IconCheck size={13} /></span>
                <span>{heroData.perk3 || '4K / FHD Streams'}</span>
              </div>
              <div className="perk-item">
                <span className="perk-icon"><IconCheck size={13} /></span>
                <span>{heroData.perk4 || '24/7 VIP Support'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Curved Showcase Display Screen */}
          <div className="hero-right-showcase">
            <div className="showcase-screen-frame">
              {/* Top LIVE badge */}
              <div className="live-indicator-badge">
                <span className="live-pulsing-dot"></span>
                <span>{heroData.liveBadge || 'LIVE'}</span>
              </div>

              {/* Curved Screen Perspective Container */}
              <div className="curved-screen-wrapper">
                <div className="curved-screen-inner">
                  <video
                    ref={videoRef}
                    key={videoUrl}
                    src={videoUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    className="showcase-video-element"
                  />
                  {/* Subtle glass reflection overlay */}
                  <div className="screen-glass-glare"></div>

                  {/* Audio Mute/Unmute toggle */}
                  <button 
                    type="button" 
                    className="showcase-sound-btn"
                    onClick={toggleSound}
                    title={isMuted ? "Activer le son" : "Couper le son"}
                    aria-label={isMuted ? "Activer le son" : "Couper le son"}
                  >
                    {isMuted ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <line x1="23" y1="9" x2="17" y2="15"/>
                        <line x1="17" y1="9" x2="23" y2="15"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Live Stats Bar on the Device */}
              <div className="showcase-bottom-bar">
                <div className="live-stat-item">
                  <span className="stat-indicator green-pulse"></span>
                  <span className="stat-label">{heroData.liveViewersText || '14,890+ Active Viewers Now'}</span>
                </div>
                <div className="live-stat-item">
                  <span className="stat-indicator blue-pulse"></span>
                  <span className="stat-label">{heroData.uptimeText || '99.9% Zero Buffering Uptime'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminEditWrapper>
  );
};
