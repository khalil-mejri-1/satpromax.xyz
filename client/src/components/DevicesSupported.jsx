import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { IconMonitor, IconCheck, IconZap, IconSparkles } from './Icons';

export const DevicesSupported = () => {
  const { content } = useContent();
  const devicesData = content?.devices || {};

  const [activeTab, setActiveTab] = useState(0);

  const defaultCategories = [
    {
      id: "smart-tv",
      title: "Smart TVs",
      brand: "Samsung, LG, Sony, Android TV",
      icon: "📺",
      apps: ["Smart IPTV", "IPTV Smarters Pro", "IBO Player", "SET IPTV", "NET IPTV", "TiviMate"],
      setupTime: "2 Minutes",
      description: "Enjoy ultra-crisp 4K UHD streaming directly on your living room Smart TV without needing extra cables or hardware.",
    },
    {
      id: "firestick",
      title: "Amazon FireStick",
      brand: "Fire TV Stick 4K, Fire TV Cube, Fire Edition TVs",
      icon: "🔥",
      apps: ["TiviMate Premium", "IPTV Smarters Pro", "XCIPTV", "Downloader App", "OTT Navigator"],
      setupTime: "1 Minute",
      description: "The most popular IPTV streaming hardware. Fast channel switching, responsive EPG guide, and smooth 60 FPS playback.",
    },
    {
      id: "android",
      title: "Android TV & Phones",
      brand: "Nvidia Shield, Xiaomi Mi Box, Google TV, Samsung Galaxy",
      icon: "🤖",
      apps: ["TiviMate", "IPTV Smarters", "Televizo", "XCIPTV Player", "VLC for Android"],
      setupTime: "1 Minute",
      description: "Full compatibility with all Android phones, tablets, TV boxes, and smart projectors with automated M3U & Xtream Codes.",
    },
    {
      id: "apple",
      title: "Apple TV & iOS",
      brand: "Apple TV 4K, iPhone 16/15, iPad Pro, MacBook, iMac",
      icon: "🍏",
      apps: ["IPTV Smarters Pro", "GSE Smart IPTV", "Snappier IPTV", "Flex IPTV", "VLC Player"],
      setupTime: "2 Minutes",
      description: "Seamless synchronization across the entire Apple ecosystem with AirPlay support and HDR10/Dolby Vision streaming.",
    },
    {
      id: "mag-box",
      title: "MAG & Formuler",
      brand: "MAG 524, MAG 322, Formuler Z11 Pro, Z10, Amiko",
      icon: "📦",
      apps: ["MYTVOnline 2 / 3", "Stalker Portal", "Ministra Portal", "MAC Portal Activation"],
      setupTime: "Instant Portal",
      description: "Dedicated portal activation for MAG & Formuler set-top boxes with custom MAC address registration.",
    },
    {
      id: "pc-mac",
      title: "PC & Windows / Mac",
      brand: "Windows 11/10, macOS Sequoia/Sonoma, Linux",
      icon: "💻",
      apps: ["VLC Media Player", "IPTV Smarters Windows/Mac", "Kodi 21", "Web Player Browser"],
      setupTime: "Instant",
      description: "Watch live channels and VOD directly on your computer or through our zero-install Web Browser Player.",
    },
  ];

  const deviceCategories = (devicesData.defaultCategories && devicesData.defaultCategories.length > 0)
    ? devicesData.defaultCategories
    : (devicesData.categories && devicesData.categories.length > 0 
      ? devicesData.categories 
      : defaultCategories);

  const currentCategory = deviceCategories[activeTab] || deviceCategories[0] || defaultCategories[0];

  return (
    <AdminEditWrapper sectionKey="devices" sectionTitle="الأجهزة المدعومة (Devices Supported)">
      <section id="devices" className="devices-section">
        <div className="devices-container">
          {/* Section Header */}
          <div className="section-header-center">
            <h2 className="section-main-title devices-headline">
              {devicesData.titlePrefix || 'All Devices Are'}{' '}
              <span className="highlight-supported-gradient">{devicesData.titleHighlight || 'Supported'}</span>
            </h2>
            <p className="devices-description-text">
              {devicesData.subtitle || 'Experience seamless streaming across all your favorite devices'}
            </p>
          </div>

          {/* Device Category Selector Tabs */}
          <div className="device-tabs-nav">
            {deviceCategories.map((cat, idx) => (
              <button
                key={cat.id || idx}
                type="button"
                className={`device-tab-btn ${activeTab === idx ? 'active' : ''}`}
                onClick={() => setActiveTab(idx)}
              >
                <span className="tab-icon-emoji">{cat.icon}</span>
                <span className="tab-title-text">{cat.title}</span>
              </button>
            ))}
          </div>

          {/* Active Device Detailed Showcase Card */}
          <div className="device-detail-card">
            <div className="device-detail-inner">
              <div className="detail-left-info">
                <div className="device-meta-badge">
                  <span className="emoji-large">{currentCategory.icon}</span>
                  <div>
                    <h3 className="active-cat-title">{currentCategory.title}</h3>
                    <span className="cat-brands-sub">{currentCategory.brand}</span>
                  </div>
                </div>

                <p className="device-detail-paragraph">
                  {currentCategory.description}
                </p>

                <div className="device-features-highlights">
                  <div className="highlight-row">
                    <span className="h-check"><IconCheck size={14} /></span>
                    <span>{devicesData.setupTimeLabel || 'Setup Time:'} <strong>{currentCategory.setupTime}</strong></span>
                  </div>
                  <div className="highlight-row">
                    <span className="h-check"><IconCheck size={14} /></span>
                    <span>{devicesData.featXtream || 'Supports Xtream Codes API & M3U Playlist URLs'}</span>
                  </div>
                  <div className="highlight-row">
                    <span className="h-check"><IconCheck size={14} /></span>
                    <span>{devicesData.featEpg || 'Full EPG Guide & Catch-up Included'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-right-apps">
                <h4 className="recommended-apps-title">{devicesData.recommendedAppsTitle || 'Recommended Apps for this Device:'}</h4>
                <div className="app-chips-grid">
                  {(currentCategory.apps || []).map((app, i) => (
                    <div key={i} className="app-chip-item">
                      <span className="app-dot"></span>
                      <span>{app}</span>
                    </div>
                  ))}
                </div>

                <div className="fast-setup-box">
                  <div className="fast-setup-icon">⚡</div>
                  <div>
                    <strong>{devicesData.fastSetupTitle || 'Instant Setup Instructions Provided'}</strong>
                    <p>{devicesData.fastSetupDesc || 'Step-by-step video & PDF guide sent to your email right after order.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminEditWrapper>
  );
};
