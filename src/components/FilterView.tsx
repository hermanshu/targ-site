import React, { useState } from 'react';
import { XMarkIcon, MapPinIcon, TagIcon, SparklesIcon, TruckIcon, UserIcon, CurrencyDollarIcon, PhotoIcon } from '@heroicons/react/24/outline';
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

interface FilterViewProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

const cities = [
  "Belgrade", "Novi Sad", "Niš", "Kragujevac", "Subotica",
  "Zrenjanin", "Pančevo", "Čačak", "Kraljevo", "Novi Pazar"
];

const categories = ["", "Электроника", "Мебель", "Одежда", "Книги", "Спорт", "Авто", "Детям", "Недвижимость", "Услуги", "Животные", "Строительство и ремонт", "Бесплатно", "Другое"];
const conditions = { "any": "Любое", "new": "Новое", "used": "Б/У" };
const deliveries = { "any": "Неважно", "delivery": "С доставкой", "pickup": "Самовывоз" };
const sellers = { "any": "Неважно", "company": "Компания", "private": "Частное лицо" };

const FilterView: React.FC<FilterViewProps> = ({ 
  isOpen, 
  onClose, 
  filterState, 
  onFilterChange, 
  onReset 
}) => {
  const { t } = useTranslation();
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filterState);

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
    onClose();
  };

  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(localFilters.cityInput.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="filter-overlay" onClick={onClose}>
      <div className="filter-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок */}
        <div className="filter-header">
          <h2 className="filter-title">Фильтры</h2>
          <button className="close-button" onClick={onClose}>
            <XMarkIcon className="close-icon" />
          </button>
        </div>

        <div className="filter-content">
          {/* Город */}
          <div className="filter-section">
            <label className="filter-label">Город</label>
            <div className="city-input-container">
              <MapPinIcon className="city-input-icon" />
              <input
                type="text"
                placeholder={t('favorites.enterCity')}
                value={localFilters.cityInput}
                onChange={(e) => {
                  handleFilterChange('cityInput', e.target.value);
                  setShowCitySuggestions(e.target.value.length > 0);
                }}
                className="city-input"
              />
            </div>
            {showCitySuggestions && filteredCities.length > 0 && (
              <div className="city-suggestions">
                {filteredCities.map((city) => (
                  <button
                    key={city}
                    className="city-suggestion"
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

          {/* Категория */}
          <div className="filter-section">
            <label className="filter-label">Категория</label>
            <select
              value={localFilters.selectedCategory}
              onChange={(e) => handleFilterChange('selectedCategory', e.target.value)}
              className="filter-select"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category || 'Любая категория'}
                </option>
              ))}
            </select>
          </div>

          {/* Состояние товара */}
          <div className="filter-section">
            <label className="filter-label">Состояние товара</label>
            <div className="filter-segmented">
              {Object.entries(conditions).map(([key, label]) => (
                <button
                  key={key}
                  className={`segmented-button ${localFilters.selectedCondition === key ? 'active' : ''}`}
                  onClick={() => handleFilterChange('selectedCondition', key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Только с фото */}
          <div className="filter-section">
            <label className="filter-toggle">
              <input
                type="checkbox"
                checked={localFilters.onlyWithPhoto}
                onChange={(e) => handleFilterChange('onlyWithPhoto', e.target.checked)}
                className="toggle-input"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Только с фото</span>
            </label>
          </div>

          {/* Доставка */}
          <div className="filter-section">
            <label className="filter-label">Доставка</label>
            <div className="filter-segmented">
              {Object.entries(deliveries).map(([key, label]) => (
                <button
                  key={key}
                  className={`segmented-button ${localFilters.selectedDelivery === key ? 'active' : ''}`}
                  onClick={() => handleFilterChange('selectedDelivery', key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Продавец */}
          <div className="filter-section">
            <label className="filter-label">Продавец</label>
            <div className="filter-segmented">
              {Object.entries(sellers).map(([key, label]) => (
                <button
                  key={key}
                  className={`segmented-button ${localFilters.selectedSeller === key ? 'active' : ''}`}
                  onClick={() => handleFilterChange('selectedSeller', key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Цена */}
          <div className="filter-section">
            <label className="filter-label">Цена</label>
            <div className="price-inputs">
              <input
                type="text"
                placeholder={t('favorites.from')}
                value={localFilters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="price-input"
              />
              <span className="price-separator">—</span>
              <input
                type="text"
                placeholder={t('favorites.to')}
                value={localFilters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="price-input"
              />
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="filter-actions">
          <button className="reset-button" onClick={handleReset}>
            Сбросить
          </button>
          <button className="apply-button" onClick={handleApply}>
            Применить
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterView; 