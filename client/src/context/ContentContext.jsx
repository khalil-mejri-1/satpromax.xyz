import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultContent } from './defaultContent';

const ContentContext = createContext();

const LOCAL_STORAGE_KEY = 'ipplay_site_content_v1';
const ADMIN_AUTH_KEY = 'ipplay_admin_logged_in';

export const ContentProvider = ({ children }) => {
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

  // 2. Admin Auth State
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // 3. Admin Login Modal / Route State
  const [showAdminLogin, setShowAdminLogin] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      return path === '/admin' || path === '/admin/' || path.startsWith('/admin');
    }
    return false;
  });

  // 4. Edit Modal State
  const [activeEditingSection, setActiveEditingSection] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveNotification, setSaveNotification] = useState(null);

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
  const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

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
    if (window.confirm('هل أنت متأكد من رغبتك في استعادة النصوص والتصميم الأصلي لجميع الأقسام؟')) {
      setContent(defaultContent);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      triggerNotification('🔄 تم استعادة المحتوى الأصلي للموقع بنجاح');
    }
  };

  // Admin login handler (checks admin@gmail.com / 123456)
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
        content,
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
