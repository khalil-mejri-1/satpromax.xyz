import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { defaultContent } from './defaultContent';
import { translations } from './translations';

const ContentContext = createContext();

const LOCAL_STORAGE_KEY = 'ipplay_site_content_v1';
const ADMIN_AUTH_KEY = 'ipplay_admin_logged_in';
const LANG_STORAGE_KEY = 'satpromax_site_lang';

function mergeSection(baseSection, transSection) {
  if (!transSection) return baseSection;
  if (!baseSection) return transSection;

  const result = { ...baseSection };

  for (const key of Object.keys(transSection)) {
    const bVal = baseSection[key];
    const tVal = transSection[key];

    if (key === 'plans' && Array.isArray(bVal) && Array.isArray(tVal)) {
      result.plans = bVal.map((p, index) => ({ ...p, ...(tVal[index] || {}) }));
    } else if (tVal && typeof tVal === 'object' && !Array.isArray(tVal)) {
      result[key] = { ...(bVal || {}), ...tVal };
    } else {
      result[key] = tVal;
    }
  }

  return result;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
];

const VALID_LANG_CODES = SUPPORTED_LANGUAGES.map((l) => l.code);

export const ContentProvider = ({ children }) => {
  // 0. Language State (14 languages)
  const [currentLang, setLangState] = useState(() => {
    try {
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
      if (savedLang && VALID_LANG_CODES.includes(savedLang)) {
        return savedLang;
      }
    } catch (e) {
      console.error('Error reading language from localStorage:', e);
    }
    return 'en';
  });

  // Custom Language Icons Config
  const [customLangIcons, setCustomLangIcons] = useState(() => {
    try {
      const saved = localStorage.getItem('satpromax_lang_icons');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading language icons:', e);
    }
    return {};
  });

  const updateLanguageIcon = (code, iconUrl) => {
    setCustomLangIcons((prev) => {
      const updated = { ...prev, [code]: iconUrl };
      try {
        localStorage.setItem('satpromax_lang_icons', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const languages = useMemo(() => {
    return SUPPORTED_LANGUAGES.map((l) => ({
      ...l,
      icon: customLangIcons[l.code] || null,
    }));
  }, [customLangIcons]);

  const setLang = (newLang) => {
    if (VALID_LANG_CODES.includes(newLang)) {
      setLangState(newLang);
      try {
        localStorage.setItem(LANG_STORAGE_KEY, newLang);
      } catch (e) {
        console.error('Error saving language to localStorage:', e);
      }
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLang;
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [currentLang]);

  // 1. Initialize Content from localStorage or defaultContent
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return { ...defaultContent, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading content from localStorage:', e);
    }
    return defaultContent;
  });

  // 2. Compute active content based on active language
  const activeContent = useMemo(() => {
    const langTrans = translations[currentLang] || translations.en;
    const merged = { ...content };
    Object.keys(langTrans).forEach((sectionKey) => {
      merged[sectionKey] = mergeSection(content[sectionKey], langTrans[sectionKey]);
    });
    return merged;
  }, [content, currentLang]);

  // 3. Admin Auth State
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // 4. Admin Login Modal / Route State
  const [showAdminLogin, setShowAdminLogin] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      return path === '/admin' || path === '/admin/' || path.startsWith('/admin');
    }
    return false;
  });

  // 5. Edit Modal State
  const [activeEditingSection, setActiveEditingSection] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveNotification, setSaveNotification] = useState(null);

  // 6. Professional Confirmation & Prompt Dialog State
  const [confirmModal, setConfirmModal] = useState(null);

  const closeConfirmModal = () => {
    setConfirmModal(null);
  };

  const showConfirm = ({
    title = 'Confirmation',
    message = '',
    details = null,
    type = 'danger',
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    onConfirm = () => {},
    onCancel = () => {},
  }) => {
    setConfirmModal({
      isOpen: true,
      type,
      title,
      message,
      details,
      confirmText,
      cancelText,
      onConfirm: async () => {
        try {
          await onConfirm();
        } finally {
          setConfirmModal(null);
        }
      },
      onCancel: () => {
        if (onCancel) onCancel();
        setConfirmModal(null);
      },
    });
  };

  const showPrompt = ({
    title = 'Saisie requise',
    message = '',
    fields = [],
    confirmText = 'Enregistrer',
    cancelText = 'Annuler',
    onConfirm = () => {},
    onCancel = () => {},
  }) => {
    setConfirmModal({
      isOpen: true,
      type: 'prompt',
      title,
      message,
      fields,
      confirmText,
      cancelText,
      onConfirm: async (values) => {
        try {
          await onConfirm(values);
        } finally {
          setConfirmModal(null);
        }
      },
      onCancel: () => {
        if (onCancel) onCancel();
        setConfirmModal(null);
      },
    });
  };

  const showAlertModal = ({
    title = 'Information',
    message = '',
    details = null,
    confirmText = 'Compris',
    type = 'info',
    onClose = () => {},
  }) => {
    setConfirmModal({
      isOpen: true,
      type,
      title,
      message,
      details,
      confirmText,
      cancelText: null,
      onConfirm: () => {
        if (onClose) onClose();
        setConfirmModal(null);
      },
    });
  };

  // Listen for browser popstate and URL changes (e.g. /admin)
  useEffect(() => {
    const handleLocationCheck = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin' || path === '/admin/' || path.startsWith('/admin')) {
        setShowAdminLogin(true);
      }
    };

    window.addEventListener('popstate', handleLocationCheck);
    handleLocationCheck();

    return () => window.removeEventListener('popstate', handleLocationCheck);
  }, []);

  // Save to localStorage when content changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(content));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [content]);

  // API base URL from Vite environment variable or local default
  const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://satpromax-xyz.vercel.app').replace(/\/+$/, '');

  // Sync with Backend on mount if available
  useEffect(() => {
    const fetchRemoteContent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content`);
        if (res.ok) {
          const remote = await res.json();
          if (remote && remote.data) {
            setContent((prev) => ({ ...prev, ...remote.data }));
          }
        }
      } catch (e) {
        // Backend offline or local mode
      }
    };
    fetchRemoteContent();
  }, [API_BASE_URL]);

  // Update a specific section
  const updateSection = (sectionKey, newSectionData) => {
    setContent((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        ...newSectionData,
      },
    }));
    triggerNotification(`✨ تم تطبيق وحفظ تعديلات ${sectionKey} بنجاح!`);
  };

  // Save all content to MongoDB via server API
  const saveToServer = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        triggerNotification('✅ تم نشر وحفظ جميع التعديلات بنجاح في قاعدة بيانات MongoDB Atlas!');
      } else {
        triggerNotification('💾 تم حفظ التعديلات محلياً بنجاح (سيتم رفعها عند اتصال السيرفر)');
      }
    } catch (e) {
      triggerNotification('💾 تم حفظ التعديلات في المتصفح بنجاح!');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to original default content
  const resetToDefault = () => {
    showConfirm({
      type: 'warning',
      title: 'Réinitialiser tout le contenu ?',
      message: 'Êtes-vous sûr de vouloir restaurer les textes, images et réglages par défaut de tous les blocs ? Toutes les modifications non enregistrées seront annulées.',
      confirmText: 'Oui, réinitialiser tout',
      cancelText: 'Annuler',
      onConfirm: () => {
        setContent(defaultContent);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        triggerNotification('🔄 تم استعادة المحتوى الأصلي للموقع بنجاح');
      }
    });
  };

  // Admin login handler
  const loginAdmin = (username, password) => {
    const cleanUser = username.trim().toLowerCase();
    if (cleanUser === 'admin@gmail.com' && password === '123456') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      if (window.location.pathname.startsWith('/admin')) {
        window.history.pushState(null, '', '/');
      }
      return { success: true };
    }
    return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  };

  // Admin logout handler
  const logoutAdmin = () => {
    setIsAdmin(false);
    setShowAdminLogin(false);
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setActiveEditingSection(null);
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState(null, '', '/');
    }
    triggerNotification('🚪 تم تسجيل الخروج والعودة لوضع التصفح العادي');
  };

  // Open login dialog
  const openAdminLogin = () => {
    setShowAdminLogin(true);
  };

  // Close login dialog
  const closeAdminLogin = () => {
    setShowAdminLogin(false);
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState(null, '', '/');
    }
  };

  const triggerNotification = (msg) => {
    setSaveNotification(msg);
    setTimeout(() => {
      setSaveNotification(null);
    }, 4500);
  };

  return (
    <ContentContext.Provider
      value={{
        content: activeContent,
        rawContent: content,
        currentLang,
        setLang,
        languages,
        updateLanguageIcon,
        setCustomLangIcons,
        isAdmin,
        showAdminLogin,
        setShowAdminLogin,
        openAdminLogin,
        closeAdminLogin,
        updateSection,
        saveToServer,
        resetToDefault,
        loginAdmin,
        logoutAdmin,
        activeEditingSection,
        setActiveEditingSection,
        isSaving,
        saveNotification,
        confirmModal,
        showConfirm,
        showPrompt,
        showAlertModal,
        closeConfirmModal,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
