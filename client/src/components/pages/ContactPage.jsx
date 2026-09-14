import React from 'react';
import { useContent } from '../../context/ContentContext';
import { PageHeaderBanner } from '../PageHeaderBanner';
import { FaqSection } from '../FaqSection';
import { ClientProofsSection } from '../ClientProofsSection';
import { IconHeadphones, IconCheck } from '../Icons';

export const ContactPage = ({ onOpenOrderModal, onNavigate }) => {
  const { currentLang } = useContent();

  const titles = {
    ar: {
      badge: '💬 خدمة عملاء على مدار الساعة',
      title: 'اتصل بنا والأسئلة الشائعة (FAQ)',
      subtitle: 'فريقنا متواجد 24 ساعة يومياً و7 أيام في الأسبوع للإجابة عن استفساراتكم والمساعدة الفورية في تفعيل الاشتراكات وحل أي مشكلة.',
      perks: ['رد سريع في أقل من 3 دقائق', 'دعم فني متخصص ومباشر', 'محادثات مباشرة عبر واتساب', 'ضمان رضا كامل 100%'],
      breadcrumb: 'اتصل بنا والأسئلة الشائعة',
      card1Title: 'محادثة واتساب الفورية',
      card1Desc: 'أسرع وسيلة للحصول على المساعدة الفورية، تجديد الاشتراك أو طلب تجربة.',
      card1Btn: 'تحدث معنا عبر واتساب',
      card2Title: 'البريد الإلكتروني الرسمي',
      card2Desc: 'للاستفسارات الرسمية، طلبات الشراكة أو الدعم المكتبي الموسع.',
      card2Btn: 'إرسال بريد إلكتروني',
      card3Title: 'حالة الخوادم والخدمة',
      card3Desc: 'جميع سيرفرات البث تعمل بكفاءة 99.9% مع مراقبة أداء تلقائية.',
      card3Status: '🟢 الخوادم تعمل بنجاح وبسرعة قصوى',
    },
    fr: {
      badge: '💬 Assistance Client 24/7 Disponible',
      title: 'Contactez notre Support & Questions Fréquentes',
      subtitle: 'Notre équipe technique et commerciale est disponible 24h/24 et 7j/7 pour vous assister immédiatement sur WhatsApp ou par e-mail.',
      perks: ['Réponse en moins de 3 minutes', 'Support technique expert en direct', 'Activation et dépannage WhatsApp', 'Satisfaction garantie à 100%'],
      breadcrumb: 'Contact & FAQ',
      card1Title: 'Assistance Directe WhatsApp',
      card1Desc: 'Le moyen le plus rapide pour poser une question, activer votre code ou renouveler un forfait.',
      card1Btn: 'Ouvrir WhatsApp',
      card2Title: 'Support par E-mail',
      card2Desc: 'Pour les demandes administratives, factures ou questions générales.',
      card2Btn: 'support@satpromax.xyz',
      card3Title: 'État des Serveurs en Temps Réel',
      card3Desc: 'Nos serveurs AntiFreeze 9.0 fonctionnent avec un taux de disponibilité garanti de 99.9%.',
      card3Status: '🟢 Tous les serveurs sont opérationnels',
    },
    en: {
      badge: '💬 24/7 Dedicated Customer Support',
      title: 'Contact Customer Care & Frequently Asked Questions',
      subtitle: 'Have a question or need assistance? Our multilingual technical support team is ready to help you 24 hours a day, 7 days a week.',
      perks: ['Average response under 3 minutes', 'Live expert technical support', 'Instant WhatsApp activation & troubleshooting', '100% Customer Satisfaction'],
      breadcrumb: 'Contact & FAQ',
      card1Title: 'Live WhatsApp Support',
      card1Desc: 'The fastest channel for instant activation, renewals, and live device troubleshooting.',
      card1Btn: 'Chat on WhatsApp',
      card2Title: 'Official Email Helpdesk',
      card2Desc: 'For general inquiries, business partnerships, or order assistance.',
      card2Btn: 'support@satpromax.xyz',
      card3Title: 'System & Server Status',
      card3Desc: 'All stream clusters and anti-freeze nodes are currently monitored and operational.',
      card3Status: '🟢 99.9% All systems operational',
    },
  };

  const t = titles[currentLang] || titles.fr;

  return (
    <div className="standalone-page-wrapper contact-page-wrapper animate-fade-in">
      <PageHeaderBanner 
        badge={t.badge}
        title={t.title}
        subtitle={t.subtitle}
        highlights={t.perks}
        breadcrumbs={[{ label: t.breadcrumb }]}
        onNavigate={onNavigate}
      />

      <div className="page-body-container">
        {/* Support Cards Grid */}
        <div className="contact-cards-grid">
          {/* Card 1: WhatsApp */}
          <div className="contact-card contact-card-highlight">
            <div className="contact-card-icon-wrap icon-whatsapp-wrap">
              <span>💬</span>
            </div>
            <h3>{t.card1Title}</h3>
            <p>{t.card1Desc}</p>
            <a 
              href="https://wa.me/212600000000" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-contact-action btn-contact-whatsapp"
            >
              <span>{t.card1Btn}</span>
              <span>→</span>
            </a>
          </div>

          {/* Card 2: Email */}
          <div className="contact-card">
            <div className="contact-card-icon-wrap icon-email-wrap">
              <span>✉️</span>
            </div>
            <h3>{t.card2Title}</h3>
            <p>{t.card2Desc}</p>
            <a 
              href="mailto:support@satpromax.xyz" 
              className="btn-contact-action btn-contact-email"
            >
              <span>{t.card2Btn}</span>
            </a>
          </div>

          {/* Card 3: Server Status */}
          <div className="contact-card">
            <div className="contact-card-icon-wrap icon-status-wrap">
              <span>⚡</span>
            </div>
            <h3>{t.card3Title}</h3>
            <p>{t.card3Desc}</p>
            <div className="server-status-indicator">
              <span>{t.card3Status}</span>
            </div>
          </div>
        </div>

        {/* Client Proofs Section (Real WhatsApp chat proofs) */}
        <ClientProofsSection />

        {/* Comprehensive FAQ Accordion */}
        <FaqSection onOpenOrderModal={onOpenOrderModal} />
      </div>
    </div>
  );
};
