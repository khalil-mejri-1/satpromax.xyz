import React from 'react';
import { useContent } from '../../context/ContentContext';
import { PageHeaderBanner } from '../PageHeaderBanner';
import { HowToInstall } from '../HowToInstall';
import { IconDownload, IconHeadphones, IconCheck } from '../Icons';

export const InstallPage = ({ onOpenOrderModal, onNavigate }) => {
  const { currentLang } = useContent();

  const titles = {
    ar: {
      badge: '⚡ تثبيت سهل وسريع في دقيقتين',
      title: 'دليل التثبيت وشرح التشغيل لجميع الأجهزة',
      subtitle: 'خطوات بسيطة ومصورة لتثبيت وتشغيل اشتراك IPTV على التلفزيون الذكي Smart TV، وأجهزة FireStick، وAndroid Box، وتطبيقات الهاتف والكمبيوتر.',
      perks: ['تثبيت سهل بدون خبرة تقنية', 'متوافق مع جميع التطبيقات الشهيرة', 'دعم فني جاهز لمساعدتك خطوة بخطوة', 'روابط تحميل مباشرة وتلقائية'],
      breadcrumb: 'دليل التثبيت',
      appsBannerTitle: 'هل تبحث عن تحميل التطبيقات الرسمية مباشرة؟',
      appsBannerDesc: 'قم بزيارة صفحة التنزيلات لتحميل تطبيق Atlas Pro ONTV و IPTV Smarters و TiviMate و IBO Player بروابط مباشرة ورموز Downloader.',
      appsBannerBtn: 'صفحة تحميل التطبيقات',
      helpTitle: 'تحتاج مساعدة في الإعداد؟',
      helpDesc: 'فريق الدعم الفني متواجد عبر الواتساب على مدار الساعة لمساعدتك في إدخال بيانات الاشتراك وتجهيز جهازك.',
      helpBtn: 'مراسلة الدعم الفني عبر واتساب',
    },
    fr: {
      badge: '⚡ Configuration Rapide en 2 Minutes',
      title: "Guide d'Installation & Tutoriels de Configuration",
      subtitle: "Instructions simples étape par étape pour configurer votre abonnement IPTV sur Smart TV Samsung/LG, FireStick, boîtiers Android, iOS et PC.",
      perks: ['Installation ultra-simple sans connaissances requises', 'Compatible IPTV Smarters, TiviMate, IBO Player', 'Assistance WhatsApp étape par étape', 'Codes Downloader directs'],
      breadcrumb: 'Installation',
      appsBannerTitle: 'Téléchargez les applications IPTV directement',
      appsBannerDesc: 'Retrouvez tous les fichiers APK officiels, codes Downloader et tutoriels vidéo sur notre page dédiée aux applications.',
      appsBannerBtn: 'Accéder aux Téléchargements',
      helpTitle: 'Besoin d’aide pour la configuration ?',
      helpDesc: 'Notre support technique est disponible 24h/24 et 7j/7 pour vous accompagner pas à pas sur WhatsApp.',
      helpBtn: 'Contacter le Support WhatsApp',
    },
    en: {
      badge: '⚡ Easy 2-Minute Quick Setup',
      title: 'Step-by-Step IPTV Installation Guides',
      subtitle: 'Simple, foolproof setup tutorials for Smart TVs, Amazon FireStick, Android TV Boxes, iOS, Windows, and MAG devices.',
      perks: ['Beginner-friendly step-by-step setup', 'Compatible with Smarters Pro, TiviMate & IBO', 'Live WhatsApp setup assistance 24/7', 'Instant Downloader codes'],
      breadcrumb: 'How To Install',
      appsBannerTitle: 'Looking for Direct App Downloads?',
      appsBannerDesc: 'Download official IPTV APK files, Downloader short-codes, and custom players directly from our dedicated apps repository.',
      appsBannerBtn: 'Go to Download Apps Page',
      helpTitle: 'Need help getting started?',
      helpDesc: 'Our customer support team is on standby 24/7 via WhatsApp to guide you through setup in minutes.',
      helpBtn: 'Message WhatsApp Support',
    },
  };

  const t = titles[currentLang] || titles.fr;

  return (
    <div className="standalone-page-wrapper install-page-wrapper animate-fade-in">
      <PageHeaderBanner 
        badge={t.badge}
        title={t.title}
        subtitle={t.subtitle}
        highlights={t.perks}
        breadcrumbs={[{ label: t.breadcrumb }]}
        onNavigate={onNavigate}
      />

      <div className="page-body-container">
        {/* Step-by-Step Installation Guides Component */}
        <HowToInstall onOpenOrderModal={onOpenOrderModal} />

        {/* Quick Direct Banner to Download Apps */}
        <div className="install-apps-bridge-card">
          <div className="bridge-card-glow"></div>
          <div className="bridge-card-content">
            <div className="bridge-icon-circle">
              <IconDownload size={32} />
            </div>
            <div className="bridge-text-box">
              <h3>{t.appsBannerTitle}</h3>
              <p>{t.appsBannerDesc}</p>
            </div>
            <button 
              type="button" 
              className="btn-bridge-download"
              onClick={() => onNavigate && onNavigate('download-apps')}
            >
              <IconDownload size={16} />
              <span>{t.appsBannerBtn}</span>
            </button>
          </div>
        </div>

        {/* Support Help Banner */}
        <div className="install-support-help-banner">
          <div className="help-banner-content">
            <div className="help-icon-box">
              <IconHeadphones size={28} />
            </div>
            <div className="help-info-box">
              <h4>{t.helpTitle}</h4>
              <p>{t.helpDesc}</p>
            </div>
            <a 
              href="https://wa.me/212600000000" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-help-whatsapp"
            >
              <span>💬</span>
              <span>{t.helpBtn}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
