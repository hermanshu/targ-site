import React, { useState } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTranslation } from '../hooks/useTranslation';
import { FavoriteFolder } from '../types';
import { 
  FolderIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ShareIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface FolderManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onFolderSelect?: (folderId: string) => void;
  mode?: 'select' | 'manage';
}

const FolderManager: React.FC<FolderManagerProps> = ({ 
  isOpen, 
  onClose, 
  onFolderSelect,
  mode = 'manage' 
}) => {
  const { folders, createFolder, updateFolder, deleteFolder, generateShareLink } = useFavorites();
  const { t } = useTranslation();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FavoriteFolder | null>(null);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<FavoriteFolder | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Форма создания/редактирования папки
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6'
  });

  const handleCreateFolder = () => {
    if (formData.name.trim()) {
      createFolder(formData.name.trim(), formData.description.trim(), formData.color);
      setFormData({ name: '', description: '', color: '#3b82f6' });
      setShowCreateForm(false);
    }
  };

  const handleUpdateFolder = () => {
    if (editingFolder && formData.name.trim()) {
      updateFolder(editingFolder.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        color: formData.color
      });
      setEditingFolder(null);
      setFormData({ name: '', description: '', color: '#3b82f6' });
    }
  };

  const handleDeleteFolder = (folder: FavoriteFolder) => {
    setShowDeleteModal(folder);
  };

  const confirmDeleteFolder = () => {
    if (showDeleteModal) {
      deleteFolder(showDeleteModal.id);
      setShowDeleteModal(null);
    }
  };

  const handleShareFolder = async (folderId: string) => {
    try {
      const shareLink = generateShareLink(folderId);
      if (shareLink) {
        await navigator.clipboard.writeText(shareLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      }
    } catch (error) {
      console.error('Ошибка при копировании ссылки:', error);
    }
  };

  const startEditing = (folder: FavoriteFolder) => {
    setEditingFolder(folder);
    setFormData({
      name: folder.name,
      description: folder.description || '',
      color: folder.color || '#3b82f6'
    });
  };

  const cancelEditing = () => {
    setEditingFolder(null);
    setFormData({ name: '', description: '', color: '#3b82f6' });
  };

  if (!isOpen) return null;

  return (
    <div className="folder-manager-overlay" onClick={onClose}>
      <div className="folder-manager" onClick={(e) => e.stopPropagation()}>
        <div className="folder-manager-header">
          <h2>{mode === 'select' ? t('favorites.selectFolder') : t('favorites.folders')}</h2>
          <button className="close-button" onClick={onClose}>
            <XMarkIcon className="close-icon" />
          </button>
        </div>

        <div className="folder-manager-content">
          {mode === 'manage' && (
            <button 
              className="create-folder-button"
              onClick={() => setShowCreateForm(true)}
            >
              <PlusIcon className="create-icon" />
              {t('favorites.createFolder')}
            </button>
          )}

          {/* Форма создания папки */}
          {showCreateForm && (
            <div className="folder-form">
              <h3>{t('favorites.createFolder')}</h3>
              <input
                type="text"
                placeholder={t('favorites.folderName')}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="folder-name-input"
              />
              <textarea
                placeholder={t('favorites.folderDescription')}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="folder-description-input"
                rows={3}
              />
              <div className="color-picker">
                <label>{t('favorites.folderColor')}:</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="color-input"
                />
              </div>
              <div className="form-actions">
                <button 
                  className="save-button"
                  onClick={handleCreateFolder}
                  disabled={!formData.name.trim()}
                >
                  <CheckIcon className="save-icon" />
                  {t('common.save')}
                </button>
                <button 
                  className="cancel-button"
                  onClick={() => setShowCreateForm(false)}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          )}

          {/* Форма редактирования папки */}
          {editingFolder && (
            <div className="folder-form">
              <h3>{t('favorites.renameFolder')}</h3>
              <input
                type="text"
                placeholder={t('favorites.folderName')}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="folder-name-input"
              />
              <textarea
                placeholder={t('favorites.folderDescription')}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="folder-description-input"
                rows={3}
              />
              <div className="color-picker">
                <label>{t('favorites.folderColor')}:</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="color-input"
                />
              </div>
              <div className="form-actions">
                <button 
                  className="save-button"
                  onClick={handleUpdateFolder}
                  disabled={!formData.name.trim()}
                >
                  <CheckIcon className="save-icon" />
                  {t('common.save')}
                </button>
                <button 
                  className="cancel-button"
                  onClick={cancelEditing}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          )}

          {/* Список папок */}
          <div className="folders-list">
            {folders.length === 0 ? (
              <div className="no-folders">
                <FolderIcon className="no-folders-icon" />
                <p>{t('favorites.noFolders')}</p>
                {mode === 'manage' && (
                  <button 
                    className="create-first-folder"
                    onClick={() => setShowCreateForm(true)}
                  >
                    {t('favorites.createFirstFolder')}
                  </button>
                )}
              </div>
            ) : (
              folders.map(folder => (
                <div key={folder.id} className="folder-item">
                  <div 
                    className="folder-info"
                    onClick={() => mode === 'select' && onFolderSelect?.(folder.id)}
                  >
                    <div 
                      className="folder-icon"
                      style={{ backgroundColor: folder.color }}
                    >
                      <FolderIcon className="folder-icon-svg" />
                    </div>
                    <div className="folder-details">
                      <h4 className="folder-name">{folder.name}</h4>
                      {folder.description && (
                        <p className="folder-description">{folder.description}</p>
                      )}
                      <span className="folder-count">
                        {folder.listingIds.length} {t('favorites.listingsCount')}
                      </span>
                    </div>
                  </div>
                  
                  {mode === 'manage' && (
                    <div className="folder-actions">
                      <button 
                        className="action-button edit"
                        onClick={() => startEditing(folder)}
                        title={t('favorites.renameFolder')}
                      >
                        <PencilIcon className="action-icon" />
                      </button>
                      
                      <button 
                        className="action-button share"
                        onClick={() => setShowShareModal(folder.id)}
                        title={t('favorites.shareFolder')}
                      >
                        <ShareIcon className="action-icon" />
                      </button>
                      
                      <button 
                        className="action-button delete"
                        onClick={() => handleDeleteFolder(folder)}
                        title={t('favorites.deleteFolder')}
                      >
                        <TrashIcon className="action-icon" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Модальное окно шаринга */}
        {showShareModal && (
          <div className="share-modal-overlay" onClick={() => setShowShareModal(null)}>
            <div className="share-modal" onClick={(e) => e.stopPropagation()}>
              <div className="share-modal-header">
                <h3>{t('favorites.shareFolder')}</h3>
                <button 
                  className="close-modal"
                  onClick={() => setShowShareModal(null)}
                >
                  <XMarkIcon className="close-icon" />
                </button>
              </div>
              
              <div className="share-modal-content">
                <p className="share-description">
                  {t('favorites.shareDescription')}
                </p>
                
                <div className="share-link-container">
                  <input
                    type="text"
                    value={generateShareLink(showShareModal)}
                    readOnly
                    className="share-link-input"
                  />
                  <button 
                    className="copy-link-button"
                    onClick={() => handleShareFolder(showShareModal)}
                  >
                    {linkCopied ? (
                      <CheckIcon className="copy-icon" />
                    ) : (
                      <ShareIcon className="copy-icon" />
                    )}
                    {linkCopied ? t('favorites.linkCopied') : t('favorites.copyLink')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно удаления папки */}
        {showDeleteModal && (
          <div className="delete-modal-overlay" onClick={() => setShowDeleteModal(null)}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
              <div className="delete-modal-header">
                <h3>{t('favorites.deleteFolder')}</h3>
                <button 
                  className="close-modal"
                  onClick={() => setShowDeleteModal(null)}
                >
                  <XMarkIcon className="close-icon" />
                </button>
              </div>
              
              <div className="delete-modal-content">
                <div className="delete-warning">
                  <TrashIcon className="delete-warning-icon" />
                  <p className="delete-warning-text">
                    {t('favorites.confirmDeleteFolder')}
                  </p>
                  <p className="delete-folder-name">
                    "{showDeleteModal.name}"
                  </p>
                  <p className="delete-folder-info">
                    {showDeleteModal.listingIds.length} {t('favorites.listingsCount')} будут перемещены в общее избранное
                  </p>
                </div>
                
                <div className="delete-modal-actions">
                  <button 
                    className="cancel-button"
                    onClick={() => setShowDeleteModal(null)}
                  >
                    {t('common.cancel')}
                  </button>
                  <button 
                    className="delete-button"
                    onClick={confirmDeleteFolder}
                  >
                    <TrashIcon className="delete-icon" />
                    {t('favorites.deleteFolder')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderManager; 