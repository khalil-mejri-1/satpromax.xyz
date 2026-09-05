import React from 'react';
import { useContent } from '../context/ContentContext';
import { IconCheck, IconZap, IconSparkles } from './Icons';

export const AdminBar = () => {
  const { isAdmin, logoutAdmin, saveToServer, resetToDefault, isSaving, saveNotification } = useContent();

  if (!isAdmin) return null;

  return (
    <>
      <div className="admin-top-toolbar">
        <div className="admin-toolbar-container">
          <div className="admin-status-badge">
            <span className="pulsing-gold-dot"></span>
            <span className="admin-badge-text">
              👑 <strong>Mode Admin</strong>
            </span>
          </div>

          <div className="admin-actions-group">
            <button 
              type="button" 
              className="btn-admin-bar btn-save-mongo"
              onClick={saveToServer}
              disabled={isSaving}
              title="Enregistrer et publier les modifications sur MongoDB"
            >
              {isSaving ? '⏳ Enregistrement...' : '💾 Sauvegarder dans MongoDB'}
            </button>

            <button 
              type="button" 
              className="btn-admin-bar btn-reset-default"
              onClick={resetToDefault}
              title="Réinitialiser tous les textes par défaut"
            >
              🔄 Réinitialiser
            </button>

            <button 
              type="button" 
              className="btn-admin-bar btn-logout-admin"
              onClick={logoutAdmin}
              title="Quitter le mode administration"
            >
              🚪 Déconnexion Admin
            </button>
          </div>
        </div>
      </div>

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
