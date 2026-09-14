import React from 'react';
import { useContent } from '../../context/ContentContext';
import { PageHeaderBanner } from '../PageHeaderBanner';
import { VodSection } from '../VodSection';

export const VodPage = ({ onOpenOrderModal, onNavigate }) => {
  const { currentLang } = useContent();

  const titles = {
    ar: {
      badge: '🎬 مكتبة السينما والمسلسلات VOD',
      title: 'أكثر من 56,000 فيلم ومسلسل 4K بتحديث يومي',
      subtitle: 'أضخم مكتبة ترفيهية تشمل أحدث إصدارات السينما ومسلسلات منصات Netflix و HBO Max و Prime Video و Disney+ بترجمة وجودة عالية.',
      perks: ['56,000+ فيلم ومسلسل مترجم', 'جودة 4K Dolby Vision & HDR', 'إضافات يومية فورية للأفلام الحديثة', 'مسلسلات كاملة بكافة المواسم'],
      breadcrumb: 'الأفلام والمسلسلات',
    },
    fr: {
      badge: '🎬 Vidéo à la Demande (VOD) 4K',
      title: 'Catalogue de 56,000+ Films & Séries en Streaming 4K',
      subtitle: "Accédez à une cinémathèque géante mise à jour quotidiennement avec les sorties cinéma et les séries Netflix, Prime, Disney+ et HBO.",
      perks: ['56,000+ Films & Séries VF/VOSTFR', 'Qualité 4K HDR & son Dolby 5.1', 'Nouveautés cinéma ajoutées chaque jour', 'Saisons intégrales disponibles'],
      breadcrumb: 'Films & Séries VOD',
    },
    en: {
      badge: '🎬 4K Movies & Series On-Demand',
      title: '56,000+ Movies & TV Series VOD Library',
      subtitle: 'Instant on-demand streaming for the latest theater releases, blockbuster hits, and binge-worthy shows from Netflix, HBO, Disney+ and Amazon.',
      perks: ['56,000+ Multi-Audio Movies & Shows', 'Ultra HD 4K & HDR Quality', 'Daily Automated Library Updates', 'Complete Series & Full Seasons'],
      breadcrumb: 'VOD Movies & Series',
    },
  };

  const t = titles[currentLang] || titles.fr;

  return (
    <div className="standalone-page-wrapper vod-page-wrapper animate-fade-in">
      <PageHeaderBanner 
        badge={t.badge}
        title={t.title}
        subtitle={t.subtitle}
        highlights={t.perks}
        breadcrumbs={[{ label: t.breadcrumb }]}
        onNavigate={onNavigate}
      />

      <div className="page-body-container">
        <VodSection onOpenOrderModal={onOpenOrderModal} />
      </div>
    </div>
  );
};
