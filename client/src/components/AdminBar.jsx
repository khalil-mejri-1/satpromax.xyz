import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { IconCheck, IconZap, IconSparkles, IconClose, IconArrowRight } from './Icons';

export const AdminBar = ({ onNavigateDashboard }) => {
  const { isAdmin, logoutAdmin, saveToServer, resetToDefault, isSaving, saveNotification } = useContent();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  if (!isAdmin) return null;

  return (
    <>
      <div className="admin-top-toolbar">
        <div className="admin-toolbar-container">
          <div className="admin-status-badge">
            <span className="pulsing-gold-dot"></span>
            <span className="admin-badge-text">
              👑 <strong>Mode Admin Actif</strong>
            </span>
          </div>

          <div className="admin-actions-group">
            {/* Single button that opens all admin tools in one window */}
            <button 
              type="button" 
              className="btn-admin-bar btn-open-admin-window"
              onClick={() => setIsModalOpen(true)}
              title="Ouvrir le panneau de contrôle de l'administration"
            >
              <span className="btn-icon">⚙️</span>
              <span><strong>Panneau d'administration</strong></span>
              <span className="admin-btn-tag">4 Actions</span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          SINGLE MODAL WINDOW CONTAINING ALL 4 BUTTONS (نافذة واحدة)
         ------------------------------------------------------------------ */}
      {isModalOpen && (
        <div 
          className="admin-panel-modal-overlay" 
          onClick={() => setIsModalOpen(false)} 
          role="dialog" 
          aria-modal="true"
        >
          <div 
            className="admin-panel-modal-card animate-pop-in" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient gold glow */}
            <div className="admin-modal-glow"></div>

            {/* Close Button */}
            <button 
              type="button" 
              className="admin-modal-close-btn" 
              onClick={() => setIsModalOpen(false)}
              aria-label="Fermer la fenêtre"
            >
              <IconClose size={20} />
            </button>

            {/* Modal Header */}
            <div className="admin-modal-header">
              <div className="admin-modal-icon-badge">
                <span>👑</span>
              </div>
              <div className="admin-modal-title-group">
                <h3 className="admin-modal-title">Panneau d'Administration</h3>
                <p className="admin-modal-subtitle">Gérez le catalogue, sauvegardez les données et contrôlez votre session</p>
              </div>
            </div>

            {/* Actions Grid (The 4 buttons organized inside one window) */}
            <div className="admin-modal-actions-list">
              {/* 1. Dashboard (Gestion de Produit) */}
              <button 
                type="button" 
                className="admin-window-action-card action-card-dashboard"
                onClick={() => {
                  setIsModalOpen(false);
                  if (onNavigateDashboard) onNavigateDashboard();
                }}
              >
                <div className="action-card-icon icon-dashboard">
                  <span>📊</span>
                </div>
                <div className="action-card-info">
                  <div className="action-card-title-row">
                    <h4>Dashboard (Gestion de Produit)</h4>
                    <span className="action-pill-tag tag-gold">Catalogue & Tarifs</span>
                  </div>
                  <p>Contrôlez les catégories, créez et modifiez les produits et forfaits affichés sur le site.</p>
                </div>
                <div className="action-card-arrow">
                  <IconArrowRight size={18} />
                </div>
              </button>

              {/* 2. Sauvegarder dans MongoDB */}
              <button 
                type="button" 
                className="admin-window-action-card action-card-save"
                disabled={isSaving}
                onClick={async () => {
                  await saveToServer();
                }}
              >
                <div className="action-card-icon icon-save">
                  <span>{isSaving ? '⏳' : '💾'}</span>
                </div>
                <div className="action-card-info">
                  <div className="action-card-title-row">
                    <h4>{isSaving ? 'Enregistrement en cours...' : 'Sauvegarder dans MongoDB'}</h4>
                    <span className="action-pill-tag tag-green">Base de Données</span>
                  </div>
                  <p>Publier et synchroniser définitivement toutes les modifications sur MongoDB Atlas.</p>
                </div>
                <div className="action-card-arrow">
                  <IconCheck size={18} />
                </div>
              </button>

              {/* 3. Réinitialiser */}
              <button 
                type="button" 
                className="admin-window-action-card action-card-reset"
                onClick={() => {
                  setIsModalOpen(false);
                  resetToDefault();
                }}
              >
                <div className="action-card-icon icon-reset">
                  <span>🔄</span>
                </div>
                <div className="action-card-info">
                  <div className="action-card-title-row">
                    <h4>Réinitialiser le Contenu</h4>
                    <span className="action-pill-tag tag-muted">Restauration</span>
                  </div>
                  <p>Restaurer l'ensemble des textes, descriptions et configurations d'origine par défaut.</p>
                </div>
                <div className="action-card-arrow">
                  <IconArrowRight size={18} />
                </div>
              </button>

              {/* 4. Déconnexion Admin */}
              <button 
                type="button" 
                className="admin-window-action-card action-card-logout"
                onClick={() => {
                  setIsModalOpen(false);
                  logoutAdmin();
                }}
              >
                <div className="action-card-icon icon-logout">
                  <span>🚪</span>
                </div>
                <div className="action-card-info">
                  <div className="action-card-title-row">
                    <h4>Déconnexion Admin</h4>
                    <span className="action-pill-tag tag-red">Session</span>
                  </div>
                  <p>Quitter la session administrateur et revenir au mode visiteur public.</p>
                </div>
                <div className="action-card-arrow">
                  <IconArrowRight size={18} />
                </div>
              </button>
            </div>

            {/* Bottom Status Note */}
            <div className="admin-modal-bottom-status">
              <span className="status-indicator-dot"></span>
              <span>Session Administrateur Sécurisée • SatProMax VIP</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Live Notification */}
      {saveNotification && (
        <div className="admin-toast-notification animate-slide-down">
          <div className="toast-icon">✨</div>
          <div className="toast-text">{saveNotification}</div>
        </div>
      )}
    </>
  );
};
