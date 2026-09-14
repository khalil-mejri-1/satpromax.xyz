import React from 'react';

export const PageHeaderBanner = ({ 
  badge = 'SatProMax Premium', 
  title, 
  subtitle, 
  breadcrumbs = [],
  highlights = [],
  onNavigate
}) => {
  return (
    <section className="page-header-banner-section">
      <div className="banner-glow-bg"></div>
      <div className="banner-grid-overlay"></div>

      <div className="page-banner-container">
        {/* Breadcrumb Navigation */}
        <nav className="page-banner-breadcrumbs" aria-label="Breadcrumb">
          <button 
            type="button" 
            className="breadcrumb-link-btn"
            onClick={() => onNavigate && onNavigate('home')}
          >
            Accueil
          </button>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span className="breadcrumb-separator">/</span>
              {crumb.route ? (
                <button 
                  type="button" 
                  className="breadcrumb-link-btn"
                  onClick={() => onNavigate && onNavigate(crumb.route)}
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="breadcrumb-current-text">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Badge */}
        {badge && (
          <div className="page-banner-badge">
            <span className="badge-sparkle">✨</span>
            <span className="badge-text">{badge}</span>
          </div>
        )}

        {/* Main H1 Title */}
        <h1 className="page-banner-title">
          {title}
        </h1>

        {/* Subtitle / Description */}
        {subtitle && (
          <p className="page-banner-subtitle">
            {subtitle}
          </p>
        )}

        {/* Highlight Perks Strip */}
        {highlights && highlights.length > 0 && (
          <div className="page-banner-highlights-row">
            {highlights.map((item, idx) => (
              <div key={idx} className="page-banner-highlight-item">
                <span className="highlight-check-icon">✓</span>
                <span className="highlight-text">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
