import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { IconClose, IconCheck, IconZap } from './Icons';

export const SectionEditModal = () => {
  const { content, updateSection, activeEditingSection, setActiveEditingSection } = useContent();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (activeEditingSection && content[activeEditingSection.key]) {
      // Deep clone section data into local form state
      setFormData(JSON.parse(JSON.stringify(content[activeEditingSection.key])));
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
    setFormData((prev) => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index),
    }));
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
    setFormData((prev) => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index),
    }));
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
      const steps = [...(apps[appIndex].steps || []), 'Nouvelle étape : Ouvrez l\'application et profitez du streaming.'];
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

  const handleSave = (e) => {
    e.preventDefault();
    updateSection(sectionKey, formData);
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

              <h4 className="editor-card-title">Applications & Tutoriels</h4>
              {(formData.apps || []).map((app, appIdx) => (
                <div key={app.id || appIdx} className="editor-nested-item-card">
                  <div className="editor-nested-item-head">
                    <h5>Application : {app.name}</h5>
                    <span className="step-num-badge">{app.devices}</span>
                  </div>
                  <div className="grid-2-cols">
                    <div className="form-group">
                      <label className="form-label">Nom de l'Application :</label>
                      <input type="text" className="form-input-control" value={app.name} onChange={(e) => handleArrayItemChange('apps', appIdx, 'name', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Appareils Compatibles :</label>
                      <input type="text" className="form-input-control" value={app.devices} onChange={(e) => handleArrayItemChange('apps', appIdx, 'devices', e.target.value)} />
                    </div>
                  </div>

                  <label className="form-label">Étapes d'installation pas-à-pas :</label>
                  <div className="features-edit-list">
                    {(app.steps || []).map((st, stIdx) => (
                      <div key={stIdx} className="feature-edit-row">
                        <span className="step-num-badge">#{stIdx + 1}</span>
                        <input 
                          type="text" 
                          className="form-input-control" 
                          value={st} 
                          onChange={(e) => handleInstallStepChange(appIdx, stIdx, e.target.value)} 
                        />
                        <button 
                          type="button" 
                          className="btn-remove-row" 
                          onClick={() => handleRemoveInstallStep(appIdx, stIdx)}
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
                      + Ajouter une étape d'installation
                    </button>
                  </div>
                </div>
              ))}
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
