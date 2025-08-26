import React, { useState, useMemo, useEffect } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTranslation } from '../hooks/useTranslation';
import DesktopListingsGrid from './DesktopListingsGrid';
import FolderManager from './FolderManager';
import { Listing, FavoriteItem } from '../types';
import { 
  FunnelIcon, 
  ShareIcon, 
  XMarkIcon,
  FolderIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface FavoritesViewProps {
  onCardClick: (listing: Listing) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ onCardClick }) => {
  const { 
    favorites, 
    folders, 
    removeFromFavorites, 
    isFavorite, 
    getListingsInFolder,
    moveToListingToFolder,
    favoriteItems 
  } = useFavorites();
  const { t } = useTranslation();
  
  // Состояние фильтрации
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [showFolders, setShowFolders] = useState(false);
  
  // Состояние управления папками
  const [showFolderManager, setShowFolderManager] = useState(false);
  const [showFolderSelector, setShowFolderSelector] = useState(false);
  const [selectedListingForFolder, setSelectedListingForFolder] = useState<Listing | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);


  
  // Состояние шаринга
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Получаем уникальные категории из избранного
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(favorites.map(fav => fav.category)));
    return uniqueCategories.sort();
  }, [favorites]);

  // Фильтруем избранное по выбранной категории и папке
  const filteredFavorites = useMemo(() => {
    let filtered = favorites;
    
    // Фильтр по папке
    if (selectedFolder) {
      filtered = getListingsInFolder(selectedFolder);
    }
    
    // Фильтр по категории
    if (selectedCategory) {
      filtered = filtered.filter(fav => fav.category === selectedCategory);
    }
    
    return filtered;
  }, [favorites, selectedCategory, selectedFolder, getListingsInFolder]);

  const handleFavoriteToggle = (listing: Listing) => {
    removeFromFavorites(listing.id);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setShowFilters(false);
  };

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
    setShowFolders(false);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedFolder('');
    setShowFilters(false);
    setShowFolders(false);
  };

  const handleMoveToFolder = (listing: Listing, folderId?: string) => {
    if (folderId !== undefined && folderId !== '') {
      // Если передан folderId, сразу перемещаем объявление
      moveToListingToFolder(listing.id, folderId);
      
      // Принудительно обновляем компонент для корректного отображения
      setTimeout(() => {
        setForceUpdate(prev => prev + 1);
      }, 100);
    } else if (folderId === '') {
      // Если передана пустая строка, перемещаем в общее избранное
      moveToListingToFolder(listing.id, undefined);
      
      // Принудительно обновляем компонент для корректного отображения
      setTimeout(() => {
        setForceUpdate(prev => prev + 1);
      }, 100);
    } else {
      // Если folderId не передан, показываем селектор папок
      setSelectedListingForFolder(listing);
      setShowFolderSelector(true);
    }
  };

  const handleFolderSelectForListing = (folderId: string) => {
    if (selectedListingForFolder) {
      moveToListingToFolder(selectedListingForFolder.id, folderId);
      setSelectedListingForFolder(null);
      setShowFolderSelector(false);
    }
  };

  const getCurrentFolderName = () => {
    if (!selectedFolder) return '';
    const folder = folders.find(f => f.id === selectedFolder);
    return folder?.name || '';
  };

  const getCurrentCategoryName = () => {
    if (!selectedCategory) return '';
    return selectedCategory;
  };

  // Получаем информацию о папке для каждого объявления
  const getListingFolderInfo = (listing: Listing) => {
    // Используем forceUpdate для принудительного обновления
    const _ = forceUpdate;
    const favoriteItem = favoriteItems.find((item: FavoriteItem) => item.listingId === listing.id);
    return favoriteItem?.folderId;
  };

  // Подготавливаем данные папок для передачи в карточки
  const foldersForCards = folders.map(folder => ({
    id: folder.id,
    name: folder.name,
    color: folder.color || '#3b82f6'
  }));



  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <div className="empty-icon">❤️</div>
        <h2 className="empty-title">{t('favorites.emptyTitle')}</h2>
        <p className="empty-description">
          {t('favorites.emptyDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <div className="header-center">
          <h1 className="favorites-title">{t('favorites.title')}</h1>
          <span className="favorites-count">
            {filteredFavorites.length} {t('favorites.listingsCount')}
            {selectedFolder && ` в папке "${getCurrentFolderName()}"`}
            {selectedCategory && ` в категории "${getCurrentCategoryName()}"`}
          </span>
          
          {/* Кнопки действий */}
          <div className="favorites-actions">
            <button 
              className="folders-button"
              onClick={() => setShowFolders(!showFolders)}
            >
              <FolderIcon className="folders-icon" />
              {selectedFolder ? getCurrentFolderName() : t('favorites.folders')}
              {showFolders ? (
                <ChevronDownIcon className="chevron-icon" />
              ) : (
                <ChevronRightIcon className="chevron-icon" />
              )}
            </button>
            
            <button 
              className="filter-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="filter-icon" />
              Категория
            </button>
            
            <button 
              className="manage-folders-button"
              onClick={() => setShowFolderManager(true)}
            >
              <PlusIcon className="manage-icon" />
              {t('favorites.createFolder')}
            </button>
          </div>

          {/* Панель папок */}
          {showFolders && (
            <div className="folders-panel">
              <div className="folders-header">
                <h3>{t('favorites.folders')}</h3>
                <button 
                  className="close-folders"
                  onClick={() => setShowFolders(false)}
                >
                  <XMarkIcon className="close-icon" />
                </button>
              </div>
              
              <div className="folders-list">
                <button
                  className={`folder-item ${!selectedFolder ? 'active' : ''}`}
                  onClick={() => handleFolderSelect('')}
                >
                  <FolderIcon className="folder-icon" />
                  <span>Все избранное</span>
                  <span className="folder-count">({favorites.length})</span>
                </button>
                
                {folders.map(folder => (
                  <button
                    key={folder.id}
                    className={`folder-item ${selectedFolder === folder.id ? 'active' : ''}`}
                    onClick={() => handleFolderSelect(folder.id)}
                  >
                    <div 
                      className="folder-color"
                      style={{ backgroundColor: folder.color }}
                    />
                    <span>{folder.name}</span>
                    <span className="folder-count">({folder.listingIds.length})</span>
                  </button>
                ))}
              </div>
              
              {(selectedFolder || selectedCategory) && (
                <button 
                  className="clear-filters"
                  onClick={clearFilters}
                >
                  {t('favorites.clearFilters')}
                </button>
              )}
            </div>
          )}

          {/* Фильтр по категориям */}
          {showFilters && (
            <div className="category-filter">
              <div className="filter-header">
                <h3>{t('favorites.filterByCategory')}</h3>
                <button 
                  className="close-filter"
                  onClick={() => setShowFilters(false)}
                >
                  <XMarkIcon className="close-icon" />
                </button>
              </div>
              
              <div className="categories-list">
                <button
                  className={`category-item ${!selectedCategory ? 'active' : ''}`}
                  onClick={() => handleCategoryFilter('')}
                >
                  {t('favorites.allCategories')} ({favorites.length})
                </button>
                
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {category} ({favorites.filter(fav => fav.category === category).length})
                  </button>
                ))}
              </div>
              
              {selectedCategory && (
                <button 
                  className="clear-filters"
                  onClick={() => setSelectedCategory('')}
                >
                  {t('favorites.clearFilters')}
                </button>
              )}
            </div>
          )}

          {favorites.length > 0 && (
            <div className="favorites-hint">
              <span 
                className="help-link"
                onClick={() => setShowHelpModal(true)}
              >
                Как работают папки?
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Сетка объявлений */}
      {filteredFavorites.length > 0 ? (
        <DesktopListingsGrid
          listings={filteredFavorites}
          onFavoriteToggle={handleFavoriteToggle}
          isFavorite={isFavorite}
          onCardClick={onCardClick}
          hasMore={false}
          onLoadMore={() => {}}
          isLoading={false}
          hasFilters={false}
          onMoveToFolder={handleMoveToFolder}
          folders={foldersForCards}
          showFolderSelector={true}
          getCurrentFolderId={getListingFolderInfo}
        />
      ) : (
        <div className="no-items-in-category">
          <div className="empty-icon">🔍</div>
          <h3>{t('favorites.noItemsInCategory')}</h3>
          <button 
            className="clear-filters-button"
            onClick={clearFilters}
          >
            {t('favorites.clearFilters')}
          </button>
        </div>
      )}

      {/* Менеджер папок */}
      <FolderManager
        isOpen={showFolderManager}
        onClose={() => setShowFolderManager(false)}
        mode="manage"
      />

      {/* Селектор папок для перемещения объявления */}
      <FolderManager
        isOpen={showFolderSelector}
        onClose={() => {
          setShowFolderSelector(false);
          setSelectedListingForFolder(null);
        }}
        onFolderSelect={handleFolderSelectForListing}
        mode="select"
      />

      {/* Модальное окно с инструкциями по папкам */}
      {showHelpModal && (
        <div className="help-modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="help-modal-header">
              <h3>Как работают папки?</h3>
              <button 
                className="close-modal"
                onClick={() => setShowHelpModal(false)}
              >
                <XMarkIcon className="close-icon" />
              </button>
            </div>
            
            <div className="help-modal-content">
              <div className="help-section">
                <h4>📁 Создавайте папки для организации</h4>
                <p>Группируйте объявления по темам: "Квартиры для покупки", "Мебель для гостиной", "Подарки на день рождения"</p>
              </div>
              
              <div className="help-section">
                <h4>🔗 Делитесь папками с друзьями</h4>
                <p>Отправьте ссылку на папку другу или партнеру. Например, если вы вместе ищете квартиру - создайте папку "Наша будущая квартира" и поделитесь ссылкой!</p>
              </div>
              
              <div className="help-section">
                <h4>📱 Простое управление</h4>
                <p>Используйте выпадающий список на карточке объявления, чтобы добавить его в нужную папку</p>
              </div>
              
              <div className="help-section">
                <h4>👥 Совместный поиск</h4>
                <p>Идеально для поиска квартиры вдвоем, планирования покупок с семьей или помощи друзьям в выборе подарков</p>
              </div>
              
              <div className="help-example">
                <h4>💡 Пример использования:</h4>
                <p>"Мы с женой ищем квартиру. Я создал папку 'Квартиры до 500 евро' и добавил туда понравившиеся объявления. Поделился ссылкой с женой - теперь она может видеть все мои находки и добавлять свои!"</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesView; 