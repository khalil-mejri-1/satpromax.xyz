import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  IconPlus, 
  IconSearch, 
  IconEdit, 
  IconTrash, 
  IconClose, 
  IconCheck, 
  IconCopy
} from './Icons';

export const DEFAULT_SITE_PAGES = [
  {
    id: 'page-home',
    title: "SatProMax | L'expert du Streaming IPTV 4K & VOD Mondiale",
    slug: '/',
    permalink: '',
    externalLink: '',
    style: '',
    type: "Page d'accueil",
    status: 'published',
    isSystem: true,
    seoTitle: "SatProMax | Meilleur Service IPTV 2026 - 19,000+ Chaînes 4K & VOD",
    seoDescription: "Abonnement IPTV premium sans coupure avec plus de 19,000 chaînes directes et 56,000 films/séries VOD. Serveurs AntiFreeze 9.0 et activation instantanée.",
    keywords: "iptv\nstreaming iptv 4k\nsatpromax\nabonnement iptv\nchaines direct",
    lastModified: "Aujourd'hui",
  },
  {
    id: 'page-apps',
    title: "Téléchargement Applications IPTV | Atlas Pro ONTV, Smarters & TiviMate",
    slug: '/download-apps',
    permalink: 'download-apps',
    externalLink: '',
    style: '',
    type: "Page d'application",
    status: 'published',
    isSystem: true,
    seoTitle: "Télécharger Atlas Pro ONTV APK & Applications IPTV | SatProMax",
    seoDescription: "Téléchargez directement les applications officielles IPTV pour FireStick, Android TV, Smart TV Samsung/LG et iOS.",
    keywords: "telecharger iptv\natlas pro ontv\niptv smarters\ntivimate\napk firestick",
    lastModified: "Aujourd'hui",
  },
  {
    id: 'page-pricing',
    title: "Nos Tarifs & Forfaits d'Abonnement IPTV (1, 2 et 3 Écrans)",
    slug: '/pricing',
    permalink: 'pricing',
    externalLink: '',
    style: '',
    type: "Page Tarifs",
    status: 'published',
    isSystem: true,
    seoTitle: "Abonnement IPTV Pas Cher - Tarifs & Forfaits SatProMax",
    seoDescription: "Découvrez nos offres d'abonnement 1 mois, 3 mois, 6 mois, 12 mois et 24 mois pour 1 écran, Pack Famille 2 écrans et Multi-Room 3 écrans.",
    keywords: "prix iptv\ntarif abonnement iptv\npas cher\nmulti room iptv\nforfait iptv",
    lastModified: "Aujourd'hui",
  },
  {
    id: 'page-channels',
    title: "Catalogue & Liste Complète des 19,000+ Chaînes en Direct",
    slug: '/channels',
    permalink: 'channels',
    externalLink: '',
    style: '',
    type: "Catalogue Chaînes",
    status: 'published',
    isSystem: true,
    seoTitle: "Liste Complète des Chaînes IPTV 2026 | SatProMax",
    seoDescription: "Consultez la base de données de toutes les chaînes françaises, arabes, européennes et américaines en direct et sans coupure.",
    keywords: "liste chaines iptv\nchaines francaises\nchaines arabes\nbein sports\ncanal+",
    lastModified: "Aujourd'hui",
  },
  {
    id: 'page-sports',
    title: "Événements Sportifs Internationaux & Pass PPV en Direct 60 FPS",
    slug: '/sports',
    permalink: 'sports',
    externalLink: '',
    style: '',
    type: "Page Sports",
    status: 'published',
    isSystem: true,
    seoTitle: "Regarder le Sport en Direct IPTV - beIN, Champions League & UFC",
    seoDescription: "Toutes les compétitions sportives en direct et haute définition 4K / 60 FPS sans décalage ni latence.",
    keywords: "sport iptv direct\nchampions league\nligue 1\nufc direct\npremier league",
    lastModified: "Aujourd'hui",
  },
  {
    id: 'page-epg',
    title: "Guide Électronique des Programmes (EPG) & Catch-Up Replay",
    slug: '/channels',
    permalink: 'epg',
    externalLink: '',
    style: '',
    type: "Fonctionnalité EPG",
    status: 'published',
    isSystem: true,
    seoTitle: "Guide TV EPG Interactif & Replay 7 Jours | SatProMax",
    seoDescription: "Guide des programmes TV synchronisé toutes les 6 heures avec fonction d'enregistrement et replay sur 7 jours.",
    keywords: "guide programme tv\nepg iptv\nreplay tv 7 jours\ncatch up iptv",
    lastModified: "Aujourd'hui",
  },
  {
    id: 'page-vod',
    title: "VOD - Nouveaux Films & Séries 4K Ajoutés (Netflix, HBO Max, Prime)",
    slug: '/vod',
    permalink: 'vod',
    externalLink: '',
    style: '',
    type: "Page VOD",
    status: 'published',
    isSystem: true,
    seoTitle: "Catalogue Films & Séries VOD 4K en Streaming | SatProMax",
    seoDescription: "Plus de 56,000 films et séries récents mis à jour quotidiennement en qualité 4K Dolby et Ultra HD.",
    keywords: "films 4k streaming\nseries netflix vod\nvod iptv 2026\ncinema ultra hd",
    lastModified: "Aujourd'hui",
  },
  {
    id: 'page-devices',
    title: "Appareils & Systèmes Compatibles (Fire TV, Android, Smart TV, Apple)",
    slug: '/devices',
    permalink: 'devices',
    externalLink: '',
    style: '',
    type: "Page Appareils",
    status: 'published',
    isSystem: true,
    seoTitle: "Appareils Compatibles avec l'Abonnement IPTV | SatProMax",
    seoDescription: "Compatible avec tous vos équipements : Amazon FireStick, Smart TV Samsung, LG, Android TV Box, Apple TV, MAG et PC.",
    keywords: "appareils compatibles iptv\nsmart tv samsung lg\nfirestick\nandroid box\napple tv",
    lastModified: "Aujourd'hui",
  },
  {
    id: 'page-install',
    title: "Guide d'Installation Rapide & Tutoriels de Configuration en 2 Minutes",
    slug: '/install',
    permalink: 'install',
    externalLink: '',
    style: '',
    type: "Guide Installation",
    status: 'published',
    isSystem: true,
    seoTitle: "Comment Installer IPTV sur Smart TV & FireStick | Guide SatProMax",
    seoDescription: "Instructions d'installation pas à pas pour IPTV Smarters Pro, TiviMate, IBO Player et boîtiers MAG.",
    keywords: "tutoriel installation iptv\nconfigurer smarters pro\ninstaller firestick\nconfiguration mag",
    lastModified: "Aujourd'hui",
  },
  {
    id: 'page-faq',
    title: "Foire Aux Questions (FAQ) & Assistance Client WhatsApp 24/7",
    slug: '/contact',
    permalink: 'faq',
    externalLink: '',
    style: '',
    type: "Support & FAQ",
    status: 'published',
    isSystem: true,
    seoTitle: "Questions Fréquentes & Support Client IPTV | SatProMax",
    seoDescription: "Réponses à toutes vos questions sur la livraison, la compatibilité, la garantie et assistance directe 24h/24 par WhatsApp.",
    keywords: "faq iptv\nassistance whatsapp\nsupport technique satpromax",
    lastModified: "Aujourd'hui",
  },
  {
    id: 'page-checkout',
    title: "Finaliser votre commande - Paiement 100% Sécurisé | SatProMax",
    slug: '/pricing',
    permalink: 'checkout',
    externalLink: '',
    style: '',
    type: "Tunnel Commande",
    status: 'published',
    isSystem: true,
    seoTitle: "Finaliser votre Abonnement IPTV - Paiement Sécurisé SSL",
    seoDescription: "Formulaire d'activation immédiate de votre abonnement avec paiement sécurisé par Carte Bancaire, PayPal ou Crypto.",
    keywords: "commander iptv\npaiement securise cb paypal\nactivation immediate",
    lastModified: "Aujourd'hui",
  },
  {
    id: 'page-terms',
    title: "Conditions Générales de Vente & d'Utilisation (CGV/CGU)",
    slug: '/terms',
    permalink: 'terms',
    externalLink: '',
    style: '',
    type: "Page Légale",
    status: 'published',
    isSystem: true,
    seoTitle: "Conditions Générales d'Utilisation | SatProMax",
    seoDescription: "Conditions contractuelles, règles d'utilisation et engagements de service de la plateforme SatProMax.",
    keywords: "conditions generales de vente\ncgv cgu\nmentions legales satpromax",
    lastModified: "Aujourd'hui",
  },
  {
    id: 'page-privacy',
    title: "Politique de Confidentialité & Protection des Données Personnelles",
    slug: '/privacy',
    permalink: 'politique-de-confidentialite',
    externalLink: '',
    style: '',
    type: "Page Légale",
    status: 'published',
    isSystem: true,
    seoTitle: "Politique de Confidentialité & Respect de la Vie Privée | SatProMax",
    seoDescription: "Protection de votre vie privée, chiffrement SSL 256-bit et engagement de non-partage des données personnelles.",
    keywords: "politique confidentialite\nrgpd donnees personnelles\nsatpromax",
    lastModified: "Aujourd'hui",
  },
  {
    id: 'page-refund',
    title: "Politique de Remboursement & Garantie Satisfait ou Remboursé 7 Jours",
    slug: '/refund',
    permalink: 'remboursement',
    externalLink: '',
    style: '',
    type: "Page Légale",
    status: 'published',
    isSystem: true,
    seoTitle: "Garantie Satisfait ou Remboursé 7 Jours | SatProMax",
    seoDescription: "Garantie intégrale de 7 jours : remboursement sans condition si notre service ne répond pas à vos attentes.",
    keywords: "remboursement iptv\ngarantie 7 jours\nsatisfait ou rembourse",
    lastModified: "Aujourd'hui",
  },
];

// Clean any slug to strictly remove /# or # and return /clean-path
export const cleanSlugUrl = (rawSlug) => {
  if (!rawSlug) return '/';
  let s = String(rawSlug).trim();
  // Strip any /# or # occurrences
  s = s.replace(/^\/#/, '/').replace(/^#/, '/').replace(/#/g, '');
  if (!s.startsWith('/')) s = '/' + s;
  return s;
};

export const PagesListView = ({ 
  content, 
  updateSection, 
  saveToServer, 
  triggerNotification,
  onNavigateHome,
  onSwitchTab 
}) => {
  // Stored pages or fallback to DEFAULT_SITE_PAGES, ensuring ALL slugs are clean without #
  const pagesList = useMemo(() => {
    const list = (content?.sitePages && Array.isArray(content.sitePages) && content.sitePages.length > 0)
      ? content.sitePages
      : DEFAULT_SITE_PAGES;

    return list.map((item) => ({
      ...item,
      slug: cleanSlugUrl(item.slug)
    }));
  }, [content?.sitePages]);

  // Auto-migrate any stored sitePages in content / localStorage to clean paths without #
  useEffect(() => {
    if (content?.sitePages && Array.isArray(content.sitePages)) {
      const hasOldHash = content.sitePages.some((p) => p.slug && p.slug.includes('#'));
      if (hasOldHash) {
        const cleaned = content.sitePages.map((p) => ({
          ...p,
          slug: cleanSlugUrl(p.slug)
        }));
        updateSection('sitePages', cleaned);
        if (saveToServer) {
          saveToServer({
            ...content,
            sitePages: cleaned,
          });
        }
      }
    }
  }, [content?.sitePages]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  // Edit / Add modal state
  const [editingPage, setEditingPage] = useState(null);
  const [isNewPage, setIsNewPage] = useState(false);
  const [pageFormData, setPageFormData] = useState({
    id: '',
    title: '',
    permalink: '',
    slug: '',
    externalLink: '',
    style: '',
    type: 'Page',
    status: 'published',
    seoTitle: '',
    seoDescription: '',
    keywords: '',
  });

  // Filtered pages
  const filteredPages = useMemo(() => {
    return pagesList.filter((p) => {
      const cleanS = cleanSlugUrl(p.slug);
      const perm = (p.permalink || cleanS.replace(/^\//, '')).toLowerCase();
      const matchesSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cleanS.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perm.includes(searchTerm.toLowerCase()) ||
        (p.seoTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.type || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || p.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [pagesList, searchTerm, filterType]);

  // Open Page helper: Opens clean URL without # (e.g. /pricing, /channels)
  const handleViewPage = (page) => {
    if (page.externalLink && page.externalLink.startsWith('http')) {
      window.open(page.externalLink, '_blank');
      return;
    }
    const cleanUrl = cleanSlugUrl(page.slug);
    window.open(cleanUrl, '_blank');
  };

  // Open modal for editing with all SEO & page attributes
  const handleOpenEdit = (page) => {
    setIsNewPage(false);
    setEditingPage(page);
    const cleanS = cleanSlugUrl(page.slug || '');
    const cleanPerm = page.permalink || cleanS.replace(/^\//, '') || '';
    setPageFormData({
      id: page.id,
      title: page.title || '',
      permalink: cleanPerm,
      slug: cleanS || '/',
      externalLink: page.externalLink || '',
      style: page.style || '',
      type: page.type || 'Page',
      status: page.status || 'published',
      seoTitle: page.seoTitle || page.title || '',
      seoDescription: page.seoDescription || '',
      keywords: page.keywords || '',
    });
  };

  // Open modal for adding
  const handleOpenAdd = () => {
    setIsNewPage(true);
    const newId = `page-${Date.now()}`;
    setEditingPage({ id: newId });
    setPageFormData({
      id: newId,
      title: '',
      permalink: 'nouvelle-page',
      slug: '/nouvelle-page',
      externalLink: '',
      style: '',
      type: 'Page personnalisée',
      status: 'published',
      seoTitle: '',
      seoDescription: '',
      keywords: '',
    });
  };

  // Save page form with all SEO attributes
  const handleSavePage = async (e) => {
    e.preventDefault();
    if (!pageFormData.title.trim()) return;

    const rawPermalink = pageFormData.permalink || pageFormData.slug || '';
    const cleanS = cleanSlugUrl(rawPermalink.startsWith('/') ? rawPermalink : '/' + rawPermalink);
    const cleanPerm = cleanS.replace(/^\//, '');

    const savedData = {
      ...pageFormData,
      slug: cleanS,
      permalink: cleanPerm,
      externalLink: pageFormData.externalLink || '',
      style: pageFormData.style || '',
      seoTitle: pageFormData.seoTitle || pageFormData.title,
      seoDescription: pageFormData.seoDescription || '',
      keywords: pageFormData.keywords || '',
      lastModified: 'Aujourd\'hui',
    };

    let updatedList = [];
    if (isNewPage) {
      const newPageObj = {
        ...savedData,
        id: pageFormData.id || `page-${Date.now()}`,
        isSystem: false,
      };
      updatedList = [newPageObj, ...pagesList];
    } else {
      updatedList = pagesList.map((p) => {
        if (p.id === pageFormData.id) {
          return {
            ...p,
            ...savedData,
          };
        }
        return p;
      });
    }

    updateSection('sitePages', updatedList);
    if (saveToServer) {
      await saveToServer({
        ...content,
        sitePages: updatedList,
      });
    }

    if (triggerNotification) {
      triggerNotification(isNewPage ? '✨ Nouvelle page ajoutée avec succès !' : '✅ Paramètres SEO de la page enregistrés avec succès !');
    }
    setEditingPage(null);
  };

  // Delete custom page
  const handleDeletePage = async (pageId, pageTitle) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la page "${pageTitle}" ?`)) {
      const updatedList = pagesList.filter((p) => p.id !== pageId);
      updateSection('sitePages', updatedList);
      if (saveToServer) {
        await saveToServer({
          ...content,
          sitePages: updatedList,
        });
      }
      if (triggerNotification) {
        triggerNotification('🗑️ Page supprimée de la liste.');
      }
    }
  };

  return (
    <div className="pages-list-view-container animate-fade-in">
      


      {/* 2. Search & Filter Bar */}
      <div className="pages-filter-strip">
        <div className="pages-search-box">
          <span className="search-icon-inside"><IconSearch size={16} /></span>
          <input
            type="text"
            className="pages-search-input"
            placeholder="Rechercher par titre de page ou URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              type="button" 
              className="btn-clear-search" 
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="pages-stats-pill">
          <span>{filteredPages.length} {filteredPages.length === 1 ? 'page trouvée' : 'pages répertoriées'}</span>
        </div>
      </div>

      {/* 3. Pages List Container (styled exactly like Image 2) */}
      <div className="pages-list-card-box">
        {filteredPages.length === 0 ? (
          <div className="pages-empty-state">
            <span className="empty-icon">🔍</span>
            <h3>Aucune page ne correspond à votre recherche</h3>
            <p>Essayez un autre mot-clé ou réinitialisez le filtre pour voir toutes les pages.</p>
            <button 
              type="button" 
              className="btn-reset-filters" 
              onClick={() => setSearchTerm('')}
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          <div className="pages-rows-list">
            {filteredPages.map((page, index) => (
              <div 
                key={page.id || index} 
                className="page-row-item"
              >
                {/* Left Side: Page Title & Meta Details */}
                <div className="page-info-col">
                  <div className="page-title-row">
                    <span className="page-document-bullet">📄</span>
                    <h3 
                      className="page-title-text"
                      onClick={() => handleViewPage(page)}
                      title="Cliquer pour visiter la page"
                    >
                      {page.title}
                    </h3>
                  </div>

                  <div className="page-meta-row">
                    <span className="page-slug-badge" title="Lien de la page">
                      {page.slug}
                    </span>
                    <span className="page-type-tag">
                      {page.type || 'Page'}
                    </span>
                    <span className="page-status-pill">
                      <span className="status-dot"></span>
                      Publiée
                    </span>
                  </div>
                </div>

                {/* Right Side: Quick Action Buttons */}
                <div className="page-actions-col">
                  <button
                    type="button"
                    className="btn-page-action btn-view"
                    onClick={() => handleViewPage(page)}
                    title="Voir et tester la page sur le site"
                  >
                    <span>👁️</span>
                    <span className="btn-label-desktop">Voir</span>
                  </button>

                  <button
                    type="button"
                    className="btn-page-action btn-edit"
                    onClick={() => handleOpenEdit(page)}
                    title="Modifier le titre et les métadonnées SEO"
                  >
                    <IconEdit size={14} />
                    <span className="btn-label-desktop">Modifier</span>
                  </button>

                  {!page.isSystem && (
                    <button
                      type="button"
                      className="btn-page-action btn-delete"
                      onClick={() => handleDeletePage(page.id, page.title)}
                      title="Supprimer cette page personnalisée"
                    >
                      <IconTrash size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Edit / Add Page Modal (mounted via Portal to be above all sections) */}
      {editingPage && typeof document !== 'undefined' && createPortal(
        <div className="admin-modal-overlay" onClick={() => setEditingPage(null)}>
          <div className="admin-modal-box animate-pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-header-text">
                <div className="admin-modal-title-with-badge">
                  <span className="modal-header-icon-pill">{isNewPage ? '➕' : '✏️'}</span>
                  <h3>{isNewPage ? 'Ajouter une Nouvelle Page' : 'Modifier les Paramètres & SEO de la Page'}</h3>
                </div>
                <p className="admin-modal-header-sub">
                  Personnalisez le titre, l'URL permalink, les balises SEO Google et le style visuel
                </p>
              </div>
              <button 
                type="button" 
                className="btn-modal-close" 
                onClick={() => setEditingPage(null)}
                title="Fermer"
              >
                <IconClose size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="admin-modal-form">
              {/* Card 1: Page Details & Links */}
              <div className="modal-section-card">
                <div className="modal-section-title">
                  <span className="section-icon">📑</span>
                  <span>Paramètres Généraux & Liens</span>
                </div>

                <div className="modal-form-grid-2">
                  <div className="form-field-group">
                    <label>Titre <span className="req-star">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="ex: Politique de Confidentialité"
                      value={pageFormData.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setPageFormData(prev => ({
                          ...prev,
                          title: newTitle,
                          seoTitle: !prev.seoTitle || prev.seoTitle === prev.title ? `${newTitle} - SatProMax` : prev.seoTitle
                        }));
                      }}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Permalink <span className="req-star">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="ex: politique-de-confidentialite"
                      value={pageFormData.permalink}
                      onChange={(e) => {
                        const cleanVal = e.target.value;
                        setPageFormData(prev => ({
                          ...prev,
                          permalink: cleanVal,
                          slug: cleanVal ? (cleanVal.startsWith('/') ? cleanVal : '/' + cleanVal) : '/'
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="modal-form-grid-2">
                  <div className="form-field-group">
                    <label>Lien externe</label>
                    <input 
                      type="text" 
                      placeholder="ex: https://monsite-externe.com (Optionnel)"
                      value={pageFormData.externalLink || ''}
                      onChange={(e) => setPageFormData({ ...pageFormData, externalLink: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Style</label>
                    <input 
                      type="text" 
                      placeholder="ex: fullwidth-dark, custom-theme (Optionnel)"
                      value={pageFormData.style || ''}
                      onChange={(e) => setPageFormData({ ...pageFormData, style: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-form-grid-2">
                  <div className="form-field-group">
                    <label>Catégorie de Page</label>
                    <select
                      className="form-select-control"
                      value={pageFormData.type}
                      onChange={(e) => setPageFormData({ ...pageFormData, type: e.target.value })}
                    >
                      <option value="Page d'accueil">Page d'accueil</option>
                      <option value="Page d'application">Page d'application</option>
                      <option value="Page Tarifs">Page Tarifs & Forfaits</option>
                      <option value="Catalogue Chaînes">Catalogue Chaînes</option>
                      <option value="Page Sports">Page Sports</option>
                      <option value="Page VOD">Page VOD</option>
                      <option value="Guide Installation">Guide d'Installation</option>
                      <option value="Support & FAQ">Support & FAQ</option>
                      <option value="Tunnel Commande">Tunnel de Commande</option>
                      <option value="Page Légale">Page Légale (CGV/RGPD)</option>
                      <option value="Page personnalisée">Page personnalisée</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label>Statut de Publication</label>
                    <select
                      className="form-select-control"
                      value={pageFormData.status || 'published'}
                      onChange={(e) => setPageFormData({ ...pageFormData, status: e.target.value })}
                    >
                      <option value="published">🟢 Publiée & Indexable</option>
                      <option value="draft">🟡 Brouillon (Non indexée)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Card 2: SEO Meta & Google Snippet */}
              <div className="modal-section-card seo-section-card">
                <div className="modal-section-title">
                  <span className="section-icon">🚀</span>
                  <span>Référencement & Optimisation SEO Google</span>
                </div>

                <div className="form-field-group">
                  <div className="label-with-counter">
                    <label>Titre de la page (Meta Title)</label>
                    <span className={`char-counter ${(pageFormData.seoTitle || '').length > 65 ? 'counter-warn' : ''}`}>
                      {(pageFormData.seoTitle || '').length}/65 caractères
                    </span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="ex: politique de confidentialité - offipro.net"
                    value={pageFormData.seoTitle}
                    onChange={(e) => setPageFormData({ ...pageFormData, seoTitle: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <div className="label-with-counter">
                    <label>Description (Meta Description)</label>
                    <span className={`char-counter ${(pageFormData.seoDescription || '').length > 165 ? 'counter-warn' : ''}`}>
                      {(pageFormData.seoDescription || '').length}/165 caractères
                    </span>
                  </div>
                  <textarea 
                    rows={3}
                    placeholder="Chez SatProMax, nous accordons une grande importance à la protection de vos données personnelles..."
                    value={pageFormData.seoDescription}
                    onChange={(e) => setPageFormData({ ...pageFormData, seoDescription: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Keywords</label>
                  <textarea 
                    rows={2}
                    placeholder={"politique confidentialité\noffipro\niptv streaming 4k"}
                    value={pageFormData.keywords || ''}
                    onChange={(e) => setPageFormData({ ...pageFormData, keywords: e.target.value })}
                  />
                  <span className="field-helper-text">Insérez vos mots-clés séparés par des retours à la ligne ou des virgules.</span>
                </div>

                {/* Live Google Search Preview */}
                <div className="google-serp-preview-box">
                  <div className="serp-preview-header">
                    <span className="google-icon">🌐</span>
                    <span className="serp-title-heading">Aperçu Google Search (SERP)</span>
                  </div>
                  <div className="google-serp-card">
                    <div className="serp-card-site">
                      <span className="serp-site-icon">🔍</span>
                      <span className="serp-site-url">
                        https://satpromax.xyz › {(pageFormData.permalink || (pageFormData.slug || '').replace(/^\//, '') || 'page')}
                      </span>
                    </div>
                    <div className="serp-card-title">
                      {pageFormData.seoTitle || pageFormData.title || "Titre de la page - SatProMax"}
                    </div>
                    <div className="serp-card-snippet">
                      {pageFormData.seoDescription || "Ajoutez une méta-description pour afficher ici un résumé optimisé pour les résultats de recherche Google."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  className="btn-modal-cancel"
                  onClick={() => setEditingPage(null)}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn-modal-save"
                >
                  <IconCheck size={16} />
                  <span>{isNewPage ? 'Créer la page' : 'Enregistrer les modifications'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
