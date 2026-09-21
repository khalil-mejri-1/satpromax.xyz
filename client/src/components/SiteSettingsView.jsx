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
import { PaymentLogo, DEFAULT_PAYMENT_METHODS } from './PaymentLogos';

export const SiteSettingsView = ({ 
  content, 
  updateSection, 
  saveToServer, 
  isSaving, 
  triggerNotification 
}) => {
  const footerData = content?.footer || {};

  const cleanMethods = (methods) => {
    if (!Array.isArray(methods) || methods.length === 0) return DEFAULT_PAYMENT_METHODS;
    return methods.filter(Boolean);
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
    paymentLabel: content?.paymentLabel || content?.modals?.paymentLabel || footerData.paymentLabel || 'Mode de paiement *',
    securityText: footerData.securityText || content?.modals?.securityText || '256-Bit SSL Encrypted • 7-Day Money-Back Guarantee',
    paymentMethods: cleanMethods(content?.paymentMethods || footerData.paymentMethods || []),

    // Success Message fields
    orderSuccessTitle: content?.modals?.successTitle || "Commande d'abonnement envoyée !",
    orderSuccessDesc: content?.modals?.successDesc || "Merci ! Une confirmation d'activation avec vos identifiants M3U & Xtream Codes a été envoyée à",
    orderServerUrl: content?.modals?.serverUrl || "http://line.satpromax.me",
    orderStatusActive: content?.modals?.statusActive || "Actif (Ligne VIP 24/7)",
    orderSetupGuide: content?.modals?.setupGuideValue || "Sent for {device}",
    orderWhatsappBtnText: content?.modals?.btnWhatsappConfirm || "Confirmer via Chat WhatsApp Instantané",
    orderWhatsappMsg: content?.modals?.whatsappOrderMsg || "Bonjour SatProMax, je viens de finaliser ma commande pour l'email {email}",
    orderDoneBtnText: content?.modals?.btnDone || "Terminé",

    // Free Trial Navbar fields
    btnFreeTrial: content?.navbar?.btnFreeTrial || "Test Gratuit 24h",
    freeTrialWhatsappMsg: content?.navbar?.freeTrialWhatsappMsg || "Bonjour SatProMax, je souhaite demander un test gratuit de 24 heures pour tester votre service IPTV s'il vous plaît.",
  });

  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodImage, setNewMethodImage] = useState('');
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync state if external content updates
  useEffect(() => {
    if (content) {
      setFormData((prev) => ({
        ...prev,
        whatsappPhone: content.footer?.whatsappPhone || prev.whatsappPhone,
        whatsappDefaultMsg: content.footer?.whatsappDefaultMsg || prev.whatsappDefaultMsg,
        supportPillText: content.footer?.supportPillText || prev.supportPillText,
        chatSupportTitle: content.footer?.chatSupportTitle || prev.chatSupportTitle,
        chatOnlineStatus: content.footer?.chatOnlineStatus || prev.chatOnlineStatus,
        chatGreeting1: content.footer?.chatGreeting1 || prev.chatGreeting1,
        chatGreeting2: content.footer?.chatGreeting2 || prev.chatGreeting2,
        chatStartBtn: content.footer?.chatStartBtn || prev.chatStartBtn,
        guaranteeTitle: content.footer?.guaranteeTitle || prev.guaranteeTitle,
        guaranteeDesc: content.footer?.guaranteeDesc || prev.guaranteeDesc,
        paymentLabel: content.paymentLabel || content.modals?.paymentLabel || content.footer?.paymentLabel || prev.paymentLabel,
        securityText: content.footer?.securityText || content.modals?.securityText || prev.securityText,
        paymentMethods: cleanMethods(content.paymentMethods || content.footer?.paymentMethods || prev.paymentMethods),
        orderSuccessTitle: content.modals?.successTitle || prev.orderSuccessTitle,
        orderSuccessDesc: content.modals?.successDesc || prev.orderSuccessDesc,
        orderServerUrl: content.modals?.serverUrl || prev.orderServerUrl,
        orderStatusActive: content.modals?.statusActive || prev.orderStatusActive,
        orderSetupGuide: content.modals?.setupGuideValue || prev.orderSetupGuide,
        orderWhatsappBtnText: content.modals?.btnWhatsappConfirm || prev.orderWhatsappBtnText,
        orderWhatsappMsg: content.modals?.whatsappOrderMsg || prev.orderWhatsappMsg,
        orderDoneBtnText: content.modals?.btnDone || prev.orderDoneBtnText,
        btnFreeTrial: content.navbar?.btnFreeTrial || prev.btnFreeTrial,
        freeTrialWhatsappMsg: content.navbar?.freeTrialWhatsappMsg || prev.freeTrialWhatsappMsg,
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
    if (content) {
      setFormData({
        whatsappPhone: content.footer?.whatsappPhone || '+15551234567',
        whatsappDefaultMsg: content.footer?.whatsappDefaultMsg || 'Hello SatProMax Support, I would like to get started with IPTV',
        supportPillText: content.footer?.supportPillText || '24/7 SUPPORT',
        chatSupportTitle: content.footer?.chatSupportTitle || 'SatProMax Support',
        chatOnlineStatus: content.footer?.chatOnlineStatus || 'En ligne • Répond généralement en quelques secondes',
        chatGreeting1: content.footer?.chatGreeting1 || '👋 Bonjour ! Bienvenue sur SatProMax. Comment pouvons-nous vous aider ?',
        chatGreeting2: content.footer?.chatGreeting2 || '⚡ Souhaitez-vous un test gratuit ou de l\'aide pour configurer votre appareil ?',
        chatStartBtn: content.footer?.chatStartBtn || 'Démarrer la discussion WhatsApp',
        guaranteeTitle: content.footer?.guaranteeTitle || '7-Day Money Back Guarantee',
        guaranteeDesc: content.footer?.guaranteeDesc || '100% risk-free trial with instant money-back protection.',
        paymentLabel: content.paymentLabel || content.modals?.paymentLabel || content.footer?.paymentLabel || 'Mode de paiement *',
        securityText: content.footer?.securityText || content.modals?.securityText || '256-Bit SSL Encrypted • 7-Day Money-Back Guarantee',
        paymentMethods: cleanMethods(content.paymentMethods || content.footer?.paymentMethods || []),
        orderSuccessTitle: content.modals?.successTitle || "Commande d'abonnement envoyée !",
        orderSuccessDesc: content.modals?.successDesc || "Merci ! Une confirmation d'activation avec vos identifiants M3U & Xtream Codes a été envoyée à",
        orderServerUrl: content.modals?.serverUrl || "http://line.satpromax.me",
        orderStatusActive: content.modals?.statusActive || "Actif (Ligne VIP 24/7)",
        orderSetupGuide: content.modals?.setupGuideValue || "Sent for {device}",
        orderWhatsappBtnText: content.modals?.btnWhatsappConfirm || "Confirmer via Chat WhatsApp Instantané",
        orderWhatsappMsg: content.modals?.whatsappOrderMsg || "Bonjour SatProMax, je viens de finaliser ma commande pour l'email {email}",
        orderDoneBtnText: content.modals?.btnDone || "Terminé",
        btnFreeTrial: content.navbar?.btnFreeTrial || "Test Gratuit 24h",
        freeTrialWhatsappMsg: content.navbar?.freeTrialWhatsappMsg || "Bonjour SatProMax, je souhaite demander un test gratuit de 24 heures pour tester votre service IPTV s'il vous plaît.",
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
      updateSection('paymentLabel', formData.paymentLabel);
      updateSection('modals', {
        ...(content?.modals || {}),
        paymentLabel: formData.paymentLabel,
        successTitle: formData.orderSuccessTitle,
        successDesc: formData.orderSuccessDesc,
        serverUrl: formData.orderServerUrl,
        statusActive: formData.orderStatusActive,
        setupGuideValue: formData.orderSetupGuide,
        btnWhatsappConfirm: formData.orderWhatsappBtnText,
        whatsappOrderMsg: formData.orderWhatsappMsg,
        btnDone: formData.orderDoneBtnText,
      });
      updateSection('navbar', {
        ...(content?.navbar || {}),
        btnFreeTrial: formData.btnFreeTrial,
        freeTrialWhatsappMsg: formData.freeTrialWhatsappMsg,
      });
    }
    if (saveToServer) {
      const updatedContent = {
        ...content,
        footer: {
          ...(content?.footer || {}),
          ...formData,
        },
        paymentMethods: formData.paymentMethods,
        paymentLabel: formData.paymentLabel,
        navbar: {
          ...(content?.navbar || {}),
          btnFreeTrial: formData.btnFreeTrial,
          freeTrialWhatsappMsg: formData.freeTrialWhatsappMsg,
        },
        modals: {
          ...(content?.modals || {}),
          paymentLabel: formData.paymentLabel,
          successTitle: formData.orderSuccessTitle,
          successDesc: formData.orderSuccessDesc,
          serverUrl: formData.orderServerUrl,
          statusActive: formData.orderStatusActive,
          setupGuideValue: formData.orderSetupGuide,
          btnWhatsappConfirm: formData.orderWhatsappBtnText,
          whatsappOrderMsg: formData.orderWhatsappMsg,
          btnDone: formData.orderDoneBtnText,
        },
      };
      await saveToServer(updatedContent);
    }
    setHasChanges(false);
    if (triggerNotification) {
      triggerNotification('✅ Paramètres, modes de paiement et messages de confirmation enregistrés avec succès !');
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

            <div className="settings-divider"></div>

            <div className="settings-form-grid-2">
              <div className="settings-form-block">
                <label className="settings-label">
                  <span>Libellé Bouton Test Gratuit (Navbar) :</span>
                  <span className="label-tip">Affiché dans la barre de navigation en haut du site</span>
                </label>
                <input 
                  type="text" 
                  className="settings-input-control"
                  placeholder="Demander un test gratuit 24 heures"
                  value={formData.btnFreeTrial || ''}
                  onChange={(e) => handleChange('btnFreeTrial', e.target.value)}
                />
              </div>

              <div className="settings-form-block">
                <label className="settings-label">
                  <span>Message WhatsApp pour Test 24h :</span>
                  <span className="label-tip">Le texte envoyé lors du clic sur le bouton de test gratuit</span>
                </label>
                <textarea 
                  rows={2}
                  className="settings-textarea-control"
                  placeholder="Bonjour SatProMax, je souhaite demander un test gratuit de 24 heures pour tester votre service IPTV s'il vous plaît."
                  value={formData.freeTrialWhatsappMsg || ''}
                  onChange={(e) => handleChange('freeTrialWhatsappMsg', e.target.value)}
                />
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
                  placeholder="Mode de paiement *"
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="quick-label">⚡ Options de paiement configurées :</span>
                  <span className="methods-counter-pill">
                    {formData.paymentMethods?.filter(m => m.enabled !== false).length || 0} / {formData.paymentMethods?.length || 0} visibles
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-trigger-add-method"
                  style={{ width: 'auto', padding: '6px 14px', fontSize: '0.75rem', marginTop: 0 }}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, paymentMethods: DEFAULT_PAYMENT_METHODS }));
                    setHasChanges(true);
                    if (triggerNotification) {
                      triggerNotification('🔄 Les 13 modes de paiement par défaut ont été restaurés.');
                    }
                  }}
                  title="Restaurer les 13 modes par défaut (Flouci, D 17, Paypal, Binance, Redotpay, Virement bancaire, Moneco, Western union, Ria, La Poste tunisienne, IZI, MoneyGram, kashy)"
                >
                  🔄 Restaurer les 13 modes officiels
                </button>
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
                            <div className={`pay-opt-box-preview ${isEnabled ? 'preview-active' : 'preview-muted'}`} style={{ minWidth: '135px', padding: '8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: isEnabled ? '#ffffff' : 'rgba(255,255,255,0.03)', color: isEnabled ? '#0f172a' : '#64748b', border: isEnabled ? '1.5px solid #0ea5e9' : '1px dashed rgba(255,255,255,0.1)' }}>
                              <div style={{ height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <PaymentLogo method={method} />
                              </div>
                              <span style={{ fontSize: '11px', fontWeight: '700' }}>{method.name || 'Mode de paiement'}</span>
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
                        <div className="pay-opt-box-preview preview-active add-box-live-btn" style={{ minWidth: '135px', padding: '8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: '#ffffff', color: '#0f172a', border: '1.5px solid #0ea5e9' }}>
                          <div style={{ height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PaymentLogo method={{ name: newMethodName, image: newMethodImage }} />
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: '700' }}>{newMethodName}</span>
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

          {/* Card: Message de Confirmation de Commande (Fenêtre de Succès) */}
          <div className="settings-card order-success-settings-card">
            <div className="card-header-with-badge">
              <div className="card-header-left">
                <div className="success-badge-icon" style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                  ✅
                </div>
                <div>
                  <h3 className="card-title">Message de Confirmation de Commande (Fenêtre de Succès)</h3>
                  <p className="card-desc">
                    Personnalisez le titre, les textes, l'URL du serveur, le message WhatsApp et les boutons affichés au client immédiatement après la validation de sa commande.
                  </p>
                </div>
              </div>
              <span className="status-pill status-active">
                ● Personnalisable
              </span>
            </div>

            {/* Inputs Grid */}
            <div className="settings-form-grid-2">
              <div className="settings-form-block">
                <label className="settings-label">
                  <span>Titre de Confirmation (H3) :</span>
                  <span className="label-tip">Titre principal affiché sous l'icône verte</span>
                </label>
                <input 
                  type="text" 
                  className="settings-input-control"
                  value={formData.orderSuccessTitle || ''}
                  onChange={(e) => handleChange('orderSuccessTitle', e.target.value)}
                  placeholder="Commande d'abonnement envoyée !"
                />
              </div>

              <div className="settings-form-block">
                <label className="settings-label">
                  <span>URL du Serveur IPTV affichée :</span>
                  <span className="label-tip">Ligne 1 de l'encadré</span>
                </label>
                <input 
                  type="text" 
                  className="settings-input-control"
                  value={formData.orderServerUrl || ''}
                  onChange={(e) => handleChange('orderServerUrl', e.target.value)}
                  placeholder="http://line.satpromax.me"
                />
              </div>
            </div>

            <div className="settings-form-block">
              <label className="settings-label">
                <span>Message d'accusé de réception :</span>
                <span className="label-tip">L'adresse e-mail saisie par le client sera affichée en gras à la fin</span>
              </label>
              <textarea 
                rows={2}
                className="settings-textarea-control"
                value={formData.orderSuccessDesc || ''}
                onChange={(e) => handleChange('orderSuccessDesc', e.target.value)}
                placeholder="Merci ! Une confirmation d'activation avec vos identifiants M3U & Xtream Codes a été envoyée à"
              />
            </div>

            <div className="settings-form-grid-2">
              <div className="settings-form-block">
                <label className="settings-label">
                  <span>Statut de la Ligne affiché :</span>
                  <span className="label-tip">Ligne 2 de l'encadré</span>
                </label>
                <input 
                  type="text" 
                  className="settings-input-control"
                  value={formData.orderStatusActive || ''}
                  onChange={(e) => handleChange('orderStatusActive', e.target.value)}
                  placeholder="Actif (Ligne VIP 24/7)"
                />
              </div>

              <div className="settings-form-block">
                <label className="settings-label">
                  <span>Guide d'installation :</span>
                  <span className="label-tip">Utilisez &#123;device&#125; pour insérer l'appareil choisi</span>
                </label>
                <input 
                  type="text" 
                  className="settings-input-control"
                  value={formData.orderSetupGuide || ''}
                  onChange={(e) => handleChange('orderSetupGuide', e.target.value)}
                  placeholder="Sent for {device}"
                />
              </div>
            </div>

            <div className="settings-form-grid-2">
              <div className="settings-form-block">
                <label className="settings-label">
                  <span>Texte du Bouton WhatsApp (Bouton Vert) :</span>
                </label>
                <input 
                  type="text" 
                  className="settings-input-control"
                  value={formData.orderWhatsappBtnText || ''}
                  onChange={(e) => handleChange('orderWhatsappBtnText', e.target.value)}
                  placeholder="Confirmer via Chat WhatsApp Instantané"
                />
              </div>

              <div className="settings-form-block">
                <label className="settings-label">
                  <span>Texte du Bouton de Fermeture :</span>
                </label>
                <input 
                  type="text" 
                  className="settings-input-control"
                  value={formData.orderDoneBtnText || ''}
                  onChange={(e) => handleChange('orderDoneBtnText', e.target.value)}
                  placeholder="Terminé"
                />
              </div>
            </div>

            <div className="settings-form-block">
              <label className="settings-label">
                <span>Message pré-rempli envoyé vers WhatsApp :</span>
                <span className="label-tip">Variables disponibles : &#123;email&#125;, &#123;plan&#125;, &#123;device&#125;</span>
              </label>
              <input 
                type="text" 
                className="settings-input-control"
                value={formData.orderWhatsappMsg || ''}
                onChange={(e) => handleChange('orderWhatsappMsg', e.target.value)}
                placeholder="Bonjour SatProMax, je viens de finaliser ma commande pour l'email {email}"
              />
            </div>

            {/* Live Interactive Modal Preview */}
            <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px dashed rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="quick-label">👁️ Aperçu réel de la fenêtre après confirmation :</span>
                <span className="methods-counter-pill">Aperçu en direct</span>
              </div>
              <div style={{ maxWidth: '420px', margin: '0 auto', background: '#141622', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '20px', padding: '24px 20px', textAlign: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.6)' }}>
                <div style={{ width: '54px', height: '54px', background: '#22c55e', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: '26px', fontWeight: '900', boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}>
                  ✓
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', margin: '0 0 8px' }}>
                  {formData.orderSuccessTitle || "Commande d'abonnement envoyée !"}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#9da3b4', margin: '0 0 16px', lineHeight: 1.4 }}>
                  {(formData.orderSuccessDesc || "Merci ! Une confirmation d'activation avec vos identifiants M3U & Xtream Codes a été envoyée à")}{' '}
                  <strong style={{ color: '#ffffff' }}>client@exemple.com</strong>.
                </p>
                <div style={{ background: 'rgba(10, 11, 14, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '12px', textAlign: 'left', marginBottom: '18px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  <div style={{ marginBottom: '4px', color: '#e5e7eb' }}>
                    <strong>URL du Serveur :</strong> {formData.orderServerUrl || 'http://line.satpromax.me'}
                  </div>
                  <div style={{ marginBottom: '4px', color: '#e5e7eb' }}>
                    <strong>Statut :</strong> {formData.orderStatusActive || 'Actif (Ligne VIP 24/7)'}
                  </div>
                  <div style={{ color: '#e5e7eb' }}>
                    <strong>Guide d'installation :</strong> {(formData.orderSetupGuide || 'Sent for {device}').replace('{device}', 'SmartTV')}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ padding: '11px', borderRadius: '10px', background: '#25d366', color: '#ffffff', fontWeight: '700', fontSize: '0.85rem' }}>
                    {formData.orderWhatsappBtnText || 'Confirmer via Chat WhatsApp Instantané'}
                  </div>
                  <div style={{ padding: '9px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.08)', color: '#ffffff', fontWeight: '600', fontSize: '0.82rem' }}>
                    {formData.orderDoneBtnText || 'Terminé'}
                  </div>
                </div>
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
