import React, { useState, useEffect, useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import { API_ENDPOINTS } from '../config/api';
import { SiteSettingsView } from './SiteSettingsView';
import { PagesListView } from './PagesListView';
import { 
  IconCheck, 
  IconZap, 
  IconPlus, 
  IconTrash, 
  IconClose, 
  IconStar, 
  IconSparkles, 
  IconArrowRight,
  IconSearch,
  IconRefreshCw,
  IconCopy,
  IconEdit,
  IconWhatsApp
} from './Icons';

export const AdminDashboard = ({ onNavigateHome }) => {
  const { 
    content, 
    updateSection, 
    saveToServer, 
    isSaving, 
    saveNotification, 
    triggerNotification,
    logoutAdmin,
    showConfirm,
    orders,
    isLoadingOrders,
    pendingOrdersCount,
    fetchOrders,
    addOrder,
    updateOrderStatus,
    updateOrderDetails,
    deleteOrder,
  } = useContent();

  const pricingData = content?.pricing || {};
  const categories = pricingData.categories || [];

  // Active Category State
  const [selectedCatId, setSelectedCatId] = useState(() => {
    return categories.length > 0 ? categories[0].id : 'cat-1';
  });

  // Modals state
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [productFormData, setProductFormData] = useState({
    id: '',
    title: '',
    price: '',
    period: '/ 12 Ay',
    badge: '',
    savings: '',
    popular: false,
    features: [],
    categoryId: '',
    seoDescription: '',
    seoKeywords: '',
    seoTitle: '',
  });

  const [editingCategory, setEditingCategory] = useState(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    id: '',
    name: '',
    description: '',
  });

  const [newFeatureText, setNewFeatureText] = useState('');

  // ----------------------------------------------------
  // Orders Management State (gestion de commande)
  // ----------------------------------------------------
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'settings' | 'pages'
  const [contenuExpanded, setContenuExpanded] = useState(true);
  const [ordersSearch, setOrdersSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingOrder, setEditingOrder] = useState(null);
  const [isNewOrderModal, setIsNewOrderModal] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    plan: '12 Months Plan',
    price: '$59.99',
    customerEmail: '',
    customerWhatsapp: '',
    deviceType: 'FireStick',
    paymentMethod: 'card',
    status: 'pending',
    notes: '',
  });

  // Refresh orders when tab is opened
  useEffect(() => {
    if (activeTab === 'orders' && fetchOrders) {
      fetchOrders();
    }
  }, [activeTab]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (updateOrderStatus) {
      await updateOrderStatus(orderId, newStatus);
    }
  };

  const handleSaveOrderEdit = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;
    if (updateOrderDetails) {
      await updateOrderDetails(editingOrder._id, {
        status: editingOrder.status,
        notes: editingOrder.notes,
        plan: editingOrder.plan,
        price: editingOrder.price,
        customerEmail: editingOrder.customerEmail,
        customerWhatsapp: editingOrder.customerWhatsapp,
        deviceType: editingOrder.deviceType,
        paymentMethod: editingOrder.paymentMethod,
      });
    }
    setEditingOrder(null);
  };

  const handleDeleteOrder = (orderId, clientEmail) => {
    showConfirm({
      type: 'danger',
      title: 'Supprimer cette commande ?',
      message: `Êtes-vous sûr de vouloir supprimer définitivement la commande de "${clientEmail}" ?`,
      confirmText: 'Oui, supprimer',
      cancelText: 'Annuler',
      onConfirm: async () => {
        if (deleteOrder) {
          await deleteOrder(orderId);
        }
      },
    });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newOrderData.customerEmail.trim()) return;
    if (addOrder) {
      const res = await addOrder(newOrderData);
      if (res && res.success) {
        setIsNewOrderModal(false);
        setNewOrderData({
          plan: '12 Months Plan',
          price: '$59.99',
          customerEmail: '',
          customerWhatsapp: '',
          deviceType: 'FireStick',
          paymentMethod: 'card',
          status: 'pending',
          notes: '',
        });
      }
    }
  };

  const confirmedOrdersCount = useMemo(() => {
    return orders.filter((o) => ['confirmed', 'active', 'completed'].includes((o.status || '').toLowerCase())).length;
  }, [orders]);

  const totalEstimatedRevenue = useMemo(() => {
    let total = 0;
    orders.forEach((o) => {
      const num = parseFloat((o.price || '').replace(/[^0-9.]/g, ''));
      if (!isNaN(num)) total += num;
    });
    return total.toFixed(2);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !ordersSearch ||
        (o.customerEmail || '').toLowerCase().includes(ordersSearch.toLowerCase()) ||
        (o.customerWhatsapp || '').toLowerCase().includes(ordersSearch.toLowerCase()) ||
        (o.plan || '').toLowerCase().includes(ordersSearch.toLowerCase()) ||
        (o.deviceType || '').toLowerCase().includes(ordersSearch.toLowerCase()) ||
        (o.notes || '').toLowerCase().includes(ordersSearch.toLowerCase());

      const matchStatus =
        statusFilter === 'all' ||
        (o.status || 'pending').toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [orders, ordersSearch, statusFilter]);

  // Active category object
  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0] || null;
  const activeProducts = activeCategory?.products || [];

  // ----------------------------------------------------
  // Category Management Handlers
  // ----------------------------------------------------
  const handleOpenAddCategory = () => {
    setIsNewCategory(true);
    setCategoryFormData({
      id: `cat-${Date.now()}`,
      name: '',
      description: '',
    });
    setEditingCategory(true);
  };

  const handleOpenEditCategory = (cat, e) => {
    if (e) e.stopPropagation();
    setIsNewCategory(false);
    setCategoryFormData({
      id: cat.id,
      name: cat.name || '',
      description: cat.description || '',
    });
    setEditingCategory(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) return;

    let updatedCategories;
    if (isNewCategory) {
      const newCat = {
        id: categoryFormData.id || `cat-${Date.now()}`,
        name: categoryFormData.name.trim(),
        description: categoryFormData.description.trim() || 'Pack de connexion',
        products: [],
      };
      updatedCategories = [...categories, newCat];
      setSelectedCatId(newCat.id);
    } else {
      updatedCategories = categories.map((cat) => {
        if (cat.id === categoryFormData.id) {
          return {
            ...cat,
            name: categoryFormData.name.trim(),
            description: categoryFormData.description.trim(),
          };
        }
        return cat;
      });
    }

    const newContent = {
      ...content,
      pricing: {
        ...(content?.pricing || {}),
        categories: updatedCategories,
      },
    };

    updateSection('pricing', { categories: updatedCategories });
    setEditingCategory(false);
    await saveToServer(newContent);
  };

  const handleDeleteCategory = (catId, catName, e) => {
    if (e) e.stopPropagation();
    if (categories.length <= 1) {
      alert('Vous devez conserver au moins une catégorie de produits.');
      return;
    }

    showConfirm({
      type: 'danger',
      title: 'Supprimer la catégorie ?',
      message: `Êtes-vous sûr de vouloir supprimer définitivement la catégorie "${catName}" ainsi que tous les produits associés ?`,
      confirmText: 'Oui, supprimer la catégorie',
      cancelText: 'Annuler',
      onConfirm: async () => {
        const updated = categories.filter((c) => c.id !== catId);
        const newContent = {
          ...content,
          pricing: {
            ...(content?.pricing || {}),
            categories: updated,
          },
        };
        updateSection('pricing', { categories: updated });
        if (selectedCatId === catId && updated.length > 0) {
          setSelectedCatId(updated[0].id);
        }
        await saveToServer(newContent);
      },
    });
  };

  // ----------------------------------------------------
  // Product Management Handlers
  // ----------------------------------------------------
  const handleOpenAddProduct = () => {
    if (!activeCategory) return;
    setIsNewProduct(true);
    setProductFormData({
      id: `prod-${Date.now()}`,
      title: '',
      price: '49.99',
      period: '/ 12 Ay',
      badge: '🔥 %62 İNDİRİM',
      savings: 'Sadece $4.99/ay',
      popular: false,
      features: [
        '19.000+ Canlı TV Kanalı',
        '56.000+ VOD Film ve Dizi',
        '4K / Ultra HD ve FHD Kalite',
        'AntiFreeze™ 9.0 Teknolojisi',
        'Elektronik Program Rehberi (EPG)',
        '7/24 Özel Müşteri Desteği',
        'Anında Otomatik Aktivasyon',
      ],
      categoryId: activeCategory.id,
      seoDescription: '',
      seoKeywords: '',
      seoTitle: '',
    });
    setEditingProduct(true);
  };

  const handleOpenEditProduct = (prod) => {
    setIsNewProduct(false);
    setProductFormData({
      id: prod.id,
      title: prod.title || '',
      price: prod.price !== undefined ? String(prod.price) : '',
      period: prod.period || '',
      badge: prod.badge || '',
      savings: prod.savings || '',
      popular: Boolean(prod.popular),
      features: Array.isArray(prod.features) ? [...prod.features] : [],
      categoryId: activeCategory?.id || '',
      seoDescription: prod.seoDescription || prod.description || '',
      seoKeywords: prod.seoKeywords || '',
      seoTitle: prod.seoTitle || '',
    });
    setEditingProduct(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productFormData.title.trim()) return;

    const parsedPrice = parseFloat(productFormData.price) || 0;
    const cleanProduct = {
      id: productFormData.id || `prod-${Date.now()}`,
      title: productFormData.title.trim(),
      price: parsedPrice,
      period: productFormData.period.trim() || '/ Mois',
      badge: productFormData.badge.trim(),
      badgeClass: productFormData.popular ? 'badge-most-popular' : 'badge-discount-subtle',
      savings: productFormData.savings.trim(),
      popular: Boolean(productFormData.popular),
      features: productFormData.features.filter((f) => f && f.trim().length > 0),
      seoDescription: (productFormData.seoDescription || '').trim(),
      seoKeywords: (productFormData.seoKeywords || '').trim(),
      seoTitle: (productFormData.seoTitle || '').trim(),
    };

    const targetCatId = productFormData.categoryId || selectedCatId;

    const updatedCategories = categories.map((cat) => {
      if (cat.id === targetCatId) {
        let updatedProds;
        const exists = cat.products?.some((p) => p.id === cleanProduct.id);
        if (exists) {
          updatedProds = (cat.products || []).map((p) => (p.id === cleanProduct.id ? cleanProduct : p));
        } else {
          updatedProds = [...(cat.products || []), cleanProduct];
        }

        return {
          ...cat,
          products: updatedProds,
        };
      } else {
        return {
          ...cat,
          products: (cat.products || []).filter((p) => p.id !== cleanProduct.id),
        };
      }
    });

    const newContent = {
      ...content,
      pricing: {
        ...(content?.pricing || {}),
        categories: updatedCategories,
      },
    };

    updateSection('pricing', { categories: updatedCategories });
    setEditingProduct(false);

    // Save directly to MongoDB Atlas immediately without needing to click 💾 Sauvegarder
    await saveToServer(newContent);
  };

  const handleDeleteProduct = (prodId, prodTitle) => {
    showConfirm({
      type: 'danger',
      title: 'Supprimer ce produit ?',
      message: `Êtes-vous sûr de vouloir supprimer définitivement le produit "${prodTitle}" ?`,
      confirmText: 'Oui, supprimer',
      cancelText: 'Annuler',
      onConfirm: async () => {
        const updatedCategories = categories.map((cat) => {
          if (cat.id === activeCategory.id) {
            return {
              ...cat,
              products: (cat.products || []).filter((p) => p.id !== prodId),
            };
          }
          return cat;
        });

        const newContent = {
          ...content,
          pricing: {
            ...(content?.pricing || {}),
            categories: updatedCategories,
          },
        };

        updateSection('pricing', { categories: updatedCategories });
        await saveToServer(newContent);
      },
    });
  };

  const handleTogglePopular = async (prodId) => {
    if (!activeCategory) return;
    const updatedCategories = categories.map((cat) => {
      if (cat.id === activeCategory.id) {
        return {
          ...cat,
          products: (cat.products || []).map((p) => {
            if (p.id === prodId) {
              const newPop = !p.popular;
              return {
                ...p,
                popular: newPop,
                badgeClass: newPop ? 'badge-most-popular' : 'badge-discount-subtle',
              };
            }
            return p;
          }),
        };
      }
      return cat;
    });

    const newContent = {
      ...content,
      pricing: {
        ...(content?.pricing || {}),
        categories: updatedCategories,
      },
    };

    updateSection('pricing', { categories: updatedCategories });
    await saveToServer(newContent);
  };

  const handleDuplicateProduct = async (prod) => {
    if (!activeCategory) return;
    const duplicated = {
      ...prod,
      id: `prod-${Date.now()}`,
      title: `${prod.title} (Copie)`,
      popular: false,
    };
    const updatedCategories = categories.map((cat) => {
      if (cat.id === activeCategory.id) {
        return {
          ...cat,
          products: [...(cat.products || []), duplicated],
        };
      }
      return cat;
    });

    const newContent = {
      ...content,
      pricing: {
        ...(content?.pricing || {}),
        categories: updatedCategories,
      },
    };

    updateSection('pricing', { categories: updatedCategories });
    await saveToServer(newContent);
  };

  const handleMoveProduct = async (index, direction) => {
    if (!activeCategory) return;
    const prods = [...activeProducts];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= prods.length) return;

    const temp = prods[index];
    prods[index] = prods[targetIndex];
    prods[targetIndex] = temp;

    const updatedCategories = categories.map((cat) => {
      if (cat.id === activeCategory.id) {
        return { ...cat, products: prods };
      }
      return cat;
    });

    const newContent = {
      ...content,
      pricing: {
        ...(content?.pricing || {}),
        categories: updatedCategories,
      },
    };

    updateSection('pricing', { categories: updatedCategories });
    await saveToServer(newContent);
  };

  // Add feature bullet point
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setProductFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeatureText.trim()],
    }));
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx) => {
    setProductFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="admin-dashboard-layout">
      {/* 1. LEFT SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand-box">
          <div className="sidebar-logo">
            <span className="logo-badge-crown">👑</span>
            <div className="brand-text">
              <h3>SatProMax</h3>
              <span className="sub-badge">PANEL ADMIN</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-section-label">GESTION COMMERCIALE</div>
          <button 
            type="button" 
            className={`sidebar-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <span className="nav-icon">📦</span>
            <span className="nav-label">Gestion de Produit</span>
          </button>

          <button 
            type="button" 
            className={`sidebar-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('orders');
              if (fetchOrders) fetchOrders();
            }}
          >
            <span className="nav-icon">🛒</span>
            <span className="nav-label">Gestion de Commande</span>
            {pendingOrdersCount > 0 && (
              <span className="sidebar-badge-count">{pendingOrdersCount}</span>
            )}
          </button>

          <button 
            type="button" 
            className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Paramètres de Site</span>
          </button>

          {/* SECTION CONTENU (Matching Image 1) */}
          <div className="sidebar-nav-section-label">CONTENU</div>
          <div className="sidebar-nav-group-box">
            <button 
              type="button" 
              className={`sidebar-nav-item sidebar-parent-item ${activeTab === 'pages' ? 'active' : ''}`}
              onClick={() => {
                setContenuExpanded(!contenuExpanded);
                setActiveTab('pages');
              }}
            >
              <span className="nav-icon">📄</span>
              <span className="nav-label">Pages & Blocs</span>
              <span className={`nav-chevron-arrow ${contenuExpanded ? 'open' : ''}`}>▾</span>
            </button>

            {contenuExpanded && (
              <div className="sidebar-sub-items-container animate-fade-in">
                <button 
                  type="button" 
                  className={`sidebar-sub-item ${activeTab === 'pages' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pages')}
                >
                  <span className="sub-bullet-dot">•</span>
                  <span className="sub-item-text">Liste des pages</span>
                </button>
              </div>
            )}
          </div>

          <div className="sidebar-nav-section-label">NAVIGATION SITE</div>
          <button 
            type="button" 
            className="sidebar-nav-item"
            onClick={onNavigateHome}
          >
            <span className="nav-icon">🌐</span>
            <span className="nav-label">Voir le Site Public</span>
          </button>
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="sidebar-footer">
          <button 
            type="button" 
            className="btn-sidebar-save"
            onClick={saveToServer}
            disabled={isSaving}
          >
            <span className="save-icon">{isSaving ? '⏳' : '💾'}</span>
            <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder MongoDB'}</span>
          </button>

          <button 
            type="button" 
            className="btn-sidebar-logout"
            onClick={logoutAdmin}
          >
            <span>🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="admin-dashboard-main">
        {activeTab === 'products' ? (
          <>
            {/* Top Header Bar */}
            <header className="admin-main-header">
              <div className="header-info">
                <h1 className="header-title">📦 Gestion de Produit & Catégories</h1>
                <p className="header-subtitle">
                  Contrôlez vos catégories en haut et personnalisez les produits rattachés ci-dessous. Les modifications s'affichent directement sur le site.
                </p>
              </div>

              <div className="header-actions">
                <button 
                  type="button" 
                  className="btn-dashboard-action btn-add-cat"
                  onClick={handleOpenAddCategory}
                >
                  <IconPlus size={16} />
                  <span>Nouvelle Catégorie</span>
                </button>

                <button 
                  type="button" 
                  className="btn-dashboard-action btn-add-prod"
                  onClick={handleOpenAddProduct}
                  disabled={!activeCategory}
                >
                  <IconPlus size={16} />
                  <span>Nouveau Produit</span>
                </button>

                <button 
                  type="button" 
                  className="btn-dashboard-action btn-save-all"
                  onClick={saveToServer}
                  disabled={isSaving}
                >
                  <span>{isSaving ? '⏳ En cours...' : '💾 Sauvegarder'}</span>
                </button>
              </div>
            </header>

            {/* ----------------------------------------------------
                3. CATEGORIES DISPLAYED AT THE TOP (اضهر الفئة فالفوق)
               ---------------------------------------------------- */}
            <section className="admin-categories-top-section">
              <div className="section-title-row">
                <div className="title-with-badge">
                  <h3>🏷️ Catégories de Produits</h3>
                  <span className="categories-count-badge">{categories.length} Catégories</span>
                </div>
                <span className="categories-hint-text">Sélectionnez une catégorie pour afficher et gérer ses produits :</span>
              </div>

              <div className="categories-pills-bar">
                {categories.map((cat) => {
                  const isSelected = cat.id === selectedCatId;
                  const prodCount = cat.products?.length || 0;
                  return (
                    <div 
                      key={cat.id} 
                      className={`category-pill-card ${isSelected ? 'active-pill' : ''}`}
                      onClick={() => setSelectedCatId(cat.id)}
                    >
                      <div className="pill-content">
                        <span className="pill-name">{cat.name}</span>
                        <span className="pill-count">{prodCount} {prodCount === 1 ? 'Produit' : 'Produits'}</span>
                      </div>

                      <div className="pill-quick-actions">
                        <button
                          type="button"
                          className="btn-pill-edit"
                          onClick={(e) => handleOpenEditCategory(cat, e)}
                          title="Modifier le nom de cette catégorie"
                        >
                          ✏️
                        </button>
                        {categories.length > 1 && (
                          <button
                            type="button"
                            className="btn-pill-delete"
                            onClick={(e) => handleDeleteCategory(cat.id, cat.name, e)}
                            title="Supprimer cette catégorie"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  className="btn-add-category-pill"
                  onClick={handleOpenAddCategory}
                >
                  <IconPlus size={16} />
                  <span>Ajouter une Catégorie</span>
                </button>
              </div>
            </section>

            {/* ----------------------------------------------------
                4. PRODUCTS DISPLAYED BELOW (واضهر المنتجات تحت)
               ---------------------------------------------------- */}
            <section className="admin-products-bottom-section">
              <div className="products-section-header">
                <div className="products-header-left">
                  <h2>
                    Produits dans <span className="highlight-cat-name">"{activeCategory?.name || 'Catégorie'}"</span>
                  </h2>
                  <p className="cat-desc-muted">{activeCategory?.description || 'Gestion des forfaits et offres'}</p>
                </div>

                <button 
                  type="button" 
                  className="btn-add-product-large"
                  onClick={handleOpenAddProduct}
                >
                  <IconPlus size={18} />
                  <span>Ajouter un Produit à cette Catégorie</span>
                </button>
              </div>

              {activeProducts.length === 0 ? (
                <div className="admin-empty-products-box">
                  <div className="empty-icon">📦</div>
                  <h3>Aucun produit dans cette catégorie</h3>
                  <p>Commencez par ajouter votre premier produit ou forfait pour cette catégorie.</p>
                  <button 
                    type="button" 
                    className="btn-dashboard-action btn-add-prod"
                    onClick={handleOpenAddProduct}
                  >
                    <IconPlus size={16} />
                    <span>Créer le Premier Produit</span>
                  </button>
                </div>
              ) : (
                <div className="admin-products-grid">
                  {activeProducts.map((prod, idx) => {
                    return (
                      <div 
                        key={prod.id || idx} 
                        className={`admin-product-card ${prod.popular ? 'card-is-popular' : ''}`}
                      >
                        {/* Top Badge */}
                        {prod.badge && (
                          <div className="admin-card-badge">
                            <span>{prod.badge}</span>
                          </div>
                        )}

                        {/* Star Popular Indicator */}
                        {prod.popular && (
                          <div className="badge-popular-star" title="Produit vedette mis en avant">
                            <IconStar size={14} filled={true} />
                            <span>POPULAIRE</span>
                          </div>
                        )}

                        {/* Header: Title & Period */}
                        <div className="product-card-top-info">
                          <h3 className="product-title">{prod.title}</h3>
                          <div className="product-price-row">
                            <span className="currency-mark">$</span>
                            <span className="price-val">{prod.price}</span>
                            <span className="period-val">{prod.period}</span>
                          </div>
                          {prod.savings && (
                            <div className="product-savings-chip">
                              {prod.savings}
                            </div>
                          )}
                          {prod.seoDescription && (
                            <div className="product-seo-chip" title="Détails SEO & Référencement configurés (Invisibles aux visiteurs)">
                              🔍 SEO Configuré
                            </div>
                          )}
                        </div>

                        {/* Features List */}
                        <div className="product-features-preview">
                          <span className="features-preview-title">Fonctionnalités ({prod.features?.length || 0}) :</span>
                          <ul className="features-bullet-list">
                            {(prod.features || []).slice(0, 5).map((feat, fIdx) => (
                              <li key={fIdx}>
                                <IconCheck size={14} className="feat-check" />
                                <span>{feat}</span>
                              </li>
                            ))}
                            {(prod.features || []).length > 5 && (
                              <li className="more-features-indicator">
                                + {(prod.features || []).length - 5} autres fonctionnalités
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="admin-card-actions-bar">
                          <div className="reorder-btns-group">
                            <button
                              type="button"
                              className="btn-order-arrow"
                              disabled={idx === 0}
                              onClick={() => handleMoveProduct(idx, -1)}
                              title="Déplacer vers la gauche"
                            >
                              ◀
                            </button>
                            <button
                              type="button"
                              className="btn-order-arrow"
                              disabled={idx === activeProducts.length - 1}
                              onClick={() => handleMoveProduct(idx, 1)}
                              title="Déplacer vers la droite"
                            >
                              ▶
                            </button>
                          </div>

                          <div className="main-item-actions">
                            <button
                              type="button"
                              className={`btn-action-star ${prod.popular ? 'active' : ''}`}
                              onClick={() => handleTogglePopular(prod.id)}
                              title={prod.popular ? 'Retirer la mise en avant' : 'Définir comme produit populaire vedette'}
                            >
                              ⭐
                            </button>
                            <button
                              type="button"
                              className="btn-action-duplicate"
                              onClick={() => handleDuplicateProduct(prod)}
                              title="Dupliquer ce produit"
                            >
                              📋
                            </button>
                            <button
                              type="button"
                              className="btn-action-edit"
                              onClick={() => handleOpenEditProduct(prod)}
                              title="Modifier le produit"
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              type="button"
                              className="btn-action-delete"
                              onClick={() => handleDeleteProduct(prod.id, prod.title)}
                              title="Supprimer ce produit"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        ) : activeTab === 'orders' ? (
          /* ====================================================
             ORDERS MANAGEMENT VIEW (GESTION DE COMMANDE)
             ==================================================== */
          <div className="orders-management-view animate-fade-in">
            {/* Orders Header */}
            <header className="admin-main-header">
              <div className="header-info">
                <h1 className="header-title">🛒 Gestion des Commandes & Abonnements</h1>
                <p className="header-subtitle">
                  Visualisez en direct les souscriptions reçues depuis la vitrine, mettez à jour leur statut et contactez immédiatement vos clients par WhatsApp.
                </p>
              </div>

              <div className="header-actions">
                <button 
                  type="button" 
                  className="btn-dashboard-action btn-refresh-orders"
                  onClick={fetchOrders}
                  disabled={isLoadingOrders}
                  title="Actualiser la liste depuis MongoDB Atlas"
                >
                  <IconRefreshCw size={16} className={isLoadingOrders ? 'animate-spin' : ''} />
                  <span>{isLoadingOrders ? 'Chargement...' : 'Actualiser'}</span>
                </button>

                <button 
                  type="button" 
                  className="btn-dashboard-action btn-add-prod"
                  onClick={() => setIsNewOrderModal(true)}
                >
                  <IconPlus size={16} />
                  <span>Nouvelle Commande</span>
                </button>
              </div>
            </header>

            {/* KPI Stat Cards */}
            <div className="orders-kpi-grid">
              <div className="orders-kpi-card kpi-total">
                <div className="kpi-icon-box">📦</div>
                <div className="kpi-info">
                  <span className="kpi-label">Total Commandes</span>
                  <h3 className="kpi-value">{orders.length}</h3>
                </div>
              </div>

              <div className="orders-kpi-card kpi-pending">
                <div className="kpi-icon-box">⏳</div>
                <div className="kpi-info">
                  <span className="kpi-label">En Attente</span>
                  <h3 className="kpi-value">{pendingOrdersCount}</h3>
                </div>
                {pendingOrdersCount > 0 && (
                  <span className="kpi-tag-alert">À traiter</span>
                )}
              </div>

              <div className="orders-kpi-card kpi-confirmed">
                <div className="kpi-icon-box">✅</div>
                <div className="kpi-info">
                  <span className="kpi-label">Confirmées & Activées</span>
                  <h3 className="kpi-value">{confirmedOrdersCount}</h3>
                </div>
              </div>

              <div className="orders-kpi-card kpi-revenue">
                <div className="kpi-icon-box">💎</div>
                <div className="kpi-info">
                  <span className="kpi-label">Volume Estimé</span>
                  <h3 className="kpi-value">${totalEstimatedRevenue}</h3>
                </div>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="orders-controls-bar">
              <div className="orders-search-wrapper">
                <IconSearch size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Rechercher par email, WhatsApp, forfait, appareil..."
                  value={ordersSearch}
                  onChange={(e) => setOrdersSearch(e.target.value)}
                  className="orders-search-input"
                />
                {ordersSearch && (
                  <button 
                    type="button" 
                    className="search-clear-btn" 
                    onClick={() => setOrdersSearch('')}
                    title="Effacer la recherche"
                  >
                    <IconClose size={16} />
                  </button>
                )}
              </div>

              <div className="orders-status-filters">
                {[
                  { id: 'all', label: 'Toutes', count: orders.length },
                  { id: 'pending', label: '⏳ En attente', count: pendingOrdersCount },
                  { id: 'confirmed', label: '🟢 Confirmées', count: orders.filter(o => o.status === 'confirmed').length },
                  { id: 'active', label: '⚡ Activées', count: orders.filter(o => o.status === 'active' || o.status === 'completed').length },
                  { id: 'cancelled', label: '🔴 Annulées', count: orders.filter(o => o.status === 'cancelled').length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`order-filter-pill ${statusFilter === tab.id ? 'active' : ''}`}
                    onClick={() => setStatusFilter(tab.id)}
                  >
                    <span>{tab.label}</span>
                    <span className="filter-count">({tab.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table Container */}
            <div className="orders-table-wrapper">
              {isLoadingOrders && orders.length === 0 ? (
                <div className="orders-loading-state">
                  <div className="loading-spinner"></div>
                  <p>Chargement des commandes depuis MongoDB Atlas...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="orders-empty-state">
                  <span className="empty-icon">📭</span>
                  <h3>Aucune commande trouvée</h3>
                  <p>
                    {ordersSearch || statusFilter !== 'all' 
                      ? 'Aucune commande ne correspond aux filtres actuels.' 
                      : 'Aucune commande enregistrée pour le moment. Les souscriptions passées sur la vitrine apparaîtront ici en temps réel.'}
                  </p>
                  {(ordersSearch || statusFilter !== 'all') && (
                    <button 
                      type="button" 
                      className="btn-clear-filters"
                      onClick={() => { setOrdersSearch(''); setStatusFilter('all'); }}
                    >
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>
              ) : (
                <div className="orders-table-scroll">
                  <table className="orders-custom-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Offre / Appareil</th>
                        <th>Paiement</th>
                        <th>Statut</th>
                        <th className="th-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((ord) => {
                        const dateStr = ord.createdAt 
                          ? new Date(ord.createdAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '—';
                        
                        const cleanWhatsapp = (ord.customerWhatsapp || '').replace(/[^0-9+]/g, '');
                        const whatsappLink = cleanWhatsapp 
                          ? `https://wa.me/${cleanWhatsapp.replace('+', '')}?text=${encodeURIComponent(
                              `Bonjour ${ord.customerEmail || ''}, suite à votre commande SatProMax (${ord.plan || ''})...`
                            )}`
                          : null;

                        return (
                          <tr key={ord._id} className={`order-row-status-${ord.status || 'pending'}`}>
                            {/* Date */}
                            <td className="td-date">
                              <span className="order-date">{dateStr}</span>
                            </td>

                            {/* Client */}
                            <td className="td-client">
                              <div className="client-contact-cell">
                                <div className="client-email-line">
                                  <span className="client-email">{ord.customerEmail || '—'}</span>
                                  {ord.customerEmail && (
                                    <button
                                      type="button"
                                      className="btn-inline-copy"
                                      onClick={() => {
                                        navigator.clipboard.writeText(ord.customerEmail);
                                        if (triggerNotification) triggerNotification('📋 Email copié !');
                                      }}
                                      title="Copier l'email"
                                    >
                                      <IconCopy size={13} />
                                    </button>
                                  )}
                                </div>
                                {ord.customerWhatsapp && (
                                  <div className="client-whatsapp-line">
                                    <span className="wa-icon">📱</span>
                                    <span className="client-whatsapp">{ord.customerWhatsapp}</span>
                                    <button
                                      type="button"
                                      className="btn-inline-copy"
                                      onClick={() => {
                                        navigator.clipboard.writeText(ord.customerWhatsapp);
                                        if (triggerNotification) triggerNotification('📋 WhatsApp copié !');
                                      }}
                                      title="Copier le numéro WhatsApp"
                                    >
                                      <IconCopy size={13} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Offre / Appareil */}
                            <td className="td-plan">
                              <div className="plan-badge-cell">
                                <span className="plan-title">{ord.plan || 'Abonnement IPTV'}</span>
                                <div className="plan-details-line">
                                  <span className="plan-price-tag">{ord.price || '$0.00'}</span>
                                  {ord.deviceType && (
                                    <span className="device-chip">📺 {ord.deviceType}</span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Paiement */}
                            <td className="td-payment">
                              <span className="payment-method-badge">
                                {ord.paymentMethod === 'card' ? '💳 Carte Bancaire' :
                                 ord.paymentMethod === 'crypto' ? '🪙 Crypto' :
                                 ord.paymentMethod === 'paypal' ? '🅿️ PayPal' :
                                 ord.paymentMethod || 'Carte'}
                              </span>
                            </td>

                            {/* Statut Dropdown */}
                            <td className="td-status">
                              <select
                                value={ord.status || 'pending'}
                                onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                                className={`status-select-badge status-${ord.status || 'pending'}`}
                              >
                                <option value="pending">⏳ En attente</option>
                                <option value="confirmed">🟢 Confirmé</option>
                                <option value="active">⚡ Activé</option>
                                <option value="completed">✅ Complété</option>
                                <option value="cancelled">🔴 Annulé</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="td-actions">
                              <div className="order-actions-cell">
                                {whatsappLink && (
                                  <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-action-whatsapp"
                                    title="Contacter le client sur WhatsApp"
                                  >
                                    <IconWhatsApp size={15} />
                                  </a>
                                )}
                                <button
                                  type="button"
                                  className="btn-action-edit"
                                  onClick={() => setEditingOrder({ ...ord })}
                                  title="Modifier les détails de la commande"
                                >
                                  <IconEdit size={15} />
                                </button>
                                <button
                                  type="button"
                                  className="btn-action-delete"
                                  onClick={() => handleDeleteOrder(ord._id, ord.customerEmail || 'Client')}
                                  title="Supprimer cette commande"
                                >
                                  <IconTrash size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          /* ====================================================
             SITE SETTINGS VIEW (PARAMÈTRES DE SITE & WHATSAPP)
             ==================================================== */
          <SiteSettingsView 
            content={content} 
            updateSection={updateSection} 
            saveToServer={saveToServer} 
            isSaving={isSaving} 
            triggerNotification={triggerNotification} 
          />
        ) : (
          /* ====================================================
             PAGES & BLOCS VIEW (LISTE DES PAGES)
             ==================================================== */
          <PagesListView
            content={content}
            updateSection={updateSection}
            saveToServer={saveToServer}
            triggerNotification={triggerNotification}
            onNavigateHome={onNavigateHome}
            onSwitchTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* ----------------------------------------------------
          MODAL: EDIT / ADD PRODUCT
         ---------------------------------------------------- */}
      {editingProduct && (
        <div className="admin-modal-overlay" onClick={() => setEditingProduct(false)}>
          <div className="admin-modal-box animate-pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-header-text">
                <div className="admin-modal-title-with-badge">
                  <span className="modal-header-icon-pill">{isNewProduct ? '➕' : '✏️'}</span>
                  <h3>{isNewProduct ? 'Ajouter un Nouveau Produit' : 'Modifier le Produit'}</h3>
                </div>
                <p className="admin-modal-header-sub">Configurez les informations du forfait, les tarifs et les caractéristiques affichées</p>
              </div>
              <button 
                type="button" 
                className="btn-modal-close" 
                onClick={() => setEditingProduct(false)}
                title="Fermer la fenêtre"
              >
                <IconClose size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="admin-modal-form">
              <div className="modal-form-grid-2">
                <div className="form-field-group">
                  <label>Nom / Titre du Produit <span className="req-star">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="ex: 12 Aylık ou 12 Mois Premium"
                    value={productFormData.title}
                    onChange={(e) => setProductFormData({ ...productFormData, title: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Catégorie Associée <span className="req-star">*</span></label>
                  <select
                    value={productFormData.categoryId}
                    onChange={(e) => setProductFormData({ ...productFormData, categoryId: e.target.value })}
                    className="form-select-control"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-form-grid-3">
                <div className="form-field-group">
                  <label>Prix ($ USD) <span className="req-star">*</span></label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required
                    placeholder="ex: 59.99"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Période / Sous-titre</label>
                  <input 
                    type="text" 
                    placeholder="ex: / 12 Ay ou / Mois"
                    value={productFormData.period}
                    onChange={(e) => setProductFormData({ ...productFormData, period: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Mention d'économie</label>
                  <input 
                    type="text" 
                    placeholder="ex: Sadece $4.99/ay"
                    value={productFormData.savings}
                    onChange={(e) => setProductFormData({ ...productFormData, savings: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Badge Promotionnel (Optionnel)</label>
                <input 
                  type="text" 
                  placeholder="ex: 🔥 %62 İNDİRİM - EN ÇOK TERCİH EDİLEN ou POPULAIRE"
                  value={productFormData.badge}
                  onChange={(e) => setProductFormData({ ...productFormData, badge: e.target.value })}
                />
              </div>

              <div className="form-field-checkbox">
                <label className="checkbox-custom-label">
                  <input 
                    type="checkbox" 
                    checked={productFormData.popular}
                    onChange={(e) => setProductFormData({ ...productFormData, popular: e.target.checked })}
                  />
                  <span className="checkbox-text">
                    ⭐ <strong>Définir comme Produit Vedette (Populaire)</strong> — Affiche le contour doré néon et la mise en avant automatique sur le site.
                  </span>
                </label>
              </div>

              {/* Features List Section */}
              <div className="form-features-editor">
                <div className="features-editor-header">
                  <label className="features-label-head">Caractéristiques & Avantages du Produit :</label>
                  <span className="features-count-badge">
                    {productFormData.features.length} {productFormData.features.length === 1 ? 'ligne' : 'lignes'}
                  </span>
                </div>
                <div className="features-input-row">
                  <input 
                    type="text" 
                    placeholder="Ajouter une caractéristique (ex: 19.000+ Canlı TV Kanalı)..."
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <button type="button" className="btn-add-feature-item" onClick={handleAddFeature}>
                    <IconPlus size={16} /> Ajouter
                  </button>
                </div>

                <div className="features-chips-list">
                  {productFormData.features.map((feat, fIdx) => (
                    <div key={fIdx} className="feature-editable-chip">
                      <span className="chip-bullet">✓</span>
                      <span className="chip-text">{feat}</span>
                      <button 
                        type="button" 
                        className="btn-chip-remove" 
                        onClick={() => handleRemoveFeature(fIdx)}
                        title="Retirer cette ligne"
                      >
                        <IconClose size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section: Optimisation SEO & Détails Produits (Invisibles aux visiteurs) */}
              <div className="form-seo-section-card">
                <div className="seo-section-header">
                  <div className="seo-header-title-flex">
                    <span className="seo-badge-pill">🔍 GOOGLE SEO & RÉFÉRENCEMENT</span>
                    <span className="seo-status-tag">🔒 Masqué aux visiteurs sur la vitrine</span>
                  </div>
                  <p className="seo-header-desc">
                    Ajoutez ici les détails complets, spécifications techniques et mots-clés de ce produit. 
                    Ces informations ne s'affichent pas visuellement sur les cartes des forfaits pour préserver un design épuré, 
                    mais sont directement injectées dans le code HTML sémantique et les balises Schema.org JSON-LD 
                    pour maximiser l'indexation et le positionnement Google de votre boutique.
                  </p>
                </div>

                <div className="form-field-group">
                  <label className="seo-field-label">
                    <span>Titre SEO / Meta Titre (Optionnel) :</span>
                    <span className="label-helper-text">Laissez vide pour utiliser automatiquement le nom du produit</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="ex: Abonnement IPTV Premium 12 Mois - 4K Ultra HD & AntiFreeze"
                    value={productFormData.seoTitle}
                    onChange={(e) => setProductFormData({ ...productFormData, seoTitle: e.target.value })}
                    className="seo-input-control"
                  />
                </div>

                <div className="form-field-group">
                  <label className="seo-field-label">
                    <span>Détails & Description Complète du Produit pour le SEO :</span>
                    <span className="label-helper-text">Rédigez une description riche avec vos termes clés (chaînes, serveurs, compatibilité, stabilité...)</span>
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="ex: Profitez du meilleur abonnement IPTV avec notre forfait 12 mois. Plus de 19 000 chaînes en direct et 56 000 films et séries VOD en 4K Ultra HD. Serveurs ultra-stables avec technologie AntiFreeze 9.0 garantissant une diffusion fluide sans coupure. Compatible avec tous les appareils (Smart TV, FireStick, Android Box, MAG, Apple TV, PC). Activation instantanée et support client VIP 24/7."
                    value={productFormData.seoDescription}
                    onChange={(e) => setProductFormData({ ...productFormData, seoDescription: e.target.value })}
                    className="seo-textarea-control"
                  />
                </div>

                <div className="form-field-group">
                  <label className="seo-field-label">
                    <span>Mots-clés SEO Ciblés (Keywords) :</span>
                    <span className="label-helper-text">Séparez les mots-clés par des virgules</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="ex: abonnement iptv 12 mois, iptv 4k france, serveur iptv stable, chaines live, iptv firestick"
                    value={productFormData.seoKeywords}
                    onChange={(e) => setProductFormData({ ...productFormData, seoKeywords: e.target.value })}
                    className="seo-input-control"
                  />
                </div>

                <div className="seo-compliance-note">
                  <span>🛡️</span>
                  <span><strong>100% Conforme Google SEO :</strong> Ces données enrichissent les métadonnées de recherche (Schema.org / JSON-LD) et permettent aux robots d'indexation de classer vos produits en tête des résultats.</span>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  className="btn-modal-cancel" 
                  onClick={() => setEditingProduct(false)}
                  disabled={isSaving}
                >
                  Annuler
                </button>
                <button type="submit" className="btn-modal-save" disabled={isSaving}>
                  <IconCheck size={16} />
                  <span>{isSaving ? 'Enregistrement dans MongoDB...' : 'Enregistrer le Produit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL: EDIT / ADD CATEGORY
         ---------------------------------------------------- */}
      {editingCategory && (
        <div className="admin-modal-overlay" onClick={() => setEditingCategory(false)}>
          <div className="admin-modal-box admin-modal-box-small animate-pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-header-text">
                <div className="admin-modal-title-with-badge">
                  <span className="modal-header-icon-pill">{isNewCategory ? '➕' : '✏️'}</span>
                  <h3>{isNewCategory ? 'Nouvelle Catégorie' : 'Modifier la Catégorie'}</h3>
                </div>
                <p className="admin-modal-header-sub">Organisez vos produits sous cette catégorie sur la vitrine</p>
              </div>
              <button 
                type="button" 
                className="btn-modal-close" 
                onClick={() => setEditingCategory(false)}
                title="Fermer la fenêtre"
              >
                <IconClose size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="admin-modal-form">
              <div className="form-field-group">
                <label>Nom de la Catégorie <span className="req-star">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="ex: 1 Écran VIP, 2 Cihaz (Aile Paketi), 3 Cihaz..."
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                />
              </div>

              <div className="form-field-group">
                <label>Description / Sous-titre</label>
                <input 
                  type="text" 
                  placeholder="ex: 1 Connexion VIP, Multi-Écrans..."
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                />
              </div>

              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  className="btn-modal-cancel" 
                  onClick={() => setEditingCategory(false)}
                  disabled={isSaving}
                >
                  Annuler
                </button>
                <button type="submit" className="btn-modal-save" disabled={isSaving}>
                  <IconCheck size={16} />
                  <span>{isSaving ? 'Enregistrement dans MongoDB...' : 'Enregistrer la Catégorie'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL: EDIT ORDER
         ---------------------------------------------------- */}
      {editingOrder && (
        <div className="admin-modal-overlay" onClick={() => setEditingOrder(null)}>
          <div className="admin-modal-box animate-pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-header-text">
                <div className="admin-modal-title-with-badge">
                  <span className="modal-header-icon-pill">✏️</span>
                  <h3>Modifier la Commande</h3>
                </div>
                <p className="admin-modal-header-sub">ID: #{editingOrder._id} • Modifiez les informations client, le statut et vos notes internes</p>
              </div>
              <button 
                type="button" 
                className="btn-modal-close" 
                onClick={() => setEditingOrder(null)}
                title="Fermer la fenêtre"
              >
                <IconClose size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveOrderEdit} className="admin-modal-form">
              <div className="modal-form-grid-2">
                <div className="form-field-group">
                  <label>Email du Client <span className="req-star">*</span></label>
                  <input 
                    type="email" 
                    required
                    value={editingOrder.customerEmail || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customerEmail: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Numéro WhatsApp</label>
                  <input 
                    type="text" 
                    placeholder="ex: +33 6 12 34 56 78"
                    value={editingOrder.customerWhatsapp || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customerWhatsapp: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-form-grid-3">
                <div className="form-field-group">
                  <label>Forfait / Plan</label>
                  <input 
                    type="text" 
                    value={editingOrder.plan || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, plan: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Prix</label>
                  <input 
                    type="text" 
                    value={editingOrder.price || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, price: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Type d'Appareil</label>
                  <input 
                    type="text" 
                    value={editingOrder.deviceType || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, deviceType: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-form-grid-2">
                <div className="form-field-group">
                  <label>Moyen de Paiement</label>
                  <select
                    value={editingOrder.paymentMethod || 'card'}
                    onChange={(e) => setEditingOrder({ ...editingOrder, paymentMethod: e.target.value })}
                    className="form-select-control"
                  >
                    <option value="card">Carte Bancaire</option>
                    <option value="crypto">Crypto-monnaie</option>
                    <option value="paypal">PayPal</option>
                    <option value="virement">Virement bancaire</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Statut de la Commande</label>
                  <select
                    value={editingOrder.status || 'pending'}
                    onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
                    className="form-select-control"
                  >
                    <option value="pending">⏳ En attente</option>
                    <option value="confirmed">🟢 Confirmé</option>
                    <option value="active">⚡ Activé</option>
                    <option value="completed">✅ Complété</option>
                    <option value="cancelled">🔴 Annulé</option>
                  </select>
                </div>
              </div>

              <div className="form-field-group">
                <label>Notes Administrateur (Identifiants M3U, codes Xtream, date d'expiration...)</label>
                <textarea 
                  rows="3"
                  className="admin-modal-textarea"
                  placeholder="Notes privées pour l'activation du client..."
                  value={editingOrder.notes || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, notes: e.target.value })}
                />
              </div>

              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  className="btn-modal-cancel" 
                  onClick={() => setEditingOrder(null)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn-modal-save">
                  <IconCheck size={16} />
                  <span>Enregistrer les Modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL: ADD MANUAL ORDER
         ---------------------------------------------------- */}
      {isNewOrderModal && (
        <div className="admin-modal-overlay" onClick={() => setIsNewOrderModal(false)}>
          <div className="admin-modal-box animate-pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-header-text">
                <div className="admin-modal-title-with-badge">
                  <span className="modal-header-icon-pill">➕</span>
                  <h3>Nouvelle Commande Manuelle</h3>
                </div>
                <p className="admin-modal-header-sub">Ajoutez manuellement une souscription reçue par WhatsApp, email ou téléphone</p>
              </div>
              <button 
                type="button" 
                className="btn-modal-close" 
                onClick={() => setIsNewOrderModal(false)}
                title="Fermer la fenêtre"
              >
                <IconClose size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="admin-modal-form">
              <div className="modal-form-grid-2">
                <div className="form-field-group">
                  <label>Email du Client <span className="req-star">*</span></label>
                  <input 
                    type="email" 
                    required
                    placeholder="client@gmail.com"
                    value={newOrderData.customerEmail}
                    onChange={(e) => setNewOrderData({ ...newOrderData, customerEmail: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Numéro WhatsApp</label>
                  <input 
                    type="text" 
                    placeholder="+33 6 00 00 00 00"
                    value={newOrderData.customerWhatsapp}
                    onChange={(e) => setNewOrderData({ ...newOrderData, customerWhatsapp: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-form-grid-3">
                <div className="form-field-group">
                  <label>Forfait / Plan <span className="req-star">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={newOrderData.plan}
                    onChange={(e) => setNewOrderData({ ...newOrderData, plan: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Prix</label>
                  <input 
                    type="text" 
                    value={newOrderData.price}
                    onChange={(e) => setNewOrderData({ ...newOrderData, price: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Appareil</label>
                  <input 
                    type="text" 
                    value={newOrderData.deviceType}
                    onChange={(e) => setNewOrderData({ ...newOrderData, deviceType: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-form-grid-2">
                <div className="form-field-group">
                  <label>Moyen de Paiement</label>
                  <select
                    value={newOrderData.paymentMethod}
                    onChange={(e) => setNewOrderData({ ...newOrderData, paymentMethod: e.target.value })}
                    className="form-select-control"
                  >
                    <option value="card">Carte Bancaire</option>
                    <option value="crypto">Crypto-monnaie</option>
                    <option value="paypal">PayPal</option>
                    <option value="virement">Virement bancaire</option>
                    <option value="cash">Espèces / Direct</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Statut Initial</label>
                  <select
                    value={newOrderData.status}
                    onChange={(e) => setNewOrderData({ ...newOrderData, status: e.target.value })}
                    className="form-select-control"
                  >
                    <option value="pending">⏳ En attente</option>
                    <option value="confirmed">🟢 Confirmé</option>
                    <option value="active">⚡ Activé</option>
                  </select>
                </div>
              </div>

              <div className="form-field-group">
                <label>Notes / M3U / Identifiants</label>
                <textarea 
                  rows="3"
                  className="admin-modal-textarea"
                  placeholder="Notes, identifiants ou informations d'activation..."
                  value={newOrderData.notes}
                  onChange={(e) => setNewOrderData({ ...newOrderData, notes: e.target.value })}
                />
              </div>

              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  className="btn-modal-cancel" 
                  onClick={() => setIsNewOrderModal(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn-modal-save">
                  <IconPlus size={16} />
                  <span>Créer la Commande</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
