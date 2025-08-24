import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  CameraIcon,
  XMarkIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  TagIcon,
  PhotoIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { useListings } from '../contexts/ListingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import { Listing } from '../types';
import { nowIso } from '../utils/datetime';

// Кастомный компонент выпадающего списка
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; emoji?: string }[];
  placeholder: string;
  error?: boolean;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  error = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`custom-select-container ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`custom-select-button ${error ? 'error' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="custom-select-text">
          {selectedOption ? (
            <>
              {selectedOption.emoji && <span className="custom-select-emoji">{selectedOption.emoji}</span>}
              {selectedOption.label}
            </>
          ) : (
            placeholder
          )}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="custom-select-chevron" />
        ) : (
          <ChevronDownIcon className="custom-select-chevron" />
        )}
      </button>
      
      {isOpen && (
        <div className="custom-select-dropdown">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`custom-select-option ${option.value === value ? 'active' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.emoji && <span className="custom-select-emoji">{option.emoji}</span>}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
  const { currentUser } = useAuth();
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
    if (listing.images && listing.images.length > 0) {
      setExistingImages(listing.images.map(img => img.src));
    } else if (listing.imageName) {
      setExistingImages([`/images/${listing.imageName}.jpg`]);
    }
  }, [listing.imageName, listing.images]);

  const categories = [
    { value: 'electronics', label: t('home.electronics'), emoji: '📱' },
    { value: 'homeAndGarden', label: t('home.homeAndGarden'), emoji: '🏠' },
    { value: 'fashion', label: t('home.fashion'), emoji: '👕' },
    { value: 'services', label: t('home.services'), emoji: '🔧' },
    { value: 'work', label: t('home.work'), emoji: '💼', hasSubcategories: true },
    { value: 'realEstate', label: t('home.realEstate'), emoji: '🏢', hasSubcategories: true },
    { value: 'plants', label: t('home.plants'), emoji: '☀️' },
    { value: 'transport', label: t('home.transport'), emoji: '🚗' },
    { value: 'sport', label: t('home.sport'), emoji: '⚽' },
    { value: 'books', label: t('home.books'), emoji: '📚' },
    { value: 'kids', label: t('home.kids'), emoji: '🎓' },
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
    // Проверяем, если пользователь пытается выбрать телефон, но у него нет номера
    if (field === 'contactMethod' && value === 'phone' && !currentUser?.phone) {
      // Автоматически переключаем на чат
      setFormData(prev => ({ ...prev, [field]: 'chat' }));
      alert(t('listings.fillPhoneInProfile'));
      return;
    }
    
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
    const validFiles = files.filter(file => {
      const isValidType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        alert(t('profile.fileTypeError'));
        return false;
      }
      
      if (!isValidSize) {
        alert(t('profile.fileSizeLimit'));
        return false;
      }
      
      return true;
    });
    
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
      newErrors.title = t('listings.enterTitle');
    }

    if (!formData.price.trim()) {
      newErrors.price = t('listings.enterPrice');
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = t('listings.enterPrice');
    }

    if (!formData.category) {
      newErrors.category = t('validation.selectCategory');
    }

    if (!formData.location) {
      newErrors.location = t('validation.enterLocation');
    }

    if (formData.category === 'work' && !formData.subcategory) {
      newErrors.subcategory = t('validation.selectSubcategory');
    }

    if (formData.category === 'realEstate' && !formData.subcategory) {
      newErrors.subcategory = t('validation.selectSubcategory');
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
        updatedAt: nowIso()
      };

      await updateListing(listing.id, updatedListing);
      
      // Здесь можно добавить логику для сохранения новых изображений
      // Пока просто показываем успешное сообщение
              alert(t('listings.listingUpdatedSuccess'));
      onBack();
      
    } catch (error) {
      console.error('Error updating listing:', error);
              alert(t('listings.errorUpdatingListing'));
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
        <h1 className="edit-listing-title">{t('listings.editListing')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="edit-listing-form">
        {/* Название */}
        <div className="form-group">
          <label className="form-label">
            <DocumentTextIcon className="form-icon" />
            {t('listings.title')} *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder={t('listings.title')}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        {/* Описание */}
        <div className="form-group">
          <label className="form-label">
            <DocumentTextIcon className="form-icon" />
            {t('listings.description')}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="form-textarea"
            placeholder={t('listings.description')}
            rows={4}
          />
        </div>

        {/* Цена и валюта */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <CurrencyDollarIcon className="form-icon" />
              {t('listings.price')} *
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
            <label className="form-label">{t('listings.currency')}</label>
            <CustomSelect
              value={formData.currency}
              onChange={(value) => handleInputChange('currency', value)}
              options={[
                { value: 'EUR', label: 'EUR' },
                { value: 'RSD', label: 'RSD' }
              ]}
              placeholder="Выберите валюту"
              className="currency-select"
            />
          </div>
        </div>

        {/* Категория */}
        <div className="form-group">
          <label className="form-label">
            <TagIcon className="form-icon" />
            {t('listings.category')} *
          </label>
          <CustomSelect
            value={formData.category}
            onChange={(value) => {
              handleInputChange('category', value);
              handleInputChange('subcategory', '');
            }}
            options={[{ value: '', label: t('listings.selectCategory') }, ...categories]}
            placeholder={t('listings.selectCategory')}
            error={!!errors.category}
          />
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        {/* Подкатегория */}
        {hasSubcategories && (
          <div className="form-group">
            <label className="form-label">{t('listings.subcategory')} *</label>
            <CustomSelect
              value={formData.subcategory}
              onChange={(value) => handleInputChange('subcategory', value)}
              options={[{ value: '', label: t('validation.selectSubcategory') }, ...(subcategories[formData.category as keyof typeof subcategories] || [])]}
              placeholder={t('validation.selectSubcategory')}
              error={!!errors.subcategory}
            />
            {errors.subcategory && <span className="error-message">{errors.subcategory}</span>}
          </div>
        )}

        {/* Локация */}
        <div className="form-group">
          <label className="form-label">
            <MapPinIcon className="form-icon" />
            {t('listings.location')} *
          </label>
          <CustomSelect
            value={formData.location}
            onChange={(value) => handleInputChange('location', value)}
            options={[{ value: '', label: t('listings.selectCity') }, ...cities.map(city => ({ value: city, label: city }))]}
            placeholder={t('listings.selectCity')}
            error={!!errors.location}
          />
          {errors.location && <span className="error-message">{errors.location}</span>}
        </div>

        {/* Способ связи */}
        <div className="form-group">
          <label className="form-label">{t('listings.contactMethod')}</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="contactMethod"
                value="chat"
                checked={formData.contactMethod === 'chat'}
                onChange={(e) => handleInputChange('contactMethod', e.target.value)}
              />
              <span>{t('listings.chat')}</span>
            </label>
            <label className={`radio-label ${!currentUser?.phone ? 'disabled' : ''}`}>
              <input
                type="radio"
                name="contactMethod"
                value="phone"
                checked={formData.contactMethod === 'phone'}
                onChange={(e) => handleInputChange('contactMethod', e.target.value)}
                disabled={!currentUser?.phone}
              />
              <span>{t('listings.phone')}</span>
              {!currentUser?.phone && (
                <small className="phone-hint">{t('listings.fillPhoneInProfile')}</small>
              )}
            </label>
          </div>
        </div>

        {/* Изображения */}
        <div className="form-group">
          <label className="form-label">
            <PhotoIcon className="form-icon" />
            {t('listings.images')}
          </label>
          
          {/* Существующие изображения */}
          {existingImages.length > 0 && (
            <div className="existing-images">
              <h4>{t('listings.existingImages')}</h4>
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
              accept="image/jpeg,image/jpg,image/png"
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
              {t('listings.addPhotoText')}
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
            {isSubmitting ? t('common.loading') : t('listings.updateListing')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditListingView; 