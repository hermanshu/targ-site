import React, { useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../hooks/useTranslation';

export interface FilterState {
  cityInput: string;
  selectedCategory: string;
  selectedCondition: string;
  onlyWithPhoto: boolean;
  selectedDelivery: string;
  selectedSeller: string;
  minPrice: string;
  maxPrice: string;
}

interface WebsiteFilterViewProps {
  isOpen: boolean;
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  onClose: () => void;
}

const cities = [
  "Belgrade", "Novi Sad", "Niš", "Kragujevac", "Subotica",
  "Zrenjanin", "Pančevo", "Čačak", "Kraljevo", "Novi Pazar"
];

const WebsiteFilterView: React.FC<WebsiteFilterViewProps> = ({ 
  isOpen, 
  filterState, 
  onFilterChange, 
  onReset,
  onClose
}) => {
  const { t } = useTranslation();
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filterState);

  const categories = ["", t('home.electronics'), t('home.furniture'), t('home.fashion'), t('home.books'), t('home.sport'), t('home.transport'), t('home.kids'), t('home.realEstate'), t('home.services'), t('home.animals'), t('home.construction'), t('home.free'), t('home.other')];
  const conditions = { "any": "Не важно", "new": "Новое", "used": "Б/у" };
  const deliveries = { "any": "Не важно", "delivery": "Доставка", "pickup": "Самовывоз" };
  const sellers = { "any": "Не важно", "company": "Компания", "private": "Частное" };

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
      selectedCondition: 'any',
      onlyWithPhoto: false,
      selectedDelivery: 'any',
      selectedSeller: 'any',
      minPrice: '',
      maxPrice: ''
    };
    setLocalFilters(resetFilters);
    onReset();
  };

  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(localFilters.cityInput.toLowerCase())
  );

  return (
    <div className={`website-filter-container ${isOpen ? 'website-filter-visible' : 'website-filter-hidden'}`}>
      <div className="website-filter-content">
        {/* Город */}
        <div className="website-filter-section">
          <label className="website-filter-label">{t('filters.city')}</label>
          <div className="website-city-input-container">
            <MapPinIcon className="website-city-input-icon" />
            <input
              type="text"
              placeholder={t('filters.city')}
              value={localFilters.cityInput}
              onChange={(e) => {
                handleFilterChange('cityInput', e.target.value);
                setShowCitySuggestions(e.target.value.length > 0);
              }}
              className="website-city-input"
            />
          </div>
          {showCitySuggestions && filteredCities.length > 0 && (
            <div className="website-city-suggestions">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  className="website-city-suggestion"
                  onClick={() => {
                    handleFilterChange('cityInput', city);
                    setShowCitySuggestions(false);
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Цена */}
        <div className="website-filter-section">
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

        {/* Категория и фото */}
        <div className="website-filter-section">
          <div className="website-filter-row">
            <div className="website-filter-column">
              <label className="website-filter-label">{t('filters.category')}</label>
              <select
                value={localFilters.selectedCategory}
                onChange={(e) => handleFilterChange('selectedCategory', e.target.value)}
                className="website-filter-select"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category || t('filters.anyCategory')}
                  </option>
                ))}
              </select>
            </div>
            <div className="website-filter-column">
              <div className="website-filter-toggle-row">
                <span className="website-filter-toggle-label">{t('filters.onlyWithPhoto')}</span>
                <label className="website-filter-toggle">
                  <input
                    type="checkbox"
                    checked={localFilters.onlyWithPhoto}
                    onChange={(e) => handleFilterChange('onlyWithPhoto', e.target.checked)}
                    className="website-toggle-input"
                  />
                  <span className="website-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Состояние товара */}
        <div className="website-filter-section">
          <label className="website-filter-label">{t('filters.condition')}</label>
          <div className="website-filter-segmented">
            {Object.entries(conditions).map(([key, label]) => (
              <button
                key={key}
                className={`website-segmented-button ${localFilters.selectedCondition === key ? 'active' : ''}`}
                onClick={() => handleFilterChange('selectedCondition', key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Доставка */}
        <div className="website-filter-section">
          <label className="website-filter-label">{t('filters.delivery')}</label>
          <div className="website-filter-segmented">
            {Object.entries(deliveries).map(([key, label]) => (
              <button
                key={key}
                className={`website-segmented-button ${localFilters.selectedDelivery === key ? 'active' : ''}`}
                onClick={() => handleFilterChange('selectedDelivery', key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Продавец */}
        <div className="website-filter-section">
          <label className="website-filter-label">{t('filters.seller')}</label>
          <div className="website-filter-segmented">
            {Object.entries(sellers).map(([key, label]) => (
              <button
                key={key}
                className={`website-segmented-button ${localFilters.selectedSeller === key ? 'active' : ''}`}
                onClick={() => handleFilterChange('selectedSeller', key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>



        {/* Кнопки */}
        <div className="website-filter-actions">
          <button className="website-reset-button" onClick={handleReset}>
            {t('filters.reset')}
          </button>
          <button className="website-apply-button" onClick={handleApply}>
            {t('filters.apply')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebsiteFilterView; 