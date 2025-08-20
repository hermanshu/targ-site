import React, { useState } from 'react';
import { 
  ArrowLeftIcon, 
  HeartIcon, 
  ShareIcon, 
  PhoneIcon, 
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserIcon,
  XMarkIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Listing } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { useIsMobile } from '../hooks/useIsMobile';
import { useListingImages } from '../hooks/useListingImages';

interface ListingDetailViewProps {
  listing: Listing;
  onBack: () => void;
  onFavoriteToggle: (listing: Listing) => void;
  isFavorite: boolean;
  onNavigateToMessages?: (listing: Listing) => void;
  onNavigateToProfile?: (mode?: 'signin' | 'signup') => void;
  onNavigateToSellerProfile?: (sellerId: string, sellerName: string, isCompany: boolean) => void;
}

const ListingDetailView: React.FC<ListingDetailViewProps> = ({
  listing,
  onBack,
  onFavoriteToggle,
  isFavorite,
  onNavigateToMessages,
  onNavigateToProfile,
  onNavigateToSellerProfile
}) => {

  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [animateHeart, setAnimateHeart] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Используем хук для работы с изображениями
  const {
    currentIndex,
    totalImages,
    nextImage,
    prevImage,
    getImageSrc,
    hasMultipleImages
  } = useListingImages({ imageName: listing.imageName });

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

  // Функция для перевода значений характеристик
  const getTranslatedCharacteristicValue = (key: string, value: string): string => {
    // Переводы для состояния товара
    if (key === 'condition') {
      const conditionMapping: { [key: string]: string } = {
        // Английские ключи
        'new': t('listings.conditionNew'),
        'likenew': t('listings.conditionLikeNew'),
        'good': t('listings.conditionGood'),
        'fair': t('listings.conditionFair'),
        'excellent': t('listings.conditionExcellent'),
        'needsrepair': t('listings.conditionNeedsRepair'),
        // Русские значения
        'новое': t('listings.conditionNew'),
        'как новое': t('listings.conditionLikeNew'),
        'хорошее': t('listings.conditionGood'),
        'удовлетворительное': t('listings.conditionFair'),
        'отличное': t('listings.conditionExcellent'),
        'требует ремонта': t('listings.conditionNeedsRepair'),
        // Сербские значения
        'novo': t('listings.conditionNew'),
        'kao novo': t('listings.conditionLikeNew'),
        'dobro': t('listings.conditionGood'),
        'zadovoljavajuće': t('listings.conditionFair'),
        'odlično': t('listings.conditionExcellent'),
        'potreban popravak': t('listings.conditionNeedsRepair'),
      };
      return conditionMapping[value.toLowerCase()] || value;
    }

    // Переводы для гарантии
    if (key === 'warranty') {
      const warrantyMapping: { [key: string]: string } = {
        // Английские ключи
        'yes': t('listings.warrantyYes'),
        'no': t('listings.warrantyNo'),
        'expired': t('listings.warrantyExpired'),
        // Русские значения
        'есть': t('listings.warrantyYes'),
        'нет': t('listings.warrantyNo'),
        'истекла': t('listings.warrantyExpired'),
        // Сербские значения
        'da': t('listings.warrantyYes'),
        'ne': t('listings.warrantyNo'),
        'istekla': t('listings.warrantyExpired'),
      };
      return warrantyMapping[value.toLowerCase()] || value;
    }

    // Переводы для типа топлива
    if (key === 'fuelType') {
      const fuelMapping: { [key: string]: string } = {
        // Английские ключи
        'petrol': t('listings.fuelTypePetrol'),
        'diesel': t('listings.fuelTypeDiesel'),
        'electric': t('listings.fuelTypeElectric'),
        'hybrid': t('listings.fuelTypeHybrid'),
        // Русские значения
        'бензин': t('listings.fuelTypePetrol'),
        'дизель': t('listings.fuelTypeDiesel'),
        'электро': t('listings.fuelTypeElectric'),
        'гибрид': t('listings.fuelTypeHybrid'),
        // Сербские значения
        'benzin': t('listings.fuelTypePetrol'),
        'dizel': t('listings.fuelTypeDiesel'),
        'elektro': t('listings.fuelTypeElectric'),
        'hibrid': t('listings.fuelTypeHybrid'),
      };
      return fuelMapping[value.toLowerCase()] || value;
    }

    // Переводы для коробки передач
    if (key === 'transmission') {
      const transmissionMapping: { [key: string]: string } = {
        // Английские ключи
        'manual': t('listings.transmissionManual'),
        'automatic': t('listings.transmissionAutomatic'),
        'robot_en': t('listings.transmissionRobot'),
        'cvt': t('listings.transmissionCVT'),
        // Русские значения
        'механика': t('listings.transmissionManual'),
        'автомат': t('listings.transmissionAutomatic'),
        'робот': t('listings.transmissionRobot'),
        'вариатор': t('listings.transmissionCVT'),
        // Сербские значения
        'manuelni': t('listings.transmissionManual'),
        'automatski': t('listings.transmissionAutomatic'),
        'robot_sr': t('listings.transmissionRobot'),
        'cvt_sr': t('listings.transmissionCVT'),
      };
      return transmissionMapping[value.toLowerCase()] || value;
    }

    // Переводы для типа недвижимости
    if (key === 'propertyType') {
      const propertyMapping: { [key: string]: string } = {
        // Английские ключи
        'apartment': t('listings.propertyTypeApartment'),
        'house': t('listings.propertyTypeHouse'),
        'commercial': t('listings.propertyTypeCommercial'),
        'land': t('listings.propertyTypeLand'),
        // Русские значения
        'квартира': t('listings.propertyTypeApartment'),
        'дом': t('listings.propertyTypeHouse'),
        'коммерческая': t('listings.propertyTypeCommercial'),
        'земля': t('listings.propertyTypeLand'),
        // Сербские значения
        'stan': t('listings.propertyTypeApartment'),
        'kuća': t('listings.propertyTypeHouse'),
        'komercijalna': t('listings.propertyTypeCommercial'),
        'zemlja': t('listings.propertyTypeLand'),
      };
      return propertyMapping[value.toLowerCase()] || value;
    }

    // Для остальных характеристик возвращаем значение как есть
    return value;
  };

  const handleFavoriteClick = () => {
    setAnimateHeart(true);
    onFavoriteToggle(listing);
    setTimeout(() => setAnimateHeart(false), 350);
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
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(dateObj);
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const handleContactClick = () => {
    // Проверяем авторизацию
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (listing.contactMethod === 'chat') {
      // Если продавец разрешил только чат, сразу переходим к сообщениям
      if (onNavigateToMessages) {
        onNavigateToMessages(listing);
      }
    } else if (listing.contactMethod === 'phone') {
      // Если продавец разрешил только звонки, показываем модальное окно с выбором
      setShowContactModal(true);
    } else {
      // Если не указан способ связи, показываем модальное окно с выбором
      setShowContactModal(true);
    }
  };

  const handlePhoneCall = () => {
    setShowContactModal(false);
    // Здесь можно добавить логику для звонка
    window.alert(`${t('listingDetail.call')} ${listing.sellerName}`);
  };

  const handleStartChat = () => {
    setShowContactModal(false);
    if (onNavigateToMessages) {
      onNavigateToMessages(listing);
    }
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleAuthAction = (action: 'signin' | 'signup') => {
    setShowAuthModal(false);
    if (onNavigateToProfile) {
      onNavigateToProfile(action);
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
      const listingUrl = `${window.location.origin}/listing/${listing.id}`;
      await navigator.clipboard.writeText(listingUrl);
      
      // Показываем уведомление об успешном копировании
      alert(t('listingDetail.linkCopied'));
      setShowShareModal(false);
    } catch (error) {
      console.error('Ошибка при копировании ссылки:', error);
      alert(t('listingDetail.copyError'));
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
      setSuccessMessage(`${t('listingDetail.reportSent')} ${selectedReportType}`);
      setShowSuccessModal(true);
      setReportReason('');
      setSelectedReportType('');
      setTimeout(() => setShowSuccessModal(false), 2000);
    }
  };

  // Функции для полноэкранного просмотра фото
  const handleImageClick = () => {
    if (listing.imageName) {
      setShowFullscreenImage(true);
    }
  };

  const handleCloseFullscreen = () => {
    setShowFullscreenImage(false);
  };

  const handleNextImage = () => {
    nextImage();
  };

  const handlePrevImage = () => {
    prevImage();
  };

  // Функции для листания фото на странице
  const handlePrevPhoto = () => {
    prevImage();
  };

  const handleNextPhoto = () => {
    nextImage();
  };

  // Функции для свайпов на мобильной версии
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextPhoto();
    }
    if (isRightSwipe) {
      handlePrevPhoto();
    }

    // Сброс значений
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showFullscreenImage) {
      if (e.key === 'Escape') {
        handleCloseFullscreen();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      }
    } else {
      // Листание фото на странице для объявлений с множественными изображениями
      if (hasMultipleImages) {
        if (e.key === 'ArrowRight') {
          handleNextPhoto();
        } else if (e.key === 'ArrowLeft') {
          handlePrevPhoto();
        }
      }
    }
  };

  return (
            <div 
          className={`listing-detail-container ${isMobile ? 'mobile' : 'desktop'}`} 
          onKeyDown={handleKeyDown} 
          tabIndex={0}
          role="main"
          aria-label="Детали объявления"
        >
      {/* Верхняя панель с кнопками */}
      <div className="detail-header">
        <button 
          className="back-button" 
          onClick={onBack}
          aria-label="Назад к списку объявлений"
        >
          <ArrowLeftIcon className="back-icon" />
        </button>
        <div className="detail-actions">
          <button 
            className="action-button" 
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
          >
            {isFavorite ? (
              <HeartIconSolid className={`action-icon ${animateHeart ? 'heart-animate' : ''}`} />
            ) : (
              <HeartIcon className="action-icon" />
            )}
          </button>
          <button 
            className="action-button" 
            onClick={handleShareClick}
            aria-label="Поделиться объявлением"
          >
            <ShareIcon className="action-icon" />
          </button>
        </div>
      </div>

      {/* Основной контент */}
      <div className="detail-main-content">
        {/* Левая колонка с изображением */}
        <div className="detail-image-section">
          <div 
            className="detail-image-container" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleImageClick();
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {listing.imageName ? (
              <img 
                src={getImageSrc()}
                alt={listing.title}
                className="detail-image"
                onClick={handleImageClick}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`detail-image-placeholder ${listing.imageName ? 'hidden' : ''}`}>
              <div className="placeholder-icon-large">📷</div>
              <span>{t('listingDetail.noPhoto')}</span>
            </div>
            {listing.imageName && (
              <>
                <div className="image-overlay" onClick={handleImageClick}>
                </div>
                
                {/* Кнопки навигации по фото для объявлений с множественными изображениями */}
                {hasMultipleImages && (
                  <>
                                          <button 
                        className="photo-nav-button prev" 
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                      >
                        <ChevronLeftIcon className="photo-nav-icon" />
                      </button>
                      
                      <button 
                        className="photo-nav-button next" 
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                      >
                        <ChevronRightIcon className="photo-nav-icon" />
                      </button>
                      
                      {/* Индикатор фото */}
                      <div className="photo-indicator">
                        <span className="photo-counter">
                          {currentIndex + 1} / {totalImages}
                        </span>
                      </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Основная информация в одном контейнере */}
        <div className="detail-main-info">
          {/* Заголовок и цена */}
          <div className="detail-title-section">
            <h1 className="detail-title">{listing.title}</h1>
            <div className="detail-price">
              {listing.price} {listing.currency}
              {(listing.category === 'work' || listing.category === 'vacancies' || listing.subcategory === 'vacancies' || listing.subcategory === 'rent') && ' / месяц'}
            </div>
          </div>

          {/* Информация о продавце */}
          <div className="seller-info">
            <div className="seller-avatar">
              {listing.isCompany ? (
                <BuildingOfficeIcon className="seller-icon" />
              ) : (
                <UserIcon className="seller-icon" />
              )}
            </div>
            <div className="seller-details">
              <div 
                className="seller-name clickable"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onNavigateToSellerProfile?.(listing.userId, listing.sellerName, listing.isCompany);
                }}
                style={{ cursor: 'pointer' }}
              >
                {listing.sellerName}
              </div>
              <div className="seller-type">
                {listing.isCompany ? t('listingDetail.company') : t('listingDetail.individual')}
              </div>
            </div>
            <button 
              className="contact-button"
              onClick={handleContactClick}
            >
              <ChatBubbleLeftRightIcon className="contact-icon" />
              <span className="contact-text">
                {listing.contactMethod === 'chat' ? t('listingDetail.write') : t('listingDetail.contactSeller')}
              </span>
            </button>
          </div>

          {/* Локация и дата */}
          <div className="detail-meta">
            <div className="meta-item">
              <MapPinIcon className="meta-icon" />
              <span>{listing.city}</span>
            </div>
            <div className="meta-item">
              <CalendarIcon className="meta-icon" />
              <span>{t('listingDetail.published')} {formatDate(listing.createdAt)}</span>
            </div>
            {listing.views !== undefined && (
              <div className="meta-item">
                <EyeIcon className="meta-icon" data-icon="eye" />
                <span>{formatViews(listing.views)} {t('listingDetail.views')}</span>
              </div>
            )}
          </div>

          {/* Категория и доставка */}
          <div className="detail-category-delivery">
            {/* Категория */}
            <div className="detail-category">
              <span className="category-label">{t('listings.category')}:</span>
              <span className="category-value">{getTranslatedCategory(listing.category)}</span>
            </div>

            {/* Способ доставки - не показываем для категорий "Работа", "Вакансии" и "Недвижимость" */}
            {listing.delivery && listing.category !== 'work' && listing.category !== 'vacancies' && listing.category !== 'realEstate' && (
              <div className="detail-delivery">
                <span className="delivery-label">{t('listingDetail.delivery')}:</span>
                <span className="delivery-value">
                  {listing.delivery === 'pickup' ? t('listingDetail.pickup') : t('listingDetail.sellerDelivery')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Характеристики и описание в одном контейнере */}
        <div className="detail-info-section">
          {/* Левый столбец - описание */}
          <div className="detail-description">
            <h3 className="description-title">{t('listingDetail.description')}</h3>
            <p className="description-text">
              {listing.description || `Прекрасный винтажный комод с зеркалом в отличном состоянии. Изготовлен из качественного дерева, имеет классический дизайн, который подойдет к любому интерьеру. 

Комод имеет 3 просторных ящика для хранения вещей, верхняя часть с зеркалом идеально подходит для косметики и украшений. Все механизмы работают исправно, поверхность в хорошем состоянии.

Размеры: 120x45x85 см. Подходит для спальни, прихожей или гостиной. Товар можно забрать в удобное время или договориться о доставке.`}
            </p>
          </div>

          {/* Правый столбец - характеристики */}
          {listing.characteristics && Object.keys(listing.characteristics).length > 0 && (
            <div className="detail-characteristics">
              <h3 className="characteristics-title">{t('listingDetail.characteristics')}</h3>
              <div className="characteristics-list">
                {Object.entries(listing.characteristics).map(([key, value]) => (
                  <div key={key} className="characteristic-item">
                    <span className="characteristic-label">{getTranslatedCharacteristic(key)}:</span>
                    <span className="characteristic-value">{getTranslatedCharacteristicValue(key, value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно выбора способа связи */}
      {showContactModal && (
        <div className="contact-modal-overlay" onClick={handleCloseModal}>
          <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal-header">
              <h3 className="contact-modal-title">{t('listingDetail.contactSeller')}</h3>
              <button className="contact-modal-close" onClick={handleCloseModal}>
                <XMarkIcon className="close-icon" />
              </button>
            </div>
            <div className="contact-modal-body">
              <p className="contact-modal-description">
                {t('listingDetail.chooseContactMethod')}
              </p>
              <div className="contact-modal-options">
                <button 
                  className="contact-option-button phone"
                  onClick={handlePhoneCall}
                >
                  <PhoneIcon className="contact-option-icon" />
                  <div className="contact-option-content">
                    <span className="contact-option-title">{t('listingDetail.call')}</span>
                    <span className="contact-option-description">{t('listingDetail.directCall')}</span>
                  </div>
                </button>
                <button 
                  className="contact-option-button chat"
                  onClick={handleStartChat}
                >
                  <ChatBubbleLeftRightIcon className="contact-option-icon" />
                  <div className="contact-option-content">
                    <span className="contact-option-title">{t('listingDetail.writeMessage')}</span>
                    <span className="contact-option-description">{t('listingDetail.openChat')}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно авторизации */}
      {showAuthModal && (
        <div className="contact-modal-overlay" onClick={handleCloseAuthModal}>
          <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal-header">
              <h3 className="contact-modal-title">{t('listingDetail.authRequired')}</h3>
              <button className="contact-modal-close" onClick={handleCloseAuthModal}>
                <XMarkIcon className="close-icon" />
              </button>
            </div>
            <div className="contact-modal-body">
              <p className="contact-modal-description">
                {t('listingDetail.authRequiredDescription')}
              </p>
              <div className="contact-modal-options">
                <button 
                  className="contact-option-button signin"
                  onClick={() => handleAuthAction('signin')}
                >
                  <UserIcon className="contact-option-icon" />
                  <div className="contact-option-content">
                    <span className="contact-option-title">{t('listingDetail.signIn')}</span>
                    <span className="contact-option-description">{t('listingDetail.signInDescription')}</span>
                  </div>
                </button>
                <button 
                  className="contact-option-button signup"
                  onClick={() => handleAuthAction('signup')}
                >
                  <BuildingOfficeIcon className="contact-option-icon" />
                  <div className="contact-option-content">
                    <span className="contact-option-title">{t('listingDetail.signUp')}</span>
                    <span className="contact-option-description">{t('listingDetail.signUpDescription')}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для выбора действий с кнопкой "Поделиться" */}
      {showShareModal && (
        <div className="contact-modal-overlay" onClick={handleCloseShareModal}>
          <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal-header">
              <h3 className="contact-modal-title">{t('listingDetail.shareOptions')}</h3>
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
                    <span className="contact-option-title">{t('listingDetail.copyLink')}</span>
                    <span className="contact-option-description">{t('listingDetail.copyLinkDescription')}</span>
                  </div>
                </button>
                <button 
                  className="contact-option-button report"
                  onClick={handleReportListing}
                >
                  <XMarkIcon className="contact-option-icon" />
                  <div className="contact-option-content">
                    <span className="contact-option-title">{t('listingDetail.reportListing')}</span>
                    <span className="contact-option-description">{t('listingDetail.reportDescription')}</span>
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
              <h3 className="modal-title">{t('listingDetail.reportListing')}</h3>
              <button 
                className="modal-close"
                onClick={handleCloseReportModal}
              >
                <XMarkIcon className="close-icon" />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-message">{t('favorites.selectReportReason')}</p>
              
              <div className="report-reasons-grid">
                <button 
                  className={`report-reason-button ${selectedReportType === 'spam' ? 'selected' : ''}`}
                  onClick={() => handleReportTypeSelect('spam')}
                >
                  <div className="report-reason-icon">🚫</div>
                  <div className="report-reason-content">
                    <span className="report-reason-title">{t('favorites.reportSpam')}</span>
                    <span className="report-reason-description">{t('favorites.reportSpamDesc')}</span>
                  </div>
                </button>
                
                <button 
                  className={`report-reason-button ${selectedReportType === 'inappropriate' ? 'selected' : ''}`}
                  onClick={() => handleReportTypeSelect('inappropriate')}
                >
                  <div className="report-reason-icon">⚠️</div>
                  <div className="report-reason-content">
                    <span className="report-reason-title">{t('favorites.reportInappropriate')}</span>
                    <span className="report-reason-description">{t('favorites.reportInappropriateDesc')}</span>
                  </div>
                </button>
                
                <button 
                  className={`report-reason-button ${selectedReportType === 'harassment' ? 'selected' : ''}`}
                  onClick={() => handleReportTypeSelect('harassment')}
                >
                  <div className="report-reason-icon">😡</div>
                  <div className="report-reason-content">
                    <span className="report-reason-title">{t('favorites.reportHarassment')}</span>
                    <span className="report-reason-description">{t('favorites.reportHarassmentDesc')}</span>
                  </div>
                </button>
                
                <button 
                  className={`report-reason-button ${selectedReportType === 'fraud' ? 'selected' : ''}`}
                  onClick={() => handleReportTypeSelect('fraud')}
                >
                  <div className="report-reason-icon">💸</div>
                  <div className="report-reason-content">
                    <span className="report-reason-title">{t('favorites.reportFraud')}</span>
                    <span className="report-reason-description">{t('favorites.reportFraudDesc')}</span>
                  </div>
                </button>
                
                <button 
                  className={`report-reason-button ${selectedReportType === 'other' ? 'selected' : ''}`}
                  onClick={() => handleReportTypeSelect('other')}
                >
                  <div className="report-reason-icon">❓</div>
                  <div className="report-reason-content">
                    <span className="report-reason-title">{t('favorites.reportOther')}</span>
                    <span className="report-reason-description">{t('favorites.reportOtherDesc')}</span>
                  </div>
                </button>
              </div>
              
              {selectedReportType && (
                <div className="report-details">
                  <textarea
                    className="modal-textarea"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder={t('favorites.enterReportDetails')}
                    rows={3}
                  />
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button 
                className="modal-button secondary"
                onClick={handleCloseReportModal}
              >
                {t('favorites.cancel')}
              </button>
              <button 
                className="modal-button primary"
                onClick={handleReportSubmit}
                disabled={!selectedReportType || !reportReason.trim()}
              >
                {t('favorites.send')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно успеха */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content success" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <div className="success-icon">✓</div>
              <p className="modal-message">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Полноэкранный просмотр фото */}
      {showFullscreenImage && (
        <div className="fullscreen-image-overlay" onClick={handleCloseFullscreen}>
          <div className="fullscreen-image-container" onClick={(e) => e.stopPropagation()}>
            <img 
              src={getImageSrc()}
              alt={listing.title}
              className="fullscreen-image"
            />
            
            {/* Кнопки навигации */}
            <button className="fullscreen-nav-button prev" onClick={handlePrevImage}>
              <ChevronLeftIcon className="fullscreen-nav-icon" />
            </button>
            <button className="fullscreen-nav-button next" onClick={handleNextImage}>
              <ChevronRightIcon className="fullscreen-nav-icon" />
            </button>
            
            {/* Кнопка закрытия */}
            <button className="fullscreen-close-button" onClick={handleCloseFullscreen}>
              <XMarkIcon className="fullscreen-close-icon" />
            </button>
            
            {/* Индикатор изображений */}
            <div className="fullscreen-indicator">
              <span className="fullscreen-counter">
                {currentIndex + 1} / {totalImages}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetailView; 