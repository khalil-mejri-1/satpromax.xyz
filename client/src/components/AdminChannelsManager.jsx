import React, { useState, useEffect, useMemo } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { 
  IconTv, 
  IconSearch, 
  IconPlus, 
  IconTrash, 
  IconEdit, 
  IconCheck, 
  IconClose, 
  IconRefreshCw, 
  IconZap, 
  IconSparkles,
  IconArrowRight
} from './Icons';
import './AdminChannelsManager.css';

export const AdminChannelsManager = ({ showConfirm }) => {
  // Tabs: 'channels' | 'categories'
  const [subTab, setSubTab] = useState('channels');

  const [categories, setCategories] = useState([]);
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  // Filters & Pagination for channels
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Modals state
  const [editingChannel, setEditingChannel] = useState(null);
  const [isNewChannel, setIsNewChannel] = useState(false);
  const [channelForm, setChannelForm] = useState({
    name: '',
    logo: '',
    category_id: '',
    is_premium: false,
    is_adult: false,
    isActive: true,
  });

  const [editingCategory, setEditingCategory] = useState(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    logoUrl: '',
    index: 1,
    isActive: true,
  });

  // Load Categories & Channels
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [catRes, chanRes] = await Promise.all([
        fetch(API_ENDPOINTS.liveCategories),
        fetch(`${API_ENDPOINTS.liveChannels}?limit=0`),
      ]);

      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.data || []);
      }

      if (chanRes.ok) {
        const chanData = await chanRes.json();
        setChannels(chanData.data || []);
      }
    } catch (err) {
      console.error('Error fetching admin live channels:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Netfly One-Click Sync
  const handleSyncFromNetfly = async () => {
    const doSync = async () => {
      try {
        setIsSyncing(true);
        setSyncStatus('Mise à jour en cours depuis Netfly...');
        const res = await fetch(API_ENDPOINTS.syncLiveChannels, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await res.json();
        if (res.ok) {
          setSyncStatus(`Succès: ${result.data?.channelsCount || 0} chaînes et ${result.data?.categoriesCount || 0} catégories synchronisées !`);
          await fetchData();
        } else {
          setSyncStatus(`Erreur: ${result.error || 'Échec de synchronisation'}`);
        }
      } catch (err) {
        setSyncStatus(`Erreur: ${err.message}`);
      } finally {
        setIsSyncing(false);
        setTimeout(() => setSyncStatus(null), 5000);
      }
    };

    if (showConfirm) {
      showConfirm({
        type: 'warning',
        title: 'Mettre à jour depuis Netfly ?',
        message: 'Cette action va re-télécharger la liste officielle des chaînes et catégories depuis Netfly et synchroniser la base de données.',
        confirmText: 'Oui, synchroniser',
        cancelText: 'Annuler',
        onConfirm: doSync,
      });
    } else {
      if (window.confirm('Synchroniser toutes les chaînes et catégories depuis Netfly ?')) {
        doSync();
      }
    }
  };

  // Filtered channels
  const filteredChannels = useMemo(() => {
    let list = channels;
    if (selectedCatFilter !== 'all') {
      const cid = Number(selectedCatFilter);
      list = list.filter((ch) => ch.category_id === cid);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((ch) => 
        (ch.name || '').toLowerCase().includes(q) ||
        (ch.category_name || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [channels, selectedCatFilter, searchQuery]);

  // Paginated channels
  const paginatedChannels = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredChannels.slice(start, start + itemsPerPage);
  }, [filteredChannels, currentPage]);

  const totalPages = Math.ceil(filteredChannels.length / itemsPerPage) || 1;

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCatFilter, searchQuery]);

  // Channel Actions
  const handleOpenAddChannel = () => {
    setIsNewChannel(true);
    setChannelForm({
      name: '',
      logo: '',
      category_id: categories[0]?.category_id || '',
      is_premium: false,
      is_adult: false,
      isActive: true,
    });
    setEditingChannel(true);
  };

  const handleOpenEditChannel = (ch) => {
    setIsNewChannel(false);
    setChannelForm({
      _id: ch._id,
      name: ch.name || '',
      logo: ch.logo || '',
      category_id: ch.category_id || '',
      is_premium: Boolean(ch.is_premium),
      is_adult: Boolean(ch.is_adult),
      isActive: ch.isActive !== false,
    });
    setEditingChannel(ch);
  };

  const handleSaveChannel = async (e) => {
    e.preventDefault();
    if (!channelForm.name.trim() || !channelForm.category_id) return;

    try {
      const url = isNewChannel 
        ? API_ENDPOINTS.channelCrud 
        : `${API_ENDPOINTS.channelCrud}/${channelForm._id}`;
      const method = isNewChannel ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(channelForm),
      });

      if (res.ok) {
        setEditingChannel(null);
        await fetchData();
      } else {
        const errJson = await res.json();
        alert(`Erreur: ${errJson.error}`);
      }
    } catch (err) {
      alert(`Erreur réseau: ${err.message}`);
    }
  };

  const handleDeleteChannel = (ch) => {
    const doDelete = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.channelCrud}/${ch._id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setChannels((prev) => prev.filter((c) => c._id !== ch._id));
        } else {
          alert('Erreur lors de la suppression de la chaîne');
        }
      } catch (err) {
        alert(err.message);
      }
    };

    if (showConfirm) {
      showConfirm({
        type: 'danger',
        title: 'Supprimer cette chaîne ?',
        message: `Êtes-vous sûr de vouloir supprimer définitivement "${ch.name}" ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        onConfirm: doDelete,
      });
    } else if (window.confirm(`Supprimer ${ch.name} ?`)) {
      doDelete();
    }
  };

  // Category Actions
  const handleOpenAddCategory = () => {
    setIsNewCategory(true);
    setCategoryForm({
      name: '',
      logoUrl: '',
      index: categories.length + 1,
      isActive: true,
    });
    setEditingCategory(true);
  };

  const handleOpenEditCategory = (cat) => {
    setIsNewCategory(false);
    setCategoryForm({
      _id: cat._id,
      name: cat.name || '',
      logoUrl: cat.logoUrl || '',
      index: cat.index || 1,
      isActive: cat.isActive !== false,
    });
    setEditingCategory(cat);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    try {
      const url = isNewCategory 
        ? API_ENDPOINTS.categoryCrud 
        : `${API_ENDPOINTS.categoryCrud}/${categoryForm._id}`;
      const method = isNewCategory ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm),
      });

      if (res.ok) {
        setEditingCategory(null);
        await fetchData();
      } else {
        const errJson = await res.json();
        alert(`Erreur: ${errJson.error}`);
      }
    } catch (err) {
      alert(`Erreur réseau: ${err.message}`);
    }
  };

  const handleDeleteCategory = (cat) => {
    const doDelete = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.categoryCrud}/${cat._id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          await fetchData();
        } else {
          alert('Erreur lors de la suppression de la catégorie');
        }
      } catch (err) {
        alert(err.message);
      }
    };

    if (showConfirm) {
      showConfirm({
        type: 'danger',
        title: 'Supprimer cette catégorie ?',
        message: `Attention : la suppression de la catégorie "${cat.name}" supprimera également toutes les chaînes associées !`,
        confirmText: 'Oui, supprimer tout',
        cancelText: 'Annuler',
        onConfirm: doDelete,
      });
    } else if (window.confirm(`Supprimer la catégorie ${cat.name} et toutes ses chaînes ?`)) {
      doDelete();
    }
  };

  return (
    <div className="admin-channels-manager">
      {/* Top Header with Stats and Sync Action */}
      <div className="admin-channels-header">
        <div className="admin-channels-title-area">
          <h2 className="admin-section-heading">Gestion des Chaînes TV en Direct</h2>
          <p className="admin-section-sub">
            Gérez toutes les chaînes, catégories et logos en direct synchronisés avec Netfly.
          </p>
        </div>

        <div className="admin-channels-header-actions">
          <button 
            type="button" 
            className="btn-admin-sync"
            onClick={handleSyncFromNetfly}
            disabled={isSyncing}
          >
            <IconRefreshCw size={15} className={isSyncing ? 'spinning-icon' : ''} />
            <span>{isSyncing ? 'Synchronisation...' : 'Synchroniser depuis Netfly'}</span>
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className={`sync-status-banner ${syncStatus.startsWith('Erreur') ? 'error' : 'success'}`}>
          {syncStatus}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-box"><IconTv size={22} /></div>
          <div className="kpi-data">
            <span className="kpi-val">{channels.length.toLocaleString()}</span>
            <span className="kpi-label">Chaînes TV Totales</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box cat-icon"><IconZap size={22} /></div>
          <div className="kpi-data">
            <span className="kpi-val">{categories.length}</span>
            <span className="kpi-label">Catégories & Bouquets</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box active-icon"><IconCheck size={22} /></div>
          <div className="kpi-data">
            <span className="kpi-val">
              {categories.find((c) => c.category_id === 414)?.program_total || 33}
            </span>
            <span className="kpi-label">Chaînes beIN Sports</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Channels vs Categories */}
      <div className="admin-subtabs-nav">
        <button 
          type="button"
          className={`subtab-btn ${subTab === 'channels' ? 'active' : ''}`}
          onClick={() => setSubTab('channels')}
        >
          <span>Chaînes en Direct ({filteredChannels.length})</span>
        </button>
        <button 
          type="button"
          className={`subtab-btn ${subTab === 'categories' ? 'active' : ''}`}
          onClick={() => setSubTab('categories')}
        >
          <span>Catégories ({categories.length})</span>
        </button>
      </div>

      {/* TAB 1: CHANNELS MANAGEMENT */}
      {subTab === 'channels' && (
        <div className="channels-mgmt-view">
          {/* Controls Bar */}
          <div className="mgmt-controls-bar">
            <div className="search-filter-wrap">
              <IconSearch size={16} className="search-ico" />
              <input 
                type="text" 
                placeholder="Rechercher une chaîne..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
              />
              {searchQuery && (
                <button type="button" className="btn-clear-search" onClick={() => setSearchQuery('')}>
                  <IconClose size={12} />
                </button>
              )}
            </div>

            <div className="category-filter-wrap">
              <select 
                value={selectedCatFilter} 
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                className="admin-select-filter"
              >
                <option value="all">Toutes les catégories ({categories.length})</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name} ({cat.program_total || 0})
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="button" 
              className="btn-admin-add-entry"
              onClick={handleOpenAddChannel}
            >
              <IconPlus size={15} />
              <span>Ajouter une Chaîne</span>
            </button>
          </div>

          {/* Channels Table */}
          <div className="admin-table-container">
            {isLoading ? (
              <div className="table-loading-msg">Chargement des chaînes...</div>
            ) : filteredChannels.length === 0 ? (
              <div className="table-empty-msg">Aucune chaîne ne correspond à vos critères de recherche.</div>
            ) : (
              <table className="admin-modern-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Logo</th>
                    <th>Nom de la Chaîne</th>
                    <th>Catégorie</th>
                    <th style={{ width: '90px' }}>Statut</th>
                    <th style={{ width: '80px' }}>Type</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedChannels.map((ch) => (
                    <tr key={ch._id || ch.channel_id}>
                      <td>
                        <div className="table-ch-logo">
                          {ch.logo ? (
                            <img src={ch.logo} alt={ch.name} onError={(e) => { e.target.style.display = 'none'; }} />
                          ) : (
                            <IconTv size={16} />
                          )}
                        </div>
                      </td>
                      <td>
                        <strong className="table-ch-name">{ch.name}</strong>
                      </td>
                      <td>
                        <span className="badge-table-cat">{ch.category_name}</span>
                      </td>
                      <td>
                        <span className={`badge-status ${ch.isActive !== false ? 'active' : 'inactive'}`}>
                          {ch.isActive !== false ? 'Actif' : 'Désactivé'}
                        </span>
                      </td>
                      <td>
                        <span className="badge-live-tag">Direct</span>
                      </td>
                      <td>
                        <div className="table-actions-cell">
                          <button 
                            type="button" 
                            className="btn-act-edit" 
                            title="Modifier"
                            onClick={() => handleOpenEditChannel(ch)}
                          >
                            <IconEdit size={14} />
                          </button>
                          <button 
                            type="button" 
                            className="btn-act-delete" 
                            title="Supprimer"
                            onClick={() => handleDeleteChannel(ch)}
                          >
                            <IconTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-pagination-bar">
              <span className="pagination-info">
                Page {currentPage} sur {totalPages} ({filteredChannels.length} chaînes au total)
              </span>
              <div className="pagination-btns">
                <button 
                  type="button" 
                  className="page-nav-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Précédent
                </button>
                <button 
                  type="button" 
                  className="page-nav-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CATEGORIES MANAGEMENT */}
      {subTab === 'categories' && (
        <div className="categories-mgmt-view">
          <div className="mgmt-controls-bar">
            <button 
              type="button" 
              className="btn-admin-add-entry"
              onClick={handleOpenAddCategory}
            >
              <IconPlus size={15} />
              <span>Ajouter une Catégorie</span>
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-modern-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>Ordre</th>
                  <th>Nom de la Catégorie</th>
                  <th>Nombre de Chaînes</th>
                  <th style={{ width: '90px' }}>Statut</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id || cat.category_id}>
                    <td>
                      <span className="badge-table-index">#{cat.index || 0}</span>
                    </td>
                    <td>
                      <strong>{cat.name}</strong>
                    </td>
                    <td>
                      <span className="badge-table-cat">{cat.program_total || 0} chaînes</span>
                    </td>
                    <td>
                      <span className={`badge-status ${cat.isActive !== false ? 'active' : 'inactive'}`}>
                        {cat.isActive !== false ? 'Actif' : 'Désactivé'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <button 
                          type="button" 
                          className="btn-act-edit" 
                          title="Modifier"
                          onClick={() => handleOpenEditCategory(cat)}
                        >
                          <IconEdit size={14} />
                        </button>
                        <button 
                          type="button" 
                          className="btn-act-delete" 
                          title="Supprimer"
                          onClick={() => handleDeleteCategory(cat)}
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Edit / Add Channel */}
      {editingChannel && (
        <div className="admin-modal-backdrop" onClick={() => setEditingChannel(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{isNewChannel ? 'Ajouter une Nouvelle Chaîne' : 'Modifier la Chaîne'}</h3>
              <button type="button" className="btn-modal-close" onClick={() => setEditingChannel(null)}>
                <IconClose size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveChannel} className="admin-modal-form">
              <div className="form-group">
                <label>Nom de la Chaîne *</label>
                <input 
                  type="text" 
                  value={channelForm.name} 
                  onChange={(e) => setChannelForm({ ...channelForm, name: e.target.value })}
                  placeholder="Ex: beIN Sports 1 Premium"
                  required
                />
              </div>

              <div className="form-group">
                <label>Catégorie *</label>
                <select 
                  value={channelForm.category_id}
                  onChange={(e) => setChannelForm({ ...channelForm, category_id: Number(e.target.value) })}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Lien du Logo (URL Image)</label>
                <input 
                  type="text" 
                  value={channelForm.logo} 
                  onChange={(e) => setChannelForm({ ...channelForm, logo: e.target.value })}
                  placeholder="https://.../logo.png"
                />
                {channelForm.logo && (
                  <div className="logo-preview-box">
                    <img src={channelForm.logo} alt="Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                    <span>Aperçu du logo</span>
                  </div>
                )}
              </div>

              <div className="form-row-checkboxes">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={channelForm.is_premium}
                    onChange={(e) => setChannelForm({ ...channelForm, is_premium: e.target.checked })}
                  />
                  <span>Chaîne VIP / Premium</span>
                </label>

                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={channelForm.isActive}
                    onChange={(e) => setChannelForm({ ...channelForm, isActive: e.target.checked })}
                  />
                  <span>Activer la chaîne</span>
                </label>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setEditingChannel(null)}>
                  Annuler
                </button>
                <button type="submit" className="btn-save-primary">
                  {isNewChannel ? 'Ajouter la chaîne' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit / Add Category */}
      {editingCategory && (
        <div className="admin-modal-backdrop" onClick={() => setEditingCategory(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{isNewCategory ? 'Ajouter une Nouvelle Catégorie' : 'Modifier la Catégorie'}</h3>
              <button type="button" className="btn-modal-close" onClick={() => setEditingCategory(null)}>
                <IconClose size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="admin-modal-form">
              <div className="form-group">
                <label>Nom de la Catégorie *</label>
                <input 
                  type="text" 
                  value={categoryForm.name} 
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Ex: French Cinema"
                  required
                />
              </div>

              <div className="form-group">
                <label>Ordre d'affichage (Index numérique)</label>
                <input 
                  type="number" 
                  value={categoryForm.index} 
                  onChange={(e) => setCategoryForm({ ...categoryForm, index: parseInt(e.target.value, 10) || 0 })}
                  placeholder="Ex: 1"
                />
              </div>

              <div className="form-row-checkboxes">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={categoryForm.isActive}
                    onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                  />
                  <span>Activer la catégorie</span>
                </label>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setEditingCategory(null)}>
                  Annuler
                </button>
                <button type="submit" className="btn-save-primary">
                  {isNewCategory ? 'Ajouter la catégorie' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
