import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useContent } from '../context/ContentContext';
import { IconClose, IconCheck, IconSparkles, IconTrash } from './Icons';

export const LanguageIconsModal = ({ isOpen, onClose }) => {
  const { languages, updateLanguageIcon, currentLang } = useContent();

  const [icons, setIcons] = useState({});

  // Sync state whenever modal opens or languages change
  useEffect(() => {
    if (isOpen && languages) {
      const map = {};
      languages.forEach((l) => {
        map[l.code] = l.icon || '';
      });
      setIcons(map);
    }
  }, [isOpen, languages]);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAr = currentLang === 'ar';
  const isFr = currentLang === 'fr';

  const t = {
    badge: isAr ? 'تخصيص الواجهة' : isFr ? 'Personnalisation' : 'UI Customization',
    title: isAr ? 'تخصيص أيقونات اللغات' : isFr ? 'Personnaliser les Icônes de Langue' : 'Customize Language Icons',
    subtitle: isAr
      ? 'يمكنك وضع رابط مباشر لصورة أو SVG، أو اختيار علم عالي الدقة من الاقتراحات السريعة لكل لغة.'
      : isFr
      ? 'Définissez une URL d\'image ou de SVG pour chaque langue, ou sélectionnez un drapeau HD prédéfini.'
      : 'Provide custom image or SVG URLs for each language, or pick from high-definition flag presets.',
    previewLabel: isAr ? 'المعاينة' : isFr ? 'Aperçu' : 'Preview',
    presetLabel: isAr ? 'الأعلام المقترحة (عالية الدقة) :' : isFr ? 'Drapeaux suggérés (Haute Définition) :' : 'Suggested Flags (HD Presets):',
    inputPlaceholder: isAr ? 'رابط الصورة (https://... أو /icon.png)' : isFr ? 'URL de l\'image (https://...)' : 'Image URL (https://... or /icon.png)',
    saveBtn: isAr ? 'حفظ الأيقونات' : isFr ? 'Enregistrer les modifications' : 'Save Icons',
    resetBtn: isAr ? 'استعادة الأعلام التعبيرية' : isFr ? 'Réinitialiser aux drapeaux par défaut' : 'Reset to Default Flags',
    cancelBtn: isAr ? 'إلغاء' : isFr ? 'Annuler' : 'Cancel',
    successMsg: isAr ? 'تم حفظ أيقونات اللغات بنجاح!' : isFr ? 'Icônes enregistrées avec succès !' : 'Language icons saved successfully!',
    resetConfirm: isAr ? 'هل أنت متأكد من استعادة الأعلام التعبيرية الأصلية؟' : isFr ? 'Voulez-vous réinitialiser toutes les icônes aux drapeaux par défaut ?' : 'Are you sure you want to restore default emoji flags?',
  };

  const presets = {
    ar: [
      { label: '🇸🇦 Saudi Arabia', url: 'https://flagcdn.com/w80/sa.png' },
      { label: '🇦🇪 UAE', url: 'https://flagcdn.com/w80/ae.png' },
      { label: '🇪🇬 Egypt', url: 'https://flagcdn.com/w80/eg.png' },
      { label: '🇲🇦 Morocco', url: 'https://flagcdn.com/w80/ma.png' },
      { label: '🇹🇳 Tunisia', url: 'https://flagcdn.com/w80/tn.png' },
      { label: '🇩🇿 Algeria', url: 'https://flagcdn.com/w80/dz.png' },
      { label: '🇶🇦 Qatar', url: 'https://flagcdn.com/w80/qa.png' },
      { label: '🇰🇼 Kuwait', url: 'https://flagcdn.com/w80/kw.png' },
    ],
    fr: [
      { label: '🇫🇷 France', url: 'https://flagcdn.com/w80/fr.png' },
      { label: '🇧🇪 Belgium', url: 'https://flagcdn.com/w80/be.png' },
      { label: '🇨🇦 Canada FR', url: 'https://flagcdn.com/w80/ca.png' },
      { label: '🇨🇭 Switzerland', url: 'https://flagcdn.com/w80/ch.png' },
    ],
    en: [
      { label: '🇬🇧 United Kingdom', url: 'https://flagcdn.com/w80/gb.png' },
      { label: '🇺🇸 United States', url: 'https://flagcdn.com/w80/us.png' },
      { label: '🇨🇦 Canada', url: 'https://flagcdn.com/w80/ca.png' },
      { label: '🇦🇺 Australia', url: 'https://flagcdn.com/w80/au.png' },
    ],
    de: [
      { label: '🇩🇪 Deutschland', url: 'https://flagcdn.com/w80/de.png' },
      { label: '🇦🇹 Österreich', url: 'https://flagcdn.com/w80/at.png' },
      { label: '🇨🇭 Schweiz', url: 'https://flagcdn.com/w80/ch.png' },
    ],
    es: [
      { label: '🇪🇸 España', url: 'https://flagcdn.com/w80/es.png' },
      { label: '🇲🇽 México', url: 'https://flagcdn.com/w80/mx.png' },
      { label: '🇦🇷 Argentina', url: 'https://flagcdn.com/w80/ar.png' },
      { label: '🇨🇴 Colombia', url: 'https://flagcdn.com/w80/co.png' },
    ],
    it: [
      { label: '🇮🇹 Italia', url: 'https://flagcdn.com/w80/it.png' },
      { label: '🇨🇭 Svizzera', url: 'https://flagcdn.com/w80/ch.png' },
    ],
    pt: [
      { label: '🇵🇹 Portugal', url: 'https://flagcdn.com/w80/pt.png' },
      { label: '🇧🇷 Brasil', url: 'https://flagcdn.com/w80/br.png' },
    ],
    nl: [
      { label: '🇳🇱 Nederland', url: 'https://flagcdn.com/w80/nl.png' },
      { label: '🇧🇪 België', url: 'https://flagcdn.com/w80/be.png' },
    ],
    no: [
      { label: '🇳🇴 Norge', url: 'https://flagcdn.com/w80/no.png' },
    ],
    sv: [
      { label: '🇸🇪 Sverige', url: 'https://flagcdn.com/w80/se.png' },
      { label: '🇫🇮 Finland', url: 'https://flagcdn.com/w80/fi.png' },
    ],
    ru: [
      { label: '🇷🇺 Россия', url: 'https://flagcdn.com/w80/ru.png' },
      { label: '🇰🇿 Казахстан', url: 'https://flagcdn.com/w80/kz.png' },
    ],
    pl: [
      { label: '🇵🇱 Polska', url: 'https://flagcdn.com/w80/pl.png' },
    ],
    el: [
      { label: '🇬🇷 Ελλάδα', url: 'https://flagcdn.com/w80/gr.png' },
      { label: '🇨🇾 Κύπρος', url: 'https://flagcdn.com/w80/cy.png' },
    ],
    tr: [
      { label: '🇹🇷 Türkiye', url: 'https://flagcdn.com/w80/tr.png' },
      { label: '🇨🇾 Kıbrıs', url: 'https://flagcdn.com/w80/cy.png' },
    ],
  };

  const handleChange = (code, val) => {
    setIcons((prev) => ({ ...prev, [code]: val }));
  };

  const handleClear = (code) => {
    setIcons((prev) => ({ ...prev, [code]: '' }));
  };

  const handleSave = () => {
    Object.keys(icons).forEach((code) => {
      updateLanguageIcon(code, icons[code]?.trim() || null);
    });
    alert(t.successMsg);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm(t.resetConfirm)) {
      setIcons({});
      languages.forEach((l) => {
        updateLanguageIcon(l.code, null);
      });
      onClose();
    }
  };

  const modalContent = (
    <div className="lang-modal-backdrop" onClick={onClose}>
      <div 
        className="lang-modal-dialog" 
        onClick={(e) => e.stopPropagation()}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Modal Top Header */}
        <div className="lang-modal-header">
          <div className="lang-modal-header-info">
            <div className="lang-modal-badge">
              <IconSparkles size={13} />
              <span>{t.badge}</span>
            </div>
            <h3 className="lang-modal-title">{t.title}</h3>
            <p className="lang-modal-subtitle">{t.subtitle}</p>
          </div>

          <button 
            type="button" 
            onClick={onClose} 
            className="lang-modal-close-btn"
            aria-label="Close"
            title="Close"
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Scrollable Language Configuration List */}
        <div className="lang-modal-body">
          {languages.map((l) => {
            const currentVal = icons[l.code] || '';
            const langPresets = presets[l.code] || [];

            return (
              <div key={l.code} className="lang-card-item">
                <div className="lang-card-top">
                  <div className="lang-card-title-group">
                    <span className="lang-flag-display">{l.flag}</span>
                    <span className="lang-name-text">{l.name}</span>
                    <span className="lang-code-pill">{l.code.toUpperCase()}</span>
                  </div>

                  {/* Live Interactive Preview Box */}
                  <div className="lang-preview-wrap">
                    <span className="lang-preview-label">{t.previewLabel}:</span>
                    <div className="lang-preview-box">
                      {currentVal ? (
                        <img 
                          src={currentVal} 
                          alt={l.name} 
                          className="lang-preview-img"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{l.flag}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Input with Clear Action */}
                <div className="lang-input-wrapper">
                  <input
                    type="text"
                    value={currentVal}
                    onChange={(e) => handleChange(l.code, e.target.value)}
                    placeholder={t.inputPlaceholder}
                    className="lang-url-input"
                  />
                  {currentVal && (
                    <button
                      type="button"
                      className="lang-input-clear-btn"
                      onClick={() => handleClear(l.code)}
                      title="Clear"
                    >
                      <IconClose size={13} />
                    </button>
                  )}
                </div>

                {/* Quick Flag Presets */}
                {langPresets.length > 0 && (
                  <div className="lang-presets-container">
                    <span className="lang-presets-label">{t.presetLabel}</span>
                    <div className="lang-preset-chips">
                      {langPresets.map((p, idx) => {
                        const isSelected = currentVal === p.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleChange(l.code, p.url)}
                            className={`lang-preset-chip ${isSelected ? 'active' : ''}`}
                          >
                            <img 
                              src={p.url} 
                              alt="" 
                              className="lang-preset-thumb" 
                            />
                            <span>{p.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="lang-modal-footer">
          <button
            type="button"
            onClick={handleReset}
            className="lang-modal-btn-reset"
          >
            <IconTrash size={16} />
            <span>{t.resetBtn}</span>
          </button>

          <div className="lang-modal-footer-actions">
            <button
              type="button"
              onClick={onClose}
              className="lang-modal-btn-cancel"
            >
              {t.cancelBtn}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="lang-modal-btn-save"
            >
              <IconCheck size={18} />
              <span>{t.saveBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal in document.body via portal so ancestor CSS (e.g. navbar backdrop-filter) won't constrain fixed positioning
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};
