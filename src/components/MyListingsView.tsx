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

const MyListingsView: React.FC = () => {
  const { currentUser } = useAuth();
  const { getUserListings, updateListing, deleteListing } = useListings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'archived' | 'draft'>('active');

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
    alert(`${t('myListings.edit')} ${listingId}`);
  };

  const handleArchive = (listingId: string) => {
    updateListing(listingId, { status: 'archived' });
  };

  const handleActivate = (listingId: string) => {
    updateListing(listingId, { status: 'active' });
  };

  const handleDelete = (listingId: string) => {
    if (window.confirm(t('myListings.deleteConfirmation'))) {
      deleteListing(listingId);
    }
  };

  const handlePublish = (listingId: string) => {
    updateListing(listingId, { isPublished: true, status: 'active' });
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="my-listings-container">
      {/* Заголовок */}
      <div className="my-listings-header">
        <button 
          onClick={() => window.history.back()}
          className="back-button"
        >
          <ArrowLeftIcon className="back-icon" />
          <span>{t('myListings.back')}</span>
        </button>
        <h1 className="my-listings-title">{t('myListings.title')}</h1>
        <button 
          className="add-listing-button"
          onClick={() => navigate('/add')}
        >
          <PlusIcon className="add-icon" />
          <span>{t('myListings.add')}</span>
        </button>
      </div>

      {/* Статистика */}
      <div className="listings-stats">
        <div className="stat-card">
          <div className="stat-number">{userListings.filter(l => l.status === 'active').length}</div>
          <div className="stat-label">{t('myListings.statsLabels.active')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{userListings.reduce((sum, l) => sum + (l.views || 0), 0)}</div>
          <div className="stat-label">{t('myListings.statsLabels.views')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{userListings.reduce((sum, l) => sum + (l.favorites || 0), 0)}</div>
          <div className="stat-label">{t('myListings.statsLabels.inFavorites')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{userListings.filter(l => l.status === 'archived').length}</div>
          <div className="stat-label">{t('myListings.statsLabels.inArchive')}</div>
        </div>
      </div>

      {/* Табы */}
      <div className="listings-tabs">
        <button 
          className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          {t('myListings.tabs.active')} ({userListings.filter(l => l.status === 'active').length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'draft' ? 'active' : ''}`}
          onClick={() => setActiveTab('draft')}
        >
          {t('myListings.tabs.drafts')} ({userListings.filter(l => l.status === 'draft').length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'archived' ? 'active' : ''}`}
          onClick={() => setActiveTab('archived')}
        >
          {t('myListings.tabs.archive')} ({userListings.filter(l => l.status === 'archived').length})
        </button>
      </div>

      {/* Список объявлений */}
      <div className="listings-grid">
        {filteredListings.length === 0 ? (
          <div className="empty-state">
            <ArchiveBoxIcon className="empty-icon" />
            <h3>{t('myListings.noListings')}</h3>
            <p>{t('myListings.noListingsInCategory')}</p>
          </div>
        ) : (
          filteredListings.map(listing => (
            <div key={listing.id} className="listing-card">
              <div className="listing-image">
                {listing.imageName ? (
                  <img src={`/images/${listing.imageName}.jpg`} alt={listing.title} />
                ) : (
                  <div className="image-placeholder">
                    <span>{t('common.noPhoto')}</span>
                  </div>
                )}
                <div className="listing-status">
                  <span className={`status-badge ${getStatusColor(listing.status || 'active')}`}>
                    {getStatusText(listing.status || 'active')}
                  </span>
                </div>
              </div>

              <div className="listing-content">
                <h3 className="listing-title">{listing.title}</h3>
                <div className="listing-price">{listing.price} {listing.currency}</div>
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
                    onClick={() => handleEdit(listing.id)}
                    className="action-button edit"
                  >
                    <PencilIcon className="action-icon" />
                    {t('myListings.edit')}
                  </button>
                  
                  {listing.status === 'active' && (
                    <button 
                      onClick={() => handleArchive(listing.id)}
                      className="action-button archive"
                    >
                      <ArchiveBoxIcon className="action-icon" />
                      {t('myListings.archive')}
                    </button>
                  )}
                  
                  {listing.status === 'archived' && (
                    <button 
                      onClick={() => handleActivate(listing.id)}
                      className="action-button activate"
                    >
                      <EyeIcon className="action-icon" />
                      {t('myListings.activate')}
                    </button>
                  )}
                  
                  {listing.status === 'draft' && (
                    <button 
                      onClick={() => handlePublish(listing.id)}
                      className="action-button publish"
                    >
                      <EyeIcon className="action-icon" />
                      {t('myListings.publish')}
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleDelete(listing.id)}
                    className="action-button delete"
                  >
                    <TrashIcon className="action-icon" />
                    {t('myListings.delete')}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyListingsView; 