import React, { useState, useEffect } from 'react';
import { 
  IconWhatsApp, 
  IconCheck, 
  IconRefreshCw, 
  IconClose,
  IconSparkles,
  IconPlus,
  IconTrash
} from './Icons';


export const SiteSettingsView = ({ 
  content, 
  updateSection, 
  saveToServer, 
  isSaving, 
  triggerNotification 
}) => {
  const footerData = content?.footer || {};

  const cleanMethods = (methods) => {
    if (!Array.isArray(methods)) return [];
    return methods.filter(m => m && m.id !== 'card' && m.id !== 'paypal' && m.id !== 'crypto');
  };

  // Form local state
  const [formData, setFormData] = useState({
    whatsappPhone: footerData.whatsappPhone || '+15551234567',
    whatsappDefaultMsg: footerData.whatsappDefaultMsg || 'Hello SatProMax Support, I would like to get started with IPTV',
    supportPillText: footerData.supportPillText || '24/7 SUPPORT',
    chatSupportTitle: footerData.chatSupportTitle || 'SatProMax Support',
    chatOnlineStatus: footerData.chatOnlineStatus || 'En ligne • Répond généralement en quelques secondes',
    chatGreeting1: footerData.chatGreeting1 || '👋 Bonjour ! Bienvenue sur SatProMax. Comment pouvons-nous vous aider ?',
    chatGreeting2: footerData.chatGreeting2 || '⚡ Souhaitez-vous un test gratuit ou de l\'aide pour configurer votre appareil ?',
    chatStartBtn: footerData.chatStartBtn || 'Démarrer la discussion WhatsApp',
    guaranteeTitle: footerData.guaranteeTitle || '7-Day Money Back Guarantee',
    guaranteeDesc: footerData.guaranteeDesc || '100% risk-free trial with instant money-back protection.',
    paymentLabel: footerData.paymentLabel || content?.modals?.paymentLabel || 'Select Payment Method:',
    securityText: footerData.securityText || content?.modals?.securityText || '256-Bit SSL Encrypted • 7-Day Money-Back Guarantee',
    paymentMethods: cleanMethods(content?.paymentMethods || footerData.paymentMethods || []),
  });

  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodImage, setNewMethodImage] = useState('');
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync state if external content updates
  useEffect(() => {
    if (content?.footer) {
      setFormData((prev) => ({
        ...prev,
        whatsappPhone: content.footer.whatsappPhone || prev.whatsappPhone,
        whatsappDefaultMsg: content.footer.whatsappDefaultMsg || prev.whatsappDefaultMsg,
        supportPillText: content.footer.supportPillText || prev.supportPillText,
        chatSupportTitle: content.footer.chatSupportTitle || prev.chatSupportTitle,
        chatOnlineStatus: content.footer.chatOnlineStatus || prev.chatOnlineStatus,
        chatGreeting1: content.footer.chatGreeting1 || prev.chatGreeting1,
        chatGreeting2: content.footer.chatGreeting2 || prev.chatGreeting2,
        chatStartBtn: content.footer.chatStartBtn || prev.chatStartBtn,
        guaranteeTitle: content.footer.guaranteeTitle || prev.guaranteeTitle,
        guaranteeDesc: content.footer.guaranteeDesc || prev.guaranteeDesc,
        paymentLabel: content.footer.paymentLabel || content?.modals?.paymentLabel || prev.paymentLabel,
        securityText: content.footer.securityText || content?.modals?.securityText || prev.securityText,
        paymentMethods: cleanMethods(content.paymentMethods || content.footer.paymentMethods || prev.paymentMethods),
      }));
    }
  }, [content]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };


  // Clean pure digits for validation
  const cleanPhone = (formData.whatsappPhone || '').replace(/[^0-9]/g, '');

  const handleTogglePaymentMethod = (index) => {
    setFormData((prev) => {
      const updated = [...(prev.paymentMethods || [])];
      updated[index] = { ...updated[index], enabled: updated[index].enabled === false ? true : false };
      return { ...prev, paymentMethods: updated };
    });
    setHasChanges(true);
  };

  const handlePaymentMethodNameChange = (index, newName) => {
    setFormData((prev) => {
      const updated = [...(prev.paymentMethods || [])];
      updated[index] = { ...updated[index], name: newName };
      return { ...prev, paymentMethods: updated };
    });
    setHasChanges(true);
  };

  const handleMethodImageUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setFormData((prev) => {
        const updated = [...(prev.paymentMethods || [])];
        updated[index] = { ...updated[index], image: uploadEvent.target.result };
        return { ...prev, paymentMethods: updated };
      });
      setHasChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const handleMethodImageChange = (index, imageUrl) => {
    setFormData((prev) => {
      const updated = [...(prev.paymentMethods || [])];
      updated[index] = { ...updated[index], image: imageUrl };
      return { ...prev, paymentMethods: updated };
    });
    setHasChanges(true);
  };

  const handleNewImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setNewMethodImage(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddPaymentMethod = (e) => {
    if (e) e.preventDefault();
    if (!newMethodName.trim()) return;
    const newId = 'custom_' + Date.now().toString(36);
    setFormData((prev) => ({
      ...prev,
      paymentMethods: [
        ...(prev.paymentMethods || []),
        { 
          id: newId, 
          name: newMethodName.trim(), 
          image: newMethodImage.trim() || null, 
          enabled: true 
        }
      ]
    }));
    setNewMethodName('');
    setNewMethodImage('');
    setShowAddMethod(false);
    setHasChanges(true);
  };

  const handleDeletePaymentMethod = (index) => {
    setFormData((prev) => {
      const updated = (prev.paymentMethods || []).filter((_, i) => i !== index);
      return { ...prev, paymentMethods: updated };
    });
    setHasChanges(true);
  };

  const handleReset = () => {
    if (content?.footer) {
      setFormData({
        whatsappPhone: content.footer.whatsappPhone || '+15551234567',
        whatsappDefaultMsg: content.footer.whatsappDefaultMsg || 'Hello SatProMax Support, I would like to get started with IPTV',
        supportPillText: content.footer.supportPillText || '24/7 SUPPORT',
        chatSupportTitle: content.footer.chatSupportTitle || 'SatProMax Support',
        chatOnlineStatus: content.footer.chatOnlineStatus || 'En ligne • Répond généralement en quelques secondes',
        chatGreeting1: content.footer.chatGreeting1 || '👋 Bonjour ! Bienvenue sur SatProMax. Comment pouvons-nous vous aider ?',
        chatGreeting2: content.footer.chatGreeting2 || '⚡ Souhaitez-vous un test gratuit ou de l\'aide pour configurer votre appareil ?',
        chatStartBtn: content.footer.chatStartBtn || 'Démarrer la discussion WhatsApp',
        guaranteeTitle: content.footer.guaranteeTitle || '7-Day Money Back Guarantee',
        guaranteeDesc: content.footer.guaranteeDesc || '100% risk-free trial with instant money-back protection.',
        paymentLabel: content.footer.paymentLabel || content?.modals?.paymentLabel || 'Select Payment Method:',
        securityText: content.footer.securityText || content?.modals?.securityText || '256-Bit SSL Encrypted • 7-Day Money-Back Guarantee',
        paymentMethods: cleanMethods(content.paymentMethods || content.footer.paymentMethods || []),
      });
      setHasChanges(false);
      if (triggerNotification) {
        triggerNotification('🔄 Paramètres réinitialisés avec succès.');
      }
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (updateSection) {
      updateSection('footer', formData);
      if (formData.paymentMethods) {
        updateSection('paymentMethods', formData.paymentMethods);
      }
    }
    if (saveToServer) {
      const updatedContent = {
        ...content,
        footer: {
          ...(content?.footer || {}),
          ...formData,
        },
        paymentMethods: formData.paymentMethods,
      };
      await saveToServer(updatedContent);
    }
    setHasChanges(false);
    if (triggerNotification) {
      triggerNotification('✅ Paramètres et modes de paiement enregistrés avec succès dans MongoDB Atlas !');
    }
  };

  const isPhoneValid = cleanPhone.length >= 8;

  return (
    <div className="site-settings-view animate-fade-in">
      {/* Top Header */}
      <header className="admin-main-header">
        <div className="header-info">
          <div className="header-title-pill">
            <span className="pill-dot"></span>
            <span>GESTION COMMERCIALE & CANAUX DE VENTE</span>
          </div>
          <h1 className="header-title">⚙️ Paramètres du Site & Contact WhatsApp</h1>
          <p className="header-subtitle">
            Configurez et modifiez en temps réel le numéro WhatsApp officiel du site, les messages pré-remplis de contact client et l'apparence du widget flottant.
          </p>
        </div>

        <div className="header-actions">
          <button 
            type="button" 
            className="btn-dashboard-action btn-refresh-orders"
            onClick={handleReset}
            disabled={isSaving}
            title="Rétablir les valeurs actuelles"
          >
            <IconRefreshCw size={16} />
            <span>Rétablir</span>
          </button>

          <button 
            type="button" 
            className="btn-dashboard-action btn-save-all"
            onClick={handleSave}
            disabled={isSaving}
          >
            <span>{isSaving ? '⏳ Enregistrement...' : '💾 Sauvegarder MongoDB'}</span>
          </button>
        </div>
      </header>

      {/* Changes Alert Banner */}
      {hasChanges && (
        <div className="settings-unsaved-banner animate-slide-down">
          <div className="banner-content">
            <span className="banner-icon">⚠️</span>
            <div>
              <strong>Modifications non enregistrées :</strong> Vous avez modifié les paramètres de contact. Cliquez sur Sauvegarder pour appliquer directement sur la vitrine.
            </div>
          </div>
          <button 
            type="button" 
            className="btn-banner-save"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer maintenant'}
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="site-settings-grid">
        {/* Left Column: WhatsApp Phone Configuration */}
        <div className="settings-main-col">
          {/* WhatsApp Card */}
          <div className="settings-card highlight-whatsapp-card">
            <div className="card-header-with-badge">
              <div className="card-header-left">
                <div className="whatsapp-badge-icon">
                  <IconWhatsApp size={24} />
                </div>
                <div>
                  <h3 className="card-title">Numéro WhatsApp Officiel du Site</h3>
                  <p className="card-desc">Ce numéro est utilisé pour tous les boutons de chat direct, l'assistance 24/7, la FAQ et la confirmation de commande.</p>
                </div>
              </div>
              <span className={`status-pill ${isPhoneValid ? 'status-active' : 'status-warning'}`}>
                {isPhoneValid ? '● Connecté & Actif' : '● Numéro Incomplet'}
              </span>
            </div>

            {/* Input WhatsApp */}
            <div className="settings-form-block">
              <label className="settings-label">
                <span>Numéro de Téléphone WhatsApp :</span>
                <span className="label-tip">Format international recommandé avec indicatif (+33, +216, +1...)</span>
              </label>

              <div className="whatsapp-input-container">
                <div className="input-prefix-icon">
                  <IconWhatsApp size={20} />
                </div>
                <input 
                  type="text" 
                  className="whatsapp-number-input"
                  placeholder="ex: +216 98 123 456 ou +33 6 12 34 56 78"
                  value={formData.whatsappPhone}
                  onChange={(e) => handleChange('whatsappPhone', e.target.value)}
                />
                {cleanPhone && (
                  <button 
                    type="button" 
                    className="btn-clear-input"
                    onClick={() => handleChange('whatsappPhone', '')}
                    title="Effacer"
                  >
                    <IconClose size={16} />
                  </button>
                )}
              </div>


              {/* Real-time Validation & Link Preview Box */}
              <div className="whatsapp-preview-bar">
                <div className="preview-meta-row">
                  <div className="meta-item">
                    <span className="meta-label">Numéro nettoyé (wa.me) :</span>
                    <strong className="meta-value font-mono">
                      {cleanPhone ? cleanPhone : <span className="text-muted">Non défini</span>}
                    </strong>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Statut du format :</span>
                    {isPhoneValid ? (
                      <span className="meta-badge-success">
                        <IconCheck size={13} /> Valide ({cleanPhone.length} chiffres)
                      </span>
                    ) : (
                      <span className="meta-badge-warn">
                        ⚠️ Requis : indicatif + numéro (au moins 8 chiffres)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Messages & Pill Config */}
            <div className="settings-divider"></div>

            <div className="settings-form-grid-2">
              <div className="settings-form-block">
                <label className="settings-label">
                  <span>Message par défaut pré-rempli :</span>
                  <span className="label-tip">Le texte préparé automatiquement quand le client clique</span>
                </label>
                <textarea 
                  rows={3}
                  className="settings-textarea-control"
                  placeholder="ex: Hello SatProMax Support, I would like to get started with IPTV"
                  value={formData.whatsappDefaultMsg}
                  onChange={(e) => handleChange('whatsappDefaultMsg', e.target.value)}
                />
              </div>

              <div className="settings-form-block">
                <label className="settings-label">
                  <span>Texte du Badge Flottant :</span>
                  <span className="label-tip">Bouton vert fixe en bas à gauche de la page</span>
                </label>
                <input 
                  type="text" 
                  className="settings-input-control"
                  placeholder="ex: 24/7 SUPPORT ou DISCUTER"
                  value={formData.supportPillText}
                  onChange={(e) => handleChange('supportPillText', e.target.value)}
                />

                <div className="form-tip-box">
                  <IconSparkles size={16} className="tip-icon" />
                  <span>Ce badge reste visible sur toutes les pages pour maximiser le taux de conversion de vos visiteurs.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Modes de Paiement (Complete Your Subscription) */}
          <div className="settings-card payment-settings-card">
            <div className="card-header-with-badge">
              <div className="card-header-left">
                <div className="payment-badge-icon">
                  💳
                </div>
                <div>
                  <h3 className="card-title">Modes de Paiement (Complete Your Subscription)</h3>
                  <p className="card-desc">
                    Gérez les options de paiement affichées aux clients dans la fenêtre de commande. Activez, désactivez ou personnalisez les libellés en temps réel.
                  </p>
                </div>
              </div>
              <span className="status-pill status-active">
                {formData.paymentMethods?.filter(m => m.enabled !== false).length || 0} Actifs
              </span>
            </div>

            {/* General Texts Grid */}
            <div className="settings-form-grid-2">
              <div className="settings-form-block">
                <label className="settings-label">Titre au-dessus des choix :</label>
                <input 
                  type="text" 
                  className="settings-input-control"
                  value={formData.paymentLabel || ''}
                  onChange={(e) => handleChange('paymentLabel', e.target.value)}
                  placeholder="Select Payment Method:"
                />
              </div>

              <div className="settings-form-block">
                <label className="settings-label">Texte de réassurance (SSL / Garantie) :</label>
                <input 
                  type="text" 
                  className="settings-input-control"
                  value={formData.securityText || ''}
                  onChange={(e) => handleChange('securityText', e.target.value)}
                  placeholder="256-Bit SSL Encrypted • 7-Day Money-Back Guarantee"
                />
              </div>
            </div>

            {/* Methods Management List */}
            <div className="payment-methods-admin-section">
              <div className="methods-section-header">
                <span className="quick-label">⚡ Options de paiement configurées :</span>
                <span className="methods-counter-pill">
                  {formData.paymentMethods?.filter(m => m.enabled !== false).length || 0} / {formData.paymentMethods?.length || 0} visibles
                </span>
              </div>

              <div className="payment-methods-admin-list">
                {(!formData.paymentMethods || formData.paymentMethods.length === 0) ? (
                  <div className="empty-methods-notice">
                    <span>ℹ️ Aucun mode de paiement configuré pour le moment. Cliquez sur le bouton ci-dessous pour ajouter votre premier mode de paiement.</span>
                  </div>
                ) : (
                  formData.paymentMethods.map((method, idx) => {
                    const isEnabled = method.enabled !== false;
                    return (
                      <div 
                        key={method.id || idx} 
                        className={`payment-admin-item ${isEnabled ? 'item-enabled' : 'item-disabled'}`}
                      >
                        {/* Top row: Toggle + Name + Preview + Delete */}
                        <div className="payment-item-main-row">
                          {/* Toggle On/Off */}
                          <button
                            type="button"
                            className={`btn-method-toggle ${isEnabled ? 'toggle-on' : 'toggle-off'}`}
                            onClick={() => handleTogglePaymentMethod(idx)}
                            title={isEnabled ? 'Cliquer pour masquer cette méthode' : 'Cliquer pour afficher cette méthode'}
                          >
                            <span className="toggle-dot"></span>
                            <span className="toggle-label">{isEnabled ? 'Actif' : 'Masqué'}</span>
                          </button>

                          {/* Name / Label input */}
                          <div className="method-field-group">
                            <label className="method-field-label">Libellé affiché au client :</label>
                            <input 
                              type="text"
                              className="settings-input-control method-text-input"
                              value={method.name || ''}
                              onChange={(e) => handlePaymentMethodNameChange(idx, e.target.value)}
                              placeholder="Nom de la méthode (ex: Carte Bancaire, Virement, etc.)"
                            />
                          </div>

                          {/* Preview Button */}
                          <div className="method-field-group method-preview-group">
                            <label className="method-field-label">Aperçu bouton :</label>
                            <div className={`pay-opt-box-preview ${isEnabled ? 'preview-active' : 'preview-muted'}`}>
                              {method.image && (
                                <img src={method.image} alt="" className="pay-opt-img-preview" />
                              )}
                              <span>{method.name || 'Mode de paiement'}</span>
                            </div>
                          </div>

                          {/* Delete button */}
                          <button
                            type="button"
                            className="btn-delete-method"
                            onClick={() => handleDeletePaymentMethod(idx)}
                            title="Supprimer ce mode de paiement"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>

                        {/* Bottom row: Image upload & URL */}
                        <div className="payment-item-image-row">
                          <div className="method-image-ctrl-group">
                            <label className="method-field-label">🖼️ Logo / Image de la méthode (optionnel) :</label>
                            <div className="method-image-inputs-flex">
                              {method.image ? (
                                <div className="method-thumbnail-wrapper">
                                  <img src={method.image} alt="Logo" className="method-thumb-img" />
                                  <button 
                                    type="button" 
                                    className="btn-remove-thumb"
                                    onClick={() => handleMethodImageChange(idx, '')}
                                    title="Supprimer l'image"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div className="method-thumb-placeholder" title="Aucune image sélectionnée">
                                  <span>🖼️</span>
                                </div>
                              )}

                              <input 
                                type="text"
                                className="settings-input-control method-image-url-input"
                                value={method.image || ''}
                                onChange={(e) => handleMethodImageChange(idx, e.target.value)}
                                placeholder="Coller l'URL de l'image (https://...) ou choisir un fichier ->"
                              />

                              <label className="btn-file-upload-styled btn-method-file-label">
                                <span>📁 Choisir photo</span>
                                <input 
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleMethodImageUpload(idx, e)}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add Custom Method */}
              <div className="add-method-wrapper">
                {showAddMethod ? (
                  <div className="add-method-form-box animate-scale-up">
                    <span className="quick-label">➕ Ajouter un nouveau moyen de paiement :</span>
                    
                    <div className="add-method-form-grid">
                      <div className="form-group">
                        <label className="method-field-label">Nom du moyen de paiement :</label>
                        <input 
                          type="text"
                          className="settings-input-control"
                          placeholder="ex: 🏦 Virement Bancaire ou 📱 Apple Pay / Flouci"
                          value={newMethodName}
                          onChange={(e) => setNewMethodName(e.target.value)}
                          autoFocus
                        />
                      </div>

                      <div className="form-group">
                        <label className="method-field-label">🖼️ Logo / Image (optionnel) :</label>
                        <div className="method-image-inputs-flex">
                          {newMethodImage && (
                            <div className="method-thumbnail-wrapper">
                              <img src={newMethodImage} alt="Preview" className="method-thumb-img" />
                              <button 
                                type="button" 
                                className="btn-remove-thumb"
                                onClick={() => setNewMethodImage('')}
                                title="Retirer l'image"
                              >
                                ✕
                              </button>
                            </div>
                          )}

                          <input 
                            type="text"
                            className="settings-input-control method-image-url-input"
                            placeholder="Coller l'URL de l'image (https://...) ou choisir un fichier ->"
                            value={newMethodImage}
                            onChange={(e) => setNewMethodImage(e.target.value)}
                          />

                          <label className="btn-file-upload-styled btn-method-file-label">
                            <span>📁 Choisir photo</span>
                            <input 
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={handleNewImageUpload}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Live button preview in add form */}
                    {newMethodName && (
                      <div className="add-preview-strip">
                        <span className="method-field-label">Aperçu du bouton :</span>
                        <div className="pay-opt-box-preview preview-active add-box-live-btn">
                          {newMethodImage && (
                            <img src={newMethodImage} alt="" className="pay-opt-img-preview" />
                          )}
                          <span>{newMethodName}</span>
                        </div>
                      </div>
                    )}

                    <div className="add-method-footer-actions">
                      <button 
                        type="button" 
                        className="btn-add-method-submit"
                        onClick={handleAddPaymentMethod}
                        disabled={!newMethodName.trim()}
                      >
                        <IconCheck size={16} />
                        <span>Confirmer l'ajout</span>
                      </button>
                      <button 
                        type="button" 
                        className="btn-add-method-cancel"
                        onClick={() => {
                          setShowAddMethod(false);
                          setNewMethodName('');
                          setNewMethodImage('');
                        }}
                      >
                        <IconClose size={16} />
                        <span>Annuler</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    type="button" 
                    className="btn-trigger-add-method"
                    onClick={() => setShowAddMethod(true)}
                  >
                    <IconPlus size={16} />
                    <span>+ Ajouter un mode de paiement personnalisé</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Support Agent & Chat Drawer Customization */}
          <div className="settings-card">
            <div className="card-header-standard">
              <div className="card-header-icon-box">💬</div>
              <div>
                <h3 className="card-title">Personnalisation de la Fenêtre de Chat d'Accueil</h3>
                <p className="card-desc">Contrôlez les bulles de dialogue de bienvenue affichées lorsque le client clique sur le bouton flottant.</p>
              </div>
            </div>

            <div className="settings-form-grid-2">
              <div className="settings-form-block">
                <label className="settings-label">Titre du Support / Nom de l'agent :</label>
                <input 
                  type="text" 
                  className="settings-input-control"
                  value={formData.chatSupportTitle}
                  onChange={(e) => handleChange('chatSupportTitle', e.target.value)}
                  placeholder="SatProMax Support"
                />
              </div>

              <div className="settings-form-block">
                <label className="settings-label">Statut de disponibilité affiché :</label>
                <input 
                  type="text" 
                  className="settings-input-control"
                  value={formData.chatOnlineStatus}
                  onChange={(e) => handleChange('chatOnlineStatus', e.target.value)}
                  placeholder="Online • Typically replies instantly"
                />
              </div>
            </div>

            <div className="settings-form-grid-2">
              <div className="settings-form-block">
                <label className="settings-label">Bulle de message 1 (Accueil) :</label>
                <input 
                  type="text" 
                  className="settings-input-control"
                  value={formData.chatGreeting1}
                  onChange={(e) => handleChange('chatGreeting1', e.target.value)}
                  placeholder="👋 Hello! Welcome to SatProMax. How can we help you today?"
                />
              </div>

              <div className="settings-form-block">
                <label className="settings-label">Bulle de message 2 (Proposition test/aide) :</label>
                <input 
                  type="text" 
                  className="settings-input-control"
                  value={formData.chatGreeting2}
                  onChange={(e) => handleChange('chatGreeting2', e.target.value)}
                  placeholder="⚡ Would you like a Free Trial or help setting up on your FireStick / Smart TV?"
                />
              </div>
            </div>

            <div className="settings-form-block">
              <label className="settings-label">Texte du bouton d'envoi WhatsApp :</label>
              <input 
                type="text" 
                className="settings-input-control"
                value={formData.chatStartBtn}
                onChange={(e) => handleChange('chatStartBtn', e.target.value)}
                placeholder="Start WhatsApp Conversation"
              />
            </div>
          </div>

          {/* Guarantee & Trust Badges */}
          <div className="settings-card">
            <div className="card-header-standard">
              <div className="card-header-icon-box">🛡️</div>
              <div>
                <h3 className="card-title">Garantie & Réassurance Commerciale</h3>
                <p className="card-desc">Textes de garantie affichés en pied de page pour rassurer les acheteurs.</p>
              </div>
            </div>

            <div className="settings-form-grid-2">
              <div className="settings-form-block">
                <label className="settings-label">Titre de la Garantie :</label>
                <input 
                  type="text" 
                  className="settings-input-control"
                  value={formData.guaranteeTitle}
                  onChange={(e) => handleChange('guaranteeTitle', e.target.value)}
                  placeholder="7-Day Money Back Guarantee"
                />
              </div>

              <div className="settings-form-block">
                <label className="settings-label">Description de la Garantie :</label>
                <input 
                  type="text" 
                  className="settings-input-control"
                  value={formData.guaranteeDesc}
                  onChange={(e) => handleChange('guaranteeDesc', e.target.value)}
                  placeholder="100% risk-free trial with instant money-back protection."
                />
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};
