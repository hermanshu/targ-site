import React, { useState } from 'react';
import { XMarkIcon, MapPinIcon } from '@heroicons/react/24/outline';
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

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

const cities = [
  "Белград", "Нови Сад", "Ниш", "Крагуевац", "Суботица",
  "Зренянин", "Панчево", "Чачак", "Кралево", "Нови Пазар",
  "Крушевац", "Ужице", "Вране", "Шабац", "Сомбор",
  "Пожаревац", "Смедерево", "Лесковац", "Валево", "Кикинда",
  "Вршац", "Бор", "Прокупле", "Сремска Митровица", "Ягодина",
  "Лозница", "Приеполе", "Пирот", "Златибор", "Копаоник"
];

const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({ 
  isOpen, 
  onClose, 
  filterState, 
  onFilterChange, 
  onReset 
}) => {
  const { t } = useTranslation();
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filterState);

  const categories = ["", t('home.electronics'), t('home.furniture'), t('home.fashion'), t('home.books'), t('home.sport'), t('home.transport'), t('home.kids'), t('home.realEstate'), t('home.services'), t('home.animals'), t('home.construction'), t('home.free'), t('home.other'), t('home.plants')];
  const conditions = { "any": "Не важно", "new": "Новое", "used": "Б/у" };
  const deliveries = { "any": "Не важно", "delivery": "Доставка", "pickup": "Самовывоз" };
  const sellers = { "any": "Не важно", "company": "Компания", "private": "Частное" };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
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

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="mobile-filter-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div 
        className="mobile-filter-sheet" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '20px 20px 0 0',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: '20px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        {/* Заголовок */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px 16px',
          borderBottom: '1px solid #e5e7eb',
          background: 'white'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0
          }}>Фильтры</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'background-color 0.2s'
            }}
          >
            <XMarkIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />
          </button>
        </div>

        {/* Содержимое фильтров */}
        <div style={{ padding: '20px' }}>
          {/* Город */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '8px'
            }}>{t('filters.city')}</label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: '#f3f4f6',
              borderRadius: '8px',
              padding: '12px 16px',
              gap: '12px'
            }}>
              <MapPinIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />
              <input
                type="text"
                placeholder={t('filters.city')}
                value={localFilters.cityInput}
                onChange={(e) => {
                  handleFilterChange('cityInput', e.target.value);
                  setShowCitySuggestions(e.target.value.length > 0);
                }}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontSize: '16px',
                  outline: 'none',
                  color: '#1f2937'
                }}
              />
            </div>
            {showCitySuggestions && filteredCities.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginTop: '4px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000
              }}>
                {filteredCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      handleFilterChange('cityInput', city);
                      setShowCitySuggestions(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      fontSize: '16px',
                      color: '#1f2937',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Цена */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '8px'
            }}>{t('filters.priceRange')}</label>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <input
                type="text"
                placeholder="От (EUR)"
                value={localFilters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#f9fafb'
                }}
              />
              <input
                type="text"
                placeholder="До (EUR)"
                value={localFilters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#f9fafb'
                }}
              />
            </div>
          </div>

          {/* Категория и фото */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px'
              }}>{t('filters.category')}</label>
              <select
                value={localFilters.selectedCategory}
                onChange={(e) => handleFilterChange('selectedCategory', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#f9fafb',
                  color: '#1f2937'
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category || t('filters.anyCategory')}
                  </option>
                ))}
              </select>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0'
            }}>
              <span style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#1f2937'
              }}>{t('filters.onlyWithPhoto')}</span>
              <label style={{
                position: 'relative',
                display: 'inline-block',
                width: '50px',
                height: '24px'
              }}>
                <input
                  type="checkbox"
                  checked={localFilters.onlyWithPhoto}
                  onChange={(e) => handleFilterChange('onlyWithPhoto', e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: localFilters.onlyWithPhoto ? '#8b5cf6' : '#d1d5db',
                  borderRadius: '24px',
                  transition: 'background-color 0.3s'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '18px',
                    width: '18px',
                    left: '3px',
                    bottom: '3px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: 'transform 0.3s',
                    transform: localFilters.onlyWithPhoto ? 'translateX(26px)' : 'translateX(0)'
                  }}></span>
                </span>
              </label>
            </div>
          </div>

          {/* Состояние товара */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '8px'
            }}>{t('filters.condition')}</label>
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              {Object.entries(conditions).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleFilterChange('selectedCondition', key)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: localFilters.selectedCondition === key ? '#8b5cf6' : '#f9fafb',
                    color: localFilters.selectedCondition === key ? 'white' : '#374151'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Доставка */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '8px'
            }}>{t('filters.delivery')}</label>
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              {Object.entries(deliveries).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleFilterChange('selectedDelivery', key)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: localFilters.selectedDelivery === key ? '#8b5cf6' : '#f9fafb',
                    color: localFilters.selectedDelivery === key ? 'white' : '#374151'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Продавец */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '8px'
            }}>{t('filters.seller')}</label>
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              {Object.entries(sellers).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleFilterChange('selectedSeller', key)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: localFilters.selectedSeller === key ? '#8b5cf6' : '#f9fafb',
                    color: localFilters.selectedSeller === key ? 'white' : '#374151'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div style={{
          display: 'flex',
          gap: '12px',
          padding: '24px',
          borderTop: '1px solid #e5e7eb',
          background: 'white'
        }}>
          <button 
            onClick={handleReset}
            style={{
              flex: 1,
              padding: '16px',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: 'white',
              color: '#6b7280'
            }}
          >
            {t('filters.reset')}
          </button>
          <button 
            onClick={handleApply}
            style={{
              flex: 2,
              padding: '16px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: '#8b5cf6',
              color: 'white'
            }}
          >
            {t('filters.apply')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterSheet; 