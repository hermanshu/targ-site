import React, { useState } from 'react';
import { 
  ArrowLeftIcon, 
  MapPinIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useParams, useNavigate } from 'react-router-dom';
import { useListingData } from './useListingData';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useTranslation } from '../../hooks/useTranslation';
import { useListingImages } from '../../hooks/useListingImages';
import { SeoMeta } from './SeoMeta';
import { Gallery } from './Hero/Gallery';
import { ActionBar } from './Hero/ActionBar';
import ReviewModal from '../ReviewModal';

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
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Используем ID из пропсов или из URL параметров
  const id = listingId || params.id || '';
  
  const { listing, loading, error } = useListingData(id);

  // Используем хук для правильной сборки изображений
  const { images: galleryImages } = useListingImages({
    images: listing?.images,          // новая схема (если есть)
    imageName: listing?.imageName     // fallback по MULTI_IMAGE_CONFIG
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
    // TODO: Добавить логику поделиться
    console.log('Share listing:', listing?.id);
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
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    // TODO: Добавить реальную логику отправки отзыва
    console.log('Submitting review:', { rating, comment, listingId: listing?.id });
    
    // Модальное окно само покажет благодарность и закроется
    // Никаких дополнительных alert'ов не нужно
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
                <div className="seller-rating-info">
                  <div className="rating-stars">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <span className="rating-text">
                    Рейтинг продавца
                  </span>
                </div>
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
    </>
  );
}; 