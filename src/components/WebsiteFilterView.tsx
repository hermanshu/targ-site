import React, { useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../hooks/useTranslation';

export interface FilterState {
  cityInput: string;
  selectedCategory: string;
  onlyWithPhoto: boolean;
  minPrice: string;
  maxPrice: string;
}

interface WebsiteFilterViewProps {
  isOpen: boolean;
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  onClose: () => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const cities = [
  "Белград", "Нови Сад", "Ниш", "Крагуевац", "Суботица",
  "Зренянин", "Панчево", "Чачак", "Кралево", "Нови Пазар",
  "Крушевац", "Ужице", "Вране", "Шабац", "Сомбор",
  "Пожаревац", "Смедерево", "Лесковац", "Валево", "Кикинда",
  "Вршац", "Бор", "Прокупле", "Сремска Митровица", "Ягодина",
  "Лозница", "Приеполе", "Пирот", "Златибор", "Копаоник"
];

const WebsiteFilterView: React.FC<WebsiteFilterViewProps> = ({ 
  isOpen, 
  filterState, 
  onFilterChange, 
  onReset,
  onClose,
  selectedCategory,
  onCategoryChange
}) => {
  const { t } = useTranslation();
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filterState);

  const categories = ["", t('home.electronics'), t('home.furniture'), t('home.fashion'), t('home.books'), t('home.sport'), t('home.transport'), t('home.kids'), t('home.realEstate'), t('home.services'), t('home.animals'), t('home.construction'), t('home.free'), t('home.other'), t('home.work'), t('home.vacancies'), t('home.resume'), t('home.rent'), t('home.sale'), t('home.plants')];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      cityInput: '',
      selectedCategory: '',
      onlyWithPhoto: false,
      minPrice: '',
      maxPrice: ''
    };
    setLocalFilters(resetFilters);
    onReset();
    
    // Сбрасываем основную категорию
    if (onCategoryChange) {
      onCategoryChange('allListings');
    }
  };

  const handleCityInputChange = (value: string) => {
    handleFilterChange('cityInput', value);
    setShowCitySuggestions(value.length > 0); // Показываем список только при вводе
  };

  const handleCitySelect = (city: string) => {
    handleFilterChange('cityInput', city);
    setShowCitySuggestions(false);
  };

  const handleCityInputFocus = () => {
    // Не показываем список при фокусе, только при вводе
  };

  const handleCityInputBlur = () => {
    // Закрываем список при потере фокуса
    setTimeout(() => setShowCitySuggestions(false), 200);
  };

  const handleCategorySelect = (category: string) => {
    handleFilterChange('selectedCategory', category);
    setShowCategorySuggestions(false);
    
    // Синхронизируем с основной категорией
    if (onCategoryChange) {
      // Преобразуем название категории в ключ
      const categoryKey = getCategoryKey(category);
      onCategoryChange(categoryKey);
    }
  };

  const getCategoryKey = (categoryName: string): string => {
    const categoryMap: { [key: string]: string } = {
      [t('filters.anyCategory')]: 'allListings',
      [t('home.electronics')]: 'electronics',
      [t('home.furniture')]: 'furniture',
      [t('home.fashion')]: 'fashion',
      [t('home.books')]: 'books',
      [t('home.sport')]: 'sport',
      [t('home.transport')]: 'transport',
      [t('home.kids')]: 'kids',
      [t('home.realEstate')]: 'realEstate',
      [t('home.services')]: 'services',
      [t('home.animals')]: 'animals',
      [t('home.construction')]: 'construction',
      [t('home.free')]: 'free',
      [t('home.other')]: 'other',
      [t('home.work')]: 'work',
      [t('home.vacancies')]: 'vacancies',
      [t('home.resume')]: 'resume',
      [t('home.rent')]: 'rent',
      [t('home.sale')]: 'sale',
      [t('home.plants')]: 'plants'
    };
    
    return categoryMap[categoryName] || 'allListings';
  };

  const handleCategoryClick = () => {
    setShowCategorySuggestions(!showCategorySuggestions);
  };

  const handleCategoryInputBlur = () => {
    setTimeout(() => setShowCategorySuggestions(false), 200);
  };

  const filteredCities = localFilters.cityInput.length > 0 
    ? cities.filter(city => 
        city.toLowerCase().includes(localFilters.cityInput.toLowerCase())
      ).slice(0, 10)
    : []; // Не показываем города при пустом поле

  const filteredCategories = categories; // Показываем все категории

  return (
    <div className={`website-filter-container ${isOpen ? 'website-filter-visible' : 'website-filter-hidden'}`}>
      <div className="website-filter-content">
        {/* Первая строка: Город, Цена и кнопки */}
        <div className="website-filter-row">
          {/* Город */}
          <div className="website-filter-field">
            <label className="website-filter-label">{t('filters.city')}</label>
            <div className="website-city-input-container">
              <MapPinIcon className="website-city-input-icon" />
              <input
                type="text"
                placeholder={t('filters.city')}
                value={localFilters.cityInput}
                onChange={(e) => handleCityInputChange(e.target.value)}
                onFocus={handleCityInputFocus}
                onBlur={handleCityInputBlur}
                className="website-city-input"
              />
            </div>
            {showCitySuggestions && filteredCities.length > 0 && (
              <div className="website-city-suggestions">
                {filteredCities.map((city) => (
                  <button
                    key={city}
                    className="website-city-suggestion"
                    onClick={() => handleCitySelect(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Диапазон цен */}
          <div className="website-filter-field">
            <label className="website-filter-label">{t('filters.priceRange')}</label>
            <div className="website-price-inputs">
              <input
                type="text"
                placeholder={t('filters.minPrice')}
                value={localFilters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="website-price-input"
              />
              <span className="website-price-separator">—</span>
              <input
                type="text"
                placeholder={t('filters.maxPrice')}
                value={localFilters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="website-price-input"
              />
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="website-filter-actions">
            <button className="website-reset-button" onClick={handleReset}>
              {t('filters.reset')}
            </button>
            <button className="website-apply-button" onClick={handleApply}>
              {t('filters.apply')}
            </button>
          </div>
        </div>

        {/* Вторая строка: Категория и Только с фото */}
        <div className="website-filter-row">
          {/* Категория */}
          <div className="website-filter-field">
            <label className="website-filter-label">{t('filters.category')}</label>
            <div className="website-category-input-container">
              <button
                className="website-category-input"
                onClick={handleCategoryClick}
                onBlur={handleCategoryInputBlur}
              >
                {localFilters.selectedCategory || t('filters.anyCategory')}
              </button>
            </div>
            {showCategorySuggestions && (
              <div className="website-category-suggestions">
                {filteredCategories.map((category) => (
                  <button
                    key={category}
                    className="website-category-suggestion"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category || t('filters.anyCategory')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Только с фото - кнопка */}
          <div className="website-filter-field">
            <label className="website-filter-label">&nbsp;</label>
            <button
              className={`website-photo-filter-button ${localFilters.onlyWithPhoto ? 'active' : ''}`}
              onClick={() => handleFilterChange('onlyWithPhoto', !localFilters.onlyWithPhoto)}
            >
              {localFilters.onlyWithPhoto ? '✓' : '○'} {t('filters.onlyWithPhoto')}
            </button>
          </div>

          {/* Пустое место для выравнивания */}
          <div className="website-filter-actions-placeholder"></div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteFilterView; 