import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { IconTv, IconTag, IconMonitor, IconHeadphones, IconChevronDown, IconPlay, IconMenu, IconClose } from './Icons';

export const Navbar = ({ onOpenOrderModal, currentLang, setLang, currentCurrency, setCurrency }) => {
  const { content, isAdmin, setActiveEditingSection } = useContent();
  const navData = content?.navbar || {};

  const [isScrolled, setIsScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const currentLanguageObj = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <a href="#" className="nav-logo" aria-label="IPPLAY TV Home">
          <div className="logo-icon-wrapper">
            <span className="logo-text-ip">{navData.logoIp || 'IP'}</span>
            <div className="logo-tv-box">
              <span className="logo-antenna"></span>
              <IconTv size={22} className="logo-tv-svg" />
            </div>
            <span className="logo-text-tv">{navData.logoTv || 'TV'}</span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="nav-links-desktop">
          <a href="#pricing" className="nav-link">
            <IconTag size={16} className="nav-link-icon" />
            <span>{navData.linkPricing || 'Pricing'}</span>
          </a>
          <a href="#channels" className="nav-link">
            <IconTv size={16} className="nav-link-icon" />
            <span>{navData.linkChannels || 'Channels List'}</span>
          </a>
          <a href="#install" className="nav-link">
            <IconMonitor size={16} className="nav-link-icon" />
            <span>{navData.linkInstall || 'How To Install'}</span>
          </a>
          <a href="#footer" className="nav-link">
            <IconHeadphones size={16} className="nav-link-icon" />
            <span>{navData.linkContact || 'Contact'}</span>
          </a>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions-desktop">
          {/* Admin Edit Button for Navbar */}
          {isAdmin && (
            <button 
              type="button" 
              className="btn-trigger-section-edit navbar-admin-edit-btn"
              onClick={() => setActiveEditingSection({ key: 'navbar', title: 'En-tête (Navbar)' })}
              title="Modifier les boutons, le logo et les liens de la Navbar"
            >
              <span className="edit-icon">✏️</span>
              <span>Modifier Navbar</span>
            </button>
          )}



          {/* GET STARTED CTA */}
          <button 
            type="button" 
            className="btn-get-started"
            onClick={() => onOpenOrderModal({ plan: '12-months', title: '12 Months Plan' })}
          >
            <span className="play-icon-circle">
              <IconPlay size={11} />
            </span>
            <span>{navData.btnGetStarted || 'GET STARTED'}</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          type="button" 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <IconClose size={24} /> : <IconMenu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-slide-down">
          {isAdmin && (
            <button 
              type="button" 
              className="btn-trigger-section-edit mobile-w-full"
              style={{ justifyContent: 'center', marginBottom: '14px', width: '100%' }}
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveEditingSection({ key: 'navbar', title: 'En-tête (Navbar)' });
              }}
            >
              <span className="edit-icon">✏️</span>
              <span>Modifier Navbar</span>
            </button>
          )}

          <a href="#pricing" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            <IconTag size={18} />
            <span>{navData.linkPricing || 'Pricing'}</span>
          </a>
          <a href="#channels" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            <IconTv size={18} />
            <span>{navData.linkChannels || 'Channels List'}</span>
          </a>
          <a href="#install" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            <IconMonitor size={18} />
            <span>{navData.linkInstall || 'How To Install'}</span>
          </a>
          <a href="#footer" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            <IconHeadphones size={18} />
            <span>{navData.linkContact || 'Contact'}</span>
          </a>

          <div className="mobile-drawer-footer">
            <div className="mobile-lang-row">
            
            </div>

            <button 
              type="button" 
              className="btn-get-started mobile-w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderModal({ plan: '12-months', title: '12 Months Plan' });
              }}
            >
              <span className="play-icon-circle">
                <IconPlay size={11} />
              </span>
              <span>{navData.btnGetStarted || 'GET STARTED'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
