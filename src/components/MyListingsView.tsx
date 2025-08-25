import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  ArchiveBoxIcon,
  EyeIcon,
  TrashIcon,
  CalendarIcon,
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useListings } from '../contexts/ListingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { Listing } from '../types';
import { ListingPage } from './listing/ListingPage';
import EditListingView from './EditListingView';
import SaleConfirmationModal from './SaleConfirmationModal';

const MyListingsView: React.FC = () => {
  const { currentUser } = useAuth();
  const { getUserListings, updateListing, deleteListing, incrementViews } = useListings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'archived' | 'draft'>('active');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [saleConfirmationModal, setSaleConfirmationModal] = useState<{
    isOpen: boolean;
    listingId: string;
    listingTitle: string;
    action: 'archive' | 'delete';
  }>({
    isOpen: false,
    listingId: '',
    listingTitle: '',
    action: 'archive'
  });

  // Функция для перевода названия категории
  const getTranslatedCategory = (category: string): string => {
    const categoryMapping: { [key: string]: string } = {
      'allListings': t('home.allListings'),
      'electronics': t('home.electronics'),
      'homeAndGarden': t('home.homeAndGarden'),
      'fashion': t('home.fashion'),
      'services': t('home.services'),
      'work': t('home.work'),
      'realEstate': t('home.realEstate'),
      'plants': t('home.plants'),
      'otherCategories': t('home.otherCategories'),
      'furniture': t('home.furniture'),
      'transport': t('home.transport'),
      'sport': t('home.sport'),
      'books': t('home.books'),
      'kids': t('home.kids'),
      'hobby': t('home.hobby'),
      'vacancies': t('home.vacancies'),
      'resume': t('home.resume'),
      'rent': t('home.rent'),
      'sale': t('home.sale')
    };
    
    return categoryMapping[category] || category;
  };

  // Получаем объявления текущего пользователя
  const userListings = getUserListings(currentUser?.id || '');
  const filteredListings = userListings.filter(listing => listing.status === activeTab);

  const handleEdit = (listingId: string) => {
    const listing = userListings.find(l => l.id === listingId);
    if (listing) {
      setEditingListing(listing);
    }
  };

  const handleArchive = (listingId: string) => {
    const listing = userListings.find(l => l.id === listingId);
    if (listing) {
      setSaleConfirmationModal({
        isOpen: true,
        listingId,
        listingTitle: listing.title,
        action: 'archive'
      });
    }
  };

  const handleActivate = (listingId: string) => {
    updateListing(listingId, { status: 'active' });
  };

  const handleDelete = (listingId: string) => {
    const listing = userListings.find(l => l.id === listingId);
    if (listing) {
      setSaleConfirmationModal({
        isOpen: true,
        listingId,
        listingTitle: listing.title,
        action: 'delete'
      });
    }
  };

  const handlePublish = (listingId: string) => {
    updateListing(listingId, { isPublished: true, status: 'active' });
  };

  const handleConfirmSale = (buyerId: string, review?: { rating: number; comment: string }) => {
    // Здесь можно добавить логику для сохранения отзыва о покупателе
    if (review && buyerId) {
      // TODO: Добавить отзыв о покупателе
  
    }
    
    // Архивируем или удаляем объявление
    if (saleConfirmationModal.listingId) {
      if (saleConfirmationModal.action === 'archive') {
        updateListing(saleConfirmationModal.listingId, { status: 'archived' });
      } else {
        deleteListing(saleConfirmationModal.listingId);
      }
    }
    
    setSaleConfirmationModal({ isOpen: false, listingId: '', listingTitle: '', action: 'archive' });
  };

  const handleConfirmAction = () => {
    // Простое действие без продажи
    if (saleConfirmationModal.listingId) {
      if (saleConfirmationModal.action === 'archive') {
        updateListing(saleConfirmationModal.listingId, { status: 'archived' });
      } else {
        deleteListing(saleConfirmationModal.listingId);
      }
    }
  };

  const handleCardClick = (listing: Listing) => {
    // Увеличиваем счетчик просмотров при клике на карточку
    incrementViews(listing.id);
    setSelectedListing(listing);
  };

  const handleBackToList = () => {
    setSelectedListing(null);
  };

  const handleBackFromEdit = () => {
    setEditingListing(null);
  };

  const handleNavigateToMessages = (listing: Listing) => {

    
    // Переходим к сообщениям с полными параметрами объявления
    const params = new URLSearchParams({
      listingId: listing.id,
      sellerId: listing.userId,
      title: listing.title,
      sellerName: listing.sellerName,
      price: listing.price,
      currency: listing.currency,
      city: listing.city,
      category: listing.category,
      isCompany: listing.isCompany.toString(),
      imageName: listing.imageName || '',
      contactMethod: listing.contactMethod || 'chat'
    });
    navigate(`/messages?${params.toString()}`);
  };

  const handleNavigateToProfile = (mode?: 'signin' | 'signup') => {
    if (mode === 'signup') {
      navigate('/profile?mode=signup');
    } else if (mode === 'signin') {
      navigate('/profile?mode=signin');
    } else {
      navigate('/profile');
    }
  };

  const handleFavoriteToggle = (listing: Listing) => {
    // В "Мои объявления" можно добавить логику для избранного

  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      case 'draft': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('myListings.status.active');
      case 'archived': return t('myListings.status.archived');
      case 'draft': return t('myListings.status.draft');
      default: return t('myListings.status.unknown');
    }
  };

  const formatDate = (date: Date | string) => {
    // Если дата передана как строка, преобразуем её в объект Date
    let dateObj: Date;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    // Проверяем, что дата корректная
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Дата не указана';
    }
    
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  };

  // Если редактируется объявление, показываем форму редактирования
  if (editingListing) {
    return (
      <EditListingView
        listing={editingListing}
        onBack={handleBackFromEdit}
      />
    );
  }

  // Если выбрано объявление, показываем детальный просмотр
  if (selectedListing) {
    return (
      <ListingPage
        listingId={selectedListing.id}
        onBack={handleBackToList}
        onFavoriteToggle={handleFavoriteToggle}
        isFavorite={false} // В "Мои объявления" всегда false
        onNavigateToMessages={handleNavigateToMessages}
        onNavigateToProfile={handleNavigateToProfile}
      />
    );
  }

  return (
    <div className="my-listings-page">
      {/* Заголовок страницы */}
      <div className="my-listings-header">
        <button 
          onClick={() => window.history.back()}
          className="my-listings-back-button"
        >
          <ArrowLeftIcon className="my-listings-back-icon" />
          <span>{t('myListings.back')}</span>
        </button>
        <h1 className="my-listings-title">{t('myListings.title')}</h1>
        <button 
          className="my-listings-add-button"
          onClick={() => navigate('/add')}
        >
          <PlusIcon className="my-listings-add-icon" />
          <span>{t('myListings.add')}</span>
        </button>
      </div>

      {/* Статистика */}
      <div className="website-stats-section">
        <div className="website-stats-grid">
          <div className="website-stat-card">
            <div className="website-stat-number">{userListings.filter(l => l.status === 'active').length}</div>
            <div className="website-stat-label">{t('myListings.statsLabels.active')}</div>
          </div>
          <div className="website-stat-card">
            <div className="website-stat-number">{userListings.reduce((sum, l) => sum + (l.views || 0), 0)}</div>
            <div className="website-stat-label">{t('myListings.statsLabels.views')}</div>
          </div>
          <div className="website-stat-card">
            <div className="website-stat-number">{userListings.reduce((sum, l) => sum + (l.favorites || 0), 0)}</div>
            <div className="website-stat-label">{t('myListings.statsLabels.inFavorites')}</div>
          </div>
          <div className="website-stat-card">
            <div className="website-stat-number">{userListings.filter(l => l.status === 'archived').length}</div>
            <div className="website-stat-label">{t('myListings.statsLabels.inArchive')}</div>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="website-categories-section">
        <div className="website-categories-scroll">
          <button 
            className={`website-category-button ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            <span className="website-category-name">
              {t('myListings.tabs.active')} ({userListings.filter(l => l.status === 'active').length})
            </span>
          </button>
          <button 
            className={`website-category-button ${activeTab === 'draft' ? 'active' : ''}`}
            onClick={() => setActiveTab('draft')}
          >
            <span className="website-category-name">
              {t('myListings.tabs.drafts')} ({userListings.filter(l => l.status === 'draft').length})
            </span>
          </button>
          <button 
            className={`website-category-button ${activeTab === 'archived' ? 'active' : ''}`}
            onClick={() => setActiveTab('archived')}
          >
            <span className="website-category-name">
              {t('myListings.tabs.archive')} ({userListings.filter(l => l.status === 'archived').length})
            </span>
          </button>
        </div>
      </div>

      {/* Список объявлений */}
      <div className="website-listings-grid">
        {filteredListings.length === 0 ? (
          <div className="website-empty-state">
            <ArchiveBoxIcon className="website-empty-icon" />
            <h3 className="website-empty-title">{t('myListings.noListings')}</h3>
            <p className="website-empty-description">{t('myListings.noListingsInCategory')}</p>
          </div>
        ) : (
          <div className="listings-grid">
            {filteredListings.map(listing => (
              <div 
                key={listing.id} 
                className="listing-card"
                onClick={() => handleCardClick(listing)}
              >
                <div className="listing-image-container">
                  {listing.images && listing.images.length > 0 ? (
                    <div className="listing-image">
                      <img src={listing.images[0]?.src || ''} alt={listing.images[0]?.alt || listing.title} />
                    </div>
                  ) : listing.imageName ? (
                    <div className="listing-image">
                      <img src={`/images/${listing.imageName}.jpg`} alt={listing.title} />
                    </div>
                  ) : (
                    <div className="listing-image-placeholder">
                      <div className="placeholder-icon">📷</div>
                      <span>{t('common.noPhoto')}</span>
                    </div>
                  )}
                  <div className="listing-status-overlay">
                    <span className={`website-status-badge ${getStatusColor(listing.status || 'active')}`}>
                      {getStatusText(listing.status || 'active')}
                    </span>
                  </div>
                </div>

                <div className="listing-content">
                  <h3 className="listing-title">{listing.title}</h3>
                  <div className="listing-price">
                    {listing.price} {listing.currency}
                    {(listing.category === 'work' || listing.category === 'vacancies' || listing.subcategory === 'vacancies' || listing.subcategory === 'rent') && ' / месяц'}
                  </div>
                  <div className="listing-location">
                    <MapPinIcon className="location-icon" />
                    {listing.city}
                  </div>
                  <div className="listing-category">{getTranslatedCategory(listing.category)}</div>
                  
                  <div className="listing-stats">
                    <div className="stat-item">
                      <EyeIcon className="stat-icon" />
                      <span>{listing.views || 0}</span>
                    </div>
                    <div className="stat-item">
                      <HeartIcon className="stat-icon" />
                      <span>{listing.favorites || 0}</span>
                    </div>
                    <div className="stat-item">
                      <CalendarIcon className="stat-icon" />
                      <span>{formatDate(listing.createdAt)}</span>
                    </div>
                  </div>

                  <div className="listing-actions">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(listing.id);
                      }}
                      className="website-action-button edit"
                    >
                      <PencilIcon className="action-icon" />
                      {t('myListings.edit')}
                    </button>
                    
                    {listing.status === 'active' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchive(listing.id);
                        }}
                        className="website-action-button archive"
                      >
                        <ArchiveBoxIcon className="action-icon" />
                        {t('myListings.archive')}
                      </button>
                    )}
                    
                    {listing.status === 'archived' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivate(listing.id);
                        }}
                        className="website-action-button activate"
                      >
                        <EyeIcon className="action-icon" />
                        {t('myListings.activate')}
                      </button>
                    )}
                    
                    {listing.status === 'draft' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePublish(listing.id);
                        }}
                        className="website-action-button publish"
                      >
                        <EyeIcon className="action-icon" />
                        {t('myListings.publish')}
                      </button>
                    )}
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(listing.id);
                      }}
                      className="website-action-button delete"
                    >
                      <TrashIcon className="action-icon" />
                      {t('myListings.delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно подтверждения продажи */}
      <SaleConfirmationModal
        isOpen={saleConfirmationModal.isOpen}
        onClose={() => setSaleConfirmationModal({ isOpen: false, listingId: '', listingTitle: '', action: 'archive' })}
        listingId={saleConfirmationModal.listingId}
        listingTitle={saleConfirmationModal.listingTitle}
        action={saleConfirmationModal.action}
        onConfirmSale={handleConfirmSale}
        onConfirmAction={handleConfirmAction}
        buyers={[
          // TODO: Здесь нужно подтягивать реальных покупателей из чатов
          { id: 'buyer1', name: 'Анна К.' },
          { id: 'buyer2', name: 'Михаил П.' },
          { id: 'buyer3', name: 'Елена С.' }
        ]}
      />
    </div>
  );
};

export default MyListingsView; 