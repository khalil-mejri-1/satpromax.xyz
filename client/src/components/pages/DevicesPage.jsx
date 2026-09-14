import React from 'react';
import { useContent } from '../../context/ContentContext';
import { PageHeaderBanner } from '../PageHeaderBanner';
import { DevicesSupported } from '../DevicesSupported';
import { DeviceStrip } from '../DeviceStrip';
import { IconDownload, IconMonitor } from '../Icons';

export const DevicesPage = ({ onNavigate }) => {
  const { currentLang } = useContent();

  const titles = {
    ar: {
      badge: '📱 توافق شامل مع كافة الشاشات والأجهزة',
      title: 'الأجهزة والأنظمة المتوافقة مع اشتراك SatProMax',
      subtitle: 'استمتع بمشاهدة برامجك على جميع شاشات التلفزيون الذكي، FireStick، الهواتف الذكية، الأجهزة اللوحية، الكمبيوتر وأجهزة الاستقبال.',
      perks: ['شاشات Samsung و LG و Android TV', 'أجهزة Amazon Fire TV Stick', 'هواتف وأجهزة آبل iOS و Mac', 'أجهزة الكمبيوتر بنظام ويندوز'],
      breadcrumb: 'الأجهزة المتوافقة',
      downloadCardTitle: 'تنزيل تطبيقات الأجهزة',
      downloadCardDesc: 'قم بتحميل ملفات التثبيت APK وروابط التحميل المباشرة لجميع الأجهزة.',
      installCardTitle: 'شروحات التثبيت بالتفصيل',
      installCardDesc: 'تصفح خطوات إدخال الاشتراك خطوة بخطوة لكل جهاز على حدة.',
    },
    fr: {
      badge: '📱 Compatibilité Totale Multi-Écrans',
      title: 'Appareils & Systèmes d’Exploitation Compatibles',
      subtitle: 'Profitez de votre abonnement sur Smart TV Samsung/LG, Amazon FireStick, boîtiers Android TV, Apple TV, iPhone, iPad, PC et MAG.',
      perks: ['Smart TV Samsung & LG WebOS', 'Amazon Fire TV Stick & Cube', 'iOS, iPadOS, Mac & Windows', 'Boîtiers Android TV & MAG'],
      breadcrumb: 'Appareils Compatibles',
      downloadCardTitle: 'Télécharger les Applications',
      downloadCardDesc: 'Fichiers APK directs, codes Downloader et installeurs pour votre appareil.',
      installCardTitle: "Guides d'Installation",
      installCardDesc: 'Tutoriels pas-à-pas pour configurer votre application en 2 minutes.',
    },
    en: {
      badge: '📱 Multi-Device Universal Compatibility',
      title: 'Supported Devices & Operating Systems',
      subtitle: 'Stream smoothly across all your screens: Smart TV, Amazon FireStick, Android TV Boxes, Apple TV, iPhone, Android phones, PC, and MAG.',
      perks: ['Samsung & LG Smart TVs', 'Amazon Fire TV Stick & 4K Max', 'Apple iOS, Mac & Windows PC', 'Android TV & MAG Set-Top Boxes'],
      breadcrumb: 'Supported Devices',
      downloadCardTitle: 'Download Official Apps',
      downloadCardDesc: 'Get direct APK files, Downloader short-codes, and media players for your device.',
      installCardTitle: 'Step-by-Step Setup Guides',
      installCardDesc: 'Follow our illustrated 2-minute setup instructions for any device.',
    },
  };

  const t = titles[currentLang] || titles.fr;

  return (
    <div className="standalone-page-wrapper devices-page-wrapper animate-fade-in">
      <PageHeaderBanner 
        badge={t.badge}
        title={t.title}
        subtitle={t.subtitle}
        highlights={t.perks}
        breadcrumbs={[{ label: t.breadcrumb }]}
        onNavigate={onNavigate}
      />

      <div className="page-body-container">
        {/* Device Logos Strip */}
        <DeviceStrip />

        {/* Detailed Grid of Supported Devices */}
        <DevicesSupported />

        {/* Action Dual-Card Link to Downloads & Installation */}
        <div className="devices-action-grid">
          <div className="device-action-card" onClick={() => onNavigate && onNavigate('download-apps')}>
            <div className="action-card-icon">
              <IconDownload size={24} />
            </div>
            <div className="action-card-text">
              <h4>{t.downloadCardTitle}</h4>
              <p>{t.downloadCardDesc}</p>
            </div>
            <span className="action-card-arrow">→</span>
          </div>

          <div className="device-action-card" onClick={() => onNavigate && onNavigate('install')}>
            <div className="action-card-icon">
              <IconMonitor size={24} />
            </div>
            <div className="action-card-text">
              <h4>{t.installCardTitle}</h4>
              <p>{t.installCardDesc}</p>
            </div>
            <span className="action-card-arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};
