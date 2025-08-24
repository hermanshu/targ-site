import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

interface DescriptionProps {
  text: string;
}

export const Description: React.FC<DescriptionProps> = React.memo(({ text }) => {
  const { t } = useTranslation();

  return (
    <div className="detail-description">
      <h3 className="description-title">{t('listingDetail.description')}</h3>
      <p className="description-text">
        {text || `Прекрасный винтажный комод с зеркалом в отличном состоянии. Изготовлен из качественного дерева, имеет классический дизайн, который подойдет к любому интерьеру. 

Комод имеет 3 просторных ящика для хранения вещей, верхняя часть с зеркалом идеально подходит для косметики и украшений. Все механизмы работают исправно, поверхность в хорошем состоянии.

Размеры: 120x45x85 см. Подходит для спальни, прихожей или гостиной. Товар можно забрать в удобное время или договориться о доставке.`}
      </p>
    </div>
  );
}); 