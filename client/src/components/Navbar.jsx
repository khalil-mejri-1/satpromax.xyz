import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { IconTv, IconTag, IconMonitor, IconHeadphones, IconChevronDown, IconPlay, IconMenu, IconClose, IconDownload, IconGlobe } from './Icons';
import { LanguageIconsModal } from './LanguageIconsModal';

export const Navbar = ({ onOpenOrderModal, onNavigateDashboard, currentRoute, onNavigate }) => {
  const { content, currentLang, setLang, languages: contextLanguages, isAdmin, setActiveEditingSection } = useContent();
  const navData = content?.navbar || {};

  const [isScrolled, setIsScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);
  const dropdownRef = useRef(null);

  const handleNavClick = (e, route) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(route);
      setMobileMenuOpen(false);
    }
  };

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
        <a 
          href="/" 
          className="nav-logo" 
          aria-label="SatProMax Home"
          onClick={(e) => handleNavClick(e, 'home')}
        >
          <img src="/satpromax-logo.png" alt="SatProMax Logo" className="site-logo-img" />
        </a>

        {/* Desktop Nav Links */}
        <nav className="nav-links-desktop">
          <a 
            href="/pricing" 
            className={`nav-link ${currentRoute === 'pricing' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'pricing')}
          >
            <IconTag size={16} className="nav-link-icon" />
            <span>{navData.linkPricing || 'Pricing'}</span>
          </a>
          <a 
            href="/channels" 
            className={`nav-link ${currentRoute === 'channels' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'channels')}
          >
            <IconTv size={16} className="nav-link-icon" />
            <span>{navData.linkChannels || 'Channels List'}</span>
          </a>
          <a 
            href="/install" 
            className={`nav-link ${currentRoute === 'install' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'install')}
          >
            <IconMonitor size={16} className="nav-link-icon" />
            <span>{navData.linkInstall || 'How To Install'}</span>
          </a>
          <a 
            href="/download-apps" 
            className={`nav-link nav-link-apps-highlight ${currentRoute === 'download-apps' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'download-apps')}
          >
            <IconDownload size={16} className="nav-link-icon" />
            <span>{navData.linkApps || 'Download Apps'}</span>
          </a>
          <a 
            href="/contact" 
            className={`nav-link ${currentRoute === 'contact' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'contact')}
          >
            <IconHeadphones size={16} className="nav-link-icon" />
            <span>{navData.linkContact || 'Contact'}</span>
          </a>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions-desktop">
          {/* Language Selector Dropdown with Globe Logo */}
          <div className="lang-switcher-container" ref={dropdownRef}>
            <button 
              type="button" 
              className="lang-switcher-btn lang-globe-btn"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              aria-label="Select Language / اختيار اللغة"
              title={`Language: ${currentLanguageObj.name}`}
            >
              <IconGlobe size={20} className="lang-globe-icon" />
              <span className="lang-code-tag">{currentLanguageObj.code.toUpperCase()}</span>
              <IconChevronDown size={13} className={`lang-arrow ${langMenuOpen ? 'open' : ''}`} />
            </button>

            {langMenuOpen && (
              <div className="lang-dropdown-menu">
                <div className="lang-dropdown-header">
                  <IconGlobe size={15} className="lang-dropdown-header-icon" />
                  <span>{currentLang === 'ar' ? 'اختر لغة الموقع' : currentLang === 'fr' ? 'Choisir la langue' : 'Select Language'}</span>
                </div>
                <div className="lang-dropdown-items-list">
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
                </div>
                {isAdmin && (
                  <div className="lang-dropdown-footer">
                    <button
                      type="button"
                      className="lang-option lang-option-customize"
                      onClick={() => {
                        setLangMenuOpen(false);
                        setShowIconModal(true);
                      }}
                    >
                      <span>⚙️</span>
                      <span>{currentLang === 'ar' ? 'تخصيص الأيقونات' : currentLang === 'fr' ? 'Changer les icônes' : 'Customize Icons'}</span>
                    </button>
                  </div>
                )}
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

      {/* Floating Admin Edit Button for Navbar (Pinned to far edge of the entire page) */}
      {isAdmin && (
        <div className="navbar-admin-floating-badge">
          <button 
            type="button" 
            className="btn-trigger-section-edit navbar-admin-edit-btn"
            onClick={() => setActiveEditingSection({ key: 'navbar', title: 'En-tête (Navbar)' })}
            title="Modifier les boutons, le logo et les liens de la Navbar"
          >
            <span className="edit-icon">✏️</span>
            <span>Modifier Navbar</span>
          </button>
        </div>
      )}

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

          <a 
            href="/pricing" 
            className={`mobile-nav-link ${currentRoute === 'pricing' ? 'active' : ''}`} 
            onClick={(e) => handleNavClick(e, 'pricing')}
          >
            <IconTag size={18} />
            <span>{navData.linkPricing || 'Pricing'}</span>
          </a>
          <a 
            href="/channels" 
            className={`mobile-nav-link ${currentRoute === 'channels' ? 'active' : ''}`} 
            onClick={(e) => handleNavClick(e, 'channels')}
          >
            <IconTv size={18} />
            <span>{navData.linkChannels || 'Channels List'}</span>
          </a>
          <a 
            href="/install" 
            className={`mobile-nav-link ${currentRoute === 'install' ? 'active' : ''}`} 
            onClick={(e) => handleNavClick(e, 'install')}
          >
            <IconMonitor size={18} />
            <span>{navData.linkInstall || 'How To Install'}</span>
          </a>
          <a 
            href="/download-apps" 
            className={`mobile-nav-link ${currentRoute === 'download-apps' ? 'active' : ''}`} 
            onClick={(e) => handleNavClick(e, 'download-apps')}
          >
            <IconDownload size={18} />
            <span>{navData.linkApps || 'Download Apps'}</span>
          </a>
          <a 
            href="/contact" 
            className={`mobile-nav-link ${currentRoute === 'contact' ? 'active' : ''}`} 
            onClick={(e) => handleNavClick(e, 'contact')}
          >
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
              {isAdmin && (
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
              )}
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
