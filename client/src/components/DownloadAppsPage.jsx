import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { AdminEditWrapper } from './AdminEditWrapper';
import { 
  IconTv, 
  IconAndroid, 
  IconApple, 
  IconWindows, 
  IconDownload, 
  IconFlame, 
  IconFilm, 
  IconPlay, 
  IconCheck, 
  IconChevronRight,
  IconEdit
} from './Icons';

export const DownloadAppsPage = ({ onOpenOrderModal, onNavigateHome }) => {
  const { 
    content, 
    updateSection, 
    isAdmin, 
    setActiveEditingSection,
    showConfirm,
    showPrompt,
    showAlertModal
  } = useContent();

  const downloadAppsData = content?.downloadApps || {};
  const hero = downloadAppsData.hero || {};
  const featured = downloadAppsData.featuredProduct || {};
  const easyInstall = downloadAppsData.easyInstall || {};
  const categories = downloadAppsData.categories || [];

  // Helper to add a brand new category directly from the page
  const handleDirectAddCategory = () => {
    showPrompt({
      title: 'Ajouter une nouvelle catégorie',
      message: 'Créez une nouvelle catégorie pour regrouper vos applications (ex: Android TV, Fire TV, Windows, iOS...)',
      confirmText: 'Créer la catégorie',
      cancelText: 'Annuler',
      fields: [
        {
          key: 'title',
          label: 'Titre de la catégorie',
          placeholder: 'Ex: Windows Applications, Fire TV Box...',
          required: true,
          defaultValue: '',
        },
      ],
      onConfirm: ({ title }) => {
        if (!title || !title.trim()) return;
        const newCat = {
          id: `cat_${Date.now()}`,
          title: title.trim(),
          apps: [
            {
              id: `app_${Date.now()}`,
              name: "Nouvelle Application",
              downloaderCode: "Code downloader : 123456",
              downloadUrl: "#",
              btnText: "Télécharger l'application",
              logo: "",
              platform: "android",
            },
          ],
        };

        const updatedCategories = [...categories, newCat];
        updateSection('downloadApps', {
          ...downloadAppsData,
          categories: updatedCategories,
        });
      },
    });
  };

  // Helper to delete a category
  const handleDirectDeleteCategory = (catIdx) => {
    const cat = categories[catIdx];
    const catTitle = cat?.title || 'cette catégorie';
    const appCount = cat?.apps?.length || 0;

    showConfirm({
      type: 'danger',
      title: 'Supprimer cette catégorie ?',
      message: `Êtes-vous sûr de vouloir supprimer définitivement "${catTitle}" ainsi que les ${appCount} application(s) associées ?`,
      details: `Catégorie : ${catTitle} (${appCount} application${appCount > 1 ? 's' : ''})`,
      confirmText: 'Supprimer la catégorie',
      cancelText: 'Annuler',
      onConfirm: () => {
        const updatedCategories = categories.filter((_, i) => i !== catIdx);
        updateSection('downloadApps', {
          ...downloadAppsData,
          categories: updatedCategories,
        });
      },
    });
  };

  // Helper to add an app directly to a category
  const handleDirectAddApp = (catIdx) => {
    const cat = categories[catIdx];
    showPrompt({
      title: `Ajouter une application (${cat?.title || ''})`,
      message: 'Remplissez les informations ci-dessous pour ajouter une application téléchargeable.',
      confirmText: 'Ajouter l\'application',
      cancelText: 'Annuler',
      fields: [
        {
          key: 'name',
          label: 'Nom de l\'application',
          placeholder: 'Ex: Atlas Pro ONTV, Smarters Pro...',
          required: true,
          defaultValue: '',
        },
        {
          key: 'platform',
          label: 'Plateforme compatible',
          type: 'select',
          defaultValue: 'android',
          options: [
            { value: 'android', label: 'Android / Smart TV' },
            { value: 'tv', label: 'Fire TV Stick' },
            { value: 'apple', label: 'Apple (iOS / Apple TV)' },
            { value: 'windows', label: 'Windows PC' },
          ],
        },
        {
          key: 'logo',
          label: "Logo / Icône de l'application (URL ou Fichier PC)",
          type: 'image',
          placeholder: "Collez l'URL du logo ou cliquez sur 'Choisir du PC'...",
          defaultValue: '',
        },
        {
          key: 'code',
          label: 'Code Downloader ou Note',
          placeholder: 'Ex: Code downloader : 785214',
          defaultValue: 'Code downloader : ',
        },
        {
          key: 'url',
          label: 'Lien de téléchargement direct (URL)',
          placeholder: 'https://... ou #',
          defaultValue: '#',
        },
        {
          key: 'btnText',
          label: 'Texte du bouton',
          placeholder: 'Ex: Télécharger l\'application',
          defaultValue: "Télécharger l'application",
        },
      ],
      onConfirm: ({ name, platform, logo, code, url, btnText }) => {
        const trimmedName = (name || 'Nouvelle Application').trim();
        const newApp = {
          id: `app_${Date.now()}`,
          name: trimmedName,
          downloaderCode: (code || '').trim(),
          downloadUrl: (url || '#').trim(),
          btnText: (btnText || `Télécharger ${trimmedName}`).trim(),
          logo: (logo || '').trim(),
          platform: platform || 'android',
        };

        const updatedCategories = [...categories];
        updatedCategories[catIdx] = {
          ...updatedCategories[catIdx],
          apps: [...(updatedCategories[catIdx].apps || []), newApp],
        };

        updateSection('downloadApps', {
          ...downloadAppsData,
          categories: updatedCategories,
        });
      },
    });
  };

  // Helper to delete an app
  const handleDirectDeleteApp = (catIdx, appIdx) => {
    const app = categories[catIdx]?.apps?.[appIdx];
    const appName = app?.name || 'cette application';

    showConfirm({
      type: 'danger',
      title: 'Supprimer cette application ?',
      message: `Voulez-vous vraiment supprimer "${appName}" de la liste des téléchargements ? Cette action est irréversible.`,
      details: {
        appName,
        code: app?.downloaderCode || null,
      },
      confirmText: 'Supprimer l\'application',
      cancelText: 'Annuler',
      onConfirm: () => {
        const updatedCategories = [...categories];
        updatedCategories[catIdx] = {
          ...updatedCategories[catIdx],
          apps: updatedCategories[catIdx].apps.filter((_, i) => i !== appIdx),
        };

        updateSection('downloadApps', {
          ...downloadAppsData,
          categories: updatedCategories,
        });
      },
    });
  };

  // Helper to edit an existing app directly
  const handleDirectEditApp = (catIdx, appIdx) => {
    const app = categories[catIdx]?.apps?.[appIdx];
    if (!app) return;

    showPrompt({
      title: `Modifier "${app.name || 'Application'}"`,
      message: 'Modifiez les informations de cette application (nom, plateforme, icône, code ou lien direct) :',
      confirmText: 'Enregistrer les modifications',
      cancelText: 'Annuler',
      fields: [
        {
          key: 'name',
          label: 'Nom de l\'application',
          placeholder: 'Ex: Atlas Pro ONTV, Smarters Pro...',
          required: true,
          defaultValue: app.name || '',
        },
        {
          key: 'platform',
          label: 'Plateforme compatible',
          type: 'select',
          defaultValue: app.platform || 'android',
          options: [
            { value: 'android', label: 'Android / Smart TV' },
            { value: 'tv', label: 'Fire TV Stick' },
            { value: 'apple', label: 'Apple (iOS / Apple TV)' },
            { value: 'windows', label: 'Windows PC' },
          ],
        },
        {
          key: 'logo',
          label: "Logo / Icône de l'application (URL ou Fichier PC)",
          type: 'image',
          placeholder: "Collez l'URL du logo ou cliquez sur 'Choisir du PC'...",
          defaultValue: app.logo || '',
        },
        {
          key: 'code',
          label: 'Code Downloader ou Note',
          placeholder: 'Ex: Code downloader : 785214',
          defaultValue: app.downloaderCode || '',
        },
        {
          key: 'url',
          label: 'Lien de téléchargement direct (URL)',
          placeholder: 'https://... ou #',
          defaultValue: app.downloadUrl || '#',
        },
        {
          key: 'btnText',
          label: 'Texte du bouton',
          placeholder: 'Ex: Télécharger l\'application',
          defaultValue: app.btnText || "Télécharger l'application",
        },
      ],
      onConfirm: ({ name, platform, logo, code, url, btnText }) => {
        const trimmedName = (name || app.name || 'Application').trim();
        const updatedApp = {
          ...app,
          name: trimmedName,
          platform: platform || app.platform || 'android',
          logo: (logo !== undefined ? logo : app.logo || '').trim(),
          downloaderCode: (code || '').trim(),
          downloadUrl: (url || '#').trim(),
          btnText: (btnText || `Télécharger ${trimmedName}`).trim(),
        };

        const updatedCategories = [...categories];
        const updatedApps = [...(updatedCategories[catIdx].apps || [])];
        updatedApps[appIdx] = updatedApp;
        updatedCategories[catIdx] = {
          ...updatedCategories[catIdx],
          apps: updatedApps,
        };

        updateSection('downloadApps', {
          ...downloadAppsData,
          categories: updatedCategories,
        });
      },
    });
  };

  // Helper to edit a category title
  const handleDirectEditCategory = (catIdx) => {
    const cat = categories[catIdx];
    if (!cat) return;

    showPrompt({
      title: `Modifier le nom de la catégorie`,
      message: 'Mettez à jour le titre de cette catégorie :',
      confirmText: 'Enregistrer',
      cancelText: 'Annuler',
      fields: [
        {
          key: 'title',
          label: 'Titre de la catégorie',
          placeholder: 'Ex: Android TV, Windows PC...',
          required: true,
          defaultValue: cat.title || '',
        },
      ],
      onConfirm: ({ title }) => {
        if (!title || !title.trim()) return;
        const updatedCategories = [...categories];
        updatedCategories[catIdx] = {
          ...updatedCategories[catIdx],
          title: title.trim(),
        };

        updateSection('downloadApps', {
          ...downloadAppsData,
          categories: updatedCategories,
        });
      },
    });
  };

  // Render platform icon for app card
  const renderAppIcon = (app) => {
    if (app.logo && app.logo.trim()) {
      return (
        <img 
          src={app.logo} 
          alt={app.name} 
          className="app-card-custom-logo" 
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      );
    }

    const nameLower = (app.name || '').toLowerCase();
    const platLower = (app.platform || '').toLowerCase();

    if (nameLower.includes('hot') || nameLower.includes('flame')) {
      return <span className="app-logo-fire">🔥</span>;
    }
    if (nameLower.includes('ibo')) {
      return <span className="app-logo-play">▶️</span>;
    }
    if (nameLower.includes('win') || platLower.includes('win')) {
      return <IconWindows size={28} className="app-platform-svg" />;
    }
    if (nameLower.includes('mac') || nameLower.includes('ios') || nameLower.includes('apple') || platLower.includes('ios')) {
      return <IconApple size={28} className="app-platform-svg" />;
    }
    if (nameLower.includes('smart') || nameLower.includes('tv') || platLower.includes('smarttv')) {
      return <IconTv size={28} className="app-platform-svg" />;
    }
    return <IconAndroid size={28} className="app-platform-svg" />;
  };

  return (
    <div className="download-apps-page-root">
      
      {/* 1. Hero Header Banner (matching Image 1) */}
      <section className="download-hero-banner">
        <div className="download-hero-overlay"></div>
        <div className="download-hero-content">
          <h1 className="download-hero-title">{hero.title || 'Application Atlas Pro ONTV'}</h1>
          <nav className="download-breadcrumb-nav" aria-label="Breadcrumb">
            <a 
              href="/" 
              className="breadcrumb-link-home"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateHome) onNavigateHome();
                else window.location.href = '/';
              }}
            >
              {hero.breadcrumbHome || 'HOME'}
            </a>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{hero.breadcrumbCurrent || 'APPLICATION ATLAS PRO ONTV'}</span>
          </nav>
        </div>

        {isAdmin && (
          <button
            type="button"
            className="btn-admin-page-hero-edit"
            onClick={() => setActiveEditingSection({ key: 'downloadApps_hero', title: 'Bannière & Produit Vedette' })}
          >
            ✏️ Modifier le Titre & Produit
          </button>
        )}
      </section>

      {/* 2. Featured Subscription Product Showcase (matching Image 1 & 2) */}
      <section className="download-product-showcase-section">
        <div className="download-container">
          <div className="download-product-grid">
            
            {/* Left Column: Product Details */}
            <div className="download-product-details">
              <h2 className="download-product-heading">
                {featured.title || "Abonnement IPTV France 2026 – Atlas Pro ONTV N°1 du Marché"}
              </h2>
              <p className="download-product-desc">
                {featured.description || "Profitez de l'abonnement Atlas Pro ONTV, avec plus de 11000 chaînes en direct et plus de 121000 films et séries VOD, le tout en qualité exceptionnelle et avec une fluidité remarquable, sans coupures ni interruptions. Compatible avec tous vos appareils, et un support technique disponible 7j/7 pour vous accompagner à tout moment."}
              </p>

              <div className="download-product-price-row">
                <div className="download-price-tag">
                  <span className="download-currency">{featured.currency || '€'}</span>
                  <span className="download-price-amount">{featured.price || '34.99'}</span>
                  <span className="download-period">{featured.period || 'Annuel'}</span>
                </div>

                <div className="download-quality-badge">
                  <IconTv size={22} className="quality-tv-icon" />
                  <span className="quality-text">{featured.qualityBadge || 'Qualité SD/HD/FULLHD/4K'}</span>
                </div>
              </div>

              <div className="download-cta-row">
                <button
                  type="button"
                  className="download-btn-buy"
                  onClick={() => {
                    if (onOpenOrderModal) {
                      onOpenOrderModal({
                        plan: 'atlas-pro',
                        title: featured.title || 'Abonnement Atlas Pro ONTV',
                        price: featured.price || '34.99',
                      });
                    }
                  }}
                >
                  <span>{featured.btnBuyText || 'ACHETER MAINTENANT →'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: TV Screen Device Mockup with Floating Badges */}
            <div className="download-product-screen-area">
              <div className="download-tv-frame">
                <div className="tv-inner-screen">
                  <img
                    src={featured.screenImage || "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=700&auto=format&fit=crop&q=80"}
                    alt="Atlas Pro ONTV Screen"
                    className="tv-display-img"
                  />
                  <div className="tv-portal-mockup-overlay">
                    <div className="tv-top-status-bar">
                      <span className="tv-logo-tag">ATLAS PRO</span>
                      <span className="tv-status-icons">12:38 PM • 4K HDR • 🟢 Live</span>
                    </div>
                    <div className="tv-menu-grid-mockup">
                      <div className="tv-menu-card-item live">
                        <IconTv size={24} />
                        <span>LIVE TV</span>
                      </div>
                      <div className="tv-menu-card-item movies">
                        <IconFilm size={24} />
                        <span>MOVIES</span>
                      </div>
                      <div className="tv-menu-card-item series">
                        <IconPlay size={24} />
                        <span>SERIES</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tv-stand-base"></div>
              </div>

              {/* Floating Pill Badges around TV */}
              <div className="floating-tv-badge badge-top-left">⚡ 11K+ Live</div>
              <div className="floating-tv-badge badge-top-right">4K ULTRA HD</div>
              <div className="floating-tv-badge badge-bottom-left">VOD 121K+</div>
              <div className="floating-tv-badge badge-bottom-right">Support 24/7</div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Easy Installation Strip (Installer facilement l'application) */}
      <section className="download-easy-install-section">
        <div className="download-container">
          <div className="easy-install-header">
            <h3 className="easy-install-title">
              {easyInstall.title || "Installer facilement l'application Atlas Pro ONTV"}
            </h3>
            <p className="easy-install-subtitle">
              {easyInstall.subtitle || "Vous ne voyez pas votre appareil dans la liste ? Aucun souci ! Contactez simplement notre équipe sur WhatsApp, et l'un de nos conseillers se fera un plaisir de vous guider personnellement à travers les étapes d'installation de votre abonnement."}
            </p>
          </div>

          <div className="easy-install-devices-row">
            {(easyInstall.devices || []).map((dev, dIdx) => (
              <div key={dev.id || dIdx} className="easy-install-card">
                <div className="device-icon-box">
                  {dev.type === 'android' && <IconAndroid size={36} className="dev-svg android" />}
                  {dev.type === 'smarttv' && <IconTv size={36} className="dev-svg smarttv" />}
                  {dev.type === 'ios' && <IconApple size={36} className="dev-svg ios" />}
                </div>
                <h4 className="device-card-title">{dev.title}</h4>
                <p className="device-card-sub">{dev.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Categorized Applications Grid (matching Images 2, 3, 4, 5) */}
      <section className="download-categories-section">
        <div className="download-container">

          {/* Admin Bar for Categories Management */}
          {isAdmin && (
            <div className="download-admin-categories-bar">
              <button 
                type="button" 
                className="btn-admin-add-category-direct"
                onClick={handleDirectAddCategory}
              >
                ➕ Ajouter une Nouvelle Catégorie
              </button>
              <button
                type="button"
                className="btn-admin-manage-all"
                onClick={() => setActiveEditingSection({ key: 'downloadApps_categories', title: 'Toutes les Catégories & Applications' })}
              >
                ⚙️ Éditeur Complet des Applications
              </button>
            </div>
          )}

          {/* Categories List */}
          {categories.map((cat, catIdx) => (
            <div key={cat.id || catIdx} className="download-category-block">
              
              {/* Category Header with Admin Controls */}
              <div className="download-category-header">
                <h3 className="download-category-title">{cat.title}</h3>
                
                {isAdmin && (
                  <div className="category-admin-actions">
                    <button
                      type="button"
                      className="btn-cat-add-app"
                      onClick={() => handleDirectAddApp(catIdx)}
                      title="Ajouter une application dans cette catégorie"
                    >
                      ➕ Ajouter une App
                    </button>
                    <button
                      type="button"
                      className="btn-cat-edit"
                      onClick={() => handleDirectEditCategory(catIdx)}
                      title="Modifier le titre de cette catégorie"
                    >
                      ✏️ Renommer
                    </button>
                    <button
                      type="button"
                      className="btn-cat-delete"
                      onClick={() => handleDirectDeleteCategory(catIdx)}
                      title="Supprimer cette catégorie"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                )}
              </div>

              {/* Cards Grid */}
              <div className="download-apps-grid">
                {(cat.apps || []).map((app, appIdx) => (
                  <div key={app.id || appIdx} className="app-download-card">
                    
                    {/* Admin Actions for individual app card */}
                    {isAdmin && (
                      <div className="app-card-admin-overlay">
                        <button
                          type="button"
                          className="btn-app-card-edit"
                          onClick={() => handleDirectEditApp(catIdx, appIdx)}
                          title="Modifier cette application"
                        >
                          <IconEdit size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn-app-card-delete"
                          onClick={() => handleDirectDeleteApp(catIdx, appIdx)}
                          title="Supprimer cette application"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* App Logo */}
                    <div className="app-card-logo-container">
                      {renderAppIcon(app)}
                    </div>

                    {/* App Name */}
                    <h4 className="app-card-name">{app.name}</h4>

                    {/* Downloader Code / Note */}
                    <span className="app-card-downloader-code">
                      {app.downloaderCode || 'Disponible directement'}
                    </span>

                    {/* Download Button */}
                    <a
                      href={app.downloadUrl || '#'}
                      className="app-card-download-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!app.downloadUrl || app.downloadUrl === '#') {
                          e.preventDefault();
                          showAlertModal({
                            type: 'info',
                            title: `Téléchargement : ${app.name}`,
                            message: `Pour installer cette application sur Android TV ou Firestick :`,
                            details: {
                              appName: app.name,
                              code: app.downloaderCode ? app.downloaderCode.replace(/code downloader\s*:\s*/i, '').trim() : 'Installation via Downloader',
                              instructions: 'Ouvrez l\'application "Downloader" sur votre TV, saisissez ce code numérique puis validez pour lancer le téléchargement automatique.',
                            },
                            confirmText: 'Compris',
                          });
                        }
                      }}
                    >
                      <IconDownload size={16} className="btn-dl-icon" />
                      <span>{app.btnText || `Télécharger ${app.name}`}</span>
                    </a>
                  </div>
                ))}
              </div>

            </div>
          ))}

        </div>
      </section>

    </div>
  );
};
