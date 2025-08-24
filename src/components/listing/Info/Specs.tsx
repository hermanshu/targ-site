import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

interface SpecsProps {
  specs: Record<string, string | number>;
}

export const Specs: React.FC<SpecsProps> = React.memo(({ specs }) => {
  const { t } = useTranslation();

  // Функция для перевода названий характеристик
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

  // Функция для перевода значений характеристик
  const getTranslatedCharacteristicValue = (key: string, value: string): string => {
    // Переводы для состояния товара
    if (key === 'condition') {
      const conditionMapping: { [key: string]: string } = {
        'new': t('listings.conditionNew'),
        'likenew': t('listings.conditionLikeNew'),
        'good': t('listings.conditionGood'),
        'fair': t('listings.conditionFair'),
        'excellent': t('listings.conditionExcellent'),
        'needsrepair': t('listings.conditionNeedsRepair'),
        'новое': t('listings.conditionNew'),
        'как новое': t('listings.conditionLikeNew'),
        'хорошее': t('listings.conditionGood'),
        'удовлетворительное': t('listings.conditionFair'),
        'отличное': t('listings.conditionExcellent'),
        'требует ремонта': t('listings.conditionNeedsRepair'),
        'novo': t('listings.conditionNew'),
        'kao novo': t('listings.conditionLikeNew'),
        'dobro': t('listings.conditionGood'),
        'zadovoljavajuće': t('listings.conditionFair'),
        'odlično': t('listings.conditionExcellent'),
        'potreban popravak': t('listings.conditionNeedsRepair'),
      };
      return conditionMapping[value.toLowerCase()] || value;
    }

    // Переводы для гарантии
    if (key === 'warranty') {
      const warrantyMapping: { [key: string]: string } = {
        'yes': t('listings.warrantyYes'),
        'no': t('listings.warrantyNo'),
        'expired': t('listings.warrantyExpired'),
        'есть': t('listings.warrantyYes'),
        'нет': t('listings.warrantyNo'),
        'истекла': t('listings.warrantyExpired'),
        'da': t('listings.warrantyYes'),
        'ne': t('listings.warrantyNo'),
        'istekla': t('listings.warrantyExpired'),
      };
      return warrantyMapping[value.toLowerCase()] || value;
    }

    // Для остальных характеристик возвращаем значение как есть
    return value;
  };

  if (!specs || Object.keys(specs).length === 0) {
    return null;
  }

  return (
    <div className="detail-characteristics">
      <h3 className="characteristics-title">{t('listingDetail.characteristics')}</h3>
      <div className="characteristics-list">
        {Object.entries(specs).map(([key, value]) => (
          <div key={key} className="characteristic-item">
            <span className="characteristic-label">
              {getTranslatedCharacteristic(key)}:
            </span>
            <span className="characteristic-value">
              {getTranslatedCharacteristicValue(key, String(value))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}); 