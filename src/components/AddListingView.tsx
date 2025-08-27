import React, { useState, useRef } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { useListings } from '../contexts/ListingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate } from 'react-router-dom';


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

const AddListingView: React.FC = () => {
  const { currentUser } = useAuth();
  const { addListing } = useListings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Константы
  const MAX_IMAGES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MIN_DESCRIPTION_LENGTH = 20;
  const MAX_DESCRIPTION_LENGTH = 2000;
  
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
    characteristics: {}
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: 'electronics', label: t('home.electronics'), emoji: '📱' },
    { value: 'home', label: t('home.homeAndGarden'), emoji: '🏠' },
    { value: 'fashion', label: t('home.fashion'), emoji: '👕' },
    { value: 'services', label: t('home.services'), emoji: '🔧' },
    { value: 'work', label: t('home.work'), emoji: '💼' },
    { value: 'real-estate', label: t('home.realEstate'), emoji: '🏢' },
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
    // Проверяем, если пользователь пытается выбрать телефон, но у него нет номера
    if (field === 'contactMethod' && value === 'phone' && currentUser && !currentUser.phone) {
      // Автоматически переключаем на чат
      setFormData(prev => ({ ...prev, [field]: 'chat' }));
      alert(t('listings.fillPhoneInProfile'));
      return;
    }
    
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

  const clearCharacteristicErrors = () => {
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

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({ 
      ...prev, 
      category,
      subcategory: '',
      characteristics: {}, // Сбрасываем характеристики при смене категории
      ...((category === 'work' || category === 'real-estate') && { delivery: undefined }) // Убираем доставку для категорий "Работа" и "Недвижимость"
    }));
    // Очищаем ошибки характеристик
    clearCharacteristicErrors();
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setFormData(prev => ({ 
      ...prev, 
      subcategory,
      characteristics: {} // Сбрасываем характеристики при смене подкатегории
    }));
    // Очищаем ошибки характеристик
    clearCharacteristicErrors();
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
      const isValidType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      const isValidSize = file.size <= MAX_FILE_SIZE; // 5MB
      
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

    if (formData.images.length + validFiles.length > MAX_IMAGES) {
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
      reader.onerror = () => {
        console.error('Ошибка при чтении файла:', file.name);
        alert(t('profile.fileReadError') || 'Ошибка при чтении файла');
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
    } else if (formData.description.length < MIN_DESCRIPTION_LENGTH) {
      newErrors.description = t('validation.minLength') + ' ' + MIN_DESCRIPTION_LENGTH;
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
    } else if (formData.contactMethod === 'phone' && currentUser && !currentUser.phone) {
      newErrors.contactMethod = t('listings.fillPhoneInProfile');
    }

    // Проверяем поле доставки для категорий, где оно обязательно
    if (formData.category !== 'work' && formData.category !== 'real-estate' && !formData.delivery) {
      newErrors.delivery = t('validation.selectDeliveryMethod') || 'Выберите способ доставки';
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
      const newListing: any = {
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
        contactMethod: formData.contactMethod
      };

      // Добавляем поле доставки только для категорий, где это логично
      if (formData.category !== 'work' && formData.category !== 'real-estate') {
        newListing.delivery = formData.delivery;
      }

      // Добавляем объявление в контекст
      addListing(newListing);
      
      // Имитация задержки
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Показываем модальное окно успеха
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Ошибка при создании объявления:', error);
      alert(t('listings.errorCreatingListing'));
    } finally {
      setIsSubmitting(false);
    }
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
              
              {formData.images.length < MAX_IMAGES && (
                <div 
                  className="image-upload-placeholder"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CameraIcon className="upload-icon" />
                  <span>{t('listings.addPhotoText')}</span>
                  <small>{String(formData.images.length)}/{MAX_IMAGES}</small>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png"
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
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
          {errors.description && (
            <div className="error-message">{errors.description}</div>
          )}
          <div className="char-counter">
            {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
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
            <input
              type="text"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0"
              className={`form-input ${errors.price ? 'input-error' : ''}`}
            />
            {errors.price && (
              <div className="error-message">{errors.price}</div>
            )}
          </div>

          <div className="form-section">
            <label className="form-label">
              <CurrencyDollarIcon className="label-icon" />
              {t('listings.currency')}
            </label>
            <CustomSelect
              value={formData.currency}
              onChange={(value) => handleInputChange('currency', value as 'EUR' | 'RSD')}
              options={[
                { value: 'EUR', label: 'EUR' },
                { value: 'RSD', label: 'RSD' }
              ]}
              placeholder="Выберите валюту"
              className="currency-select"
            />
          </div>

          <div className="form-section">
            <label className="form-label">
              <TagIcon className="label-icon" />
              {t('listings.category')} *
            </label>
            <CustomSelect
              value={formData.category}
              onChange={handleCategoryChange}
              options={[{ value: '', label: t('listings.selectCategory') }, ...categories]}
              placeholder={t('listings.selectCategory')}
              error={!!errors.category}
            />
            {errors.category && (
              <div className="error-message">{errors.category}</div>
            )}
          </div>
        </div>

        {/* Подкатегории */}
        {formData.category && subcategories[formData.category as keyof typeof subcategories] && (
          <div className="form-section">
            <label className="form-label">
              <TagIcon className="label-icon" />
              {t('listings.subcategory')} *
            </label>
            <CustomSelect
              value={formData.subcategory}
              onChange={handleSubcategoryChange}
              options={[{ value: '', label: t('validation.selectSubcategory') }, ...(subcategories[formData.category as keyof typeof subcategories] || [])]}
              placeholder={t('validation.selectSubcategory')}
              error={!!errors.subcategory}
            />
            {errors.subcategory && (
              <div className="error-message">{errors.subcategory}</div>
            )}
          </div>
        )}

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
                      <CustomSelect
              value={formData.location}
              onChange={(value) => handleInputChange('location', value)}
              options={[{ value: '', label: t('listings.selectCity') }, ...cities.map(city => ({ value: city, label: city }))]}
              placeholder={t('listings.selectCity')}
              error={!!errors.location}
            />
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
              className={`contact-method-button ${formData.contactMethod === 'phone' ? 'active' : ''} ${currentUser && !currentUser.phone ? 'disabled' : ''}`}
              onClick={() => currentUser && currentUser.phone ? handleInputChange('contactMethod', 'phone') : null}
              disabled={!currentUser || !currentUser.phone}
            >
              <span className="method-text">{t('listings.phone')}</span>
              <span className="method-hint">
                {currentUser && currentUser.phone ? `${t('listings.fromProfile')} ${currentUser.phone}` : t('listings.fillPhoneInProfile')}
              </span>
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

        {/* Доставка - не показываем для категорий "Работа" и "Недвижимость" */}
        {formData.category !== 'work' && formData.category !== 'real-estate' && (
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
            {errors.delivery && (
              <div className="error-message">{errors.delivery}</div>
            )}
          </div>
        )}

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

      {/* Модальное окно успешного создания объявления */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-content success-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="success-modal-header">
              <div className="success-icon">✅</div>
              <h3 className="success-modal-title">{t('listings.listingCreatedSuccess')}</h3>
            </div>
            
            <div className="success-modal-body">
              <p className="success-modal-description">
                Твое объявление успешно опубликовано и теперь доступно для просмотра другими пользователями.
              </p>
            </div>
            
            <div className="success-modal-actions">
              <button 
                className="success-modal-button primary"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/my-listings');
                }}
              >
                Перейти к моим объявлениям
              </button>
              <button 
                className="success-modal-button secondary"
                onClick={() => {
                  setShowSuccessModal(false);
                  // Сброс формы
                  setFormData({
                    title: '',
                    description: '',
                    price: '',
                    currency: 'EUR',
                    category: '',
                    subcategory: '',
                    location: '',
                    contactMethod: 'chat',
                    delivery: 'pickup',
                    images: [],
                    characteristics: {}
                  });
                  setImagePreviewUrls([]);
                  setErrors({});
                }}
              >
                Создать еще одно объявление
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddListingView; 