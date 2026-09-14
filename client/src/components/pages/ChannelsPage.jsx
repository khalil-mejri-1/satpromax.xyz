import React from 'react';
import { useContent } from '../../context/ContentContext';
import { PageHeaderBanner } from '../PageHeaderBanner';
import { ChannelsSection } from '../ChannelsSection';
import { EpgSection } from '../EpgSection';
import { SportsSection } from '../SportsSection';

export const ChannelsPage = ({ onOpenChannelExplorer, onOpenOrderModal, onNavigate }) => {
  const { currentLang } = useContent();

  const titles = {
    ar: {
      badge: '📺 دليل القنوات والبث المباشر',
      title: 'أكثر من 19,000 قناة تلفزيونية بجودة 4K و FHD',
      subtitle: 'استكشف قائمة القنوات التلفزيونية العربية، الفرنسية، الأوروبية، الأمريكية والرياضية مع دليل البرامج الإلكتروني EPG وبدون أي تقطيع.',
      perks: ['19,000+ قناة تلفزيونية عالمية', 'بث رياضي مباشر 60 إطار/ثانية', 'دليل برامج إلكتروني EPG 7 أيام', 'خوادم مستقرة 99.9%'],
      breadcrumb: 'قائمة القنوات',
    },
    fr: {
      badge: '📺 Guide TV & Chaînes en Direct',
      title: 'Catalogue de 19,000+ Chaînes TV en Direct 4K & FHD',
      subtitle: 'Explorez toutes vos chaînes françaises, arabes, européennes, internationales et sportives en Ultra Haute Définition avec guide TV interactif.',
      perks: ['19,000+ Chaînes directes 4K/FHD', 'Sports en direct 60 FPS sans latence', 'Guide TV EPG sur 7 jours', 'Stabilité garantie à 99.9%'],
      breadcrumb: 'Chaînes TV',
    },
    en: {
      badge: '📺 Live TV & Channel Directory',
      title: '19,000+ Live Worldwide TV Channels in 4K & FHD',
      subtitle: 'Browse thousands of live channels from France, UK, USA, Arab world, and across the globe with zero buffering and full EPG support.',
      perks: ['19,000+ Global Live Channels', '60 FPS Ultra-Smooth Sports Feeds', '7-Day Electronic Program Guide (EPG)', '99.9% Uptime Reliability'],
      breadcrumb: 'Channels Catalog',
    },
  };

  const t = titles[currentLang] || titles.fr;

  return (
    <div className="standalone-page-wrapper channels-page-wrapper animate-fade-in">
      <PageHeaderBanner 
        badge={t.badge}
        title={t.title}
        subtitle={t.subtitle}
        highlights={t.perks}
        breadcrumbs={[{ label: t.breadcrumb }]}
        onNavigate={onNavigate}
      />

      <div className="page-body-container">
        {/* Interactive Channel Catalog Showcase */}
        <ChannelsSection onOpenChannelExplorer={onOpenChannelExplorer} />

        {/* EPG Electronic Program Guide Showcase */}
        <EpgSection onOpenOrderModal={onOpenOrderModal} />

        {/* International Sports Coverage */}
        <SportsSection onOpenChannelExplorer={onOpenChannelExplorer} />
      </div>
    </div>
  );
};
