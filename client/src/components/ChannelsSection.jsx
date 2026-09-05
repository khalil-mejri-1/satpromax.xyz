import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { IconSearch, IconTv, IconSparkles, IconCheck } from './Icons';

export const ChannelsSection = ({ onOpenChannelExplorer }) => {
  const { content } = useContent();
  const channelsData = content?.channels || {};

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const channelCategories = [
    'All',
    'USA / UK / CA',
    'Sports Live',
    'Movies & HBO',
    'News 24/7',
    'Kids & Family',
    'Arab & Europe',
  ];

  const channelLogos = [
    { name: "ABC NEWS", type: "News", badge: "abc NEWS", iconBg: "#000000" },
    { name: "beIN SPORTS", type: "Sports", badge: "beIN", iconBg: "#5c2d91" },
    { name: "CNN", type: "News", badge: "CNN", iconBg: "#cc0000" },
    { name: "Disney Channel", type: "Kids", badge: "Disney", iconBg: "#0064d2" },
    { name: "ESPN", type: "Sports", badge: "ESPN", iconBg: "#cc0000" },
    { name: "FOX", type: "Entertainment", badge: "FOX", iconBg: "#002b49" },
    { name: "HBO", type: "Movies", badge: "HBO", iconBg: "#000000" },
    { name: "NBC", type: "Entertainment", badge: "NBC", iconBg: "#0047bb" },
    { name: "AMC", type: "Movies", badge: "aMC", iconBg: "#000000" },
    { name: "NBA TV", type: "Sports", badge: "NBA", iconBg: "#1d428a" },
    { name: "ELEVEN SPORTS", type: "Sports", badge: "ELEVEN SPORTS", iconBg: "#111111" },
    { name: "CANAL+", type: "Entertainment", badge: "CANAL+", iconBg: "#000000" },
    { name: "BT SPORT", type: "Sports", badge: "BT SPORT", iconBg: "#5514b4" },
    { name: "PLAY SPORTS", type: "Sports", badge: "PLAY SPORTS", iconBg: "#000000" },
    { name: "DAZN", type: "Sports", badge: "DAZN", iconBg: "#f5f5f5", darkText: true },
    { name: "NOVA", type: "Movies", badge: "S NOVA", iconBg: "#000000" },
    { name: "SUPER SPORT", type: "Sports", badge: "SUPER SPORT", iconBg: "#001a44" },
    { name: "SN Sportsnet", type: "Sports", badge: "SN", iconBg: "#00205b" },
    { name: "SKY SPORTS", type: "Sports", badge: "sky sports", iconBg: "#001e4e" },
    { name: "BBC One", type: "News", badge: "BBC", iconBg: "#bb1919" },
  ];

  const filteredChannels = channelLogos.filter((ch) => {
    const matchesCat = 
      activeCategory === 'All' || 
      (activeCategory === 'Sports Live' && ch.type === 'Sports') ||
      (activeCategory === 'Movies & HBO' && ch.type === 'Movies') ||
      (activeCategory === 'News 24/7' && ch.type === 'News') ||
      (activeCategory === 'Kids & Family' && ch.type === 'Kids') ||
      (activeCategory === 'USA / UK / CA' && (ch.type === 'Entertainment' || ch.type === 'News')) ||
      (activeCategory === 'Arab & Europe');
    
    const matchesSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase()) || ch.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <AdminEditWrapper sectionKey="channels" sectionTitle="Chaînes en Direct">
      <section id="channels" className="channels-section">
        <div className="channels-container">
          {/* Section Header */}
          <div className="section-header-center">
            <h2 className="section-main-title channels-headline">
              {channelsData.titlePrefix || 'Watch All Channels with'}{' '}
              <span className="highlight-iptv-gradient">{channelsData.titleHighlight || 'IPTV'}</span>{' '}
              {channelsData.titleSuffix || 'No Cable TV Required'}
            </h2>
            <p className="channels-description-text">
              {channelsData.description || 'We offer thousands of TV channels covering Canada, United States, United Kingdom, Portugal, Albania, Germany, Italy, France, Brazil, Romania, Greece, Spain, Sweden, Finland, Ireland, Norway, Denmark, Latin American countries, Arab countries, and almost all countries worldwide.'}
            </p>
          </div>

          {/* Categories Bar & Quick Search */}
          <div className="channels-filter-bar">
            <div className="category-chips-list">
              {channelCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="search-input-wrapper">
              <IconSearch size={16} className="search-icon" />
              <input 
                type="text"
                placeholder="Search 19,000+ channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="channel-search-input"
              />
            </div>
          </div>

          {/* Channel Logos Glass Card Grid (Exact styling from Image 3 Top) */}
          <div className="channel-logos-glass-box">
            <div className="channel-logos-grid">
              {filteredChannels.map((channel, index) => (
                <div key={index} className="channel-logo-card" title={channel.name}>
                  <div 
                    className={`channel-badge-inner ${channel.darkText ? 'dark-text' : ''}`}
                    style={{ backgroundColor: channel.iconBg }}
                  >
                    <span className="channel-brand-badge-text">{channel.badge}</span>
                  </div>
                  <span className="channel-card-sub">{channel.name}</span>
                </div>
              ))}
            </div>

            {/* Quick Stat Pill inside Channels Box */}
            <div className="channels-box-footer">
              <div className="live-channels-counter">
                <span className="pulsing-green-dot"></span>
                <span>{channelsData.counterText || '19,420+ Channels Online in 4K / FHD / 60 FPS with Zero Freeze'}</span>
              </div>
              <button 
                type="button"
                className="btn-view-full-list"
                onClick={onOpenChannelExplorer}
              >
                {channelsData.btnBrowse || 'Browse Full Channel Database'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </AdminEditWrapper>
  );
};
