import React, { useState } from 'react';
import { IconClose, IconCheck, IconZap, IconShieldCheck, IconSearch, IconPlayCircle, IconStar, IconTv } from './Icons';

export const Modals = ({
  orderModalData,
  onCloseOrderModal,
  channelExplorerOpen,
  onCloseChannelExplorer,
  vodPlayerData,
  onCloseVodPlayer,
  currentCurrency = 'USD',
}) => {
  // Order Modal State
  const [deviceType, setDeviceType] = useState('FireStick');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('card');

  // Channel Explorer State
  const [channelSearch, setChannelSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('USA');

  const fullChannelsList = [
    { country: 'USA', name: 'ESPN 4K Ultra HD', category: 'Sports', quality: '4K', status: 'Live' },
    { country: 'USA', name: 'HBO East / West 4K', category: 'Movies', quality: '4K', status: 'Live' },
    { country: 'USA', name: 'NBC Sports Network', category: 'Sports', quality: '1080p 60FPS', status: 'Live' },
    { country: 'USA', name: 'FOX News Channel HD', category: 'News', quality: '1080p', status: 'Live' },
    { country: 'USA', name: 'Disney Channel FHD', category: 'Kids', quality: '1080p', status: 'Live' },
    { country: 'USA', name: 'Discovery Channel HD', category: 'Documentary', quality: '1080p', status: 'Live' },
    { country: 'USA', name: 'TNT & TBS HD', category: 'Entertainment', quality: '1080p', status: 'Live' },
    { country: 'UK', name: 'Sky Sports Main Event UHD', category: 'Sports', quality: '4K UHD', status: 'Live' },
    { country: 'UK', name: 'Sky Sports Premier League', category: 'Sports', quality: '4K 60FPS', status: 'Live' },
    { country: 'UK', name: 'TNT Sports 1 / 2 / 3 / 4', category: 'Sports', quality: '4K UHD', status: 'Live' },
    { country: 'UK', name: 'BBC One FHD / Two HD', category: 'General', quality: '1080p', status: 'Live' },
    { country: 'UK', name: 'Sky Cinema Premiere HD', category: 'Movies', quality: '4K UHD', status: 'Live' },
    { country: 'Canada', name: 'TSN 1, 2, 3, 4, 5 HD', category: 'Sports', quality: '1080p 60FPS', status: 'Live' },
    { country: 'Canada', name: 'Sportsnet Ontario / West', category: 'Sports', quality: '1080p 60FPS', status: 'Live' },
    { country: 'Arab', name: 'beIN SPORTS 1-9 Premium 4K', category: 'Sports', quality: '4K 60FPS', status: 'Live' },
    { country: 'Arab', name: 'beIN SPORTS AFC & MAX', category: 'Sports', quality: 'FHD', status: 'Live' },
    { country: 'Arab', name: 'MBC 1, MBC 2, MBC Action HD', category: 'Entertainment', quality: '1080p', status: 'Live' },
    { country: 'Arab', name: 'SSC Sports Saudi HD 1-8', category: 'Sports', quality: '4K', status: 'Live' },
    { country: 'France', name: 'Canal+ UHD & Canal+ Foot', category: 'Sports', quality: '4K UHD', status: 'Live' },
    { country: 'France', name: 'RMC Sport 1 & 2 HD', category: 'Sports', quality: '1080p', status: 'Live' },
    { country: 'Spain', name: 'Movistar LaLiga 4K UHD', category: 'Sports', quality: '4K 60FPS', status: 'Live' },
    { country: 'Spain', name: 'DAZN LaLiga HD', category: 'Sports', quality: '1080p', status: 'Live' },
    { country: 'Italy', name: 'Sky Sport Calcio UHD', category: 'Sports', quality: '4K UHD', status: 'Live' },
    { country: 'Germany', name: 'Sky Sport Bundesliga UHD', category: 'Sports', quality: '4K UHD', status: 'Live' },
    { country: 'PPV', name: 'UFC PPV Fight Night HD', category: 'PPV Events', quality: '4K 60FPS', status: 'Live' },
    { country: 'PPV', name: 'DAZN Boxing International PPV', category: 'PPV Events', quality: '4K', status: 'Live' },
  ];

  const filteredChannelRows = fullChannelsList.filter(c => {
    const matchesCountry = countryFilter === 'All' || c.country === countryFilter;
    const matchesQuery = c.name.toLowerCase().includes(channelSearch.toLowerCase()) || c.category.toLowerCase().includes(channelSearch.toLowerCase());
    return matchesCountry && matchesQuery;
  });

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!customerEmail) return;
    setOrderSuccess(true);
  };

  return (
    <>
      {/* 1. ORDER & SUBSCRIPTION CHECKOUT MODAL */}
      {orderModalData && (
        <div className="modal-backdrop-fixed" onClick={onCloseOrderModal}>
          <div className="modal-card-dialog animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="btn-modal-close" 
              onClick={onCloseOrderModal}
              aria-label="Close modal"
            >
              <IconClose size={20} />
            </button>

            {!orderSuccess ? (
              <div className="order-form-container">
                <div className="modal-header-box">
                  <div className="modal-badge-pill">⚡ Instant Activation</div>
                  <h3 className="modal-title">Complete Your Subscription</h3>
                  <p className="modal-subtitle">
                    Selected Package: <strong>{orderModalData.title || '12 Months Premium IPTV'}</strong>
                  </p>
                  {orderModalData.price && (
                    <div className="modal-price-tag">
                      Total: <span>{orderModalData.price}</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleOrderSubmit} className="order-actual-form">
                  <div className="form-group">
                    <label className="form-label">Email Address (for instant activation code & credentials):</label>
                    <input 
                      type="email" 
                      required
                      placeholder="name@example.com" 
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="form-input-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">WhatsApp Number (optional for priority support):</label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000" 
                      value={customerWhatsapp}
                      onChange={(e) => setCustomerWhatsapp(e.target.value)}
                      className="form-input-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Device you will use:</label>
                    <select 
                      value={deviceType}
                      onChange={(e) => setDeviceType(e.target.value)}
                      className="form-select-control"
                    >
                      <option value="FireStick">Amazon FireStick / Fire TV</option>
                      <option value="SmartTV">Samsung or LG Smart TV</option>
                      <option value="AndroidTV">Android TV Box / Nvidia Shield</option>
                      <option value="Apple">Apple TV / iPhone / iPad</option>
                      <option value="MAG">MAG Box / Formuler (Provide MAC)</option>
                      <option value="PC">Windows PC / Mac Computer</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Select Payment Method:</label>
                    <div className="payment-options-grid">
                      <button 
                        type="button" 
                        className={`pay-opt-box ${selectedPayment === 'card' ? 'active' : ''}`}
                        onClick={() => setSelectedPayment('card')}
                      >
                        <span>💳 Credit / Debit Card</span>
                      </button>
                      <button 
                        type="button" 
                        className={`pay-opt-box ${selectedPayment === 'paypal' ? 'active' : ''}`}
                        onClick={() => setSelectedPayment('paypal')}
                      >
                        <span>🅿️ PayPal</span>
                      </button>
                      <button 
                        type="button" 
                        className={`pay-opt-box ${selectedPayment === 'crypto' ? 'active' : ''}`}
                        onClick={() => setSelectedPayment('crypto')}
                      >
                        <span>₿ Crypto (USDT / BTC)</span>
                      </button>
                    </div>
                  </div>

                  <div className="order-security-row">
                    <IconShieldCheck size={16} />
                    <span>256-Bit SSL Encrypted • 7-Day Money-Back Guarantee</span>
                  </div>

                  <button type="submit" className="btn-modal-checkout-submit">
                    <span>Activate Subscription Now</span>
                    <IconZap size={18} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="order-success-container text-center animate-fade-in">
                <div className="success-icon-bubble">
                  <IconCheck size={36} />
                </div>
                <h3>Subscription Order Initiated!</h3>
                <p>
                  Thank you! An activation confirmation along with your M3U & Xtream Codes login credentials has been sent to <strong>{customerEmail}</strong>.
                </p>
                <div className="credentials-preview-box">
                  <div className="cred-line"><strong>Server URL:</strong> http://line.ipplaytv.me:8080</div>
                  <div className="cred-line"><strong>Status:</strong> Active (24/7 VIP Line)</div>
                  <div className="cred-line"><strong>Setup Guide:</strong> Sent to email for {deviceType}</div>
                </div>

                <div className="success-actions-row">
                  <a 
                    href={`https://wa.me/?text=Hello%20IPPLAY%20TV,%20I%20just%20placed%20order%20for%20email%20${encodeURIComponent(customerEmail)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-confirm"
                  >
                    Confirm via WhatsApp Instant Chat
                  </a>
                  <button 
                    type="button" 
                    className="btn-close-success"
                    onClick={onCloseOrderModal}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. CHANNELS LIST EXPLORER MODAL */}
      {channelExplorerOpen && (
        <div className="modal-backdrop-fixed" onClick={onCloseChannelExplorer}>
          <div className="modal-card-dialog modal-dialog-large animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="btn-modal-close" 
              onClick={onCloseChannelExplorer}
              aria-label="Close modal"
            >
              <IconClose size={20} />
            </button>

            <div className="explorer-header">
              <div className="pill-badge-gradient">19,000+ Channels Live</div>
              <h3>Explore Global TV Channels</h3>
              <p>Browse live TV feeds, sports broadcast channels, and pay-per-view events.</p>
            </div>

            {/* Filter controls */}
            <div className="explorer-filters-bar">
              <div className="country-pills-list">
                {['All', 'USA', 'UK', 'Canada', 'Arab', 'France', 'Spain', 'Italy', 'Germany', 'PPV'].map((country) => (
                  <button
                    key={country}
                    type="button"
                    className={`country-pill-btn ${countryFilter === country ? 'active' : ''}`}
                    onClick={() => setCountryFilter(country)}
                  >
                    {country}
                  </button>
                ))}
              </div>

              <div className="search-input-wrapper explorer-search">
                <IconSearch size={16} />
                <input 
                  type="text"
                  placeholder="Search channel by name or league..."
                  value={channelSearch}
                  onChange={(e) => setChannelSearch(e.target.value)}
                  className="channel-search-input"
                />
              </div>
            </div>

            {/* Channels Table / List */}
            <div className="channels-table-container">
              <table className="channels-interactive-table">
                <thead>
                  <tr>
                    <th>Channel Name</th>
                    <th>Country / Region</th>
                    <th>Category</th>
                    <th>Broadcast Quality</th>
                    <th>Server Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChannelRows.map((ch, idx) => (
                    <tr key={idx}>
                      <td className="channel-name-cell">
                        <span className="live-mini-dot"></span>
                        <strong>{ch.name}</strong>
                      </td>
                      <td>{ch.country}</td>
                      <td><span className="cat-table-badge">{ch.category}</span></td>
                      <td><span className="quality-table-badge">{ch.quality}</span></td>
                      <td><span className="status-live-badge">● Online 60FPS</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="explorer-footer">
              <span>Showing sample of 19,000+ channels. Full updated playlist delivered upon activation.</span>
              <button 
                type="button" 
                className="btn-modal-checkout-submit"
                onClick={() => {
                  onCloseChannelExplorer();
                  onCloseOrderModal();
                }}
              >
                Subscribe to Access All Channels
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. VOD MOVIE / SERIES TRAILER PREVIEW MODAL */}
      {vodPlayerData && (
        <div className="modal-backdrop-fixed" onClick={onCloseVodPlayer}>
          <div className="modal-card-dialog modal-vod-dialog animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="btn-modal-close" 
              onClick={onCloseVodPlayer}
              aria-label="Close modal"
            >
              <IconClose size={20} />
            </button>

            <div className="vod-player-mockup-box">
              {/* Simulated High-Res Video Screen */}
              <div className="simulated-video-player">
                <img 
                  src={vodPlayerData.cover} 
                  alt={vodPlayerData.title} 
                  className="player-bg-poster"
                />
                <div className="video-player-overlay">
                  <div className="player-top-bar">
                    <span className="player-vod-tag">{vodPlayerData.platform} • {vodPlayerData.quality}</span>
                    <span className="player-live-res">4K UHD | Dolby Atmos 5.1</span>
                  </div>

                  <div className="player-center-play">
                    <div className="pulsing-play-circle">
                      <IconPlayCircle size={64} />
                    </div>
                  </div>

                  <div className="player-controls-bar">
                    <div className="progress-bar-line">
                      <div className="progress-fill" style={{ width: '45%' }}></div>
                    </div>
                    <div className="controls-meta-row">
                      <span>01:14:20 / 02:30:00</span>
                      <span>HD Audio English [5.1] | Multi-Subtitles</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Info Details */}
              <div className="vod-player-details">
                <div className="vod-details-header">
                  <div>
                    <h3 className="vod-detail-title">{vodPlayerData.title}</h3>
                    <div className="vod-tags-row">
                      <span className="tag-chip"><IconStar size={13} /> {vodPlayerData.rating}</span>
                      <span className="tag-chip">{vodPlayerData.year}</span>
                      <span className="tag-chip">{vodPlayerData.genre}</span>
                      <span className="tag-chip quality-chip">{vodPlayerData.quality}</span>
                    </div>
                  </div>
                </div>

                <p className="vod-detail-synopsis">{vodPlayerData.description}</p>

                <div className="vod-cta-actions">
                  <button 
                    type="button" 
                    className="btn-hero-subscribe"
                    onClick={() => {
                      onCloseVodPlayer();
                      // open checkout
                    }}
                  >
                    Stream Full Movie in 4K Now
                  </button>
                  <button 
                    type="button" 
                    className="btn-hero-plans"
                    onClick={onCloseVodPlayer}
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
