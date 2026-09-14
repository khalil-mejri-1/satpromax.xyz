import React, { useState, useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { IconCheck, IconZap, IconStar, IconFlame, IconShieldCheck, IconSparkles } from './Icons';

export const Pricing = ({ onOpenOrderModal, currentCurrency = 'USD' }) => {
  const { content } = useContent();
  const pricingData = content?.pricing || {};

  const categories = (pricingData.categories && pricingData.categories.length > 0)
    ? pricingData.categories
    : [
    {
      id: 'cat-1',
      name: pricingData.connection1 || '1 Device (VIP)',
      products: pricingData.plans || [],
    },
    {
      id: 'cat-2',
      name: pricingData.connection2 || '2 Devices (Family Pack)',
      products: (pricingData.plans || []).map((p) => ({ ...p, price: Number((p.price * 1.6).toFixed(2)) })),
    },
    {
      id: 'cat-3',
      name: pricingData.connection3 || '3 Devices (Multi-Room)',
      products: (pricingData.plans || []).map((p) => ({ ...p, price: Number((p.price * 2.2).toFixed(2)) })),
    },
  ];

  const [activeCatId, setActiveCatId] = useState(() => {
    return categories.length > 0 ? categories[0].id : 'cat-1';
  });

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

  const activeCategory = categories.find((c) => c.id === activeCatId) || categories[0];
  const currentProducts = activeCategory?.products || [];

  const formatPrice = (usdPrice) => {
    const numPrice = typeof usdPrice === 'number' ? usdPrice : parseFloat(usdPrice) || 0;
    const converted = numPrice * currRate;
    return converted.toFixed(2);
  };

  // Google SEO Schema.org JSON-LD Structured Data
  const schemaJsonLd = useMemo(() => {
    const allProducts = categories.flatMap((cat) =>
      (cat.products || []).map((p) => ({
        ...p,
        categoryName: cat.name,
      }))
    );

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: pricingData.titleHighlight || 'SatProMax IPTV Subscription Plans',
      description: pricingData.subtitle || 'All plans include our premium features and 24/7 support',
      itemListElement: allProducts.map((p, idx) => {
        const itemObj = {
          '@type': 'Product',
          name: p.seoTitle || p.title,
          description: p.seoDescription || (p.features || []).join('. '),
          category: p.categoryName,
          offers: {
            '@type': 'Offer',
            priceCurrency: currentCurrency || 'USD',
            price: formatPrice(p.price),
            availability: 'https://schema.org/InStock',
            priceValidUntil: '2028-12-31',
          },
        };
        if (p.seoKeywords) {
          itemObj.keywords = p.seoKeywords;
        }
        return {
          '@type': 'ListItem',
          position: idx + 1,
          item: itemObj,
        };
      }),
    };
  }, [categories, pricingData, currentCurrency, currRate]);

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

          {/* Categories Selector Bar (Affichage des Catégories en Haut) */}
          <div className="connections-selector-box">
            <span className="selector-label">{pricingData.selectDevicesLabel || 'Active Devices / Connections:'}</span>
            <div className="connections-btn-group">
              {categories.map((cat) => (
                <button 
                  key={cat.id} 
                  type="button" 
                  className={`conn-btn ${activeCatId === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCatId(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing / Products Cards Grid (Affichage des Produits en Bas) */}
          <div className="pricing-cards-grid">
            {currentProducts.map((plan, idx) => {
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
                    {plan.savings && <div className="plan-savings-tag">{plan.savings}</div>}
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
                      title: `${plan.title} (${activeCategory?.name || 'Abonnement'})`,
                      price: `${currSymbol}${formatted}`,
                    })}
                  >
                    <IconZap size={16} />
                    <span>{pricingData.btnOrderNow || 'Order Now'}</span>
                  </button>

                  {/* Features List */}
                  <div className="card-features-list">
                    <p className="features-title">{pricingData.whatsIncluded || "WHAT'S INCLUDED:"}</p>
                    {(plan.features || []).map((feat, i) => (
                      <div key={i} className="feature-row">
                        <span className="feature-check-icon">
                          <IconCheck size={14} />
                        </span>
                        <span className="feature-text">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Guarantee footer note */}
                  <div className="card-guarantee-note">
                    <IconShieldCheck size={14} />
                    <span>{pricingData.guaranteeNote || '7-Day Money-Back Guarantee'}</span>
                  </div>

                  {/* Hidden SEO Metadata for Crawlers & Search Engines (Invisible to visitors) */}
                  <div className="visually-hidden-seo" aria-hidden="true">
                    <h4>{plan.seoTitle || plan.title}</h4>
                    <p>{plan.seoDescription || (plan.features || []).join(', ')}</p>
                    {plan.seoKeywords && <span>{plan.seoKeywords}</span>}
                    <span>{currSymbol}{formatted} {plan.period}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Google SEO Schema.org JSON-LD (Invisible to visitors, parsed by search engine crawlers) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
          />

          {/* Bottom Payment Trust Bar */}
          <div className="pricing-trust-bar">
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <span>{pricingData.trust1 || 'Instant Automated Delivery (Within 2 Minutes)'}</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span>{pricingData.trust2 || '256-Bit SSL Encrypted & Secure Checkout'}</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <span>{pricingData.trust3 || '100% Satisfaction or Full Refund'}</span>
            </div>
          </div>
        </div>
      </section>
    </AdminEditWrapper>
  );
};
