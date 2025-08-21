import React from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 'medium',
  showText = false 
}) => {
  const handleStarClick = (starValue: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const getStarSize = () => {
    switch (size) {
      case 'small': return 'text-sm';
      case 'large': return 'text-xl';
      default: return 'text-base';
    }
  };

  const getRatingText = () => {
    if (rating === 0) return 'Нет оценок';
    if (rating < 2) return 'Плохо';
    if (rating < 3) return 'Удовлетворительно';
    if (rating < 4) return 'Хорошо';
    if (rating < 5) return 'Очень хорошо';
    return 'Отлично';
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            disabled={readonly}
            className={`
              ${getStarSize()}
              ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}
              ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}
              ${!readonly ? 'hover:text-yellow-400' : ''}
            `}
          >
            ★
          </button>
        ))}
      </div>
      {showText && (
        <span className="text-sm text-gray-600 ml-2">
          {getRatingText()}
        </span>
      )}
    </div>
  );
};

export default StarRating; 