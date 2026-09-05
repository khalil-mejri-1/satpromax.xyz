import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { IconPlayCircle, IconCheck, IconTv, IconZap, IconShieldCheck, IconSparkles } from './Icons';

export const Hero = ({ onOpenOrderModal, onExploreChannels }) => {
  const { content } = useContent();
  const heroData = content?.hero || {};

  const [activeSlide, setActiveSlide] = useState(0);

  const heroShowcaseImages = [
    {
      id: 1,
      title: heroData.showcaseCards?.[0]?.title || "The Most Dangerous Animal",
      category: heroData.showcaseCards?.[0]?.subtitle || "True Crime Series",
      badge: heroData.showcaseCards?.[0]?.quality || "4K HDR",
      gradient: "linear-gradient(135deg, #1f1c2c, #928DAB)",
      cover: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      title: heroData.showcaseCards?.[1]?.title || "FBI: Special Operations",
      category: heroData.showcaseCards?.[1]?.subtitle || "Action / Drama",
      badge: heroData.showcaseCards?.[1]?.quality || "LIVE NOW",
      gradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      cover: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      title: heroData.showcaseCards?.[2]?.title || "The Good Place",
      category: heroData.showcaseCards?.[2]?.subtitle || "Comedy / Fantasy",
      badge: heroData.showcaseCards?.[2]?.quality || "Full Season",
      gradient: "linear-gradient(135deg, #ff9966, #ff5e62)",
      cover: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: 4,
      title: heroData.showcaseCards?.[3]?.title || "UEFA Champions League",
      category: heroData.showcaseCards?.[3]?.subtitle || "Sports Live HD",
      badge: heroData.showcaseCards?.[3]?.quality || "60 FPS 4K",
      gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
      cover: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=80",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroShowcaseImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroShowcaseImages.length]);

  return (
    <AdminEditWrapper sectionKey="hero" sectionTitle="Section Hero">
      <section className="hero-section">
        {/* Ambient background glows */}
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
                  {/* 3D Visual Cards Track */}
                  <div className="curved-cards-track">
                    {/* Card 1: The Most Dangerous Animal */}
                    <div className="curved-channel-card card-dangerous">
                      <div className="card-overlay">
                        <div className="card-top-info">
                          <span className="channel-tag">{heroData.showcaseCards?.[0]?.tag || 'DOCU'}</span>
                          <span className="quality-tag">{heroData.showcaseCards?.[0]?.quality || 'FHD'}</span>
                        </div>
                        <div className="card-bottom-info">
                          <h4>{heroData.showcaseCards?.[0]?.title || 'The Most Dangerous Animal'}</h4>
                          <p>{heroData.showcaseCards?.[0]?.subtitle || 'Stream Episode 1'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: FBI Special Ops */}
                    <div className="curved-channel-card card-fbi">
                      <div className="card-overlay">
                        <div className="card-top-info">
                          <span className="channel-tag">{heroData.showcaseCards?.[1]?.tag || 'SERIES'}</span>
                          <span className="quality-tag">{heroData.showcaseCards?.[1]?.quality || '4K'}</span>
                        </div>
                        <div className="card-bottom-info">
                          <h4>{heroData.showcaseCards?.[1]?.title || 'FBI'}</h4>
                          <p>{heroData.showcaseCards?.[1]?.subtitle || 'Season 6 Live'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: The Good Place */}
                    <div className="curved-channel-card card-goodplace">
                      <div className="card-overlay">
                        <div className="card-top-info">
                          <span className="channel-tag">{heroData.showcaseCards?.[2]?.tag || 'COMEDY'}</span>
                          <span className="quality-tag">{heroData.showcaseCards?.[2]?.quality || '1080p'}</span>
                        </div>
                        <div className="card-bottom-info">
                          <h4>{heroData.showcaseCards?.[2]?.title || 'The Good Place'}</h4>
                          <p>{heroData.showcaseCards?.[2]?.subtitle || 'All Episodes VOD'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Live Sports */}
                    <div className="curved-channel-card card-sports">
                      <div className="card-overlay">
                        <div className="card-top-info">
                          <span className="channel-tag tag-sports">{heroData.showcaseCards?.[3]?.tag || 'sling'}</span>
                          <span className="quality-tag">{heroData.showcaseCards?.[3]?.quality || '60FPS'}</span>
                        </div>
                        <div className="card-bottom-info">
                          <h4>{heroData.showcaseCards?.[3]?.title || 'Live Sports PPV'}</h4>
                          <p>{heroData.showcaseCards?.[3]?.subtitle || 'Real-Time Broadcast'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
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
