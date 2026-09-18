import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { defaultContent } from './defaultContent';
import { translations } from './translations';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const ContentContext = createContext();

const LOCAL_STORAGE_KEY = 'satpromax_site_content_v3';
const ADMIN_AUTH_KEY = 'satpromax_admin_logged_in';
const LANG_STORAGE_KEY = 'satpromax_site_lang';

function mergeSection(sectionKey, userSection, transSection, defaultSection) {
  if (!userSection) return transSection || defaultSection || {};
  if (!transSection) return userSection;

  const result = { ...userSection };

  for (const key of Object.keys(transSection)) {
    const uVal = userSection[key];
    const tVal = transSection[key];
    const dVal = defaultSection ? defaultSection[key] : undefined;

    // 1. Pricing Plans Array
    if (key === 'plans' && Array.isArray(uVal) && Array.isArray(tVal)) {
      result.plans = uVal.map((p, index) => {
        const transPlan = tVal[index] || {};
        const defPlan = (defaultSection?.plans && defaultSection.plans[index]) || {};
        const mergedPlan = { ...p };

        for (const planProp of Object.keys(transPlan)) {
          const transPropVal = transPlan[planProp];

          if (planProp === 'features' && Array.isArray(transPropVal)) {
            mergedPlan.features = transPropVal;
          } else if (planProp === 'title' || planProp === 'period' || planProp === 'badge' || planProp === 'savings') {
            mergedPlan[planProp] = transPropVal;
          }
        }
        return mergedPlan;
      });
    }
    // 2. Pricing Categories (Translates device tabs and products in each category)
    else if (sectionKey === 'pricing' && key === 'categories' && Array.isArray(uVal)) {
      result.categories = uVal.map((cat, catIdx) => {
        const transCat = (tVal && tVal[catIdx]) || {};
        const connLabel = catIdx === 0 
          ? transSection.connection1 
          : catIdx === 1 
            ? transSection.connection2 
            : transSection.connection3;

        const mergedCat = {
          ...cat,
          name: transCat.name || connLabel || cat.name,
          description: transCat.description || cat.description,
        };

        if (Array.isArray(cat.products) && Array.isArray(transSection.plans)) {
          mergedCat.products = cat.products.map((prod, pIdx) => {
            const transPlan = transSection.plans[pIdx] || {};
            return {
              ...prod,
              title: transPlan.title || prod.title,
              period: transPlan.period || prod.period,
              badge: transPlan.badge || prod.badge,
              savings: transPlan.savings || prod.savings,
              features: Array.isArray(transPlan.features) ? transPlan.features : prod.features,
            };
          });
        }
        return mergedCat;
      });
    }
    // 3. Nested objects (e.g. hero, downloadApps.hero, featuresGrid.card1, etc.)
    else if (tVal && typeof tVal === 'object' && !Array.isArray(tVal)) {
      result[key] = { ...(uVal || {}) };
      for (const subKey of Object.keys(tVal)) {
        const subU = uVal ? uVal[subKey] : undefined;
        const subD = dVal ? dVal[subKey] : undefined;
        const subT = tVal[subKey];
        if (JSON.stringify(subU) === JSON.stringify(subD) || subU === undefined || typeof subT === 'string') {
          result[key][subKey] = subT;
        }
      }
    }
    // 4. Arrays (e.g. faq items, testimonials items, install apps)
    else if (Array.isArray(tVal)) {
      if (sectionKey === 'faq' && (key === 'items' || key === 'defaultItems') && Array.isArray(uVal)) {
        result[key] = uVal.map((item, idx) => {
          const transItem = tVal[idx];
          if (!transItem) return item;
          return {
            ...item,
            q: transItem.q || item.q,
            a: transItem.a || item.a,
          };
        });
      } else if (sectionKey === 'install' && (key === 'apps' || key === 'defaultApps') && Array.isArray(uVal)) {
        result[key] = uVal.map((app, idx) => {
          const transApp = tVal[idx];
          if (!transApp) return app;
          return {
            ...app,
            name: transApp.name || app.name,
            devices: transApp.devices || app.devices,
            steps: Array.isArray(transApp.steps) ? transApp.steps : app.steps,
          };
        });
      } else if (sectionKey === 'devices' && (key === 'categories' || key === 'defaultCategories') && Array.isArray(uVal)) {
        result[key] = uVal.map((dev, idx) => {
          const transDev = tVal[idx];
          if (!transDev) return dev;
          return {
            ...dev,
            title: transDev.title || dev.title,
            brand: transDev.brand || dev.brand,
            setupTime: transDev.setupTime || dev.setupTime,
            description: transDev.description || dev.description,
          };
        });
      } else if (sectionKey === 'testimonials' && (key === 'items' || key === 'defaultItems') && Array.isArray(uVal)) {
        result[key] = uVal.map((testi, idx) => {
          const transTesti = tVal[idx];
          if (!transTesti) return testi;
          return {
            ...testi,
            name: transTesti.name || testi.name,
            location: transTesti.location || testi.location,
            text: transTesti.text || testi.text,
          };
        });
      } else if (sectionKey === 'clientProofs' && (key === 'items' || key === 'defaultItems') && Array.isArray(uVal)) {
        result[key] = uVal.map((proof, idx) => {
          const transProof = tVal[idx];
          if (!transProof) return proof;
          return {
            ...proof,
            caption: transProof.caption || proof.caption,
            messages: Array.isArray(transProof.messages) ? transProof.messages : proof.messages,
          };
        });
      } else {
        if (JSON.stringify(uVal) === JSON.stringify(dVal) || !uVal || uVal.length === 0) {
          result[key] = tVal;
        }
      }
    }
    // 5. Primitive values (strings, numbers, booleans)
    else {
      result[key] = tVal;
    }
  }

  // Always guarantee pricing has 3 complete categories with translated names and products
  if (sectionKey === 'pricing' && Array.isArray(transSection.plans)) {
    const baseCategories = (Array.isArray(result.categories) && result.categories.length === 3)
      ? result.categories
      : (defaultSection?.categories || []);

    result.categories = [0, 1, 2].map((catIdx) => {
      const existingCat = baseCategories[catIdx] || {};
      const connLabel = catIdx === 0 
        ? (transSection.connection1 || '1 Device (VIP)') 
        : catIdx === 1 
          ? (transSection.connection2 || '2 Devices (Family Pack)') 
          : (transSection.connection3 || '3 Devices (Multi-Room)');

      const priceMultiplier = catIdx === 0 ? 1 : catIdx === 1 ? 1.6 : 2.2;
      const baseProducts = (Array.isArray(existingCat.products) && existingCat.products.length === 5)
        ? existingCat.products
        : (defaultSection?.categories && defaultSection.categories[catIdx]?.products) || [];

      const mergedProducts = transSection.plans.map((transPlan, pIdx) => {
        const existingProd = baseProducts[pIdx] || {};
        const defaultProd = (defaultSection?.categories && defaultSection.categories[catIdx]?.products[pIdx]) || {};
        const calcPrice = Number((transPlan.price * priceMultiplier).toFixed(2));

        return {
          ...defaultProd,
          ...existingProd,
          title: transPlan.title || existingProd.title || defaultProd.title,
          period: transPlan.period || existingProd.period || defaultProd.period,
          badge: transPlan.badge || existingProd.badge || defaultProd.badge,
          savings: transPlan.savings || existingProd.savings || defaultProd.savings,
          features: Array.isArray(transPlan.features) ? transPlan.features : (existingProd.features || defaultProd.features),
          price: existingProd.price || defaultProd.price || calcPrice,
        };
      });

      return {
        id: existingCat.id || `cat-${catIdx + 1}`,
        name: connLabel,
        description: connLabel,
        products: mergedProducts,
      };
    });
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
      merged[sectionKey] = mergeSection(
        sectionKey,
        content[sectionKey],
        langTrans[sectionKey],
        defaultContent[sectionKey]
      );
    });
    return merged;
  }, [content, currentLang]);

  // 3. Admin Auth State
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true' || localStorage.getItem('ipplay_admin_logged_in') === 'true';
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

  // Sync with Backend on mount if available
  useEffect(() => {
    const fetchRemoteContent = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.content);
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
  }, []);

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
  const saveToServer = async (customContent = null) => {
    setIsSaving(true);
    const dataToSave = customContent || content;
    try {
      const res = await fetch(API_ENDPOINTS.content, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: dataToSave }),
      });
      if (res.ok) {
        triggerNotification('✅ تم حفظ المنتج والتعديلات مباشرة في قاعدة بيانات MongoDB Atlas!');
        return true;
      } else {
        triggerNotification('💾 تم حفظ التعديلات محلياً بنجاح (سيتم رفعها عند اتصال السيرفر)');
        return false;
      }
    } catch (e) {
      triggerNotification('💾 تم حفظ التعديلات في المتصفح بنجاح!');
      return false;
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
      if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
        window.history.pushState(null, '', '/admin/dashboard');
        window.dispatchEvent(new PopStateEvent('popstate'));
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

  // ----------------------------------------------------
  // Orders Management & Real-Time Sync (Gestion de Commande)
  // ----------------------------------------------------
  const ORDERS_BROADCAST_CHANNEL = 'satpromax_orders_channel';
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const fetchOrders = async (silent = false) => {
    if (!silent) setIsLoadingOrders(true);
    try {
      const res = await fetch(API_ENDPOINTS.vetrine);
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.data)) {
          setOrders(json.data);
        }
      }
    } catch (err) {
      if (!silent) {
        console.warn('Backend server unreachable for orders:', err?.message || err);
      }
    } finally {
      if (!silent) setIsLoadingOrders(false);
    }
  };

  const addOrder = async (orderPayload) => {
    try {
      const res = await fetch(API_ENDPOINTS.vetrine, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        const json = await res.json();
        const saved = json.data;
        if (saved) {
          setOrders((prev) => {
            const exists = prev.some((o) => o._id === saved._id);
            return exists ? prev : [saved, ...prev];
          });

          // Broadcast to any other open tabs
          if (typeof window !== 'undefined' && window.BroadcastChannel) {
            try {
              const bc = new BroadcastChannel(ORDERS_BROADCAST_CHANNEL);
              bc.postMessage({ type: 'NEW_ORDER', data: saved });
              bc.close();
            } catch (e) {}
          }
          window.dispatchEvent(new CustomEvent('satpromax_order_created', { detail: saved }));

          if (isAdmin) {
            triggerNotification(`🔔 Nouvelle commande reçue: ${saved.customerEmail || ''}`);
          }
        }
        return { success: true, data: saved };
      } else {
        const errJson = await res.json().catch(() => ({}));
        return { success: false, error: errJson.error || 'Erreur lors de la création de la commande' };
      }
    } catch (err) {
      console.error('Error adding order:', err);
      return { success: false, error: err.message };
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      const res = await fetch(`${API_ENDPOINTS.vetrine}/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          setOrders((prev) =>
            prev.map((o) => (o._id === orderId ? json.data : o))
          );
          if (typeof window !== 'undefined' && window.BroadcastChannel) {
            try {
              const bc = new BroadcastChannel(ORDERS_BROADCAST_CHANNEL);
              bc.postMessage({ type: 'ORDER_UPDATED', data: json.data });
              bc.close();
            } catch (e) {}
          }
        }
        triggerNotification(`✅ Statut de la commande mis à jour: ${newStatus}`);
        return { success: true };
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      fetchOrders(true);
    }
  };

  const updateOrderDetails = async (orderId, updateData) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.vetrine}/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          setOrders((prev) =>
            prev.map((o) => (o._id === orderId ? json.data : o))
          );
          if (typeof window !== 'undefined' && window.BroadcastChannel) {
            try {
              const bc = new BroadcastChannel(ORDERS_BROADCAST_CHANNEL);
              bc.postMessage({ type: 'ORDER_UPDATED', data: json.data });
              bc.close();
            } catch (e) {}
          }
        }
        triggerNotification('✅ Commande mise à jour avec succès dans MongoDB !');
        return { success: true, data: json?.data };
      }
    } catch (err) {
      console.error('Error updating order details:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      const res = await fetch(`${API_ENDPOINTS.vetrine}/${orderId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        if (typeof window !== 'undefined' && window.BroadcastChannel) {
          try {
            const bc = new BroadcastChannel(ORDERS_BROADCAST_CHANNEL);
            bc.postMessage({ type: 'ORDER_DELETED', orderId });
            bc.close();
          } catch (e) {}
        }
        triggerNotification('🗑️ Commande supprimée avec succès');
        return { success: true };
      }
    } catch (err) {
      console.error('Error deleting order:', err);
      fetchOrders(true);
    }
  };

  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => (o.status || 'pending').toLowerCase() === 'pending').length;
  }, [orders]);

  // Real-time synchronization & Polling
  useEffect(() => {
    fetchOrders(true);

    let bc = null;
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      try {
        bc = new BroadcastChannel(ORDERS_BROADCAST_CHANNEL);
        bc.onmessage = (event) => {
          const { type, data, orderId } = event.data || {};
          if (type === 'NEW_ORDER' && data) {
            setOrders((prev) => {
              const exists = prev.some((o) => o._id === data._id);
              return exists ? prev : [data, ...prev];
            });
            if (isAdmin) {
              triggerNotification(`🔔 Nouvelle commande reçue: ${data.customerEmail || ''}`);
            }
          } else if (type === 'ORDER_UPDATED' && data) {
            setOrders((prev) =>
              prev.map((o) => (o._id === data._id ? data : o))
            );
          } else if (type === 'ORDER_DELETED' && orderId) {
            setOrders((prev) => prev.filter((o) => o._id !== orderId));
          }
        };
      } catch (e) {
        console.error('BroadcastChannel error:', e);
      }
    }

    // Auto-polling every 6 seconds to capture external orders from any device
    const pollInterval = setInterval(() => {
      fetchOrders(true);
    }, 6000);

    const onFocus = () => {
      fetchOrders(true);
    };
    window.addEventListener('focus', onFocus);

    return () => {
      if (bc) bc.close();
      clearInterval(pollInterval);
      window.removeEventListener('focus', onFocus);
    };
  }, [isAdmin]);

  return (
    <ContentContext.Provider
      value={{
        apiBaseUrl: API_BASE_URL,
        apiEndpoints: API_ENDPOINTS,
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
        triggerNotification,
        confirmModal,
        showConfirm,
        showPrompt,
        showAlertModal,
        closeConfirmModal,
        // Orders Real-Time System
        orders,
        isLoadingOrders,
        pendingOrdersCount,
        fetchOrders,
        addOrder,
        updateOrderStatus,
        updateOrderDetails,
        deleteOrder,
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
