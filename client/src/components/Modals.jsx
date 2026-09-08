import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { IconClose, IconCheck, IconZap, IconShieldCheck, IconSearch, IconPlayCircle, IconStar, IconTv } from './Icons';

export const Modals = ({
  orderModalData,
  onCloseOrderModal,
  channelExplorerOpen,
  onCloseChannelExplorer,
  currentCurrency = 'USD',
}) => {
  const { content } = useContent();
  const modalsData = content?.modals || {};

  // Order Modal State
  const [deviceType, setDeviceType] = useState('FireStick');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('card');

  // Channel Explorer State
  const [channelSearch, setChannelSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');

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
                  <div className="modal-badge-pill">{modalsData.instantActivation || '⚡ Instant Activation'}</div>
                  <h3 className="modal-title">{modalsData.orderTitle || 'Complete Your Subscription'}</h3>
                  <p className="modal-subtitle">
                    {modalsData.selectedPackage || 'Selected Package:'} <strong>{orderModalData.title || '12 Months Premium IPTV'}</strong>
                  </p>
                  {orderModalData.price && (
                    <div className="modal-price-tag">
                      {modalsData.totalPrice || 'Total:'} <span>{orderModalData.price}</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleOrderSubmit} className="order-actual-form">
                  <div className="form-group">
                    <label className="form-label">{modalsData.emailLabel || 'Email Address (for instant activation code & credentials):'}</label>
                    <input 
                      type="email" 
                      required
                      placeholder={modalsData.emailPlaceholder || 'name@example.com'}
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="form-input-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{modalsData.whatsappLabel || 'WhatsApp Number (optional for priority support):'}</label>
                    <input 
                      type="tel" 
                      placeholder={modalsData.whatsappPlaceholder || '+1 (555) 000-0000'}
                      value={customerWhatsapp}
                      onChange={(e) => setCustomerWhatsapp(e.target.value)}
                      className="form-input-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{modalsData.deviceLabel || 'Primary Device you will use:'}</label>
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
                    <label className="form-label">{modalsData.paymentLabel || 'Select Payment Method:'}</label>
                    <div className="payment-options-grid">
                      <button 
                        type="button" 
                        className={`pay-opt-box ${selectedPayment === 'card' ? 'active' : ''}`}
                        onClick={() => setSelectedPayment('card')}
                      >
                        <span>{modalsData.payCard || '💳 Credit / Debit Card'}</span>
                      </button>
                      <button 
                        type="button" 
                        className={`pay-opt-box ${selectedPayment === 'paypal' ? 'active' : ''}`}
                        onClick={() => setSelectedPayment('paypal')}
                      >
                        <span>{modalsData.payPaypal || '🅿️ PayPal'}</span>
                      </button>
                      <button 
                        type="button" 
                        className={`pay-opt-box ${selectedPayment === 'crypto' ? 'active' : ''}`}
                        onClick={() => setSelectedPayment('crypto')}
                      >
                        <span>{modalsData.payCrypto || '₿ Crypto (USDT / BTC)'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="order-security-row">
                    <IconShieldCheck size={16} />
                    <span>{modalsData.securityText || '256-Bit SSL Encrypted • 7-Day Money-Back Guarantee'}</span>
                  </div>

                  <button type="submit" className="btn-modal-checkout-submit">
                    <span>{modalsData.btnSubmitOrder || 'Activate Subscription Now'}</span>
                    <IconZap size={18} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="order-success-container text-center animate-fade-in">
                <div className="success-icon-bubble">
                  <IconCheck size={36} />
                </div>
                <h3>{modalsData.successTitle || 'Subscription Order Initiated!'}</h3>
                <p>
                  {modalsData.successDesc || 'Thank you! An activation confirmation along with your credentials has been sent to'} <strong>{customerEmail}</strong>.
                </p>
                <div className="credentials-preview-box">
                  <div className="cred-line"><strong>{modalsData.serverUrlLabel || 'Server URL:'}</strong> http://line.satpromax.me</div>
                  <div className="cred-line"><strong>{modalsData.statusLabel || 'Status:'}</strong> {modalsData.statusActive || 'Active (24/7 VIP Line)'}</div>
                  <div className="cred-line"><strong>{modalsData.setupGuideLabel || 'Setup Guide:'}</strong> Sent for {deviceType}</div>
                </div>

                <div className="success-actions-row">
                  <a 
                    href={`https://wa.me/?text=Hello%20SatProMax,%20I%20just%20placed%20order%20for%20email%20${encodeURIComponent(customerEmail)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-confirm"
                  >
                    {modalsData.btnWhatsappConfirm || 'Confirm via WhatsApp Instant Chat'}
                  </a>
                  <button 
                    type="button" 
                    className="btn-close-success"
                    onClick={onCloseOrderModal}
                  >
                    {modalsData.btnDone || 'Done'}
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
              <div className="pill-badge-gradient">{modalsData.explorerBadge || '19,000+ Channels Live'}</div>
              <h3>{modalsData.explorerTitle || 'Explore Global TV Channels'}</h3>
              <p>{modalsData.explorerSubtitle || 'Browse live TV feeds, sports broadcast channels, and pay-per-view events.'}</p>
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
                  placeholder={modalsData.explorerSearchPlaceholder || 'Search channel by name or league...'}
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
                    <th>{modalsData.thChannel || 'Channel Name'}</th>
                    <th>{modalsData.thCountry || 'Country / Region'}</th>
                    <th>{modalsData.thCategory || 'Category'}</th>
                    <th>{modalsData.thQuality || 'Broadcast Quality'}</th>
                    <th>{modalsData.thStatus || 'Server Status'}</th>
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
              <span>{modalsData.explorerFooter || 'Showing sample of 19,000+ channels. Full updated playlist delivered upon activation.'}</span>
              <button 
                type="button" 
                className="btn-modal-checkout-submit"
                onClick={() => {
                  onCloseChannelExplorer();
                  onCloseOrderModal();
                }}
              >
                {modalsData.btnSubscribeExplore || 'Subscribe to Access All Channels'}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};
