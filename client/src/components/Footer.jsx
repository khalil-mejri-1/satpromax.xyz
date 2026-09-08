import React from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { IconTv, IconShieldCheck, IconZap, IconStar, IconHeadphones } from './Icons';

export const Footer = ({ onOpenOrderModal, onOpenChannelExplorer }) => {
  const { content, isAdmin, openAdminLogin } = useContent();
  const footerData = content?.footer || {};

  return (
    <AdminEditWrapper sectionKey="footer" sectionTitle="الفوتر وحقوق النشر (Footer)">
      <footer className="site-footer">
        <div className="footer-top-glow"></div>
        <div className="footer-container">
          <div className="footer-grid">
            {/* Col 1: Brand & Bio */}
            <div className="footer-brand-col">
              <a href="#" className="footer-logo-link" aria-label="SatProMax Home">
                <img src="/satpromax-logo.png" alt="SatProMax Logo" className="site-footer-logo-img" />
              </a>
              <p className="footer-brand-desc">
                {footerData.brandDesc || "The world's leading premium IPTV provider delivering 19,000+ live HD/4K TV channels and 56,000+ VOD movies & series with zero freezing and 99.9% guaranteed server uptime."}
              </p>
              <div className="footer-trust-rating">
                <div className="stars-row">
                  {[...Array(5)].map((_, i) => (
                    <IconStar key={i} size={15} className="star-gold" />
                  ))}
                </div>
                <span className="rating-text">{footerData.ratingText || '4.9 / 5 Rated by 14,800+ Global Customers'}</span>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="footer-nav-col">
              <h4 className="footer-col-title">{footerData.navColTitle || 'Navigation'}</h4>
              <ul className="footer-links-list">
                <li><a href="#pricing">{footerData.navPricing || 'Pricing Plans'}</a></li>
                <li><a href="#channels">{footerData.navChannels || 'Live Channels List'}</a></li>
                <li><a href="#vod">{footerData.navVod || 'Movies & TV Series VOD'}</a></li>
                <li><a href="#devices">{footerData.navDevices || 'Supported Devices'}</a></li>
                <li><a href="#install">{footerData.navInstall || 'Installation Guides'}</a></li>
                <li><a href="#contact">{footerData.navContact || 'Contact & FAQ'}</a></li>
              </ul>
            </div>

            {/* Col 3: Popular Channels & Sports */}
            <div className="footer-nav-col">
              <h4 className="footer-col-title">{footerData.packagesColTitle || 'Top Packages'}</h4>
              <ul className="footer-links-list">
                <li><a href="#channels" onClick={onOpenChannelExplorer}>{footerData.pkgBein || 'beIN Sports & UEFA Pass'}</a></li>
                <li><a href="#channels" onClick={onOpenChannelExplorer}>{footerData.pkgUsaUk || 'USA & UK Entertainment'}</a></li>
                <li><a href="#channels" onClick={onOpenChannelExplorer}>{footerData.pkgCinema || '4K Cinema & HBO VOD'}</a></li>
                <li><a href="#channels" onClick={onOpenChannelExplorer}>{footerData.pkgPpv || 'PPV Boxing & UFC Events'}</a></li>
                <li><a href="#channels" onClick={onOpenChannelExplorer}>{footerData.pkgArabic || 'Arabic & European Feeds'}</a></li>
                <li><a href="#channels" onClick={onOpenChannelExplorer}>{footerData.pkgKids || 'Kids & Family Channels'}</a></li>
              </ul>
            </div>

            {/* Col 4: Safe Payment & Guarantee */}
            <div className="footer-nav-col">
              <h4 className="footer-col-title">{footerData.secureColTitle || 'Guaranteed & Secure'}</h4>
              <div className="guarantee-box-mini">
                <div className="g-icon">🛡️</div>
                <div>
                  <strong>{footerData.guaranteeTitle || '7-Day Money Back Guarantee'}</strong>
                  <p>{footerData.guaranteeDesc || '100% risk-free trial with instant money-back protection.'}</p>
                </div>
              </div>

              <div className="payment-badges-row">
                <span className="pay-badge">VISA</span>
                <span className="pay-badge">Mastercard</span>
                <span className="pay-badge">PayPal</span>
                <span className="pay-badge">Bitcoin / USDT</span>
                <span className="pay-badge">Apple Pay</span>
              </div>
            </div>
          </div>

          {/* Bottom copyright line */}
          <div className="footer-bottom-bar">
            <p className="copyright-text">
              {footerData.copyrightText || `© ${new Date().getFullYear()} SatProMax. All rights reserved. Premium IPTV & VOD Streaming Service.`}
            </p>
            <div className="footer-legal-links">
              <a href="#terms">{footerData.termsLink || 'Terms of Service'}</a>
              <span className="dot-divider">•</span>
              <a href="#privacy">{footerData.privacyLink || 'Privacy Policy'}</a>
              <span className="dot-divider">•</span>
              <a href="#refund">{footerData.refundLink || 'Refund Policy'}</a>
              <span className="dot-divider">•</span>
              <button 
                type="button" 
                className="btn-admin-portal-link"
                onClick={openAdminLogin}
                title={isAdmin ? (footerData.adminActiveBtn || 'Admin Mode Active') : (footerData.adminBtn || 'Admin Portal')}
              >
                👑 {isAdmin ? (footerData.adminActiveBtn || 'Admin Mode Active') : (footerData.adminBtn || 'Admin Portal (/admin/)')}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </AdminEditWrapper>
  );
};
