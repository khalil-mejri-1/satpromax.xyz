import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { 
  IconTrash, 
  IconAlertTriangle, 
  IconInfo, 
  IconPlus, 
  IconRefreshCw, 
  IconClose, 
  IconCopy, 
  IconCheck,
  IconAndroid,
  IconApple,
  IconWindows,
  IconTv
} from './Icons';

export const ConfirmModal = () => {
  const { confirmModal, closeConfirmModal } = useContent();

  if (!confirmModal || !confirmModal.isOpen) return null;

  return <ConfirmModalInner modal={confirmModal} onClose={closeConfirmModal} />;
};

const ConfirmModalInner = ({ modal, onClose }) => {
  const {
    type = 'danger',
    title = 'Confirmation',
    message = '',
    details = null,
    fields = [],
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    onConfirm = () => {},
  } = modal;

  // Local state for prompt fields
  const [formValues, setFormValues] = useState(() => {
    const initial = {};
    if (Array.isArray(fields)) {
      fields.forEach((f) => {
        initial[f.key] = f.defaultValue !== undefined ? f.defaultValue : '';
      });
    }
    return initial;
  });

  const [copiedCode, setCopiedCode] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const firstInputRef = useRef(null);

  // Focus first input on mount
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleInputChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleFormSubmit = (e) => {
    if (e) e.preventDefault();

    if (type === 'prompt' && Array.isArray(fields)) {
      const errors = {};
      let hasError = false;
      fields.forEach((f) => {
        if (f.required && (!formValues[f.key] || !String(formValues[f.key]).trim())) {
          errors[f.key] = true;
          hasError = true;
        }
      });

      if (hasError) {
        setFieldErrors(errors);
        return;
      }

      onConfirm(formValues);
    } else {
      onConfirm();
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Icon chooser
  const renderHeaderIcon = () => {
    switch (type) {
      case 'danger':
        return <IconTrash size={28} className="confirm-icon confirm-icon-danger" />;
      case 'warning':
        return <IconAlertTriangle size={28} className="confirm-icon confirm-icon-warning" />;
      case 'prompt':
        return <IconPlus size={28} className="confirm-icon confirm-icon-prompt" />;
      case 'info':
      default:
        return <IconInfo size={28} className="confirm-icon confirm-icon-info" />;
    }
  };

  return (
    <div className="confirm-dialog-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className={`confirm-dialog-card confirm-dialog-${type} animate-pop-in`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient header effect */}
        <div className={`confirm-ambient-glow glow-${type}`}></div>

        {/* Close Button */}
        <button 
          type="button" 
          className="confirm-dialog-close-btn" 
          onClick={onClose}
          aria-label="Fermer"
        >
          <IconClose size={18} />
        </button>

        {/* Header Icon + Title */}
        <div className="confirm-dialog-header">
          <div className={`confirm-icon-wrapper icon-bg-${type}`}>
            {renderHeaderIcon()}
          </div>
          <div className="confirm-title-group">
            <h3 className="confirm-dialog-title">{title}</h3>
            {message && <p className="confirm-dialog-message">{message}</p>}
          </div>
        </div>

        {/* Content details (e.g. details chip, code box, or custom info) */}
        {details && (
          <div className="confirm-details-container">
            {typeof details === 'string' ? (
              <div className="confirm-details-text">{details}</div>
            ) : (
              <div className="confirm-details-card">
                {details.appName && (
                  <div className="confirm-detail-item">
                    <span className="confirm-detail-label">Application :</span>
                    <strong className="confirm-detail-value">{details.appName}</strong>
                  </div>
                )}
                {details.code && (
                  <div className="confirm-downloader-box">
                    <div className="confirm-downloader-info">
                      <span className="confirm-downloader-tag">Code Downloader</span>
                      <code className="confirm-code-display">{details.code}</code>
                    </div>
                    <button 
                      type="button" 
                      className={`btn-copy-code ${copiedCode ? 'copied' : ''}`}
                      onClick={() => handleCopy(details.code)}
                    >
                      {copiedCode ? (
                        <>
                          <IconCheck size={14} /> <span>Copié !</span>
                        </>
                      ) : (
                        <>
                          <IconCopy size={14} /> <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
                {details.instructions && (
                  <p className="confirm-detail-instructions">{details.instructions}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Form Fields for Prompt Modal */}
        {type === 'prompt' && Array.isArray(fields) && fields.length > 0 && (
          <form onSubmit={handleFormSubmit} className="confirm-prompt-form">
            {fields.map((f, idx) => (
              <div key={f.key} className="confirm-form-group">
                <label className="confirm-form-label">
                  {f.label}
                  {f.required && <span className="text-danger-star"> *</span>}
                </label>

                {f.type === 'select' ? (
                  <select
                    className={`confirm-form-input confirm-form-select ${fieldErrors[f.key] ? 'input-error' : ''}`}
                    value={formValues[f.key]}
                    onChange={(e) => handleInputChange(f.key, e.target.value)}
                    ref={idx === 0 ? firstInputRef : null}
                  >
                    {f.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    className={`confirm-form-input confirm-form-textarea ${fieldErrors[f.key] ? 'input-error' : ''}`}
                    placeholder={f.placeholder || ''}
                    value={formValues[f.key]}
                    onChange={(e) => handleInputChange(f.key, e.target.value)}
                    ref={idx === 0 ? firstInputRef : null}
                  />
                ) : f.type === 'image' ? (
                  <div className="confirm-image-uploader-control">
                    <div className="confirm-image-input-row">
                      <input
                        type="text"
                        className={`confirm-form-input ${fieldErrors[f.key] ? 'input-error' : ''}`}
                        placeholder={f.placeholder || "Collez l'URL de l'image (https://...)"}
                        value={formValues[f.key] || ''}
                        onChange={(e) => handleInputChange(f.key, e.target.value)}
                        ref={idx === 0 ? firstInputRef : null}
                      />
                      <label className="btn-upload-local-file" title="Choisir un fichier image depuis votre ordinateur">
                        📁 Choisir du PC
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (uploadEvent) => {
                              handleInputChange(f.key, uploadEvent.target.result);
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>

                    {formValues[f.key] && (
                      <div className="confirm-image-preview-badge">
                        <img
                          src={formValues[f.key]}
                          alt="Preview"
                          className="confirm-preview-thumb"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="confirm-preview-info">
                          <span className="confirm-preview-label">Aperçu de l'image :</span>
                          <span className="confirm-preview-status">
                            {String(formValues[f.key]).startsWith('data:image') ? '📷 Fichier chargé depuis le PC' : '🔗 Image via URL'}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="btn-clear-preview"
                          onClick={() => handleInputChange(f.key, '')}
                          title="Supprimer l'image"
                        >
                          ✕ Retirer
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type={f.type || 'text'}
                    className={`confirm-form-input ${fieldErrors[f.key] ? 'input-error' : ''}`}
                    placeholder={f.placeholder || ''}
                    value={formValues[f.key]}
                    onChange={(e) => handleInputChange(f.key, e.target.value)}
                    ref={idx === 0 ? firstInputRef : null}
                  />
                )}

                {fieldErrors[f.key] && (
                  <span className="confirm-field-error-msg">Ce champ est requis.</span>
                )}
              </div>
            ))}
          </form>
        )}

        {/* Action Buttons */}
        <div className="confirm-dialog-actions">
          {cancelText && (
            <button 
              type="button" 
              className="btn-confirm-cancel" 
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}

          <button 
            type="button" 
            className={`btn-confirm-action btn-confirm-${type}`}
            onClick={handleFormSubmit}
          >
            {type === 'danger' && <IconTrash size={16} />}
            {type === 'warning' && <IconRefreshCw size={16} />}
            {type === 'prompt' && <IconPlus size={16} />}
            {type === 'info' && <IconCheck size={16} />}
            <span>{confirmText}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
