import React from 'react';
import { useContent } from '../../context/ContentContext';
import { PageHeaderBanner } from '../PageHeaderBanner';
import { SportsSection } from '../SportsSection';

export const SportsPage = ({ onOpenChannelExplorer, onOpenOrderModal, onNavigate }) => {
  const { currentLang } = useContent();

  const titles = {
    ar: {
      badge: '⚽ البث الرياضي المباشر 60 إطار/ثانية',
      title: 'أقوى البطولات العالمية وأحداث PPV بدون تقطيع',
      subtitle: 'تابع دوري أبطال أوروبا، الدوري الإنجليزي، الإسباني، قنوات beIN Sports، SSC، ونزالات UFC و الملاكمة بأعلى جودة وبدون أي تأخير.',
      perks: ['جودة 4K Ultra HD بمعدل 60 FPS', 'قنوات beIN Sports و RMC و DAZN', 'أحداث الدفع مقابل المشاهدة PPV كاملة', 'تغطية لجميع المباريات الحية'],
      breadcrumb: 'الرياضة والمباريات',
    },
    fr: {
      badge: '⚽ Sports en Direct & PPV 60 FPS',
      title: 'Événements Sportifs Internationaux & Pass Matchs en Direct',
      subtitle: 'Vivez la Ligue des Champions, Premier League, La Liga, beIN Sports, Canal+, DAZN, UFC et tous les combats PPV en 60 FPS ultra-fluide.',
      perks: ['Flux Ultra HD 4K à 60 FPS', 'beIN Sports, Canal+, RMC Sport & DAZN', 'Tous les événements PPV inclus sans supplément', 'Zéro décalage de diffusion'],
      breadcrumb: 'Sports & PPV',
    },
    en: {
      badge: '⚽ 60 FPS Live Sports & PPV Pass',
      title: 'Live Global Sporting Events & PPV Stadium Feeds',
      subtitle: 'Stream UEFA Champions League, Premier League, La Liga, UFC, Boxing PPVs, and motorsport events with crystal clear 60 FPS streams.',
      perks: ['4K Ultra HD & 60 FPS Feeds', 'beIN Sports, Sky Sports, TNT & DAZN', 'All PPV Fight Nights Included', 'Zero Delay & Low Latency Streaming'],
      breadcrumb: 'Sports & PPV',
    },
  };

  const t = titles[currentLang] || titles.fr;

  return (
    <div className="standalone-page-wrapper sports-page-wrapper animate-fade-in">
      <PageHeaderBanner 
        badge={t.badge}
        title={t.title}
        subtitle={t.subtitle}
        highlights={t.perks}
        breadcrumbs={[{ label: t.breadcrumb }]}
        onNavigate={onNavigate}
      />

      <div className="page-body-container">
        <SportsSection onOpenChannelExplorer={onOpenChannelExplorer} />

        <div className="sports-cta-banner">
          <div className="sports-cta-content">
            <h3>{currentLang === 'ar' ? 'جاهز لمشاهدة مباراتك القادمة الآن؟' : currentLang === 'fr' ? 'Prêt à regarder votre prochain match en direct ?' : 'Ready to stream your next big game live?'}</h3>
            <p>{currentLang === 'ar' ? 'اشترك الآن واحصل على تفعيل فوري قبل انطلاق المباراة مباشرة.' : currentLang === 'fr' ? 'Abonnez-vous dès maintenant et recevez vos identifiants avant le coup d’envoi.' : 'Get instant automated activation before kickoff.'}</p>
            <button 
              type="button" 
              className="btn-get-started"
              onClick={() => onOpenOrderModal({ plan: '12-months', title: '12 Months Sports Pass' })}
            >
              <span>{currentLang === 'ar' ? 'اشترك الآن وفعل الباقة' : currentLang === 'fr' ? 'Activer mon Abonnement' : 'Activate Subscription'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
