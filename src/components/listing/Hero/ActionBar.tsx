import React, { useState } from 'react';
import { 
  HeartIcon, 
  ShareIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface ActionBarProps {
  id: string;
  isFav: boolean;
  onFavoriteToggle: () => void;
  onShareClick: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({ 
  id, 
  isFav, 
  onFavoriteToggle, 
  onShareClick 
}) => {
  const [animateHeart, setAnimateHeart] = useState(false);

  const handleFavoriteClick = () => {
    setAnimateHeart(true);
    onFavoriteToggle();
    setTimeout(() => setAnimateHeart(false), 350);
  };

  return (
    <div className="detail-actions">
      <button 
        className="action-button" 
        onClick={handleFavoriteClick}
        aria-label={isFav ? "Убрать из избранного" : "Добавить в избранное"}
      >
        {isFav ? (
          <HeartIconSolid className={`action-icon ${animateHeart ? 'heart-animate' : ''}`} />
        ) : (
          <HeartIcon className="action-icon" />
        )}
      </button>
      <button 
        className="action-button" 
        onClick={onShareClick}
        aria-label="Поделиться объявлением"
      >
        <ShareIcon className="action-icon" />
      </button>
    </div>
  );
}; 