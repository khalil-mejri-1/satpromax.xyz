import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { IconClose, IconCheck, IconZap } from './Icons';

export const SectionEditModal = () => {
  const { content, updateSection, activeEditingSection, setActiveEditingSection, showConfirm } = useContent();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (activeEditingSection) {
      if (activeEditingSection.key === 'downloadApps_hero' || activeEditingSection.key === 'downloadApps_categories') {
        setFormData(JSON.parse(JSON.stringify(content.downloadApps || {})));
      } else if (content[activeEditingSection.key]) {
        // Deep clone section data into local form state
        setFormData(JSON.parse(JSON.stringify(content[activeEditingSection.key])));
      }
    }
  }, [activeEditingSection, content]);

  if (!activeEditingSection) return null;

  const sectionKey = activeEditingSection.key;
  const sectionTitle = activeEditingSection.title;

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleArrayItemChange = (arrayKey, index, field, value) => {
    setFormData((prev) => {
      const arr = [...(prev[arrayKey] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [arrayKey]: arr };
    });
  };

  // Pricing features helper
  const handleFeatureListChange = (planIndex, featIndex, value) => {
    setFormData((prev) => {
      const plans = [...(prev.plans || [])];
      const features = [...(plans[planIndex].features || [])];
      features[featIndex] = value;
      plans[planIndex] = { ...plans[planIndex], features };
      return { ...prev, plans };
    });
  };

  const handleAddFeatureToPlan = (planIndex) => {
    setFormData((prev) => {
      const plans = [...(prev.plans || [])];
      const features = [...(plans[planIndex].features || []), 'Nouvelle fonctionnalité'];
      plans[planIndex] = { ...plans[planIndex], features };
      return { ...prev, plans };
    });
  };

  const handleRemoveFeatureFromPlan = (planIndex, featIndex) => {
    setFormData((prev) => {
      const plans = [...(prev.plans || [])];
      const features = plans[planIndex].features.filter((_, i) => i !== featIndex);
      plans[planIndex] = { ...plans[planIndex], features };
      return { ...prev, plans };
    });
  };

  // FAQ helpers
  const handleAddFaqItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        { q: 'Nouvelle question fréquente ?', a: 'Réponse claire et détaillée sur le service...' },
      ],
    }));
  };

  const handleRemoveFaqItem = (index) => {
    const item = formData.items?.[index];
    showConfirm({
      type: 'danger',
      title: 'Supprimer cette FAQ ?',
      message: `Êtes-vous sûr de vouloir supprimer la question "${item?.q || ''}" ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      onConfirm: () => {
        setFormData((prev) => ({
          ...prev,
          items: (prev.items || []).filter((_, i) => i !== index),
        }));
      },
    });
  };

  // VOD helpers
  const handleAddVodItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        {
          id: Date.now(),
          title: 'Nouveau Film / Série',
          rating: '9.2',
          genre: 'Action, Aventure',
          quality: '4K HDR',
          platform: 'NETFLIX',
          description: 'Description du film ou de la série disponible en haute qualité...',
        },
      ],
    }));
  };

  const handleRemoveVodItem = (index) => {
    const item = formData.items?.[index];
    showConfirm({
      type: 'danger',
      title: 'Supprimer cet élément VOD ?',
      message: `Êtes-vous sûr de vouloir supprimer "${item?.title || 'cet élément'}" ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      onConfirm: () => {
        setFormData((prev) => ({
          ...prev,
          items: (prev.items || []).filter((_, i) => i !== index),
        }));
      },
    });
  };

  // Install step helper
  const handleInstallStepChange = (appIndex, stepIndex, value) => {
    setFormData((prev) => {
      const apps = [...(prev.apps || [])];
      const steps = [...(apps[appIndex].steps || [])];
      steps[stepIndex] = value;
      apps[appIndex] = { ...apps[appIndex], steps };
      return { ...prev, apps };
    });
  };

  const handleAddInstallStep = (appIndex) => {
    setFormData((prev) => {
      const apps = [...(prev.apps || [])];
      const steps = [...(apps[appIndex].steps || []), 'New step: Open the app and start streaming.'];
      apps[appIndex] = { ...apps[appIndex], steps };
      return { ...prev, apps };
    });
  };

  const handleRemoveInstallStep = (appIndex, stepIndex) => {
    setFormData((prev) => {
      const apps = [...(prev.apps || [])];
      const steps = apps[appIndex].steps.filter((_, i) => i !== stepIndex);
      apps[appIndex] = { ...apps[appIndex], steps };
      return { ...prev, apps };
    });
  };

  // Install app (section) helpers
  const handleAddInstallApp = () => {
    setFormData((prev) => ({
      ...prev,
      apps: [
        ...(prev.apps || []),
        {
          id: `app_${Date.now()}`,
          name: 'New Application',
          devices: 'Android, iOS, Smart TV',
          steps: ['Step 1: Download and install the application.', 'Step 2: Enter your credentials and enjoy!'],
        },
      ],
    }));
  };

  const handleRemoveInstallApp = (appIndex) => {
    const app = formData.apps?.[appIndex];
    showConfirm({
      type: 'danger',
      title: 'Supprimer ce guide d\'installation ?',
      message: `Êtes-vous sûr de vouloir supprimer le guide pour "${app?.name || 'cette application'}" et toutes ses étapes ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      onConfirm: () => {
        setFormData((prev) => ({
          ...prev,
          apps: (prev.apps || []).filter((_, i) => i !== appIndex),
        }));
      },
    });
  };

  // Image file uploader helper (converts to base64 Data URL so user can pick any photo from their computer)
  const handleImageFileChange = (arrayKey, index, field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      handleArrayItemChange(arrayKey, index, field, uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Testimonials helpers
  const handleAddTestimonialItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        {
          id: Date.now(),
          name: 'Nouveau Client',
          location: 'France',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          rating: 5,
          text: 'Service IPTV remarquable ! Zéro coupure et activation immédiate.',
        },
      ],
    }));
  };

  const handleRemoveTestimonialItem = (index) => {
    const item = formData.items?.[index];
    showConfirm({
      type: 'danger',
      title: 'Supprimer ce témoignage ?',
      message: `Êtes-vous sûr de vouloir supprimer l'avis de "${item?.name || 'ce client'}" ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      onConfirm: () => {
        setFormData((prev) => ({
          ...prev,
          items: (prev.items || []).filter((_, i) => i !== index),
        }));
      },
    });
  };

  // Client proofs helpers
  const handleAddClientProofItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        {
          id: Date.now(),
          title: '+1 (555) 789-xxxx',
          clientPhone: '+1 (555) ***-****',
          image: '',
          caption: 'Activation rapide et confirmation client',
          messages: [
            { sender: 'them', text: 'Hello, I just ordered the subscription', time: '2:10 PM', status: 'read' },
            { sender: 'me', text: 'Welcome! Your playlist is ready and sent to email', time: '2:12 PM' },
            { sender: 'them', text: 'All 4K channels work smoothly, thank you!', time: '2:15 PM', reaction: '❤️' },
          ],
        },
      ],
    }));
  };

  const handleRemoveClientProofItem = (index) => {
    const item = formData.items?.[index];
    showConfirm({
      type: 'danger',
      title: 'Supprimer cette preuve client ?',
      message: `Êtes-vous sûr de vouloir supprimer la preuve "${item?.title || 'sélectionnée'}" ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      onConfirm: () => {
        setFormData((prev) => ({
          ...prev,
          items: (prev.items || []).filter((_, i) => i !== index),
        }));
      },
    });
  };

  // Download Apps helpers
  const handleFeaturedImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setFormData((prev) => ({
        ...prev,
        featuredProduct: {
          ...(prev.featuredProduct || {}),
          screenImage: uploadEvent.target.result,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddAppCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...(prev.categories || []),
        {
          id: `cat_${Date.now()}`,
          title: "Nouvelle Catégorie d'Applications",
          apps: [
            {
              id: `app_${Date.now()}`,
              name: 'Nouvelle Application',
              downloaderCode: 'Code downloader : 000000',
              downloadUrl: '#',
              btnText: 'Télécharger APK',
              logo: '',
              platform: 'android',
            },
          ],
        },
      ],
    }));
  };

  const handleRemoveAppCategory = (catIdx) => {
    const cat = formData.categories?.[catIdx];
    showConfirm({
      type: 'danger',
      title: 'Supprimer la catégorie ?',
      message: `Voulez-vous vraiment supprimer "${cat?.title || 'cette catégorie'}" et toutes ses applications ?`,
      confirmText: 'Supprimer la catégorie',
      cancelText: 'Annuler',
      onConfirm: () => {
        setFormData((prev) => ({
          ...prev,
          categories: (prev.categories || []).filter((_, i) => i !== catIdx),
        }));
      },
    });
  };

  const handleCategoryTitleChange = (catIdx, value) => {
    setFormData((prev) => {
      const cats = [...(prev.categories || [])];
      cats[catIdx] = { ...cats[catIdx], title: value };
      return { ...prev, categories: cats };
    });
  };

  const handleAddAppToCategory = (catIdx) => {
    setFormData((prev) => {
      const cats = [...(prev.categories || [])];
      const apps = [
        ...(cats[catIdx].apps || []),
        {
          id: `app_${Date.now()}`,
          name: 'Nouvelle Application',
          downloaderCode: 'Code downloader : 123456',
          downloadUrl: '#',
          btnText: 'Télécharger APK',
          logo: '',
          platform: 'android',
        },
      ];
      cats[catIdx] = { ...cats[catIdx], apps };
      return { ...prev, categories: cats };
    });
  };

  const handleRemoveAppFromCategory = (catIdx, appIdx) => {
    const app = formData.categories?.[catIdx]?.apps?.[appIdx];
    showConfirm({
      type: 'danger',
      title: 'Supprimer cette application ?',
      message: `Êtes-vous sûr de vouloir supprimer l'application "${app?.name || ''}" ?`,
      confirmText: 'Supprimer l\'application',
      cancelText: 'Annuler',
      onConfirm: () => {
        setFormData((prev) => {
          const cats = [...(prev.categories || [])];
          const apps = cats[catIdx].apps.filter((_, i) => i !== appIdx);
          cats[catIdx] = { ...cats[catIdx], apps };
          return { ...prev, categories: cats };
        });
      },
    });
  };

  const handleAppFieldChange = (catIdx, appIdx, field, value) => {
    setFormData((prev) => {
      const cats = [...(prev.categories || [])];
      const apps = [...(cats[catIdx].apps || [])];
      apps[appIdx] = { ...apps[appIdx], [field]: value };
      cats[catIdx] = { ...cats[catIdx], apps };
      return { ...prev, categories: cats };
    });
  };

  const handleAppLogoUpload = (catIdx, appIdx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      handleAppFieldChange(catIdx, appIdx, 'logo', uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (sectionKey === 'downloadApps_hero' || sectionKey === 'downloadApps_categories') {
      updateSection('downloadApps', formData);
    } else {
      updateSection(sectionKey, formData);
    }
    setActiveEditingSection(null);
  };

  return (
    <div className="admin-editor-backdrop" onClick={() => setActiveEditingSection(null)}>
      <div 
        className="admin-editor-dialog animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
        dir="ltr"
      >
        {/* Modal Top Bar (Fixed & Clean) */}
        <div className="admin-editor-top-bar">
          <div className="admin-editor-title-area">
            <div className="admin-badge-pill">
              <IconZap size={13} />
              <span>Éditeur de Section en Direct</span>
            </div>
            <h3 className="admin-modal-heading">
              Modifier la section : <span className="admin-heading-highlight">{sectionTitle}</span>
            </h3>
            <p className="admin-modal-desc">
              Modifiez les textes et données ci-dessous. Les modifications s'appliquent immédiatement sur le site.
            </p>
          </div>

          <button 
            type="button" 
            className="admin-modal-close-btn" 
            onClick={() => setActiveEditingSection(null)}
            aria-label="Fermer"
            title="Fermer"
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="admin-section-form" onSubmit={handleSave} className="admin-editor-form-content">
          {/* ================= 1. NAVBAR EDITOR ================= */}
          {sectionKey === 'navbar' && (
            <div className="editor-card-group">
              <h4 className="editor-card-title">🏷️ Identité du Logo</h4>
              <div className="grid-3-cols">
                <div className="form-group">
                  <label className="form-label">Logo Texte 1 (IP) :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.logoIp || ''} 
                    onChange={(e) => handleFieldChange('logoIp', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Logo Texte 2 (TV) :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.logoTv || ''} 
                    onChange={(e) => handleFieldChange('logoTv', e.target.value)} 
                  />
                </div>
              </div>

              <h4 className="editor-card-title">🔗 Liens de Navigation</h4>
              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Lien Tarifs (Pricing) :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.linkPricing || ''} 
                    onChange={(e) => handleFieldChange('linkPricing', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Lien Chaînes (Channels) :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.linkChannels || ''} 
                    onChange={(e) => handleFieldChange('linkChannels', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Lien Guide Installation :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.linkInstall || ''} 
                    onChange={(e) => handleFieldChange('linkInstall', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Lien Contact :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.linkContact || ''} 
                    onChange={(e) => handleFieldChange('linkContact', e.target.value)} 
                  />
                </div>
              </div>

              <h4 className="editor-card-title">🔘 Bouton d'Action (CTA)</h4>
              <div className="form-group">
                <label className="form-label">Texte du bouton CTA Navbar :</label>
                <input 
                  type="text" 
                  className="form-input-control" 
                  value={formData.btnGetStarted || ''} 
                  onChange={(e) => handleFieldChange('btnGetStarted', e.target.value)} 
                />
              </div>
            </div>
          )}

          {/* ================= 2. HERO EDITOR ================= */}
          {sectionKey === 'hero' && (
            <div className="editor-card-group">
              <h4 className="editor-card-title">✨ Badges & Accroches</h4>
              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Badge d'offre 1 (Badge 1) :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.badgeOffer || ''} 
                    onChange={(e) => handleFieldChange('badgeOffer', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Badge de réduction 2 (Badge 2) :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.badgeDiscount || ''} 
                    onChange={(e) => handleFieldChange('badgeDiscount', e.target.value)} 
                  />
                </div>
              </div>

              <h4 className="editor-card-title">📝 Titre Principal</h4>
              <div className="form-group">
                <label className="form-label">Début du Titre (Title Prefix) :</label>
                <input 
                  type="text" 
                  className="form-input-control" 
                  value={formData.titlePrefix || ''} 
                  onChange={(e) => handleFieldChange('titlePrefix', e.target.value)} 
                />
              </div>

              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Texte Dégradé Rouge (Channels) :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.titleChannels || ''} 
                    onChange={(e) => handleFieldChange('titleChannels', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Texte Dégradé Bleu (VOD) :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.titleVod || ''} 
                    onChange={(e) => handleFieldChange('titleVod', e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Fin du Titre (Title Suffix) :</label>
                <input 
                  type="text" 
                  className="form-input-control" 
                  value={formData.titleSuffix || ''} 
                  onChange={(e) => handleFieldChange('titleSuffix', e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Sous-titre Hero :</label>
                <textarea 
                  rows={3}
                  className="form-input-control" 
                  value={formData.subtitle || ''} 
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)} 
                />
              </div>

              <h4 className="editor-card-title">🔘 Boutons d'Action Principaux</h4>
              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Texte Bouton 1 (Abonnement) :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.btnSubscribe || ''} 
                    onChange={(e) => handleFieldChange('btnSubscribe', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Texte Bouton 2 (Voir les Tarifs) :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.btnPlans || ''} 
                    onChange={(e) => handleFieldChange('btnPlans', e.target.value)} 
                  />
                </div>
              </div>

              <h4 className="editor-card-title">⭐ Avantages Clés (Perks)</h4>
              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Avantage 1 :</label>
                  <input type="text" className="form-input-control" value={formData.perk1 || ''} onChange={(e) => handleFieldChange('perk1', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Avantage 2 :</label>
                  <input type="text" className="form-input-control" value={formData.perk2 || ''} onChange={(e) => handleFieldChange('perk2', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Avantage 3 :</label>
                  <input type="text" className="form-input-control" value={formData.perk3 || ''} onChange={(e) => handleFieldChange('perk3', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Avantage 4 :</label>
                  <input type="text" className="form-input-control" value={formData.perk4 || ''} onChange={(e) => handleFieldChange('perk4', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. DEVICE STRIP EDITOR ================= */}
          {sectionKey === 'deviceStrip' && (
            <div className="editor-card-group">
              <h4 className="editor-card-title">📱 Bandeau d'Appareils</h4>
              <div className="form-group">
                <label className="form-label">Titre du bandeau :</label>
                <input 
                  type="text" 
                  className="form-input-control" 
                  value={formData.title || ''} 
                  onChange={(e) => handleFieldChange('title', e.target.value)} 
                />
              </div>

              <h4 className="editor-card-title">Labels des appareils dans le défilement</h4>
              <div className="grid-2-cols">
                {(formData.devices || []).map((dev, idx) => (
                  <div key={dev.id || idx} className="form-group">
                    <label className="form-label">{dev.name} :</label>
                    <input 
                      type="text" 
                      className="form-input-control" 
                      value={dev.label || dev.name} 
                      onChange={(e) => handleArrayItemChange('devices', idx, 'label', e.target.value)} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 4. PRICING EDITOR ================= */}
          {sectionKey === 'pricing' && (
            <div className="editor-card-group">
              <h4 className="editor-card-title">💰 En-tête des Tarifs</h4>
              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Badge de la Section :</label>
                  <input type="text" className="form-input-control" value={formData.badge || ''} onChange={(e) => handleFieldChange('badge', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Début du Titre :</label>
                  <input type="text" className="form-input-control" value={formData.titlePrefix || ''} onChange={(e) => handleFieldChange('titlePrefix', e.target.value)} />
                </div>
              </div>

              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Mot Mis en Valeur :</label>
                  <input type="text" className="form-input-control" value={formData.titleHighlight || ''} onChange={(e) => handleFieldChange('titleHighlight', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Sous-titre :</label>
                  <input type="text" className="form-input-control" value={formData.subtitle || ''} onChange={(e) => handleFieldChange('subtitle', e.target.value)} />
                </div>
              </div>

              <h4 className="editor-card-title">📦 Forfaits & Tarifs Disponibles</h4>
              {(formData.plans || []).map((plan, pIdx) => (
                <div key={plan.id || pIdx} className="editor-nested-item-card">
                  <div className="editor-nested-item-head">
                    <h5>Forfait #{pIdx + 1} : {plan.title}</h5>
                    <span className="step-num-badge">${plan.price}</span>
                  </div>

                  <div className="grid-3-cols">
                    <div className="form-group">
                      <label className="form-label">Nom du Forfait :</label>
                      <input type="text" className="form-input-control" value={plan.title} onChange={(e) => handleArrayItemChange('plans', pIdx, 'title', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Prix ($) :</label>
                      <input type="number" step="0.01" className="form-input-control" value={plan.price} onChange={(e) => handleArrayItemChange('plans', pIdx, 'price', parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Badge de l'offre :</label>
                      <input type="text" className="form-input-control" value={plan.badge || ''} onChange={(e) => handleArrayItemChange('plans', pIdx, 'badge', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid-2-cols">
                    <div className="form-group">
                      <label className="form-label">Texte d'économie (Savings) :</label>
                      <input type="text" className="form-input-control" value={plan.savings || ''} onChange={(e) => handleArrayItemChange('plans', pIdx, 'savings', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Période (Ex: 1 Mois, 12 Mois) :</label>
                      <input type="text" className="form-input-control" value={plan.period || ''} onChange={(e) => handleArrayItemChange('plans', pIdx, 'period', e.target.value)} />
                    </div>
                  </div>

                  {/* Plan Features */}
                  <label className="form-label">Fonctionnalités incluses :</label>
                  <div className="features-edit-list">
                    {(plan.features || []).map((feat, fIdx) => (
                      <div key={fIdx} className="feature-edit-row">
                        <input 
                          type="text" 
                          className="form-input-control" 
                          value={feat} 
                          onChange={(e) => handleFeatureListChange(pIdx, fIdx, e.target.value)} 
                        />
                        <button 
                          type="button" 
                          className="btn-remove-row" 
                          onClick={() => handleRemoveFeatureFromPlan(pIdx, fIdx)}
                          title="Supprimer cette fonctionnalité"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="btn-add-feature-row" 
                      onClick={() => handleAddFeatureToPlan(pIdx)}
                    >
                      + Ajouter une fonctionnalité à ce forfait
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= 5. CHANNELS EDITOR ================= */}
          {sectionKey === 'channels' && (
            <div className="editor-card-group">
              <h4 className="editor-card-title">📺 Chaînes & Flux Direct</h4>
              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Début du Titre :</label>
                  <input type="text" className="form-input-control" value={formData.titlePrefix || ''} onChange={(e) => handleFieldChange('titlePrefix', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mot en Dégradé :</label>
                  <input type="text" className="form-input-control" value={formData.titleHighlight || ''} onChange={(e) => handleFieldChange('titleHighlight', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Fin du Titre :</label>
                <input type="text" className="form-input-control" value={formData.titleSuffix || ''} onChange={(e) => handleFieldChange('titleSuffix', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Description détaillée des pays et bouquets :</label>
                <textarea rows={4} className="form-input-control" value={formData.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} />
              </div>

              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Texte du compteur de chaînes :</label>
                  <input type="text" className="form-input-control" value={formData.counterText || ''} onChange={(e) => handleFieldChange('counterText', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Texte du bouton Explorer :</label>
                  <input type="text" className="form-input-control" value={formData.btnBrowse || ''} onChange={(e) => handleFieldChange('btnBrowse', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. SPORTS EDITOR ================= */}
          {sectionKey === 'sports' && (
            <div className="editor-card-group">
              <h4 className="editor-card-title">⚽ Événements Sportifs Direct</h4>
              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Début du Titre :</label>
                  <input type="text" className="form-input-control" value={formData.titlePrefix || ''} onChange={(e) => handleFieldChange('titlePrefix', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mot en Dégradé :</label>
                  <input type="text" className="form-input-control" value={formData.titleHighlight || ''} onChange={(e) => handleFieldChange('titleHighlight', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Fin du Titre :</label>
                <input type="text" className="form-input-control" value={formData.titleSuffix || ''} onChange={(e) => handleFieldChange('titleSuffix', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Description :</label>
                <textarea rows={3} className="form-input-control" value={formData.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Texte du bouton Explorer les sports :</label>
                <input type="text" className="form-input-control" value={formData.btnExplore || ''} onChange={(e) => handleFieldChange('btnExplore', e.target.value)} />
              </div>
            </div>
          )}

          {/* ================= 7. FEATURES GRID EDITOR ================= */}
          {sectionKey === 'featuresGrid' && (
            <div className="editor-card-group">
              <h4 className="editor-card-title">⚡ Cartes des Fonctionnalités Principales</h4>
              {['card1', 'card2', 'card3'].map((cKey, idx) => (
                <div key={cKey} className="editor-nested-item-card">
                  <div className="editor-nested-item-head">
                    <h5>Carte #{idx + 1} : {formData[cKey]?.title || ''}</h5>
                  </div>
                  <div className="grid-2-cols">
                    <div className="form-group">
                      <label className="form-label">Titre Principal :</label>
                      <input type="text" className="form-input-control" value={formData[cKey]?.title || ''} onChange={(e) => handleNestedChange(cKey, 'title', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description :</label>
                      <input type="text" className="form-input-control" value={formData[cKey]?.desc || ''} onChange={(e) => handleNestedChange(cKey, 'desc', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Valeur Statistique :</label>
                      <input type="text" className="form-input-control" value={formData[cKey]?.statValue || ''} onChange={(e) => handleNestedChange(cKey, 'statValue', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Détail Statistique :</label>
                      <input type="text" className="form-input-control" value={formData[cKey]?.statDetail || ''} onChange={(e) => handleNestedChange(cKey, 'statDetail', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= 8. EPG EDITOR ================= */}
          {sectionKey === 'epg' && (
            <div className="editor-card-group">
              <h4 className="editor-card-title">📅 Guide TV Électronique (EPG)</h4>
              <div className="form-group">
                <label className="form-label">Titre de la fonctionnalité :</label>
                <input type="text" className="form-input-control" value={formData.title || ''} onChange={(e) => handleFieldChange('title', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Description Complète :</label>
                <textarea rows={3} className="form-input-control" value={formData.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} />
              </div>

              <div className="grid-3-cols">
                <div className="form-group">
                  <label className="form-label">Point clé 1 :</label>
                  <input type="text" className="form-input-control" value={formData.perk1 || ''} onChange={(e) => handleFieldChange('perk1', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Point clé 2 :</label>
                  <input type="text" className="form-input-control" value={formData.perk2 || ''} onChange={(e) => handleFieldChange('perk2', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Point clé 3 :</label>
                  <input type="text" className="form-input-control" value={formData.perk3 || ''} onChange={(e) => handleFieldChange('perk3', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Texte du Bouton d'Action :</label>
                <input type="text" className="form-input-control" value={formData.btnText || ''} onChange={(e) => handleFieldChange('btnText', e.target.value)} />
              </div>
            </div>
          )}

          {/* ================= 9. VOD EDITOR ================= */}
          {sectionKey === 'vod' && (
            <div className="editor-card-group">
              <h4 className="editor-card-title">🎬 Bibliothèque VOD & Cinéma</h4>
              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Début du Titre :</label>
                  <input type="text" className="form-input-control" value={formData.titlePrefix || ''} onChange={(e) => handleFieldChange('titlePrefix', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mot en Dégradé :</label>
                  <input type="text" className="form-input-control" value={formData.titleHighlight || ''} onChange={(e) => handleFieldChange('titleHighlight', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description :</label>
                <textarea rows={3} className="form-input-control" value={formData.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} />
              </div>

              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Titre de la bannière de demande :</label>
                  <input type="text" className="form-input-control" value={formData.ctaTitle || ''} onChange={(e) => handleFieldChange('ctaTitle', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Texte du bouton de demande VOD :</label>
                  <input type="text" className="form-input-control" value={formData.ctaBtn || ''} onChange={(e) => handleFieldChange('ctaBtn', e.target.value)} />
                </div>
              </div>

              <h4 className="editor-card-title">Films & Séries en vedette</h4>
              {(formData.items || []).map((item, idx) => (
                <div key={item.id || idx} className="editor-nested-item-card">
                  <div className="editor-nested-item-head">
                    <h5>{item.title} ({item.platform})</h5>
                    <button type="button" className="btn-remove-row" onClick={() => handleRemoveVodItem(idx)}>Supprimer ✕</button>
                  </div>
                  <div className="grid-3-cols">
                    <div className="form-group">
                      <label className="form-label">Titre :</label>
                      <input type="text" className="form-input-control" value={item.title} onChange={(e) => handleArrayItemChange('items', idx, 'title', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Plateforme :</label>
                      <input type="text" className="form-input-control" value={item.platform} onChange={(e) => handleArrayItemChange('items', idx, 'platform', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Note / Rating :</label>
                      <input type="text" className="form-input-control" value={item.rating} onChange={(e) => handleArrayItemChange('items', idx, 'rating', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid-2-cols">
                    <div className="form-group">
                      <label className="form-label">Genre :</label>
                      <input type="text" className="form-input-control" value={item.genre} onChange={(e) => handleArrayItemChange('items', idx, 'genre', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Qualité :</label>
                      <input type="text" className="form-input-control" value={item.quality} onChange={(e) => handleArrayItemChange('items', idx, 'quality', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Synopsis :</label>
                    <textarea rows={2} className="form-input-control" value={item.description} onChange={(e) => handleArrayItemChange('items', idx, 'description', e.target.value)} />
                  </div>
                </div>
              ))}

              <button type="button" className="btn-add-feature-row" onClick={handleAddVodItem}>
                + Ajouter un film / série à la liste
              </button>
            </div>
          )}

          {/* ================= 10. DEVICES SUPPORTED EDITOR ================= */}
          {sectionKey === 'devices' && (
            <div className="editor-card-group">
              <h4 className="editor-card-title">💻 Appareils & Systèmes Compatibles</h4>
              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Début du Titre :</label>
                  <input type="text" className="form-input-control" value={formData.titlePrefix || ''} onChange={(e) => handleFieldChange('titlePrefix', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mot en Dégradé :</label>
                  <input type="text" className="form-input-control" value={formData.titleHighlight || ''} onChange={(e) => handleFieldChange('titleHighlight', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Sous-titre :</label>
                <input type="text" className="form-input-control" value={formData.subtitle || ''} onChange={(e) => handleFieldChange('subtitle', e.target.value)} />
              </div>

              <h4 className="editor-card-title">Catégories d'Appareils</h4>
              {(formData.categories || []).map((cat, idx) => (
                <div key={cat.id || idx} className="editor-nested-item-card">
                  <div className="editor-nested-item-head">
                    <h5>{cat.icon} {cat.title}</h5>
                    <span className="step-num-badge">{cat.setupTime}</span>
                  </div>
                  <div className="grid-2-cols">
                    <div className="form-group">
                      <label className="form-label">Nom de la Catégorie :</label>
                      <input type="text" className="form-input-control" value={cat.title} onChange={(e) => handleArrayItemChange('categories', idx, 'title', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Marques & Modèles :</label>
                      <input type="text" className="form-input-control" value={cat.brand} onChange={(e) => handleArrayItemChange('categories', idx, 'brand', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description & Compatibilité :</label>
                    <textarea rows={2} className="form-input-control" value={cat.description} onChange={(e) => handleArrayItemChange('categories', idx, 'description', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= 11. HOW TO INSTALL EDITOR ================= */}
          {sectionKey === 'install' && (
            <div className="editor-card-group">
              <h4 className="editor-card-title">🛠️ Guide d'Installation</h4>
              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Badge de la Section :</label>
                  <input type="text" className="form-input-control" value={formData.badge || ''} onChange={(e) => handleFieldChange('badge', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mot en Dégradé :</label>
                  <input type="text" className="form-input-control" value={formData.titleHighlight || ''} onChange={(e) => handleFieldChange('titleHighlight', e.target.value)} />
                </div>
              </div>

              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Sous-titre :</label>
                  <input type="text" className="form-input-control" value={formData.subtitle || ''} onChange={(e) => handleFieldChange('subtitle', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Texte du Bouton Commencer :</label>
                  <input type="text" className="form-input-control" value={formData.btnOrder || ''} onChange={(e) => handleFieldChange('btnOrder', e.target.value)} />
                </div>
              </div>

              <h4 className="editor-card-title">Applications & Sections d'Installation</h4>
              {(formData.apps || []).map((app, appIdx) => (
                <div key={app.id || appIdx} className="editor-nested-item-card">
                  <div className="editor-nested-item-head">
                    <h5>📱 {app.name || `Section #${appIdx + 1}`}</h5>
                    <button
                      type="button"
                      className="btn-remove-row"
                      onClick={() => handleRemoveInstallApp(appIdx)}
                      title="Supprimer cette section"
                    >
                      🗑️ Supprimer la section
                    </button>
                  </div>

                  <div className="grid-2-cols">
                    <div className="form-group">
                      <label className="form-label">🏷️ Nom de l'Application / Section :</label>
                      <input type="text" className="form-input-control" value={app.name} onChange={(e) => handleArrayItemChange('apps', appIdx, 'name', e.target.value)} placeholder="ex: IPTV Smarters Pro" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">📺 Appareils Compatibles :</label>
                      <input type="text" className="form-input-control" value={app.devices} onChange={(e) => handleArrayItemChange('apps', appIdx, 'devices', e.target.value)} placeholder="ex: Android, iOS, Smart TV" />
                    </div>
                  </div>

                  <label className="form-label">📋 Étapes d'installation :</label>
                  <div className="features-edit-list">
                    {(app.steps || []).map((st, stIdx) => (
                      <div key={stIdx} className="feature-edit-row">
                        <span className="step-num-badge">#{stIdx + 1}</span>
                        <input 
                          type="text" 
                          className="form-input-control" 
                          value={st} 
                          onChange={(e) => handleInstallStepChange(appIdx, stIdx, e.target.value)} 
                          placeholder={`Étape ${stIdx + 1}...`}
                        />
                        <button 
                          type="button" 
                          className="btn-remove-row" 
                          onClick={() => handleRemoveInstallStep(appIdx, stIdx)}
                          title="Supprimer cette étape"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="btn-add-feature-row" 
                      onClick={() => handleAddInstallStep(appIdx)}
                    >
                      + Ajouter une étape
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn-add-feature-row"
                style={{ marginTop: '12px', width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))', border: '2px dashed rgba(139,92,246,0.4)', color: '#a78bfa', fontWeight: 700, fontSize: '14px', padding: '14px' }}
                onClick={handleAddInstallApp}
              >
                ➕ Ajouter une nouvelle section / application
              </button>
            </div>
          )}

          {/* ================= 12. FAQ EDITOR ================= */}
          {sectionKey === 'faq' && (
            <div className="editor-card-group">
              <h4 className="editor-card-title">❓ Questions Fréquemment Posées (FAQ)</h4>
              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Badge de la Section :</label>
                  <input type="text" className="form-input-control" value={formData.badge || ''} onChange={(e) => handleFieldChange('badge', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Titre Mis en Valeur :</label>
                  <input type="text" className="form-input-control" value={formData.titleHighlight || ''} onChange={(e) => handleFieldChange('titleHighlight', e.target.value)} />
                </div>
              </div>

              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Sous-titre :</label>
                  <input type="text" className="form-input-control" value={formData.subtitle || ''} onChange={(e) => handleFieldChange('subtitle', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Texte du bouton Support :</label>
                  <input type="text" className="form-input-control" value={formData.btnChat || ''} onChange={(e) => handleFieldChange('btnChat', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Titre de la bannière Support 24/7 :</label>
                <input type="text" className="form-input-control" value={formData.bannerTitle || ''} onChange={(e) => handleFieldChange('bannerTitle', e.target.value)} />
              </div>

              <h4 className="editor-card-title">Questions & Réponses</h4>
              {(formData.items || []).map((faq, idx) => (
                <div key={idx} className="editor-nested-item-card">
                  <div className="editor-nested-item-head">
                    <h5>Question #{idx + 1}</h5>
                    <button type="button" className="btn-remove-row" onClick={() => handleRemoveFaqItem(idx)}>Supprimer ✕</button>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Texte de la Question :</label>
                    <input type="text" className="form-input-control" value={faq.q} onChange={(e) => handleArrayItemChange('items', idx, 'q', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Texte de la Réponse :</label>
                    <textarea rows={3} className="form-input-control" value={faq.a} onChange={(e) => handleArrayItemChange('items', idx, 'a', e.target.value)} />
                  </div>
                </div>
              ))}

              <button type="button" className="btn-add-feature-row" onClick={handleAddFaqItem}>
                + Ajouter une nouvelle question / réponse
              </button>
            </div>
          )}

          {/* ================= 13. FOOTER & WHATSAPP EDITOR ================= */}
          {sectionKey === 'footer' && (
            <div className="editor-card-group">
              <h4 className="editor-card-title">🏢 Pied de Page & Support WhatsApp</h4>
              <div className="form-group">
                <label className="form-label">Description de la marque (Footer Brand Desc) :</label>
                <textarea rows={3} className="form-input-control" value={formData.brandDesc || ''} onChange={(e) => handleFieldChange('brandDesc', e.target.value)} />
              </div>

              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Texte des avis clients (Rating) :</label>
                  <input type="text" className="form-input-control" value={formData.ratingText || ''} onChange={(e) => handleFieldChange('ratingText', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Titre de la Garantie :</label>
                  <input type="text" className="form-input-control" value={formData.guaranteeTitle || ''} onChange={(e) => handleFieldChange('guaranteeTitle', e.target.value)} />
                </div>
              </div>

              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Texte Droits d'auteur (Copyright) :</label>
                  <input type="text" className="form-input-control" value={formData.copyrightText || ''} onChange={(e) => handleFieldChange('copyrightText', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Numéro de Téléphone WhatsApp :</label>
                  <input type="text" className="form-input-control" value={formData.whatsappPhone || ''} onChange={(e) => handleFieldChange('whatsappPhone', e.target.value)} />
                </div>
              </div>

              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Texte du badge WhatsApp flottant :</label>
                  <input type="text" className="form-input-control" value={formData.supportPillText || ''} onChange={(e) => handleFieldChange('supportPillText', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Message par défaut WhatsApp :</label>
                  <input type="text" className="form-input-control" value={formData.whatsappDefaultMsg || ''} onChange={(e) => handleFieldChange('whatsappDefaultMsg', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* ================= 14. TESTIMONIALS EDITOR ================= */}
          {sectionKey === 'testimonials' && (
            <div className="editor-card-group">
              <h4 className="editor-card-title">💬 Avis des Clients (What Our Customers Say)</h4>
              <div className="grid-3-cols">
                <div className="form-group">
                  <label className="form-label">Début du Titre :</label>
                  <input type="text" className="form-input-control" value={formData.titlePrefix || ''} onChange={(e) => handleFieldChange('titlePrefix', e.target.value)} placeholder="What Our" />
                </div>
                <div className="form-group">
                  <label className="form-label">Mot Dégradé Rose :</label>
                  <input type="text" className="form-input-control" value={formData.titleHighlight || ''} onChange={(e) => handleFieldChange('titleHighlight', e.target.value)} placeholder="Customers" />
                </div>
                <div className="form-group">
                  <label className="form-label">Fin du Titre :</label>
                  <input type="text" className="form-input-control" value={formData.titleSuffix || ''} onChange={(e) => handleFieldChange('titleSuffix', e.target.value)} placeholder="Say" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Sous-titre de la section :</label>
                <input type="text" className="form-input-control" value={formData.subtitle || ''} onChange={(e) => handleFieldChange('subtitle', e.target.value)} />
              </div>

              <h4 className="editor-card-title">Liste des Avis Clients</h4>
              {(formData.items || []).map((item, idx) => (
                <div key={item.id || idx} className="editor-nested-item-card">
                  <div className="editor-nested-item-head">
                    <h5>⭐ Avis #{idx + 1} : {item.name || 'Client'}</h5>
                    <button type="button" className="btn-remove-row" onClick={() => handleRemoveTestimonialItem(idx)}>
                      Supprimer ✕
                    </button>
                  </div>

                  <div className="grid-3-cols">
                    <div className="form-group">
                      <label className="form-label">Nom du Client :</label>
                      <input type="text" className="form-input-control" value={item.name || ''} onChange={(e) => handleArrayItemChange('items', idx, 'name', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pays / Emplacement :</label>
                      <input type="text" className="form-input-control" value={item.location || ''} onChange={(e) => handleArrayItemChange('items', idx, 'location', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Note (Étoiles 1-5) :</label>
                      <input type="number" min="1" max="5" className="form-input-control" value={item.rating || 5} onChange={(e) => handleArrayItemChange('items', idx, 'rating', Number(e.target.value))} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">🖼️ Photo du Client (Avatar) :</label>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {item.avatar && (
                        <img 
                          src={item.avatar} 
                          alt="preview" 
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)', flexShrink: 0 }} 
                        />
                      )}
                      <input 
                        type="text" 
                        className="form-input-control" 
                        value={item.avatar || ''} 
                        onChange={(e) => handleArrayItemChange('items', idx, 'avatar', e.target.value)} 
                        placeholder="Coller l'URL de l'image..."
                        style={{ flex: 1, minWidth: '220px' }}
                      />
                      <label className="btn-file-upload-styled">
                        📁 Choisir photo
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }} 
                          onChange={(e) => handleImageFileChange('items', idx, 'avatar', e)} 
                        />
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">💬 Commentaire / Témoignage :</label>
                    <textarea 
                      rows={3} 
                      className="form-input-control" 
                      value={item.text || ''} 
                      onChange={(e) => handleArrayItemChange('items', idx, 'text', e.target.value)} 
                      placeholder="Écrivez le commentaire du client ici..."
                    />
                  </div>
                </div>
              ))}

              <button type="button" className="btn-add-feature-row" onClick={handleAddTestimonialItem}>
                + Ajouter un nouvel avis client
              </button>
            </div>
          )}

          {/* ================= 15. CLIENT PROOFS (WHATSAPP) EDITOR ================= */}
          {sectionKey === 'clientProofs' && (
            <div className="editor-card-group">
              <h4 className="editor-card-title">📱 Captures & Preuves WhatsApp (Our Valued Clients)</h4>
              <div className="grid-3-cols">
                <div className="form-group">
                  <label className="form-label">Début du Titre :</label>
                  <input type="text" className="form-input-control" value={formData.titlePrefix || ''} onChange={(e) => handleFieldChange('titlePrefix', e.target.value)} placeholder="Our" />
                </div>
                <div className="form-group">
                  <label className="form-label">Titre Dégradé :</label>
                  <input type="text" className="form-input-control" value={formData.titleHighlight || ''} onChange={(e) => handleFieldChange('titleHighlight', e.target.value)} placeholder="Valued Clients" />
                </div>
                <div className="form-group">
                  <label className="form-label">Emoji / Suffixe :</label>
                  <input type="text" className="form-input-control" value={formData.titleSuffix || ''} onChange={(e) => handleFieldChange('titleSuffix', e.target.value)} placeholder="💙" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Sous-titre :</label>
                <input type="text" className="form-input-control" value={formData.subtitle || ''} onChange={(e) => handleFieldChange('subtitle', e.target.value)} />
              </div>

              <h4 className="editor-card-title">Liste des Preuves / Captures WhatsApp</h4>
              {(formData.items || []).map((item, idx) => (
                <div key={item.id || idx} className="editor-nested-item-card">
                  <div className="editor-nested-item-head">
                    <h5>📱 Capture #{idx + 1} : {item.title || item.clientPhone || 'WhatsApp Proof'}</h5>
                    <button type="button" className="btn-remove-row" onClick={() => handleRemoveClientProofItem(idx)}>
                      Supprimer ✕
                    </button>
                  </div>

                  <div className="grid-2-cols">
                    <div className="form-group">
                      <label className="form-label">Numéro ou Titre WhatsApp :</label>
                      <input type="text" className="form-input-control" value={item.title || ''} onChange={(e) => handleArrayItemChange('items', idx, 'title', e.target.value)} placeholder="+1 (780) 456-xxxx" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Légende / Note :</label>
                      <input type="text" className="form-input-control" value={item.caption || ''} onChange={(e) => handleArrayItemChange('items', idx, 'caption', e.target.value)} placeholder="Streaming 4K confirmé" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">📸 Image de Capture d'écran WhatsApp :</label>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt="preview" 
                          style={{ width: '48px', height: '70px', borderRadius: '8px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)', flexShrink: 0 }} 
                        />
                      )}
                      <input 
                        type="text" 
                        className="form-input-control" 
                        value={item.image || ''} 
                        onChange={(e) => handleArrayItemChange('items', idx, 'image', e.target.value)} 
                        placeholder="Coller l'URL de votre capture d'écran..."
                        style={{ flex: 1, minWidth: '220px' }}
                      />
                      <label className="btn-file-upload-styled">
                        📁 Choisir capture
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }} 
                          onChange={(e) => handleImageFileChange('items', idx, 'image', e)} 
                        />
                      </label>
                    </div>
                    <small style={{ color: '#94a3b8', fontSize: '12px', marginTop: '6px', display: 'block' }}>
                      💡 Astuce : Si vous ne sélectionnez aucune image, une interface de discussion WhatsApp réaliste en mode sombre s'affiche par défaut !
                    </small>
                  </div>
                </div>
              ))}

              <button type="button" className="btn-add-feature-row" onClick={handleAddClientProofItem}>
                + Ajouter une nouvelle preuve WhatsApp
              </button>
            </div>
          )}

          {/* ================= 16. DOWNLOAD APPS HERO & FEATURED PRODUCT ================= */}
          {sectionKey === 'downloadApps_hero' && (
            <div className="editor-card-group">
              <h4 className="editor-card-title">📱 Page Download Apps : Bannière & Produit Vedette</h4>
              
              <div className="grid-3-cols">
                <div className="form-group">
                  <label className="form-label">Titre de la Bannière (Hero) :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.hero?.title || ''} 
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      hero: { ...(prev.hero || {}), title: e.target.value }
                    }))} 
                    placeholder="Application Atlas Pro ONTV"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Texte Breadcrumb Accueil :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.hero?.breadcrumbHome || ''} 
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      hero: { ...(prev.hero || {}), breadcrumbHome: e.target.value }
                    }))} 
                    placeholder="HOME"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Texte Breadcrumb Page :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.hero?.breadcrumbCurrent || ''} 
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      hero: { ...(prev.hero || {}), breadcrumbCurrent: e.target.value }
                    }))} 
                    placeholder="APPLICATION ATLAS PRO ONTV"
                  />
                </div>
              </div>

              <h4 className="editor-card-title" style={{ marginTop: '24px' }}>🏷️ Produit & Abonnement Vedette</h4>
              <div className="form-group">
                <label className="form-label">Titre du Produit :</label>
                <input 
                  type="text" 
                  className="form-input-control" 
                  value={formData.featuredProduct?.title || ''} 
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    featuredProduct: { ...(prev.featuredProduct || {}), title: e.target.value }
                  }))} 
                  placeholder="Abonnement IPTV France 2026 – Atlas Pro ONTV N°1 du Marché"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description du Produit :</label>
                <textarea 
                  rows={4} 
                  className="form-input-control" 
                  value={formData.featuredProduct?.description || ''} 
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    featuredProduct: { ...(prev.featuredProduct || {}), description: e.target.value }
                  }))} 
                />
              </div>

              <div className="grid-3-cols">
                <div className="form-group">
                  <label className="form-label">Prix :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.featuredProduct?.price || ''} 
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      featuredProduct: { ...(prev.featuredProduct || {}), price: e.target.value }
                    }))} 
                    placeholder="34.99"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Devise & Période :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.featuredProduct?.period || ''} 
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      featuredProduct: { ...(prev.featuredProduct || {}), period: e.target.value }
                    }))} 
                    placeholder="Annuel"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Badge Qualité :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.featuredProduct?.qualityBadge || ''} 
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      featuredProduct: { ...(prev.featuredProduct || {}), qualityBadge: e.target.value }
                    }))} 
                    placeholder="Qualité SD/HD/FULLHD/4K"
                  />
                </div>
              </div>

              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Texte du Bouton d'Achat :</label>
                  <input 
                    type="text" 
                    className="form-input-control" 
                    value={formData.featuredProduct?.btnBuyText || ''} 
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      featuredProduct: { ...(prev.featuredProduct || {}), btnBuyText: e.target.value }
                    }))} 
                    placeholder="ACHETER MAINTENANT →"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Image de l'Écran TV :</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {formData.featuredProduct?.screenImage && (
                      <img 
                        src={formData.featuredProduct.screenImage} 
                        alt="TV Preview" 
                        style={{ width: '50px', height: '35px', borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }}
                      />
                    )}
                    <input 
                      type="text" 
                      className="form-input-control" 
                      value={formData.featuredProduct?.screenImage || ''} 
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        featuredProduct: { ...(prev.featuredProduct || {}), screenImage: e.target.value }
                      }))} 
                      placeholder="URL de l'image TV..."
                      style={{ flex: 1 }}
                    />
                    <label className="btn-file-upload-styled">
                      📁 Choisir
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={handleFeaturedImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 17. DOWNLOAD APPS CATEGORIES & APPLICATIONS ================= */}
          {sectionKey === 'downloadApps_categories' && (
            <div className="editor-card-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 className="editor-card-title" style={{ margin: 0 }}>📦 Gestion des Catégories & Applications</h4>
                <button 
                  type="button" 
                  className="btn-add-feature-row" 
                  style={{ width: 'auto', padding: '8px 16px', margin: 0 }}
                  onClick={handleAddAppCategory}
                >
                  ➕ Ajouter une Catégorie
                </button>
              </div>

              {(formData.categories || []).map((cat, catIdx) => (
                <div key={cat.id || catIdx} className="editor-nested-item-card" style={{ border: '1px solid rgba(99,102,241,0.3)', marginBottom: '24px' }}>
                  <div className="editor-nested-item-head" style={{ background: 'rgba(99,102,241,0.1)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h5 style={{ margin: 0, fontSize: '1rem', color: '#a5b4fc' }}>📁 Catégorie #{catIdx + 1}</h5>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        type="button" 
                        className="btn-add-feature-row"
                        style={{ width: 'auto', padding: '4px 10px', fontSize: '12px', margin: 0 }}
                        onClick={() => handleAddAppToCategory(catIdx)}
                      >
                        ➕ Ajouter une App
                      </button>
                      <button 
                        type="button" 
                        className="btn-remove-row" 
                        onClick={() => handleRemoveAppCategory(catIdx)}
                      >
                        Supprimer la catégorie ✕
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Titre de la Catégorie :</label>
                    <input 
                      type="text" 
                      className="form-input-control" 
                      value={cat.title || ''} 
                      onChange={(e) => handleCategoryTitleChange(catIdx, e.target.value)} 
                      placeholder="ex: Android APK APP..."
                    />
                  </div>

                  <label className="form-label" style={{ marginTop: '16px' }}>📱 Applications dans cette catégorie :</label>
                  {(cat.apps || []).map((app, appIdx) => (
                    <div key={app.id || appIdx} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ color: '#fff', fontSize: '0.9rem' }}>App #{appIdx + 1} : {app.name || 'Application'}</strong>
                        <button 
                          type="button" 
                          className="btn-remove-row" 
                          style={{ fontSize: '12px', padding: '2px 8px' }}
                          onClick={() => handleRemoveAppFromCategory(catIdx, appIdx)}
                        >
                          Supprimer App ✕
                        </button>
                      </div>

                      <div className="grid-2-cols">
                        <div className="form-group">
                          <label className="form-label">Nom de l'App :</label>
                          <input 
                            type="text" 
                            className="form-input-control" 
                            value={app.name || ''} 
                            onChange={(e) => handleAppFieldChange(catIdx, appIdx, 'name', e.target.value)} 
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Code Downloader / Note :</label>
                          <input 
                            type="text" 
                            className="form-input-control" 
                            value={app.downloaderCode || ''} 
                            onChange={(e) => handleAppFieldChange(catIdx, appIdx, 'downloaderCode', e.target.value)} 
                            placeholder="Code downloader : 123456"
                          />
                        </div>
                      </div>

                      <div className="grid-2-cols">
                        <div className="form-group">
                          <label className="form-label">Lien de Téléchargement (URL) :</label>
                          <input 
                            type="text" 
                            className="form-input-control" 
                            value={app.downloadUrl || ''} 
                            onChange={(e) => handleAppFieldChange(catIdx, appIdx, 'downloadUrl', e.target.value)} 
                            placeholder="https://..."
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Texte du Bouton :</label>
                          <input 
                            type="text" 
                            className="form-input-control" 
                            value={app.btnText || ''} 
                            onChange={(e) => handleAppFieldChange(catIdx, appIdx, 'btnText', e.target.value)} 
                            placeholder="Télécharger APK"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">🖼️ Logo / Icône de l'Application :</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          {app.logo && (
                            <img 
                              src={app.logo} 
                              alt="App Logo" 
                              style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: '2px' }}
                            />
                          )}
                          <input 
                            type="text" 
                            className="form-input-control" 
                            value={app.logo || ''} 
                            onChange={(e) => handleAppFieldChange(catIdx, appIdx, 'logo', e.target.value)} 
                            placeholder="URL du logo..."
                            style={{ flex: 1 }}
                          />
                          <label className="btn-file-upload-styled">
                            📁 Choisir Logo
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ display: 'none' }} 
                              onChange={(e) => handleAppLogoUpload(catIdx, appIdx, e)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    className="btn-add-feature-row" 
                    onClick={() => handleAddAppToCategory(catIdx)}
                  >
                    + Ajouter une application dans cette catégorie
                  </button>
                </div>
              ))}

              <button 
                type="button" 
                className="btn-add-feature-row" 
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))', border: '2px dashed rgba(99,102,241,0.5)', color: '#c7d2fe', fontWeight: 700, padding: '14px' }}
                onClick={handleAddAppCategory}
              >
                ➕ Ajouter une Nouvelle Catégorie
              </button>
            </div>
          )}
        </form>

        {/* Sticky Bottom Actions Bar */}
        <div className="admin-editor-footer-sticky">
          <button 
            type="button" 
            className="admin-btn-cancel" 
            onClick={() => setActiveEditingSection(null)}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            form="admin-section-form"
            className="admin-btn-save"
          >
            <IconCheck size={18} />
            <span>Enregistrer les modifications</span>
          </button>
        </div>
      </div>
    </div>
  );
};
