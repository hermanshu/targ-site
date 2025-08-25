import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon, 
  MapPinIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  ShareIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useParams, useNavigate } from 'react-router-dom';
import { useListingData } from './useListingData';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useTranslation } from '../../hooks/useTranslation';
import { useListingImages } from '../../hooks/useListingImages';
import { useAuth } from '../../contexts/AuthContext';
import { useReviews } from '../../contexts/ReviewsContext';
import { useDialogs } from '../../contexts/DialogsContext';
import { SeoMeta } from './SeoMeta';
import { Gallery } from './Hero/Gallery';
import { ActionBar } from './Hero/ActionBar';
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
  
  // Используем ID из пропсов или из URL параметров
  const id = listingId || params.id || '';
  
  const { listing, loading, error } = useListingData(id);

  // Используем хук для правильной сборки изображений
  const { images: galleryImages } = useListingImages({
    images: listing?.images,          // новая схема (если есть)
    imageName: listing?.imageName     // fallback по MULTI_IMAGE_CONFIG
  });

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
      
      console.log('listing:', listing);
      console.log('listingForMessages:', listingForMessages);
      
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

  return (
    <>
      <SeoMeta listing={listing} />
      
      <div className={`listing-detail-container ${isMobile ? 'mobile' : 'desktop'}`}>
        {/* Верхняя панель с кнопками */}
        <div className="detail-header">
          <button 
            className="back-button" 
            onClick={handleBack}
            aria-label="Назад к списку объявлений"
          >
            <ArrowLeftIcon className="back-icon" />
          </button>
          <ActionBar
            id={listing.id}
            isFav={isFavorite}
            onFavoriteToggle={handleFavoriteToggle}
            onShareClick={handleShareClick}
          />
        </div>

        {/* Основной контент */}
        <div className="detail-main-content">
          {/* Левая колонка с изображением */}
          <div className="detail-image-section">
            <Gallery images={galleryImages} />
          </div>

          {/* Основная информация в одном контейнере */}
          <div className="detail-main-info">
            {/* Заголовок и цена */}
            <div className="detail-title-section">
              <h1 className="detail-title">{listing.title}</h1>
              <div className="detail-price">
                <span className="price-amount">{listing.price}</span>
                <span className="price-currency">{listing.currency}</span>
                {(listing.category === 'work' || listing.category === 'vacancies' || listing.subcategory === 'vacancies' || listing.subcategory === 'rent') && (
                  <span className="price-period"> / месяц</span>
                )}
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
                  onClick={() => onNavigateToSellerProfile?.(listing.userId, listing.sellerName, listing.isCompany)}
                  style={{ cursor: 'pointer' }}
                >
                  {listing.sellerName}
                </div>
                <div className="seller-type">
                  {listing.isCompany ? 'Компания' : 'Частное лицо'}
                </div>
                
                {/* Рейтинг продавца */}
                {sellerRating.totalReviews > 0 && (
                  <div 
                    className="seller-rating-info clickable"
                    onClick={handleSellerRatingClick}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="rating-stars">
                      {'⭐'.repeat(Math.floor(sellerRating.averageRating))}
                      {'☆'.repeat(5 - Math.floor(sellerRating.averageRating))}
                    </div>
                    <span className="rating-text">
                      {sellerRating.averageRating} ({sellerRating.totalReviews} отзывов)
                    </span>
                  </div>
                )}
              </div>
              <div className="seller-actions">
                <button 
                  className="contact-button"
                  onClick={handleContactClick}
                >
                  <ChatBubbleLeftRightIcon className="contact-icon" />
                  <span className="contact-text">
                    {listing.contactMethod === 'chat' ? 'Написать' : 'Связаться'}
                  </span>
                </button>
                
                {/* Кнопка оставить отзыв */}
                <button 
                  className="review-button"
                  onClick={handleReviewClick}
                >
                  <StarIcon className="review-icon" />
                  <span className="review-text">Отзыв</span>
                </button>
              </div>
            </div>

            {/* Мета-информация */}
            <div className="detail-meta">
              <div className="meta-item">
                <MapPinIcon className="meta-icon" />
                <span>{listing.city}</span>
              </div>
              <div className="meta-item">
                <CalendarIcon className="meta-icon" />
                <span>Опубликовано {new Date(listing.createdAt).toLocaleDateString('ru-RU')}</span>
              </div>
              {listing.views !== undefined && (
                <div className="meta-item">
                  <EyeIcon className="meta-icon" />
                  <span>{listing.views} просмотров</span>
                </div>
              )}
            </div>

            {/* Категория и доставка на отдельной строке */}
            <div className="detail-category-delivery">
              {/* Категория */}
              <div className="category-delivery-item">
                <span className="category-label">Категория:</span>
                <span className="category-value">{getTranslatedCategory(listing.category)}</span>
              </div>

              {/* Способ доставки - не показываем для категорий "Работа", "Вакансии" и "Недвижимость" */}
              {listing.delivery && listing.category !== 'work' && listing.category !== 'vacancies' && listing.category !== 'realEstate' && (
                <div className="category-delivery-item">
                  <span className="delivery-label">Доставка:</span>
                  <span className="delivery-value">
                    {listing.delivery === 'pickup' ? 'Самовывоз' : 'Доставка продавцом'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Характеристики и описание в одном контейнере */}
          <div className="detail-info-section">
            {/* Левый столбец - описание */}
            <div className="detail-description">
              <h3 className="description-title">Описание</h3>
              <p className="description-text">
                {listing.description || `Прекрасный винтажный комод с зеркалом в отличном состоянии. Изготовлен из качественного дерева, имеет классический дизайн, который подойдет к любому интерьеру. 

Комод имеет 3 просторных ящика для хранения вещей, верхняя часть с зеркалом идеально подходит для косметики и украшений. Все механизмы работают исправно, поверхность в хорошем состоянии.

Размеры: 120x45x85 см. Подходит для спальни, прихожей или гостиной. Товар можно забрать в удобное время или договориться о доставке.`}
              </p>
            </div>

            {/* Правый столбец - характеристики */}
            {listing.characteristics && Object.keys(listing.characteristics).length > 0 && (
              <div className="detail-characteristics">
                <h3 className="characteristics-title">Характеристики</h3>
                <div className="characteristics-list">
                  {Object.entries(listing.characteristics).map(([key, value]) => (
                    <div key={key} className="characteristic-item">
                      <span className="characteristic-label">{getTranslatedCharacteristic(key)}:</span>
                      <span className="characteristic-value">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>


      </div>

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
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Опишите проблему подробнее..."
                    className="report-reason-textarea"
                    rows={3}
                  />
                </div>
              )}

              <div className="modal-actions">
                <button 
                  className="modal-button cancel"
                  onClick={handleCloseReportModal}
                >
                  Отмена
                </button>
                <button 
                  className="modal-button submit"
                  onClick={handleReportSubmit}
                  disabled={!selectedReportType || !reportReason.trim()}
                >
                  Отправить жалобу
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно благодарности за жалобу */}
      {showThankYouModal && (
        <div className="modal-overlay" onClick={handleCloseThankYouModal}>
          <div className="modal-content thank-you-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Спасибо за обращение!</h3>
              <button 
                className="modal-close"
                onClick={handleCloseThankYouModal}
              >
                <XMarkIcon className="close-icon" />
              </button>
            </div>
            <div className="modal-body">
              <div className="thank-you-content">
                <div className="thank-you-icon">✅</div>
                <p className="thank-you-message">
                  Ваша жалоба успешно отправлена. Мы рассмотрим её в ближайшее время и примем необходимые меры.
                </p>
                <p className="thank-you-note">
                  Спасибо, что помогаете сделать нашу платформу лучше!
                </p>
              </div>
              <div className="modal-actions">
                <button 
                  className="modal-button submit"
                  onClick={handleCloseThankYouModal}
                >
                  Понятно
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 