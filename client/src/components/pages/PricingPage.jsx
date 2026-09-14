import React from 'react';
import { useContent } from '../../context/ContentContext';
import { PageHeaderBanner } from '../PageHeaderBanner';
import { Pricing } from '../Pricing';
import { FeaturesGrid } from '../FeaturesGrid';
import { TestimonialsSection } from '../TestimonialsSection';
import { FaqSection } from '../FaqSection';

export const PricingPage = ({ onOpenOrderModal, currentCurrency, onNavigate }) => {
  const { currentLang, content } = useContent();

  const titles = {
    ar: {
      badge: '💎 أفضل عروض IPTV لعام 2026',
      title: 'باقات وأسعار اشتراك IPTV بريميوم',
      subtitle: 'اختر الخطة المناسبة لك من شهر حتى سنتين مع تفعيل فوري وضمان استرجاع الأموال لمدة 7 أيام بدون مخاطرة.',
      perks: ['تفعيل فوري خلال دقيقتين', 'خوادم AntiFreeze 9.0 فائقة السرعة', 'أكثر من 19,000 قناة و56,000 فيلم VOD', 'دعم فني واتساب 24/7'],
      breadcrumb: 'الأسعار والباقات',
    },
    fr: {
      badge: '💎 Meilleurs Forfaits IPTV 2026',
      title: "Tarifs & Formules d'Abonnement IPTV Premium",
      subtitle: "Choisissez l'abonnement adapté à vos besoins (1 à 24 mois, 1 à 3 écrans). Activation immédiate et garantie satisfait ou remboursé 7 jours sans condition.",
      perks: ['Activation immédiate en 2 min', 'Serveurs AntiFreeze 9.0 4K/FHD', '19,000+ Chaînes & 56,000+ VOD', 'Assistance WhatsApp 24/7'],
      breadcrumb: 'Nos Tarifs',
    },
    en: {
      badge: '💎 Best Value IPTV Deals 2026',
      title: 'Premium IPTV Pricing Plans & Subscriptions',
      subtitle: 'Select the perfect package for your streaming needs. Instant automated delivery with a 7-day money-back guarantee.',
      perks: ['Instant 2-Minute Activation', 'Anti-Freeze™ 9.0 High-Speed Servers', '19,000+ Live Channels & 56,000+ VOD', '24/7 Dedicated WhatsApp Support'],
      breadcrumb: 'Pricing Plans',
    },
  };

  const t = titles[currentLang] || titles.fr;

  return (
    <div className="standalone-page-wrapper pricing-page-wrapper animate-fade-in">
      <PageHeaderBanner 
        badge={t.badge}
        title={t.title}
        subtitle={t.subtitle}
        highlights={t.perks}
        breadcrumbs={[{ label: t.breadcrumb }]}
        onNavigate={onNavigate}
      />

      <div className="page-body-container">
        {/* Interactive Pricing Component */}
        <Pricing 
          onOpenOrderModal={onOpenOrderModal} 
          currentCurrency={currentCurrency} 
        />

        {/* Guarantees & Technical Features */}
        <FeaturesGrid />

        {/* Testimonials & Customer Satisfaction */}
        <TestimonialsSection />

        {/* Pricing Related FAQs */}
        <FaqSection onOpenOrderModal={onOpenOrderModal} />
      </div>
    </div>
  );
};
