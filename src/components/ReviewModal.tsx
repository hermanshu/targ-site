import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import StarRating from './StarRating';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  sellerName: string;
  listingTitle: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  sellerName,
  listingTitle
}) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Пожалуйста, поставьте оценку');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      setShowThankYou(true);
      setTimeout(() => {
        setShowThankYou(false);
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Ошибка при отправке отзыва:', error);
      alert('Произошла ошибка при отправке отзыва');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay review-modal-overlay">
      {!showThankYou ? (
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Оставить отзыв</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Продавец: <span className="font-medium">{sellerName}</span></p>
          <p className="text-sm text-gray-600 mb-4">Объявление: <span className="font-medium">{listingTitle}</span></p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ваша оценка
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size="large"
            showText={true}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Комментарий (необязательно)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Расскажите о своем опыте..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {comment.length}/500
          </div>
        </div>

        <div className="modal-actions">
          <button
            onClick={handleClose}
            className="modal-button secondary"
            disabled={isSubmitting}
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="modal-button primary"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
          </button>
        </div>
      </div>
      ) : (
        <div className="modal-content thank-you-content" onClick={(e) => e.stopPropagation()}>
          <div className="thank-you-body">
            <div className="thank-you-icon">😊</div>
            <h3 className="thank-you-title">Спасибо за отзыв!</h3>
            <p className="thank-you-message">
              Ваш отзыв поможет другим пользователям сделать правильный выбор
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewModal; 