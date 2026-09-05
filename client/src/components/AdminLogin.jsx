import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { IconShieldCheck, IconClose, IconZap, IconStar } from './Icons';

export const AdminLogin = ({ onLoginSuccess, onCancel }) => {
  const { loginAdmin } = useContent();
  const [username, setUsername] = useState('admin@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const result = loginAdmin(username, password);
      setLoading(false);
      if (result.success) {
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setErrorMsg(result.error || 'Email ou mot de passe incorrect');
      }
    }, 450);
  };

  const handleFillDemo = () => {
    setUsername('admin@gmail.com');
    setPassword('123456');
    setErrorMsg('');
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-backdrop" onClick={onCancel}></div>

      <div className="admin-login-card animate-scale-up">
        {onCancel && (
          <button 
            type="button" 
            className="btn-modal-close" 
            onClick={onCancel}
            aria-label="Fermer"
          >
            <IconClose size={20} />
          </button>
        )}

        {/* Header */}
        <div className="admin-login-header">
          <div className="admin-logo-circle">
            <span className="crown-icon">👑</span>
            <div className="crown-glow"></div>
          </div>
          <div className="admin-badge-portal">PORTAIL ADMIN /admin/</div>
          <h2 className="admin-login-title">Connexion Administrateur</h2>
          <p className="admin-login-sub">
            Connectez-vous pour activer le mode d'édition en direct et modifier n'importe quel texte, prix ou bouton.
          </p>
        </div>

        {errorMsg && (
          <div className="admin-error-alert animate-fade-in">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label className="form-label">
              <span>Adresse Email / Username</span>
              <span className="required-star">*</span>
            </label>
            <div className="input-icon-wrapper">
              <input 
                type="email"
                required
                className="form-input-control"
                placeholder="admin@gmail.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Mot de passe / Password</span>
              <span className="required-star">*</span>
            </label>
            <div className="input-icon-wrapper password-wrapper">
              <input 
                type={showPass ? "text" : "password"}
                required
                className="form-input-control"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn-toggle-pass"
                onClick={() => setShowPass(!showPass)}
                title={showPass ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPass ? "👁️" : "🔒"}
              </button>
            </div>
          </div>

          {/* Quick Credential Helper Pill */}
          <div className="admin-credentials-hint" onClick={handleFillDemo} title="Cliquez pour remplir automatiquement">
            <div className="hint-header">
              <span className="hint-icon">🔑</span>
              <strong>Identifiants de démonstration :</strong>
            </div>
            <div className="hint-codes">
              <span className="code-pill">admin@gmail.com</span>
              <span className="code-divider">+</span>
              <span className="code-pill">123456</span>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-admin-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner-row">
                <span className="spinner-dot"></span>
                <span>Vérification en cours...</span>
              </span>
            ) : (
              <span className="btn-inner-row">
                <span>⚡ Se connecter & Activer le mode édition</span>
              </span>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <button 
            type="button" 
            className="btn-return-home"
            onClick={onCancel}
          >
            ← Retourner au site en tant que visiteur
          </button>
        </div>
      </div>
    </div>
  );
};
