import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { IconCheck, IconZap, IconStar, IconFlame, IconShieldCheck, IconSparkles } from './Icons';

export const Pricing = ({ onOpenOrderModal, currentCurrency = 'USD' }) => {
  const { content } = useContent();
  const pricingData = content?.pricing || {};

  const [connections, setConnections] = useState(1);
  const [billingCycle, setBillingCycle] = useState('12m');

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'AU$',
  };

  const currencyRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    CAD: 1.36,
    AUD: 1.52,
  };

  const currSymbol = currencySymbols[currentCurrency] || '$';
  const currRate = currencyRates[currentCurrency] || 1;

  const formatPrice = (usdPrice) => {
    const numPrice = typeof usdPrice === 'number' ? usdPrice : parseFloat(usdPrice) || 0;
    const converted = numPrice * currRate * (connections === 1 ? 1 : connections === 2 ? 1.6 : 2.2);
    return converted.toFixed(2);
  };

  const plans = pricingData.plans || [
    {
      id: '1m',
      title: '1 Month',
      badge: 'Starter',
      badgeClass: 'badge-starter',
      price: 13.99,
      period: '/ 1 Month',
      popular: false,
      savings: 'Standard Rate',
      features: [
        '19,000+ Live Channels',
        '56,000+ VOD Movies & Series',
        '4K / Ultra HD & FHD Quality',
        'AntiFreeze™ 9.0 Technology',
        'Electronic Program Guide (EPG)',
        'Free Updates & Fast Activation',
        '24/7 Dedicated Customer Support',
        'All Devices Supported',
      ],
    },
    {
      id: '3m',
      title: '3 Months',
      badge: 'Save 30%',
      badgeClass: 'badge-discount-subtle',
      price: 26.99,
      period: '/ 3 Months',
      popular: false,
      savings: 'Save $15.00',
      features: [
        '19,000+ Live Channels',
        '56,000+ VOD Movies & Series',
        '4K / Ultra HD & FHD Quality',
        'AntiFreeze™ 9.0 Technology',
        'Electronic Program Guide (EPG)',
        'Free Updates & Fast Activation',
        '24/7 Dedicated Customer Support',
        '7-Days Catch-Up Replay',
      ],
    },
    {
      id: '6m',
      title: '6 Months',
      badge: 'Save 45%',
      badgeClass: 'badge-discount-subtle',
      price: 39.99,
      period: '/ 6 Months',
      popular: false,
      savings: 'Save $43.95',
      features: [
        '19,000+ Live Channels',
        '56,000+ VOD Movies & Series',
        '4K / Ultra HD & FHD Quality',
        'AntiFreeze™ 9.0 Technology',
        'Electronic Program Guide (EPG)',
        'Free Updates & Fast Activation',
        '24/7 VIP Dedicated Support',
        'PPV Events & Sports Passes',
      ],
    },
    {
      id: '12m',
      title: '12 Months',
      badge: '🔥 62% OFF - BEST VALUE',
      badgeClass: 'badge-most-popular',
      price: 59.99,
      period: '/ 12 Months',
      popular: true,
      savings: 'Only $4.99/mo',
      features: [
        '19,000+ Live Channels in 4K/FHD',
        '56,000+ VOD Movies & Series (Updated Daily)',
        '4K / UHD / FHD / 60 FPS Streams',
        'AntiFreeze™ 9.0 Zero-Buffer Server',
        'Full EPG Electronic Program Guide',
        'All International Sports & PPV Events',
        'Instant Automated Activation',
        '24/7 VIP WhatsApp & Live Chat Support',
        '7-Day Money-Back Guarantee',
      ],
    },
    {
      id: '24m',
      title: '24 Months',
      badge: '75% OFF - SUPER SAVER',
      badgeClass: 'badge-discount-gold',
      price: 89.99,
      period: '/ 24 Months',
      popular: false,
      savings: 'Only $3.74/mo',
      features: [
        '19,000+ Live Channels',
        '56,000+ VOD Movies & Series',
        '4K / UHD / FHD / 60 FPS Streams',
        'AntiFreeze™ 9.0 Premium Server',
        'Full EPG & Catch-Up TV',
        'Free Stream Optimizer & VIP Line',
        'Instant Automated Activation',
        '24/7 Lifetime Priority Support',
        '7-Day Money-Back Guarantee',
      ],
    },
  ];

  return (
    <AdminEditWrapper sectionKey="pricing" sectionTitle="Tarifs & Forfaits">
      <section id="pricing" className="pricing-section">
        <div className="pricing-container">
          {/* Section Header */}
          <div className="section-header-center">
            <div className="pill-badge-container">
              <span className="pill-badge-gradient">{pricingData.badge || 'Premium Plans'}</span>
            </div>
            <h2 className="section-main-title">
              {pricingData.titlePrefix || 'Choose Your'} <span className="highlight-perfect-plan">{pricingData.titleHighlight || 'Perfect Plan'}</span>
            </h2>
            <p className="section-sub-desc">
              {pricingData.subtitle || 'All plans include our premium features and 24/7 support'}
            </p>
          </div>

          {/* Connection Selector Toggle */}
          <div className="connections-selector-box">
            <span className="selector-label">Select Active Devices:</span>
            <div className="connections-btn-group">
              <button 
                type="button" 
                className={`conn-btn ${connections === 1 ? 'active' : ''}`}
                onClick={() => setConnections(1)}
              >
                {pricingData.connection1 || '1 Device / Connection'}
              </button>
              <button 
                type="button" 
                className={`conn-btn ${connections === 2 ? 'active' : ''}`}
                onClick={() => setConnections(2)}
              >
                {pricingData.connection2 || '2 Devices (Family Pack)'}
              </button>
              <button 
                type="button" 
                className={`conn-btn ${connections === 3 ? 'active' : ''}`}
                onClick={() => setConnections(3)}
              >
                {pricingData.connection3 || '3 Devices (Multi-Room)'}
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="pricing-cards-grid">
            {plans.map((plan, idx) => {
              const formatted = formatPrice(plan.price);
              const badgeClass = plan.popular ? 'badge-most-popular' : idx === 4 ? 'badge-discount-gold' : 'badge-discount-subtle';
              return (
                <div 
                  key={plan.id || idx} 
                  className={`pricing-card ${plan.popular ? 'featured-card' : ''}`}
                >
                  {/* Popular / Best value badge */}
                  {plan.badge && (
                    <div className={`card-badge-top ${plan.badgeClass || badgeClass}`}>
                      <span>{plan.badge}</span>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="card-header">
                    <h3 className="plan-title">{plan.title}</h3>
                    <div className="plan-savings-tag">{plan.savings}</div>
                  </div>

                  {/* Price Display */}
                  <div className="card-price-row">
                    <span className="price-currency">{currSymbol}</span>
                    <span className="price-amount">{formatted}</span>
                    <span className="price-period">{plan.period}</span>
                  </div>

                  {/* Card CTA Button */}
                  <button
                    type="button"
                    className={`btn-order-plan ${plan.popular ? 'btn-order-featured' : ''}`}
                    onClick={() => onOpenOrderModal({
                      plan: plan.id,
                      title: `${plan.title} Plan (${connections} Connection${connections > 1 ? 's' : ''})`,
                      price: `${currSymbol}${formatted}`,
                    })}
                  >
                    <IconZap size={16} />
                    <span>Order Now</span>
                  </button>

                  {/* Features List */}
                  <div className="card-features-list">
                    <p className="features-title">What's included:</p>
                    {(plan.features || []).map((feat, i) => (
                      <div key={i} className="feature-row">
                        <span className="feature-check-icon">
                          <IconCheck size={14} />
                        </span>
                        <span className="feature-text">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Guarantee badge */}
                  <div className="card-footer-guarantee">
                    <IconShieldCheck size={14} />
                    <span>7-Day Money Back Guarantee</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Payment Trust Bar */}
          <div className="pricing-trust-bar">
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <span>Instant Automated Delivery (Within 2 Minutes)</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span>256-Bit SSL Encrypted & Secure Checkout</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <span>100% Satisfaction or Full Refund</span>
            </div>
          </div>
        </div>
      </section>
    </AdminEditWrapper>
  );
};
