import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  CameraIcon,
  XMarkIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  TagIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { useListings } from '../contexts/ListingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { Listing } from '../types';

interface FormData {
  title: string;
  description: string;
  price: string;
  currency: 'EUR' | 'RSD';
  category: string;
  subcategory: string;
  location: string;
  images: File[];
  contactMethod: 'phone' | 'chat';
  delivery?: 'pickup' | 'delivery';
  characteristics: Record<string, string>;
}

interface EditListingViewProps {
  listing: Listing;
  onBack: () => void;
}

const EditListingView: React.FC<EditListingViewProps> = ({ listing, onBack }) => {
  const { updateListing } = useListings();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    title: listing.title,
    description: listing.description || '',
    price: listing.price,
    currency: listing.currency as 'EUR' | 'RSD',
    category: listing.category,
    subcategory: listing.subcategory || '',
    location: listing.city,
    images: [],
    contactMethod: listing.contactMethod as 'phone' | 'chat' || 'chat',
    characteristics: listing.characteristics || {}
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Инициализация существующих изображений
  useEffect(() => {
    if (listing.imageName) {
      setExistingImages([`/images/${listing.imageName}.jpg`]);
    }
  }, [listing.imageName]);

  const categories = [
    { value: 'electronics', label: t('home.electronics'), emoji: '📱' },
    { value: 'homeAndGarden', label: t('home.homeAndGarden'), emoji: '🏠' },
    { value: 'fashion', label: t('home.fashion'), emoji: '👕' },
    { value: 'services', label: t('home.services'), emoji: '🔧' },
    { value: 'work', label: t('home.work'), emoji: '💼', hasSubcategories: true },
    { value: 'realEstate', label: t('home.realEstate'), emoji: '🏢', hasSubcategories: true },
    { value: 'plants', label: t('home.plants'), emoji: '✨' },
    { value: 'transport', label: t('home.transport'), emoji: '🚗' },
    { value: 'sport', label: t('home.sport'), emoji: '⚽' },
    { value: 'books', label: t('home.books'), emoji: '📚' },
    { value: 'kids', label: t('home.kids'), emoji: '👶' },
    { value: 'furniture', label: t('home.furniture'), emoji: '🪑' },
    { value: 'hobby', label: t('home.hobby'), emoji: '🎨' },
    { value: 'animals', label: t('home.animals'), emoji: '🐾' },
    { value: 'construction', label: t('home.construction'), emoji: '🔨' },
    { value: 'free', label: t('home.free'), emoji: '🎁' },
    { value: 'otherCategories', label: t('home.other'), emoji: '📦' }
  ];

  const cities = [
    "Белград", "Нови Сад", "Ниш", "Крагуевац", "Суботица",
    "Зренянин", "Панчево", "Чачак", "Кралево", "Нови Пазар",
    "Крушевац", "Ужице", "Вране", "Шабац", "Сомбор",
    "Пожаревац", "Смедерево", "Лесковац", "Валево", "Кикинда",
    "Вршац", "Бор", "Прокупле", "Сремска Митровица", "Ягодина",
    "Лозница", "Приеполе", "Пирот", "Златибор", "Копаоник"
  ];

  const subcategories = {
    work: [
      { value: 'vacancies', label: t('home.vacancies'), emoji: '👥' },
      { value: 'resume', label: t('home.resume'), emoji: '💼' }
    ],
    realEstate: [
      { value: 'rent', label: t('home.rent'), emoji: '🏠' },
      { value: 'sale', label: t('home.sale'), emoji: '🏢' }
    ]
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles]
      }));

      // Создаем превью для новых изображений
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviewUrls(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('addListing.errors.titleRequired');
    }

    if (!formData.price.trim()) {
      newErrors.price = t('addListing.errors.priceRequired');
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = t('addListing.errors.priceInvalid');
    }

    if (!formData.category) {
      newErrors.category = t('addListing.errors.categoryRequired');
    }

    if (!formData.location) {
      newErrors.location = t('addListing.errors.locationRequired');
    }

    if (formData.category === 'work' && !formData.subcategory) {
      newErrors.subcategory = t('addListing.errors.subcategoryRequired');
    }

    if (formData.category === 'realEstate' && !formData.subcategory) {
      newErrors.subcategory = t('addListing.errors.subcategoryRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Генерируем новое имя для изображения, если оно было загружено
      let newImageName = listing.imageName;
      if (formData.images.length > 0) {
        newImageName = `listing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      const updatedListing = {
        ...listing,
        title: formData.title,
        description: formData.description,
        price: formData.price,
        currency: formData.currency,
        category: formData.category,
        subcategory: formData.subcategory,
        city: formData.location,
        imageName: newImageName,
        contactMethod: formData.contactMethod,
        characteristics: formData.characteristics,
        updatedAt: new Date()
      };

      await updateListing(listing.id, updatedListing);
      
      // Здесь можно добавить логику для сохранения новых изображений
      // Пока просто показываем успешное сообщение
      alert(t('editListing.success'));
      onBack();
      
    } catch (error) {
      console.error('Error updating listing:', error);
      alert(t('editListing.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);
  const hasSubcategories = selectedCategory?.hasSubcategories;

  return (
    <div className="edit-listing-container">
      <div className="edit-listing-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeftIcon className="back-icon" />
          {t('common.back')}
        </button>
        <h1 className="edit-listing-title">{t('editListing.title')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="edit-listing-form">
        {/* Название */}
        <div className="form-group">
          <label className="form-label">
            <DocumentTextIcon className="form-icon" />
            {t('addListing.title')} *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder={t('addListing.titlePlaceholder')}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        {/* Описание */}
        <div className="form-group">
          <label className="form-label">
            <DocumentTextIcon className="form-icon" />
            {t('addListing.description')}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="form-textarea"
            placeholder={t('addListing.descriptionPlaceholder')}
            rows={4}
          />
        </div>

        {/* Цена и валюта */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <CurrencyDollarIcon className="form-icon" />
              {t('addListing.price')} *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className={`form-input ${errors.price ? 'error' : ''}`}
              placeholder="0"
              min="0"
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{t('addListing.currency')}</label>
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="form-select"
            >
              <option value="EUR">EUR</option>
              <option value="RSD">RSD</option>
            </select>
          </div>
        </div>

        {/* Категория */}
        <div className="form-group">
          <label className="form-label">
            <TagIcon className="form-icon" />
            {t('addListing.category')} *
          </label>
          <select
            value={formData.category}
            onChange={(e) => {
              handleInputChange('category', e.target.value);
              handleInputChange('subcategory', '');
            }}
            className={`form-select ${errors.category ? 'error' : ''}`}
          >
            <option value="">{t('addListing.selectCategory')}</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.emoji} {category.label}
              </option>
            ))}
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        {/* Подкатегория */}
        {hasSubcategories && (
          <div className="form-group">
            <label className="form-label">{t('addListing.subcategory')} *</label>
            <select
              value={formData.subcategory}
              onChange={(e) => handleInputChange('subcategory', e.target.value)}
              className={`form-select ${errors.subcategory ? 'error' : ''}`}
            >
              <option value="">{t('addListing.selectSubcategory')}</option>
              {subcategories[formData.category as keyof typeof subcategories]?.map(subcategory => (
                <option key={subcategory.value} value={subcategory.value}>
                  {subcategory.emoji} {subcategory.label}
                </option>
              ))}
            </select>
            {errors.subcategory && <span className="error-message">{errors.subcategory}</span>}
          </div>
        )}

        {/* Локация */}
        <div className="form-group">
          <label className="form-label">
            <MapPinIcon className="form-icon" />
            {t('addListing.location')} *
          </label>
          <select
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className={`form-select ${errors.location ? 'error' : ''}`}
          >
            <option value="">{t('addListing.selectLocation')}</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.location && <span className="error-message">{errors.location}</span>}
        </div>

        {/* Способ связи */}
        <div className="form-group">
          <label className="form-label">{t('addListing.contactMethod')}</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="contactMethod"
                value="chat"
                checked={formData.contactMethod === 'chat'}
                onChange={(e) => handleInputChange('contactMethod', e.target.value)}
              />
              <span>{t('addListing.chat')}</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="contactMethod"
                value="phone"
                checked={formData.contactMethod === 'phone'}
                onChange={(e) => handleInputChange('contactMethod', e.target.value)}
              />
              <span>{t('addListing.phone')}</span>
            </label>
          </div>
        </div>

        {/* Изображения */}
        <div className="form-group">
          <label className="form-label">
            <PhotoIcon className="form-icon" />
            {t('addListing.images')}
          </label>
          
          {/* Существующие изображения */}
          {existingImages.length > 0 && (
            <div className="existing-images">
              <h4>{t('editListing.existingImages')}</h4>
              <div className="image-grid">
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className="image-preview existing">
                    <img src={imageUrl} alt={`Existing ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="remove-image-btn"
                    >
                      <XMarkIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Новые изображения */}
          <div className="image-upload-section">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="upload-button"
            >
              <CameraIcon className="upload-icon" />
              {t('addListing.uploadImages')}
            </button>
          </div>

          {/* Превью новых изображений */}
          {imagePreviewUrls.length > 0 && (
            <div className="image-grid">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="image-preview">
                  <img src={url} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-image-btn"
                  >
                    <XMarkIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onBack}
            className="cancel-button"
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('editListing.updating') : t('editListing.update')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditListingView; 