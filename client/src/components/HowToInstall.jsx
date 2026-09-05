import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { IconCheck, IconZap, IconMonitor, IconTv } from './Icons';

export const HowToInstall = ({ onOpenOrderModal }) => {
  const { content } = useContent();
  const installData = content?.install || {};

  const defaultApps = [
    {
      id: 'smarters',
      name: 'IPTV Smarters Pro',
      devices: 'Android, FireStick, iOS, Smart TV, Windows',
      steps: [
        'Download and install IPTV Smarters Pro from your device store or Downloader (Code: 29938).',
        'Open the app and select "Login with Xtream Codes API".',
        'Enter Any Name in the first field, then enter your Username, Password, and Server URL from your activation email.',
        'Click "Add User" and enjoy 19,000+ live channels & 56K+ VOD movies instantly!',
      ],
    },
    {
      id: 'tivimate',
      name: 'TiviMate IPTV',
      devices: 'FireStick, Android TV, Nvidia Shield, Google TV',
      steps: [
        'Install TiviMate from the Google Play Store or search Downloader app.',
        'Click "Add Playlist" -> choose "Xtream Codes login" or "M3U Playlist".',
        'Input your Server URL, Username, and Password sent upon order confirmation.',
        'Enable EPG TV Guide and enjoy ultra-smooth channel zapping and 4K streaming.',
      ],
    },
    {
      id: 'smartiptv',
      name: 'Smart IPTV / IBO Player',
      devices: 'Samsung Smart TV, LG webOS TV',
      steps: [
        'Search and install "IBO Player" or "Smart IPTV" from your TV App Store.',
        'Open the app to find your TV MAC Address and Device Key.',
        'Visit the portal upload page or provide your MAC Address during checkout.',
        'Restart the TV app, and all your channels and playlist will load automatically.',
      ],
    },
    {
      id: 'mag',
      name: 'MAG / Formuler Box',
      devices: 'MAG 250/322/524, Formuler Z10/Z11',
      steps: [
        'Go to Settings -> System Settings -> Servers -> Portals.',
        'Set Portal 1 Name to "IPPLAY TV" and enter the Portal URL provided in your activation email.',
        'Send us your MAG device MAC address (starts with 00:1A:79:xx:xx:xx) to whitelist.',
        'Reboot the device portal to access all channels, EPG, and VOD on your TV.',
      ],
    },
  ];

  const apps = installData.apps && installData.apps.length > 0 ? installData.apps : defaultApps;
  const [selectedApp, setSelectedApp] = useState(apps[0]?.id || 'smarters');

  const currentApp = apps.find(a => (a.id === selectedApp || a.name === selectedApp)) || apps[0] || defaultApps[0];

  return (
    <AdminEditWrapper sectionKey="install" sectionTitle="دليل التثبيت والتشغيل (How To Install)">
      <section id="install" className="install-section">
        <div className="install-container">
          <div className="section-header-center">
            <div className="pill-badge-container">
              <span className="pill-badge-gradient">{installData.badge || 'Easy 3-Step Setup'}</span>
            </div>
            <h2 className="section-main-title">
              {installData.titlePrefix || 'How To'} <span className="highlight-perfect-plan">{installData.titleHighlight || 'Install & Activate'}</span>
            </h2>
            <p className="section-sub-desc">
              {installData.subtitle || 'Get up and running in less than 2 minutes on any device of your choice'}
            </p>
          </div>

          {/* App Switcher Pills */}
          <div className="app-switcher-tabs">
            {apps.map((app, idx) => (
              <button
                key={app.id || idx}
                type="button"
                className={`app-tab-btn ${selectedApp === (app.id || app.name) ? 'active' : ''}`}
                onClick={() => setSelectedApp(app.id || app.name)}
              >
                <span>{app.name}</span>
              </button>
            ))}
          </div>

          {/* Step-by-Step Card */}
          <div className="install-guide-card">
            <div className="guide-card-header">
              <div className="guide-title-box">
                <h3>Setup Guide for {currentApp.name}</h3>
                <span className="supported-devices-tag">Supported on: {currentApp.devices}</span>
              </div>
              <div className="activation-badge">
                <span className="pulsing-green-dot"></span>
                <span>Instant Activation</span>
              </div>
            </div>

            <div className="steps-flow-grid">
              {(currentApp.steps || []).map((step, idx) => (
                <div key={idx} className="step-flow-item">
                  <div className="step-number-circle">
                    <span>{idx + 1}</span>
                  </div>
                  <div className="step-body">
                    <h4>Step {idx + 1}</h4>
                    <p>{step}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="guide-footer-action">
              <div className="help-text">
                <strong>Need personal assistance?</strong> Our 24/7 technical team is available on WhatsApp to guide you step-by-step.
              </div>
              <button 
                type="button" 
                className="btn-guide-order"
                onClick={() => onOpenOrderModal({ plan: '12-months', title: 'Start with 12 Months Subscription' })}
              >
                {installData.btnOrder || 'Get Started Now'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </AdminEditWrapper>
  );
};
