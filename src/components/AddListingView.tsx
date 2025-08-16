import React, { useState, useRef } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { useListings } from '../contexts/ListingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate } from 'react-router-dom';

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
  delivery: 'pickup' | 'delivery';
  characteristics: Record<string, string>;
}

const AddListingView: React.FC = () => {
  const { currentUser } = useAuth();
  const { addListing } = useListings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    currency: 'EUR',
    category: '',
    subcategory: '',
    location: '',
    images: [],
    contactMethod: 'chat',
    delivery: 'pickup',
    characteristics: {}
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: 'electronics', label: t('home.electronics'), emoji: '📱' },
    { value: 'home', label: t('home.homeAndGarden'), emoji: '🏠' },
    { value: 'fashion', label: t('home.fashion'), emoji: '👕' },
    { value: 'services', label: t('home.services'), emoji: '🔧' },
    { value: 'work', label: t('home.work'), emoji: '💼', hasSubcategories: true },
    { value: 'real-estate', label: t('home.realEstate'), emoji: '🏢', hasSubcategories: true },
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
    { value: 'other', label: t('home.other'), emoji: '📦' }
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
    'real-estate': [
      { value: 'rent', label: t('home.rent'), emoji: '🏠' },
      { value: 'sale', label: t('home.sale'), emoji: '🏢' }
    ]
  };

  // Типы для характеристик
  type CharacteristicField = {
    key: string;
    label: string;
    type: 'text' | 'number' | 'select';
    options?: string[];
  };

  // Характеристики для каждой категории и подкатегории
  const categoryCharacteristics: Record<string, CharacteristicField[]> = {
    electronics: [
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'model', label: t('listings.characteristicModel'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionFair')] },
      { key: 'warranty', label: t('listings.characteristicWarranty'), type: 'select', options: [t('listings.warrantyYes'), t('listings.warrantyNo'), t('listings.warrantyExpired')] },
      { key: 'year', label: t('listings.characteristicYear'), type: 'number' }
    ],
    home: [
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionFair')] },
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' },
      { key: 'dimensions', label: t('listings.characteristicDimensions'), type: 'text' },
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' }
    ],
    fashion: [
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'size', label: t('listings.characteristicSize'), type: 'text' },
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionFair')] },
      { key: 'color', label: t('listings.characteristicColor'), type: 'text' }
    ],
    services: [
      { key: 'serviceType', label: t('listings.characteristicServiceType'), type: 'text' },
      { key: 'experience', label: t('listings.characteristicExperience'), type: 'text' },
      { key: 'location', label: t('listings.location'), type: 'text' },
      { key: 'schedule', label: t('listings.characteristicSchedule'), type: 'text' }
    ],
    plants: [
      { key: 'plantType', label: t('listings.characteristicPlantType'), type: 'text' },
      { key: 'age', label: t('listings.characteristicAge'), type: 'text' },
      { key: 'height', label: t('listings.characteristicHeight'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionExcellent'), t('listings.conditionGood'), t('listings.conditionFair')] }
    ],
    // Подкатегории для работы
    vacancies: [
      { key: 'position', label: t('listings.characteristicPosition'), type: 'text' },
      { key: 'salary', label: t('listings.characteristicSalary'), type: 'text' },
      { key: 'experience', label: t('listings.characteristicExperience'), type: 'text' },
      { key: 'schedule', label: t('listings.characteristicSchedule'), type: 'text' },
      { key: 'location', label: t('listings.location'), type: 'text' }
    ],
    resume: [
      { key: 'position', label: t('listings.characteristicPosition'), type: 'text' },
      { key: 'experience', label: t('listings.characteristicExperience'), type: 'text' },
      { key: 'education', label: t('listings.characteristicEducation'), type: 'text' },
      { key: 'skills', label: t('listings.characteristicSkills'), type: 'text' }
    ],
    // Подкатегории для недвижимости
    rent: [
      { key: 'propertyType', label: t('listings.characteristicPropertyType'), type: 'select', options: [t('listings.propertyTypeApartment'), t('listings.propertyTypeHouse'), t('listings.propertyTypeCommercial'), t('listings.propertyTypeLand')] },
      { key: 'rooms', label: t('listings.characteristicRooms'), type: 'number' },
      { key: 'area', label: t('listings.characteristicArea'), type: 'number' },
      { key: 'floor', label: t('listings.characteristicFloor'), type: 'number' },
      { key: 'rentPeriod', label: t('listings.characteristicRentPeriod'), type: 'text' }
    ],
    sale: [
      { key: 'propertyType', label: t('listings.characteristicPropertyType'), type: 'select', options: [t('listings.propertyTypeApartment'), t('listings.propertyTypeHouse'), t('listings.propertyTypeCommercial'), t('listings.propertyTypeLand')] },
      { key: 'rooms', label: t('listings.characteristicRooms'), type: 'number' },
      { key: 'area', label: t('listings.characteristicArea'), type: 'number' },
      { key: 'floor', label: t('listings.characteristicFloor'), type: 'number' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionExcellent'), t('listings.conditionGood'), t('listings.conditionNeedsRepair')] }
    ],
    // Подкатегории для других категорий
    transport: [
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'model', label: t('listings.characteristicModel'), type: 'text' },
      { key: 'year', label: t('listings.characteristicYear'), type: 'number' },
      { key: 'mileage', label: t('listings.characteristicMileage'), type: 'number' },
      { key: 'fuelType', label: t('listings.characteristicFuelType'), type: 'select', options: [t('listings.fuelTypePetrol'), t('listings.fuelTypeDiesel'), t('listings.fuelTypeElectric'), t('listings.fuelTypeHybrid')] },
      { key: 'transmission', label: t('listings.characteristicTransmission'), type: 'select', options: [t('listings.transmissionManual'), t('listings.transmissionAutomatic'), t('listings.transmissionRobot'), t('listings.transmissionCVT')] }
    ],
    sport: [
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionFair')] },
      { key: 'size', label: t('listings.characteristicSize'), type: 'text' },
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' }
    ],
    books: [
      { key: 'author', label: t('listings.characteristicAuthor'), type: 'text' },
      { key: 'publisher', label: t('listings.characteristicPublisher'), type: 'text' },
      { key: 'year', label: t('listings.characteristicYear'), type: 'number' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionExcellent'), t('listings.conditionGood'), t('listings.conditionFair')] },
      { key: 'language', label: t('listings.characteristicLanguage'), type: 'text' }
    ],
    kids: [
      { key: 'ageGroup', label: t('listings.characteristicAgeGroup'), type: 'text' },
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionFair')] },
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' }
    ],
    furniture: [
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' },
      { key: 'dimensions', label: t('listings.characteristicDimensions'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionFair')] },
      { key: 'style', label: t('listings.characteristicStyle'), type: 'text' }
    ],
    hobby: [
      { key: 'hobbyType', label: t('listings.characteristicHobbyType'), type: 'text' },
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionFair')] },
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' }
    ]
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCharacteristicChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        [key]: value
      }
    }));
    // Очищаем ошибку при изменении характеристики
    if (errors[`characteristic_${key}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`characteristic_${key}`];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({ 
      ...prev, 
      category,
      subcategory: '',
      characteristics: {} // Сбрасываем характеристики при смене категории
    }));
    // Очищаем ошибки характеристик
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('characteristic_')) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setFormData(prev => ({ 
      ...prev, 
      subcategory,
      characteristics: {} // Сбрасываем характеристики при смене подкатегории
    }));
    // Очищаем ошибки характеристик
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('characteristic_')) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const handleImagesChange = (images: File[]) => {
    setFormData(prev => ({ ...prev, images }));
    // Очищаем ошибку при изменении поля
    if (errors.images) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
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

    if (formData.images.length + validFiles.length > 10) {
      alert(t('listings.maxPhotoCount'));
      return;
    }

    const newImages = [...formData.images, ...validFiles];
    handleImagesChange(newImages);

    // Создаем превью для новых изображений
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    
    handleImagesChange(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('listings.enterTitle');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('listings.enterDescription');
    } else if (formData.description.length < 20) {
      newErrors.description = t('validation.minLength') + ' 20';
    }

    if (!formData.price.trim()) {
      newErrors.price = t('listings.enterPrice');
    }

    if (!formData.category) {
      newErrors.category = t('validation.selectCategory');
    }

    // Проверяем подкатегорию, если она требуется
    if (formData.category && subcategories[formData.category as keyof typeof subcategories] && !formData.subcategory) {
      newErrors.subcategory = t('validation.selectSubcategory');
    }

    if (!formData.location.trim()) {
      newErrors.location = t('validation.enterLocation');
    }

    if (!formData.contactMethod) {
      newErrors.contactMethod = t('validation.selectContactMethod');
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
      // Создаем новое объявление
      const newListing = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        currency: formData.currency,
        category: formData.subcategory || formData.category, // Используем подкатегорию, если она есть
        city: formData.location,
        sellerName: currentUser?.name || currentUser?.email || 'Пользователь',
        isCompany: currentUser?.isCompany || false,
        imageName: formData.images.length > 0 ? 'user-upload' : '',
        userId: currentUser?.id || 'anonymous',
        characteristics: formData.characteristics,
        contactMethod: formData.contactMethod,
        delivery: formData.delivery
      };

      // Добавляем объявление в контекст
      addListing(newListing);
      
      // Имитация задержки
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(t('listings.listingCreatedSuccess'));
      
      // Перенаправляем на "Мои объявления"
      navigate('/my-listings');
      
    } catch (error) {
      console.error('Ошибка при создании объявления:', error);
      alert(t('listings.errorCreatingListing'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (value: string) => {
    // Возвращаем значение как есть, без ограничений
    return value;
  };



  return (
    <div className="add-listing-container">
      {/* Заголовок */}
      <div className="add-listing-header">
        <button 
          onClick={() => window.history.back()}
          className="back-button"
        >
          <ArrowLeftIcon className="back-icon" />
          <span>{t('common.back')}</span>
        </button>
        <h1 className="add-listing-title">{t('listings.createListing')}</h1>
        <div style={{ width: '80px' }}></div> {/* Для центрирования заголовка */}
      </div>

      <form onSubmit={handleSubmit} className="add-listing-form">
        {/* Загрузка изображений */}
        <div className="form-section">
          <label className="form-label">
            <PhotoIcon className="label-icon" />
            {t('listings.photosRequired')}
          </label>
          <div className="image-upload-area">
            <div className="image-grid">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="image-preview">
                  <img src={url} alt={`${t('favorites.previewImage')} ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-image-button"
                  >
                    <XMarkIcon className="remove-icon" />
                  </button>
                </div>
              ))}
              
              {formData.images.length < 10 && (
                <div 
                  className="image-upload-placeholder"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CameraIcon className="upload-icon" />
                  <span>{t('listings.addPhotoText')}</span>
                  <small>{String(formData.images.length)}/10</small>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            

            
            <div className="upload-hint">
              <p>{t('listings.photoOptionalNote')}</p>
              <p>{t('listings.maxPhotoCount')}</p>
              <p>{t('listings.maxFileSizeNote')}</p>
              <p>{t('listings.supportedFormatsNote')}</p>
            </div>
          </div>
        </div>

        {/* Основная информация */}
        <div className="form-section">
          <label className="form-label">
            <DocumentTextIcon className="label-icon" />
                          {t('listings.title')} *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder={t('listings.title')}
            className={`form-input ${errors.title ? 'input-error' : ''}`}
          />
          {errors.title && (
            <div className="error-message">{errors.title}</div>
          )}
        </div>

        <div className="form-section">
                      <label className="form-label">
              <DocumentTextIcon className="label-icon" />
              {t('listings.description')} *
            </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder={t('listings.description')}
            className={`form-textarea ${errors.description ? 'input-error' : ''}`}
            rows={6}
            maxLength={2000}
          />
          {errors.description && (
            <div className="error-message">{errors.description}</div>
          )}
          <div className="char-counter">
            {formData.description.length}/2000
          </div>
        </div>

        {/* Цена, валюта и категория */}
        <div className="form-row">
          <div className="form-section">
            <label className="form-label">
              <CurrencyDollarIcon className="label-icon" />
              {formData.category === 'work' || formData.subcategory === 'vacancies' ? 'Зарплата в месяц' : 
               formData.subcategory === 'rent' ? 'Стоимость в месяц' : 
               t('listings.price')} *
            </label>
            <div className="price-input-group">
              <input
                type="text"
                value={formData.price}
                onChange={(e) => handleInputChange('price', formatPrice(e.target.value))}
                placeholder="0"
                className={`form-input ${errors.price ? 'input-error' : ''}`}
              />
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value as 'EUR' | 'RSD')}
                className="currency-select"
              >
                <option value="EUR">EUR</option>
                <option value="RSD">RSD</option>
              </select>
            </div>
            {errors.price && (
              <div className="error-message">{errors.price}</div>
            )}
          </div>

          <div className="form-section">
            <label className="form-label">
              <TagIcon className="label-icon" />
              {t('listings.category')} *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`form-select ${errors.category ? 'input-error' : ''}`}
            >
              <option value="">{t('listings.selectCategory')}</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.emoji} {category.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="error-message">{errors.category}</div>
            )}
          </div>

          {/* Подкатегории */}
          {formData.category && subcategories[formData.category as keyof typeof subcategories] && (
            <div className="form-section">
              <label className="form-label">
                <TagIcon className="label-icon" />
                {t('listings.subcategory')} *
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => handleSubcategoryChange(e.target.value)}
                className={`form-select ${errors.subcategory ? 'input-error' : ''}`}
              >
                <option value="">{t('validation.selectSubcategory')}</option>
                {subcategories[formData.category as keyof typeof subcategories].map(subcategory => (
                  <option key={subcategory.value} value={subcategory.value}>
                    {subcategory.emoji} {subcategory.label}
                  </option>
                ))}
              </select>
              {errors.subcategory && (
                <div className="error-message">{errors.subcategory}</div>
              )}
            </div>
          )}
        </div>

        {/* Характеристики */}
        {(formData.category && categoryCharacteristics[formData.category as keyof typeof categoryCharacteristics]) ||
         (formData.subcategory && categoryCharacteristics[formData.subcategory as keyof typeof categoryCharacteristics]) ? (
          <div className="form-section">
            <label className="form-label">
              <DocumentTextIcon className="label-icon" />
              {t('listings.characteristics')}
            </label>
            <div className="characteristics-grid">
              {(formData.subcategory && categoryCharacteristics[formData.subcategory as keyof typeof categoryCharacteristics] 
                ? categoryCharacteristics[formData.subcategory as keyof typeof categoryCharacteristics]
                : categoryCharacteristics[formData.category as keyof typeof categoryCharacteristics]
              ).map(char => (
                <div key={char.key} className="characteristic-field">
                  <label className="characteristic-label">{char.label}</label>
                  {char.type === 'select' ? (
                    <select
                      value={formData.characteristics[char.key] || ''}
                      onChange={(e) => handleCharacteristicChange(char.key, e.target.value)}
                      className="characteristic-select"
                    >
                      <option value="">{t('listings.selectCharacteristic')} {char.label.toLowerCase()}</option>
                      {char.options?.map((option: string) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={char.type}
                      value={formData.characteristics[char.key] || ''}
                      onChange={(e) => handleCharacteristicChange(char.key, e.target.value)}
                      placeholder={`${t('listings.enterCharacteristic')} ${char.label.toLowerCase()}`}
                      className="characteristic-input"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Местоположение */}
        <div className="form-section">
          <label className="form-label">
            <MapPinIcon className="label-icon" />
            {t('listings.location')} *
          </label>
          <select
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className={`form-input ${errors.location ? 'input-error' : ''}`}
          >
            <option value="">{t('listings.selectCity')}</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.location && (
            <div className="error-message">{errors.location}</div>
          )}
        </div>

        {/* Способ связи */}
        <div className="form-section">
          <label className="form-label">{t('listings.contactMethod')} *</label>
          <div className="contact-method-buttons">
            <button
              type="button"
              className={`contact-method-button ${formData.contactMethod === 'phone' ? 'active' : ''}`}
              onClick={() => handleInputChange('contactMethod', 'phone')}
            >
              <span className="method-text">{t('listings.phone')}</span>
              <span className="method-hint">{t('listings.fromProfile')} {currentUser?.phone || t('listings.notSpecified')}</span>
            </button>
            <button
              type="button"
              className={`contact-method-button ${formData.contactMethod === 'chat' ? 'active' : ''}`}
              onClick={() => handleInputChange('contactMethod', 'chat')}
            >
              <span className="method-text">{t('listings.chat')}</span>
              <span className="method-hint">Email: {currentUser?.email}</span>
            </button>
          </div>
          {errors.contactMethod && (
            <div className="error-message">{errors.contactMethod}</div>
          )}
        </div>

        {/* Доставка */}
        <div className="form-section">
          <label className="form-label">{t('listings.deliveryMethod')} *</label>
          <div className="delivery-buttons">
            <button
              type="button"
              className={`delivery-button ${formData.delivery === 'pickup' ? 'active' : ''}`}
              onClick={() => handleInputChange('delivery', 'pickup')}
            >
              <span className="delivery-text">{t('listings.pickup')}</span>
              <span className="delivery-hint">{t('listings.buyerWillPickup')}</span>
            </button>
            <button
              type="button"
              className={`delivery-button ${formData.delivery === 'delivery' ? 'active' : ''}`}
              onClick={() => handleInputChange('delivery', 'delivery')}
            >
              <span className="delivery-text">{t('listings.delivery')}</span>
              <span className="delivery-hint">{t('listings.sellerWillDeliver')}</span>
            </button>
          </div>
        </div>

        {/* Кнопка отправки */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? t('common.loading') : t('listings.createListing')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddListingView; 