import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { API_ENDPOINTS } from '../config/api';
import { 
  IconSearch, 
  IconTv, 
  IconClose, 
  IconChevronDown, 
  IconSparkles, 
  IconArrowRight, 
  IconZap, 
  IconCheck,
  IconPlayCircle
} from './Icons';
import channelsCache from '../data/channels_cache.json';
import './ChannelsListPage.css';

export const ChannelsListPage = ({ onNavigateHome, onOpenOrderModal }) => {
  const { currentLang } = useContent();
  const isRtl = currentLang === 'ar';

  // State
  const [categories, setCategories] = useState(() => channelsCache?.categories || []);
  const [channels, setChannels] = useState(() => channelsCache?.channels || []);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [failedLogos, setFailedLogos] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(120);

  // Fetch updated data from Backend
  useEffect(() => {
    let isMounted = true;

    async function loadFreshData() {
      try {
        setIsLoading(true);
        // Fetch Categories
        const catRes = await fetch(API_ENDPOINTS.liveCategories);
        if (catRes.ok) {
          const catJson = await catRes.json();
          if (isMounted && catJson?.data?.length > 0) {
            setCategories(catJson.data);
          }
        }

        // Fetch Channels
        const chanRes = await fetch(`${API_ENDPOINTS.liveChannels}?limit=0`);
        if (chanRes.ok) {
          const chanJson = await chanRes.json();
          if (isMounted && chanJson?.data?.length > 0) {
            setChannels(chanJson.data);
          }
        }
      } catch (err) {
        console.warn('Using local fallback cache for channels:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadFreshData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter channels based on category and search query
  const filteredChannels = useMemo(() => {
    let result = channels;

    if (selectedCategory !== 'all') {
      const catIdNum = Number(selectedCategory);
      result = result.filter((ch) => ch.category_id === catIdNum);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((ch) => 
        (ch.name || '').toLowerCase().includes(q) ||
        (ch.category_name || '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [channels, selectedCategory, searchQuery]);

  // Group channels by category for Netfly-like accordion display
  const groupedCategories = useMemo(() => {
    // Map category_id -> channels
    const map = new Map();

    filteredChannels.forEach((ch) => {
      const catId = ch.category_id;
      if (!map.has(catId)) {
        map.set(catId, {
          id: catId,
          name: ch.category_name || 'Autre',
          channels: [],
        });
      }
      map.get(catId).channels.push(ch);
    });

    // Convert map to array and sort according to original categories order
    const catOrderMap = new Map();
    categories.forEach((c, idx) => {
      catOrderMap.set(c.category_id, typeof c.index === 'number' ? c.index : idx);
    });

    return Array.from(map.values()).sort((a, b) => {
      const orderA = catOrderMap.has(a.id) ? catOrderMap.get(a.id) : 9999;
      const orderB = catOrderMap.has(b.id) ? catOrderMap.get(b.id) : 9999;
      return orderA - orderB;
    });
  }, [filteredChannels, categories]);

  // Expand all active groups by default or when category changes
  useEffect(() => {
    if (selectedCategory !== 'all') {
      setExpandedGroups(new Set([Number(selectedCategory)]));
    } else {
      // Expand top 8 groups initially to keep DOM light and responsive
      const initialSet = new Set(groupedCategories.slice(0, 8).map((g) => g.id));
      setExpandedGroups(initialSet);
    }
  }, [selectedCategory, groupedCategories.length]);

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const handleImageError = (channelId) => {
    setFailedLogos((prev) => new Set(prev).add(channelId));
  };

  // Scroll to category in list or update filter
  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className={`channels-explorer-page ${isRtl ? 'dir-rtl' : 'dir-ltr'}`}>
      {/* Top Floating Action Header / Breadcrumb */}
      <div className="channels-explorer-topbar">
        <div className="channels-topbar-inner">
          <button 
            type="button" 
            className="btn-back-home"
            onClick={onNavigateHome}
          >
            <span className="back-arrow">←</span>
            <span>{isRtl ? 'العودة للرئيسية' : 'Retour à l\'accueil'}</span>
          </button>

          <div className="topbar-branding">
            <span className="live-dot-pulse"></span>
            <span className="topbar-channels-count">
              <strong>{channels.length.toLocaleString()}+</strong> {isRtl ? 'قناة مباشرة متوفرة' : 'Chaînes en Direct'}
            </span>
          </div>

          <button 
            type="button" 
            className="btn-topbar-order"
            onClick={() => onOpenOrderModal && onOpenOrderModal({ plan: '12-months', title: '12 Mois IPTV' })}
          >
            <IconZap size={15} />
            <span>{isRtl ? 'طلب اشتراك الآن' : 'Commander Maintenant'}</span>
          </button>
        </div>
      </div>

      <main className="channels-explorer-main">
        {/* Hero Section Banner */}
        <section className="channels-hero-header">
          <div className="channels-hero-badge">
            <IconSparkles size={14} />
            <span>{isRtl ? 'دليل القنوات الحية بدون انقطاع' : 'Guide Complet des Chaînes Live 4K / FHD'}</span>
          </div>
          <h1 className="channels-hero-title">
            {isRtl ? 'قائمة القنوات' : 'Liste des Chaînes'}
          </h1>
          <p className="channels-hero-subtitle">
            {isRtl 
              ? 'تصفح جميع القنوات المباشرة مصنفة حسب الفئة بدقة فائقة وبدون تقطيع.' 
              : 'Explorez des milliers de chaînes TV internationales en haute définition, classées par bouquets et pays.'}
          </p>
        </section>

        {/* Search Bar matching Netfly */}
        <div className="channels-search-bar-wrapper">
          <div className="channels-search-bar">
            <IconSearch className="search-icon" size={20} />
            <input 
              type="text" 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'ابحث عن القنوات...' : 'Rechercher une chaîne, un sport, un pays...'}
              spellCheck="false"
              autoComplete="off"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="search-clear-btn" 
                onClick={clearSearch} 
                title="Effacer"
              >
                <IconClose size={13} />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="search-results-pill">
              {isRtl 
                ? `تم العثور على ${filteredChannels.length} قناة` 
                : `${filteredChannels.length} chaînes trouvées`}
            </div>
          )}
        </div>

        {/* 2-Column Channels Board (Sidebar Categories + Channels Groups Grid) */}
        <div className="channels-board-layout">
          {/* Categories Sidebar */}
          <aside className="categories-sidebar-panel">
            <div className="categories-panel-header">
              <h2 className="panel-title">{isRtl ? 'الفئات' : 'Catégories'}</h2>
              <span className="panel-count-badge">{categories.length}</span>
            </div>

            <div className="category-scroll-list">
              <button 
                type="button" 
                className={`category-item-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleSelectCategory('all')}
              >
                <span className="cat-name">{isRtl ? 'كل الفئات' : 'Toutes les Catégories'}</span>
                <span className="cat-count">{channels.length}</span>
              </button>

              {categories.map((cat) => {
                const isActive = String(selectedCategory) === String(cat.category_id);
                return (
                  <button 
                    key={cat.category_id}
                    type="button"
                    className={`category-item-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectCategory(cat.category_id)}
                  >
                    <span className="cat-name">{cat.name}</span>
                    <span className="cat-count">{cat.program_total || 0}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Channels Content Panel */}
          <section className="channels-content-panel">
            {filteredChannels.length === 0 ? (
              <div className="channels-empty-state">
                <IconTv size={48} className="empty-icon" />
                <h3>{isRtl ? 'لم يتم العثور على أي قناة' : 'Aucune chaîne trouvée'}</h3>
                <p>{isRtl ? 'يرجى تجربة كلمة بحث أخرى أو اختيار فئة مختلفة.' : 'Essayez avec un autre mot-clé ou sélectionnez une autre catégorie.'}</p>
                <button type="button" className="btn-reset-filter" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                  {isRtl ? 'إعادة ضبط البحث' : 'Réinitialiser la recherche'}
                </button>
              </div>
            ) : (
              <div className="groups-container">
                {groupedCategories.map((group) => {
                  const isExpanded = expandedGroups.has(group.id) || selectedCategory !== 'all';
                  const channelList = group.channels;

                  return (
                    <div key={group.id} className="channel-group-card">
                      {/* Accordion Group Header */}
                      <button 
                        type="button" 
                        className="group-header-btn"
                        onClick={() => toggleGroup(group.id)}
                      >
                        <div className="group-header-accent"></div>
                        <h2 className="group-title-text">
                          {group.name}
                          <span className="group-count-pill">({channelList.length})</span>
                        </h2>
                        <span className={`group-chevron-icon ${isExpanded ? 'open' : ''}`}>
                          <IconChevronDown size={18} />
                        </span>
                      </button>

                      {/* Group Channels Grid */}
                      {isExpanded && (
                        <div className="group-channels-body">
                          <div className="channel-cards-grid">
                            {channelList.map((ch) => {
                              const hasFailedImg = failedLogos.has(ch.channel_id) || !ch.logo;
                              return (
                                <div key={ch.channel_id} className="channel-entry-card" title={ch.name}>
                                  {/* Channel Logo Thumbnail */}
                                  <div className="channel-logo-wrapper">
                                    {!hasFailedImg ? (
                                      <img 
                                        src={ch.logo} 
                                        alt={ch.name} 
                                        className="channel-img-logo"
                                        loading="lazy"
                                        onError={() => handleImageError(ch.channel_id)}
                                      />
                                    ) : (
                                      <div className="channel-logo-fallback">
                                        <IconTv size={20} />
                                      </div>
                                    )}
                                  </div>

                                  {/* Channel Meta & Live Tag */}
                                  <div className="channel-info-wrapper">
                                    <h3 className="channel-title" title={ch.name}>{ch.name}</h3>
                                    <div className="channel-tags-row">
                                      <span className="tag-pill-live">
                                        {isRtl ? 'مباشر' : 'Live'}
                                      </span>
                                      {ch.is_premium === 1 && (
                                        <span className="tag-pill-premium">VIP</span>
                                      )}
                                      {ch.is_adult === 1 && (
                                        <span className="tag-pill-adult">18+</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Promo CTA Card */}
            <div className="channels-bottom-cta">
              <div className="cta-sparkle-badge">
                <IconZap size={16} />
                <span>{isRtl ? 'تجربة مشاهدة سينمائية لا مثيل لها' : 'Accédez à toutes ces chaînes dès aujourd\'hui'}</span>
              </div>
              <h3 className="cta-title">
                {isRtl ? 'هل أعجبتك القنوات؟ اشترك الآن بأسعار حصرية!' : 'Prêt à regarder toutes ces chaînes sans aucune interruption ?'}
              </h3>
              <p className="cta-desc">
                {isRtl 
                  ? 'سيرفرات فائقة السرعة مع ضمان استقرار 99.9% وجودة 4K / FHD حقيقية لجميع أجهزتك.' 
                  : 'Serveurs haute disponibilité, support 24/7 et compatibilité totale sur Smart TV, FireStick, Android et Apple.'}
              </p>
              <button 
                type="button" 
                className="btn-channels-cta"
                onClick={() => onOpenOrderModal && onOpenOrderModal({ plan: '12-months', title: '12 Mois IPTV Premium' })}
              >
                <span>{isRtl ? 'اختر خطتك الآن' : 'Voir les Offres d\'Abonnement'}</span>
                <IconArrowRight size={18} />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
