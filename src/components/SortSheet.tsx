import React, { useState, useEffect } from 'react';
import { XMarkIcon, ClockIcon, ArrowDownIcon, ArrowUpIcon, StarIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../hooks/useTranslation';

export interface SortOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SortSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSort: string;
  onSortSelect: (sortId: string) => void;
}

const SortSheet: React.FC<SortSheetProps> = ({ isOpen, onClose, selectedSort, onSortSelect }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsVisible(false);
      setIsClosing(false);
    }, 400);
  };

  const handleSortSelect = (sortId: string) => {
    onSortSelect(sortId);
    handleClose();
  };

  const sortOptions: SortOption[] = [
    {
      id: 'newest',
      title: t('sorting.newestFirst'),
      description: t('sorting.newestFirstDescription'),
      icon: ClockIcon
    },
    {
      id: 'cheap',
      title: t('sorting.cheapestFirst'),
      description: t('sorting.cheapestFirstDescription'),
      icon: ArrowDownIcon
    },
    {
      id: 'expensive',
      title: t('sorting.expensiveFirst'),
      description: t('sorting.expensiveFirstDescription'),
      icon: ArrowUpIcon
    },
    {
      id: 'popular',
      title: t('sorting.mostPopular'),
      description: t('sorting.mostPopularDescription'),
      icon: StarIcon
    },
    {
      id: 'withPhoto',
      title: t('sorting.withPhotoFirst'),
      description: t('sorting.withPhotoFirstDescription'),
      icon: PhotoIcon
    }
  ];

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`sort-sheet-overlay ${isVisible && !isClosing ? 'visible' : ''}`} onClick={handleClose}>
      <div className={`sort-sheet ${isVisible && !isClosing ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Заголовок */}
        <div className="sort-sheet-header">
          <h2 className="sort-sheet-title">{t('sorting.title')}</h2>
          <button className="close-button" onClick={handleClose}>
            <XMarkIcon className="close-icon" />
          </button>
        </div>

        {/* Опции сортировки */}
        <div className="sort-options">
          {sortOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.id}
                className={`sort-option ${selectedSort === option.id ? 'active' : ''}`}
                onClick={() => handleSortSelect(option.id)}
              >
                <div className="sort-option-content">
                  <div className="sort-option-header">
                    <IconComponent className="sort-option-icon" />
                    <span className="sort-option-title">{option.title}</span>
                  </div>
                  <p className="sort-option-description">{option.description}</p>
                </div>
                {selectedSort === option.id && (
                  <div className="sort-option-check">
                    <div className="check-circle"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SortSheet; 