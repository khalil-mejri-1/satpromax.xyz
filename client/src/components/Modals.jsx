import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import { API_ENDPOINTS } from '../config/api';
import { 
  IconClose, 
  IconCheck, 
  IconZap, 
  IconShieldCheck, 
  IconSearch, 
  IconPlayCircle, 
  IconStar, 
  IconTv,
  IconChevronDown,
  IconAndroid,
  IconApple,
  IconMonitor,
  IconServer
} from './Icons';
import { PaymentLogo, DEFAULT_PAYMENT_METHODS } from './PaymentLogos';

const DEVICE_OPTIONS = [
  {
    value: 'FireStick',
    label: 'Amazon FireStick / Fire TV',
    sublabel: 'Fire TV Stick 4K, Max, Cube, Lite',
    badge: 'Fire TV',
    badgeClass: 'device-badge-firestick',
    deviceType: 'firestick'
  },
  {
    value: 'SmartTV',
    label: 'Samsung or LG Smart TV',
    sublabel: 'Tizen OS, webOS, IBO Player, Smarters',
    badge: 'Smart TV',
    badgeClass: 'device-badge-smarttv',
    deviceType: 'smarttv'
  },
  {
    value: 'AndroidTV',
    label: 'Android TV Box / Nvidia Shield',
    sublabel: 'Xiaomi Mi Box, Google TV, Chromecast',
    badge: 'Android',
    badgeClass: 'device-badge-androidtv',
    deviceType: 'androidtv'
  },
  {
    value: 'Apple',
    label: 'Apple TV / iPhone / iPad',
    sublabel: 'Apple TV 4K, iOS, iPadOS, Mac',
    badge: 'Apple',
    badgeClass: 'device-badge-apple',
    deviceType: 'apple'
  },
  {
    value: 'MAG',
    label: 'MAG Box / Formuler (Provide MAC)',
    sublabel: 'MAG 250/322/524, Formuler Z / Stalker',
    badge: 'MAG Box',
    badgeClass: 'device-badge-mag',
    deviceType: 'mag'
  },
  {
    value: 'PC',
    label: 'Windows PC / Mac Computer',
    sublabel: 'VLC Media Player, IPTV Smarters Pro, Web',
    badge: 'PC / Mac',
    badgeClass: 'device-badge-pc',
    deviceType: 'pc'
  }
];

const renderDeviceIcon = (deviceKey, size = 18) => {
  switch (deviceKey) {
    case 'androidtv':
    case 'AndroidTV':
      return <IconAndroid size={size} />;
    case 'apple':
    case 'Apple':
      return <IconApple size={size} />;
    case 'pc':
    case 'PC':
      return <IconMonitor size={size} />;
    case 'mag':
    case 'MAG':
      return <IconServer size={size} />;
    case 'firestick':
    case 'FireStick':
    case 'smarttv':
    case 'SmartTV':
    default:
      return <IconTv size={size} />;
  }
};

const DeviceSelectDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = DEVICE_OPTIONS.find((opt) => opt.value === value) || DEVICE_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = DEVICE_OPTIONS.findIndex((opt) => opt.value === value);
        const nextIndex = (currentIndex + 1) % DEVICE_OPTIONS.length;
        onChange(DEVICE_OPTIONS[nextIndex].value);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = DEVICE_OPTIONS.findIndex((opt) => opt.value === value);
        const prevIndex = (currentIndex - 1 + DEVICE_OPTIONS.length) % DEVICE_OPTIONS.length;
        onChange(DEVICE_OPTIONS[prevIndex].value);
      }
    }
  };

  return (
    <div className={`custom-device-select-container ${isOpen ? 'is-open' : ''}`} ref={dropdownRef}>
      {/* Hidden fallback select for complete form compatibility */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="visually-hidden-select"
        tabIndex={-1}
        aria-hidden="true"
      >
        {DEVICE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Trigger button */}
      <button
        type="button"
        className={`custom-device-select-trigger ${isOpen ? 'active-open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="trigger-selected-content">
          <span className={`device-icon-badge ${selectedOption.badgeClass}`}>
            {renderDeviceIcon(selectedOption.deviceType, 18)}
          </span>
          <div className="trigger-text-wrapper">
            <div className="trigger-title-row">
              <span className="trigger-device-title">{selectedOption.label}</span>
              <span className="trigger-badge-tag">{selectedOption.badge}</span>
            </div>
            <span className="trigger-device-sublabel">{selectedOption.sublabel}</span>
          </div>
        </div>
        <div className="trigger-chevron-wrapper">
          <IconChevronDown size={18} className={`chevron-icon ${isOpen ? 'rotate-open' : ''}`} />
        </div>
      </button>

      {/* Dropdown Options Popup */}
      {isOpen && (
        <div className="custom-device-dropdown-menu animate-dropdown-pop" role="listbox">
          {DEVICE_OPTIONS.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`custom-device-option-item ${isSelected ? 'option-selected' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                <span className={`device-icon-badge ${opt.badgeClass}`}>
                  {renderDeviceIcon(opt.deviceType, 18)}
                </span>
                <div className="option-text-group">
                  <div className="option-title-row">
                    <span className="option-title">{opt.label}</span>
                    <span className="option-badge-tag">{opt.badge}</span>
                  </div>
                  <span className="option-sublabel">{opt.sublabel}</span>
                </div>
                <div className="option-indicator">
                  {isSelected ? (
                    <span className="option-check-circle">
                      <IconCheck size={13} />
                    </span>
                  ) : (
                    <span className="option-radio-dot" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Modals = ({
  orderModalData,
  onCloseOrderModal,
  channelExplorerOpen,
  onCloseChannelExplorer,
  currentCurrency = 'USD',
}) => {
  const { content, addOrder } = useContent();
  const modalsData = content?.modals || {};
  const footerData = content?.footer || {};
  const cleanWhatsappPhone = (content?.footer?.whatsappPhone || '').replace(/[^0-9]/g, '');

  const rawPaymentMethods = (Array.isArray(content?.paymentMethods) && content.paymentMethods.length > 0)
    ? content.paymentMethods 
    : (Array.isArray(footerData?.paymentMethods) && footerData.paymentMethods.length > 0)
      ? footerData.paymentMethods
      : DEFAULT_PAYMENT_METHODS;

  const activePaymentMethods = useMemo(() => {
    return Array.isArray(rawPaymentMethods)
      ? rawPaymentMethods.filter((m) => m && m.enabled !== false)
      : DEFAULT_PAYMENT_METHODS;
  }, [rawPaymentMethods]);

  const paymentLabel = content?.paymentLabel
    || content?.modals?.paymentLabel 
    || footerData?.paymentLabel 
    || modalsData.paymentLabel 
    || 'Mode de paiement *';

  const securityText = footerData?.securityText 
    || modalsData.securityText 
    || '256-Bit SSL Encrypted • 7-Day Money-Back Guarantee';

  // Order Modal State
  const [deviceType, setDeviceType] = useState('FireStick');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(() => activePaymentMethods[0]?.id || 'flouci');

  // Ensure selectedPayment matches an active method
  useEffect(() => {
    if (activePaymentMethods.length > 0) {
      if (!activePaymentMethods.some((m) => m.id === selectedPayment)) {
        setSelectedPayment(activePaymentMethods[0].id);
      }
    } else {
      setSelectedPayment('');
    }
  }, [activePaymentMethods, selectedPayment]);

  // Channel Explorer State
  const [channelSearch, setChannelSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');

  // Device dropdown open state
  const [deviceDropdownOpen, setDeviceDropdownOpen] = useState(false);
  const deviceDropdownRef = useRef(null);

  // Close custom dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (deviceDropdownRef.current && !deviceDropdownRef.current.contains(e.target)) {
        setDeviceDropdownOpen(false);
      }
    };
    if (deviceDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [deviceDropdownOpen]);

  const fullChannelsList = [
    { country: 'USA', name: 'ESPN 1 & 2 HD / 4K UHD', category: 'Sports', quality: '4K UHD', status: 'Live' },
    { country: 'USA', name: 'HBO, Cinemax, Showtime Max', category: 'Movies', quality: '1080p FHD', status: 'Live' },
    { country: 'USA', name: 'NBC, CBS, FOX, ABC Networks', category: 'General', quality: '1080p FHD', status: 'Live' },
    { country: 'UK', name: 'Sky Sports Main Event UHD', category: 'Sports', quality: '4K 60FPS', status: 'Live' },
    { country: 'UK', name: 'TNT Sports 1, 2, 3, 4 Ultimate 4K', category: 'Sports', quality: '4K HDR', status: 'Live' },
    { country: 'UK', name: 'BBC One, Two, ITV 1-4 HD', category: 'Entertainment', quality: '1080p', status: 'Live' },
    { country: 'Canada', name: 'TSN 1-5 & RDS Canada 4K', category: 'Sports', quality: '4K', status: 'Live' },
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

  const [submittingOrder, setSubmittingOrder] = useState(false);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!customerEmail) return;

    setSubmittingOrder(true);
    try {
      const orderPayload = {
        action: 'create_order',
        orderId: 'SPM-' + Math.floor(100000 + Math.random() * 900000),
        plan: orderModalData.title || orderModalData.plan || '12 Months VIP',
        package: orderModalData.title || orderModalData.plan || '12 Months VIP',
        price: orderModalData.price || '€49.99',
        customerEmail: customerEmail.trim(),
        customerWhatsapp: customerWhatsapp.trim() || 'Non spécifié',
        deviceType: deviceType,
        paymentMethod: (() => {
          const chosenMethod = activePaymentMethods.find(m => m.id === selectedPayment);
          return chosenMethod ? chosenMethod.name : (selectedPayment || 'Standard');
        })(),
        currency: orderModalData.currency || '€',
        timestamp: new Date().toISOString(),
        notes: `Currency: ${currentCurrency}`,
      };

      if (addOrder) {
        await addOrder(orderPayload);
      } else {
        await fetch(API_ENDPOINTS.vetrine, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });
      }
    } catch (err) {
      console.warn('Backend order recording offline, continuing locally:', err);
    } finally {
      setSubmittingOrder(false);
      setOrderSuccess(true);
    }
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
                    <DeviceSelectDropdown 
                      value={deviceType}
                      onChange={setDeviceType}
                    />
                  </div>

                  {activePaymentMethods.length > 0 && (
                    <div className="form-group payment-selection-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{paymentLabel}</span>
                        <span style={{ fontSize: '0.72rem', color: '#9da3b4', fontWeight: 'normal' }}>
                          Sécurisé & Instantané
                        </span>
                      </label>
                      <div className="payment-cards-scroll-wrapper">
                        <div className="payment-options-cards-grid">
                          {activePaymentMethods.map((pm) => {
                            const isSelected = selectedPayment === pm.id;
                            return (
                              <div 
                                key={pm.id}
                                role="button"
                                tabIndex={0}
                                className={`luxury-pay-card ${isSelected ? 'card-selected' : ''}`}
                                onClick={() => setSelectedPayment(pm.id)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedPayment(pm.id); }}
                                aria-pressed={isSelected}
                              >
                                {isSelected && (
                                  <div className="pay-card-check-badge" title="Sélectionné">
                                    ✓
                                  </div>
                                )}
                                <div className="pay-card-logo-box">
                                  <PaymentLogo method={pm} />
                                </div>
                                <span className="pay-card-name" title={pm.name}>{pm.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="order-security-row">
                    <IconShieldCheck size={16} />
                    <span>{securityText}</span>
                  </div>

                  <button type="submit" className="btn-modal-checkout-submit" disabled={submittingOrder}>
                    <span>{submittingOrder ? 'Activation en cours...' : (modalsData.btnSubmitOrder || 'Activate Subscription Now')}</span>
                    <IconZap size={18} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="order-success-container text-center animate-fade-in">
                <div className="success-icon-bubble">
                  <IconCheck size={36} />
                </div>
                <h3>{modalsData.successTitle || content?.modals?.successTitle || "Commande d'abonnement envoyée !"}</h3>
                <p>
                  {(modalsData.successDesc || content?.modals?.successDesc || "Merci ! Une confirmation d'activation avec vos identifiants M3U & Xtream Codes a été envoyée à")} <strong>{customerEmail}</strong>.
                </p>
                <div className="credentials-preview-box">
                  <div className="cred-line">
                    <strong>{modalsData.serverUrlLabel || content?.modals?.serverUrlLabel || 'URL du Serveur :'}</strong> {modalsData.serverUrl || content?.modals?.serverUrl || 'http://line.satpromax.me'}
                  </div>
                  <div className="cred-line">
                    <strong>{modalsData.statusLabel || content?.modals?.statusLabel || 'Statut :'}</strong> {modalsData.statusActive || content?.modals?.statusActive || 'Actif (Ligne VIP 24/7)'}
                  </div>
                  <div className="cred-line">
                    <strong>{modalsData.setupGuideLabel || content?.modals?.setupGuideLabel || "Guide d'installation :"}</strong> {(modalsData.setupGuideValue || content?.modals?.setupGuideValue || "Sent for {device}").replace('{device}', deviceType)}
                  </div>
                </div>

                <div className="success-actions-row">
                  <a 
                    href={cleanWhatsappPhone 
                      ? `https://wa.me/${cleanWhatsappPhone}?text=${encodeURIComponent(
                          (modalsData.whatsappOrderMsg || content?.modals?.whatsappOrderMsg || "Bonjour SatProMax, je viens de finaliser ma commande pour l'email {email}")
                            .replace('{email}', customerEmail)
                            .replace('{plan}', orderModalData?.title || 'Abonnement IPTV')
                            .replace('{device}', deviceType)
                        )}`
                      : `https://wa.me/?text=${encodeURIComponent(
                          (modalsData.whatsappOrderMsg || content?.modals?.whatsappOrderMsg || "Bonjour SatProMax, je viens de finaliser ma commande pour l'email {email}")
                            .replace('{email}', customerEmail)
                            .replace('{plan}', orderModalData?.title || 'Abonnement IPTV')
                            .replace('{device}', deviceType)
                        )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-confirm"
                  >
                    {modalsData.btnWhatsappConfirm || content?.modals?.btnWhatsappConfirm || 'Confirmer via Chat WhatsApp Instantané'}
                  </a>
                  <button 
                    type="button" 
                    className="btn-close-success"
                    onClick={onCloseOrderModal}
                  >
                    {modalsData.btnDone || content?.modals?.btnDone || 'Terminé'}
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
