import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { IconTv, IconTag, IconMonitor, IconHeadphones, IconChevronDown, IconPlay, IconMenu, IconClose, IconDownload } from './Icons';
import { LanguageIconsModal } from './LanguageIconsModal';

export const Navbar = ({ onOpenOrderModal }) => {
  const { content, currentLang, setLang, languages: contextLanguages, isAdmin, setActiveEditingSection } = useContent();
  const navData = content?.navbar || {};

  const [isScrolled, setIsScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = contextLanguages && contextLanguages.length > 0 ? contextLanguages : [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  const currentLanguageObj = languages.find(l => l.code === currentLang) || languages[0] || { code: 'en', name: 'English', flag: '🇬🇧' };

  const renderLangIcon = (langObj) => {
    if (langObj.icon) {
      return <img src={langObj.icon} alt={langObj.name} className="lang-custom-icon" />;
    }
    return <span className="lang-flag">{langObj.flag}</span>;
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <a href="#" className="nav-logo" aria-label="SatProMax Home">
          <img src="/satpromax-logo.png" alt="SatProMax Logo" className="site-logo-img" />
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
          <a href="/download-apps" target="_blank" rel="noopener noreferrer" className="nav-link nav-link-apps-highlight">
            <IconDownload size={16} className="nav-link-icon" />
            <span>{navData.linkApps || 'Download Apps'}</span>
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

          {/* Language Selector Dropdown */}
          <div className="lang-switcher-container" ref={dropdownRef}>
            <button 
              type="button" 
              className="lang-switcher-btn"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              aria-label="Select Language"
            >
              {renderLangIcon(currentLanguageObj)}
              <span className="lang-name">{currentLanguageObj.name}</span>
              <IconChevronDown size={14} className={`lang-arrow ${langMenuOpen ? 'open' : ''}`} />
            </button>

            {langMenuOpen && (
              <div className="lang-dropdown-menu">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    className={`lang-option ${currentLang === l.code ? 'active' : ''}`}
                    onClick={() => {
                      setLang(l.code);
                      setLangMenuOpen(false);
                    }}
                  >
                    {renderLangIcon(l)}
                    <span className="lang-label">{l.name}</span>
                    {currentLang === l.code && <span className="lang-active-dot">•</span>}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '6px', paddingTop: '6px' }}>
                  <button
                    type="button"
                    className="lang-option"
                    style={{ fontSize: '0.8rem', color: '#fbbf24', justifyContent: 'center', gap: '6px' }}
                    onClick={() => {
                      setLangMenuOpen(false);
                      setShowIconModal(true);
                    }}
                  >
                    <span>⚙️</span>
                    <span>{currentLang === 'ar' ? 'تخصيص الأيقونات' : currentLang === 'fr' ? 'Changer les icônes' : 'Customize Icons'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

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
          <a href="/download-apps" target="_blank" rel="noopener noreferrer" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            <IconDownload size={18} />
            <span>{navData.linkApps || 'Download Apps'}</span>
          </a>
          <a href="#footer" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            <IconHeadphones size={18} />
            <span>{navData.linkContact || 'Contact'}</span>
          </a>

          <div className="mobile-drawer-footer">
            <div className="mobile-lang-row">
              <span className="mobile-lang-title">Language / اللغة:</span>
              <div className="mobile-lang-buttons">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    className={`mobile-lang-btn ${currentLang === l.code ? 'active' : ''}`}
                    onClick={() => setLang(l.code)}
                  >
                    {renderLangIcon(l)}
                    <span className="mobile-lang-name">{l.name}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="mobile-lang-btn"
                style={{ marginTop: '8px', width: '100%', justifyContent: 'center', color: '#fbbf24', borderColor: 'rgba(251,191,36,0.3)' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowIconModal(true);
                }}
              >
                <span>⚙️</span>
                <span>{currentLang === 'ar' ? 'تخصيص أيقونات اللغات' : currentLang === 'fr' ? 'Changer les icônes' : 'Customize Icons'}</span>
              </button>
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

      {/* Language Customization Modal */}
      <LanguageIconsModal 
        isOpen={showIconModal} 
        onClose={() => setShowIconModal(false)} 
      />
    </header>
  );
};
