import React, { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  ShareIcon,
  BuildingOfficeIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useParams, useNavigate } from 'react-router-dom';
import { useListingData } from './useListingData';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useTranslation } from '../../hooks/useTranslation';
import { useListingImages } from '../../hooks/useListingImages';
import { useAuth } from '../../contexts/AuthContext';
import { useReviews } from '../../contexts/ReviewsContext';
import { useDialogs } from '../../contexts/DialogsContext';
import ReviewModal from '../ReviewModal';
import SellerReviewsModal from '../SellerReviewsModal';
import ReviewRestrictionModal from '../ReviewRestrictionModal';

interface ListingPageProps {
  listingId?: string; // Добавляем ID как пропс
  onBack: () => void;
  onFavoriteToggle: (listing: any) => void;
  isFavorite: boolean;
  onNavigateToMessages?: (listing: any) => void;
  onNavigateToProfile?: (mode?: 'signin' | 'signup') => void;
  onNavigateToSellerProfile?: (sellerId: string, sellerName: string, isCompany: boolean) => void;
}

export const ListingPage: React.FC<ListingPageProps> = ({
  listingId,
  onBack,
  onFavoriteToggle,
  isFavorite,
  onNavigateToMessages,
  onNavigateToProfile,
  onNavigateToSellerProfile
}) => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { getSellerRating, addReview } = useReviews();
  const { hasDialogWithSeller } = useDialogs();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showSellerReviewsModal, setShowSellerReviewsModal] = useState(false);
  const [showReviewRestrictionModal, setShowReviewRestrictionModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // Используем ID из пропсов или из URL параметров
  const id = listingId || params.id || '';
  const { listing, loading, error } = useListingData(id);

  // Используем хук для правильной сборки изображений
  const { images: galleryImages } = useListingImages({
    images: listing?.images,          // новая схема (если есть)
    imageName: listing?.imageName     // fallback по MULTI_IMAGE_CONFIG
  });

  // Получаем изображения
  const images = galleryImages;

  // Получаем рейтинг продавца
  const [sellerRating, setSellerRating] = useState(
    listing ? getSellerRating(listing.userId) : { averageRating: 0, totalReviews: 0, reviews: [] }
  );

  // Обновляем рейтинг при изменении данных
  useEffect(() => {
    if (listing) {
      setSellerRating(getSellerRating(listing.userId));
    }
  }, [getSellerRating, listing?.userId]);

  // Функция для рендеринга звезд
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index}>
        {index < rating ? (
          <StarIconSolid className="w-4 h-4 text-yellow-400" />
        ) : (
          <StarIcon className="w-4 h-4 text-gray-300" />
        )}
      </span>
    ));
  };

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

  // Функция для перевода характеристик
  const getTranslatedCharacteristic = (key: string): string => {
    const characteristicMapping: { [key: string]: string } = {
      'brand': t('listings.characteristicBrand'),
      'model': t('listings.characteristicModel'),
      'condition': t('listings.characteristicCondition'),
      'warranty': t('listings.characteristicWarranty'),
      'year': t('listings.characteristicYear'),
      'material': t('listings.characteristicMaterial'),
      'dimensions': t('listings.characteristicDimensions'),
      'size': t('listings.characteristicSize'),
      'color': t('listings.characteristicColor'),
      'serviceType': t('listings.characteristicServiceType'),
      'experience': t('listings.characteristicExperience'),
      'schedule': t('listings.characteristicSchedule'),
      'plantType': t('listings.characteristicPlantType'),
      'age': t('listings.characteristicAge'),
      'height': t('listings.characteristicHeight'),
      'position': t('listings.characteristicPosition'),
      'salary': t('listings.characteristicSalary'),
      'education': t('listings.characteristicEducation'),
      'skills': t('listings.characteristicSkills'),
      'propertyType': t('listings.characteristicPropertyType'),
      'rooms': t('listings.characteristicRooms'),
      'area': t('listings.characteristicArea'),
      'floor': t('listings.characteristicFloor'),
      'rentPeriod': t('listings.characteristicRentPeriod'),
      'mileage': t('listings.characteristicMileage'),
      'fuelType': t('listings.characteristicFuelType'),
      'transmission': t('listings.characteristicTransmission'),
      'author': t('listings.characteristicAuthor'),
      'publisher': t('listings.characteristicPublisher'),
      'language': t('listings.characteristicLanguage'),
      'ageGroup': t('listings.characteristicAgeGroup'),
      'style': t('listings.characteristicStyle'),
      'hobbyType': t('listings.characteristicHobbyType'),
    };
    
    return characteristicMapping[key] || key;
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleFavoriteToggle = () => {
    if (listing) {
      onFavoriteToggle(listing);
    }
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  const handleCopyLink = async () => {
    try {
      // Создаем ссылку на объявление
      const shareUrl = `${window.location.origin}${window.location.pathname}?listingId=${listing?.id}`;
      await navigator.clipboard.writeText(shareUrl);
      
      // Показываем уведомление об успешном копировании
      alert(t('listingDetail.linkCopied') || 'Ссылка скопирована!');
      setShowShareModal(false);
    } catch (error) {
      console.error('Ошибка при копировании ссылки:', error);
      alert(t('listingDetail.copyError') || 'Ошибка при копировании');
    }
  };

  const handleReportListing = () => {
    setShowShareModal(false);
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setReportReason('');
    setSelectedReportType('');
  };

  const handleReportTypeSelect = (type: string) => {
    setSelectedReportType(type);
  };

  const handleReportSubmit = () => {
    if (selectedReportType && reportReason.trim()) {
      setShowReportModal(false);
      setShowThankYouModal(true);
      setReportReason('');
      setSelectedReportType('');
    }
  };

  const handleCloseThankYouModal = () => {
    setShowThankYouModal(false);
  };

  const handleContactClick = () => {
    if (listing && onNavigateToMessages) {
      // Преобразуем NormalizedListing в формат, ожидаемый handleNavigateToMessages
      const listingForMessages = {
        id: listing.id,
        title: listing.title,
        price: listing.price.toString(), // price должен быть string
        currency: listing.currency,
        city: listing.city,
        category: listing.category,
        subcategory: listing.subcategory,
        sellerName: listing.sellerName,
        isCompany: listing.isCompany,
        imageName: listing.imageName || '',
        description: listing.description,
        createdAt: listing.createdAt,
        userId: listing.userId,
        views: listing.views,
        characteristics: listing.characteristics,
        contactMethod: listing.contactMethod,
        delivery: listing.delivery
      };
      
      
      
      onNavigateToMessages(listingForMessages);
    }
  };

  const handleReviewClick = () => {
    if (!currentUser) {
      // Если пользователь не авторизован, предлагаем войти
      if (onNavigateToProfile) {
        onNavigateToProfile('signin');
      }
      return;
    }

    if (!listing) return;

    // Проверяем, есть ли диалог с продавцом
    if (!hasDialogWithSeller(currentUser.id, listing.userId)) {
      setShowReviewRestrictionModal(true);
      return;
    }

    setShowReviewModal(true);
  };

  const handleSellerRatingClick = () => {
    setShowSellerReviewsModal(true);
  };

  const handleContactSellerForReview = () => {
    if (listing && onNavigateToMessages) {
      onNavigateToMessages(listing);
    }
  };



  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!currentUser || !listing) return;

    addReview({
      reviewerId: currentUser.id,
      sellerId: listing.userId,
      listingId: listing.id,
      rating: rating as 1 | 2 | 3 | 4 | 5,
      comment,
      isVerified: true,
      reviewerName: currentUser.name
    });
    
    // Обновляем рейтинг продавца
    setSellerRating(getSellerRating(listing.userId));
    
    // Закрываем модальное окно отзыва
    setShowReviewModal(false);
  };

  // Новый layout
  if (loading) {
    return (
      <div className="listing-loading">
        <div className="loading-spinner">⏳</div>
        <p>Загрузка объявления...</p>
      </div>
    );
  }
  if (error || !listing) {
    return (
      <div className="listing-error">
        <h2>Ошибка загрузки</h2>
        <p>{error || 'Объявление не найдено'}</p>
        <button onClick={handleBack} className="back-button">
          <ArrowLeftIcon className="back-icon" />
          Назад
        </button>
      </div>
    );
  }

  const openFullscreen = (idx: number) => {
    setCurrentIndex(idx);
    setFullscreen(true);
  };
  const closeFullscreen = () => setFullscreen(false);
  const nextImage = () => setCurrentIndex((i) => (i + 1) % images.length);
  const prevImage = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  const isMobileView = isMobile;
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f5f6fa] via-[#e9eaf3] to-[#f0f4ff] font-sans overflow-hidden">
      {/* Glassmorphism background decorations */}
      <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 z-0">
        <div className="absolute left-[-80px] top-24 w-72 h-72 rounded-full bg-indigo-200/30 blur-2xl" />
        <div className="absolute right-[-60px] top-1/2 w-60 h-60 rounded-full bg-pink-200/30 blur-2xl" />
        <div className="absolute left-1/2 bottom-[-100px] w-96 h-96 rounded-full bg-blue-100/30 blur-2xl" style={{transform: 'translateX(-50%)'}} />
      </div>
      {/* Top bar (ниже панели навигации) */}
      <div className="listing-detail-toolbar flex items-center justify-between mt-16 mb-4 max-w-5xl mx-auto w-full z-20 bg-white/60 backdrop-blur-lg border border-white/20 shadow-md rounded-lg px-4 h-12">
        <button onClick={handleBack} className="back-button flex items-center gap-1.5 text-gray-700 hover:text-indigo-600 font-semibold py-0.5 px-2 rounded-lg bg-transparent hover:bg-white/30 transition-all text-xs">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-100"><ArrowLeftIcon className="w-3 h-3" /></span>
          <span>Назад</span>
        </button>
        <button onClick={handleShareClick} className="back-button flex items-center gap-1.5 text-gray-700 hover:text-indigo-600 font-semibold py-0.5 px-2 rounded-lg bg-transparent hover:bg-white/30 transition-all text-xs">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-100"><ShareIcon className="w-3 h-3" /></span>
          <span>Поделиться</span>
        </button>
      </div>
      {/* Main content */}
      <div className="listing-detail-main max-w-5xl mx-auto flex flex-col md:flex-row gap-6 pb-10 px-4 z-10 relative mb-8">
        {/* Photo left, sticky */}
        <div className="md:w-[420px] w-full flex justify-center md:justify-start">
          <div className="sticky top-32 w-full max-w-[420px] aspect-square bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden flex flex-col items-center border border-white/30">
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentIndex].src}
                  alt={listing.title}
                  className="object-cover w-full h-full cursor-pointer transition-transform duration-200 hover:scale-105"
                  onClick={() => openFullscreen(currentIndex)}
                />
                {images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs rounded-full px-3 py-1">
                    {currentIndex + 1} / {images.length}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400 text-4xl">📷</div>
            )}
          </div>
        </div>
        {/* Info right */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white/60 backdrop-blur-lg rounded-lg shadow-md border border-white/20 p-6 flex flex-col gap-3 h-full justify-between">
            <h1 className="text-2xl font-extrabold text-gray-900 break-words leading-tight">{listing.title}</h1>
            <div className="text-xl font-bold text-indigo-600">{listing.price} {listing.currency}</div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigateToSellerProfile?.(listing.userId, listing.sellerName, listing.isCompany)}>
                {listing.isCompany ? <BuildingOfficeIcon className="w-5 h-5 text-blue-500" /> : <UserIcon className="w-5 h-5 text-gray-500" />}
                <span className="font-semibold text-gray-800 hover:underline">{listing.sellerName}</span>
              </div>
              {sellerRating.totalReviews > 0 && (
                <div className="flex items-center gap-1 cursor-pointer text-xs" onClick={handleSellerRatingClick}>
                  <div className="flex gap-0.5">
                    {renderStars(Math.floor(sellerRating.averageRating))}
                  </div>
                  <span className="text-gray-600">
                    {sellerRating.averageRating} ({sellerRating.totalReviews})

                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
              <div className="flex items-center gap-1"><MapPinIcon className="w-3 h-3" />{listing.city}</div>
              <div className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" />Опубликовано {new Date(listing.createdAt).toLocaleDateString('ru-RU')}</div>
              {listing.views !== undefined && <div className="flex items-center gap-1"><EyeIcon className="w-3 h-3" />{listing.views} просмотров</div>}
              <button
                className={`flex items-center gap-1 px-2 py-1 rounded-lg font-semibold transition-all duration-200 border bg-white/40 hover:bg-white/60 border-white/30 text-indigo-700 text-xs ${isFavorite ? 'ring-2 ring-yellow-300' : ''}`}
                onClick={handleFavoriteToggle}
                type="button"
                aria-pressed={isFavorite}
              >
                <StarIcon className={`w-4 h-4 ${isFavorite ? 'text-yellow-400' : 'text-indigo-400'}`} />
                <span className="font-medium">{isFavorite ? 'В избранном' : 'В избранное'}</span>
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-auto">
              <button 
                className="flex-1 bg-indigo-600 text-white font-semibold rounded-lg px-3 py-2 shadow-md hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                onClick={handleContactClick}
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                <span>Связаться</span>
              </button>
              <button className="flex-1 bg-white/60 text-indigo-700 font-semibold rounded-lg px-3 py-2 shadow-md hover:bg-white/80 transition-all duration-200 flex items-center justify-center gap-2 text-sm border border-indigo-100" onClick={handleReviewClick}>
                <StarIcon className="w-4 h-4" />
                <span>Отзыв</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Description & characteristics */}
      {/* Description & characteristics */}
      <div className="max-w-5xl mx-auto mt-4 px-4 flex flex-col md:flex-row gap-4 z-10 relative mb-6">
        <div className="bg-white/60 backdrop-blur-lg rounded-lg shadow-md border border-white/20 p-5 flex-1 min-w-[260px]">
          <h3 className="text-base font-bold mb-2 text-gray-900">Описание</h3>
          <p className="whitespace-pre-line text-sm text-gray-800 bg-white/30 rounded p-3 shadow-inner min-h-[60px]">
            {listing.description || 'Описание отсутствует'}
          </p>
        </div>
        {listing.characteristics && Object.keys(listing.characteristics).length > 0 && (
          <div className="bg-white/60 backdrop-blur-lg rounded-lg shadow-md border border-white/20 p-5 flex-1 min-w-[260px]">
            <h3 className="text-base font-bold mb-2 text-gray-900">Характеристики</h3>
            <div className="grid grid-cols-1 gap-1 bg-white/30 rounded p-3 shadow-inner text-xs">
              {Object.entries(listing.characteristics).map(([key, value]) => (
                <div key={key} className="flex justify-between text-gray-700">
                  <span className="font-medium">{getTranslatedCharacteristic(key)}:</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Fullscreen image modal */}
      {fullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center" onClick={closeFullscreen}>
          <div className="relative w-full max-w-3xl aspect-square flex items-center justify-center p-4">
            <img src={images[currentIndex].src} alt={listing.title} className="object-contain w-full h-full max-h-[90vh]" />
            {images.length > 1 && (
              <>
                <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-3 shadow hover:bg-white z-50 transition-all" onClick={e => { e.stopPropagation(); prevImage(); }}>
                  <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
                </button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-3 shadow hover:bg-white z-50 transition-all" onClick={e => { e.stopPropagation(); nextImage(); }}>
                  <ShareIcon className="w-6 h-6 text-gray-800" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm rounded-full px-4 py-2 z-50">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
            <button className="absolute top-4 right-4 bg-white/80 rounded-full p-3 shadow hover:bg-white z-50 transition-all" onClick={e => { e.stopPropagation(); closeFullscreen(); }}>
              <XMarkIcon className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
      )}
      {/* Модальное окно для отзыва */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={handleCloseReviewModal}
        onSubmit={handleSubmitReview}
        sellerName={listing?.sellerName || ''}
        listingTitle={listing?.title || ''}
      />

      {/* Модальное окно отзывов о продавце */}
      {listing && (
        <SellerReviewsModal
          isOpen={showSellerReviewsModal}
          onClose={() => setShowSellerReviewsModal(false)}
          sellerName={listing.sellerName}
          sellerRating={sellerRating}
          isCompany={listing.isCompany}
        />
      )}

      {/* Модальное окно ограничения отзывов */}
      {listing && (
        <ReviewRestrictionModal
          isOpen={showReviewRestrictionModal}
          onClose={() => setShowReviewRestrictionModal(false)}
          onContactSeller={handleContactSellerForReview}
          sellerName={listing.sellerName}
        />
      )}

      {/* Модальное окно для выбора действий с кнопкой "Поделиться" */}
      {showShareModal && (
        <div className="contact-modal-overlay" onClick={handleCloseShareModal}>
          <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal-header">
              <h3 className="contact-modal-title">{t('listingDetail.shareOptions') || 'Поделиться'}</h3>
              <button className="contact-modal-close" onClick={handleCloseShareModal}>
                <XMarkIcon className="close-icon" />
              </button>
            </div>
            <div className="contact-modal-body">
              <div className="contact-modal-options">
                <button 
                  className="contact-option-button share"
                  onClick={handleCopyLink}
                >
                  <ShareIcon className="contact-option-icon" />
                  <div className="contact-option-content">
                    <span className="contact-option-title">{t('listingDetail.copyLink') || 'Копировать ссылку'}</span>
                    <span className="contact-option-description">{t('listingDetail.copyLinkDescription') || 'Скопировать ссылку на объявление'}</span>
                  </div>
                </button>
                <button 
                  className="contact-option-button report"
                  onClick={handleReportListing}
                >
                  <XMarkIcon className="contact-option-icon" />
                  <div className="contact-option-content">
                    <span className="contact-option-title">{t('listingDetail.reportListing') || 'Пожаловаться на объявление'}</span>
                    <span className="contact-option-description">{t('listingDetail.reportDescription') || 'Сообщить о нарушении'}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно жалобы на объявление */}
      {showReportModal && (
        <div className="modal-overlay" onClick={handleCloseReportModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('listingDetail.reportListing') || 'Пожаловаться на объявление'}</h3>
              <button 
                className="modal-close"
                onClick={handleCloseReportModal}
              >
                <XMarkIcon className="close-icon" />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-message">Выберите причину жалобы:</p>
              <div className="report-reasons-grid">
                <button 
                  className={`report-reason-button ${selectedReportType === 'spam' ? 'selected' : ''}`}
                  onClick={() => handleReportTypeSelect('spam')}
                >
                  <div className="report-reason-icon">🚫</div>
                  <div className="report-reason-content">
                    <span className="report-reason-title">Спам</span>
                    <span className="report-reason-description">Нежелательная реклама</span>
                  </div>
                </button>
                <button 
                  className={`report-reason-button ${selectedReportType === 'inappropriate' ? 'selected' : ''}`}
                  onClick={() => handleReportTypeSelect('inappropriate')}
                >
                  <div className="report-reason-icon">⚠️</div>
                  <div className="report-reason-content">
                    <span className="report-reason-title">Неприемлемый контент</span>
                    <span className="report-reason-description">Оскорбительный материал</span>
                  </div>
                </button>
                <button 
                  className={`report-reason-button ${selectedReportType === 'fraud' ? 'selected' : ''}`}
                  onClick={() => handleReportTypeSelect('fraud')}
                >
                  <div className="report-reason-icon">💸</div>
                  <div className="report-reason-content">
                    <span className="report-reason-title">Мошенничество</span>
                    <span className="report-reason-description">Обман покупателей</span>
                  </div>
                </button>
              </div>
              {selectedReportType && (
                <div className="report-reason-input">
                  <div className="report-reason-label">
                    Дополнительная информация:
                  </div>
                  <textarea
                    id="reportReason"
                    className="report-reason-textarea"
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    rows={3}
                    placeholder="Опишите подробнее причину жалобы"
                  />
                  <button
                    className="report-submit-button bg-indigo-600 text-white rounded-lg px-4 py-2 mt-4 hover:bg-indigo-700 transition-all"
                    onClick={handleReportSubmit}
                  >
                    Отправить жалобу
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Спасибо за жалобу */}
      {showThankYouModal && (
        <div className="modal-overlay" onClick={handleCloseThankYouModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Спасибо!</h3>
              <button className="modal-close" onClick={handleCloseThankYouModal}>
                <XMarkIcon className="close-icon" />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-message">Ваша жалоба отправлена на модерацию.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
