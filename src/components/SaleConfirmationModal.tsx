import React, { useState } from 'react';
import { XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../hooks/useTranslation';
import StarRating from './StarRating';

interface SaleConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  action: 'archive' | 'delete';
  onConfirmSale: (buyerId: string, review?: { rating: number; comment: string }) => void;
  onConfirmAction: () => void;
  buyers: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}

const SaleConfirmationModal: React.FC<SaleConfirmationModalProps> = ({
  isOpen,
  onClose,
  listingId,
  listingTitle,
  action,
  onConfirmSale,
  onConfirmAction,
  buyers
}) => {
  const { t } = useTranslation();
  const [selectedBuyer, setSelectedBuyer] = useState<string>('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [step, setStep] = useState<'confirm' | 'select-buyer' | 'review'>('confirm');

  const handleConfirmSale = () => {
    if (buyers.length === 0) {
      // Если нет покупателей, просто подтверждаем продажу
      onConfirmSale('');
      onClose();
      return;
    }
    
    if (buyers.length === 1) {
      // Если только один покупатель, выбираем его автоматически
      setSelectedBuyer(buyers[0].id);
      setStep('review');
      return;
    }
    
    // Если несколько покупателей, переходим к выбору
    setStep('select-buyer');
  };

  const handleBuyerSelect = (buyerId: string) => {
    setSelectedBuyer(buyerId);
    setStep('review');
  };

  const handleSubmitReview = () => {
    const review = rating > 0 ? { rating, comment } : undefined;
    onConfirmSale(selectedBuyer, review);
    onClose();
    resetForm();
  };

  const handleSkipReview = () => {
    onConfirmSale(selectedBuyer);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setSelectedBuyer('');
    setRating(0);
    setComment('');
    setStep('confirm');
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay sale-confirmation-overlay">
      <div className="modal-content sale-confirmation-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {step === 'confirm' && t('myListings.saleConfirmation.title')}
            {step === 'select-buyer' && t('myListings.saleConfirmation.selectBuyer')}
            {step === 'review' && t('myListings.saleConfirmation.leaveReview')}
          </h3>
          <button onClick={handleClose} className="modal-close-button">
            <XMarkIcon className="modal-close-icon" />
          </button>
        </div>

        <div className="modal-body">
          {step === 'confirm' && (
            <div className="sale-confirmation-step">
              <p className="sale-confirmation-text">
                {t('myListings.saleConfirmation.question')}
              </p>
              <p className="sale-confirmation-listing">
                "{listingTitle}"
              </p>
              <div className="sale-confirmation-buttons">
                <button 
                  onClick={handleConfirmSale}
                  className="sale-confirmation-button confirm"
                >
                  {t('myListings.saleConfirmation.yes')}
                </button>
                <button 
                  onClick={() => {
                    onConfirmAction();
                    onClose();
                    resetForm();
                  }}
                  className="sale-confirmation-button cancel"
                >
                  {t('myListings.saleConfirmation.no')}
                </button>
              </div>
            </div>
          )}

          {step === 'select-buyer' && (
            <div className="sale-confirmation-step">
              <p className="sale-confirmation-text">
                {t('myListings.saleConfirmation.selectBuyerText')}
              </p>
              <div className="buyers-list">
                {buyers.map(buyer => (
                  <button
                    key={buyer.id}
                    onClick={() => handleBuyerSelect(buyer.id)}
                    className="buyer-item"
                  >
                    <div className="buyer-avatar">
                      {buyer.avatar ? (
                        <img src={buyer.avatar} alt={buyer.name} />
                      ) : (
                        <UserIcon className="buyer-avatar-icon" />
                      )}
                    </div>
                    <span className="buyer-name">{buyer.name}</span>
                  </button>
                ))}
              </div>
              <div className="sale-confirmation-buttons">
                <button 
                  onClick={() => setStep('confirm')}
                  className="sale-confirmation-button back"
                >
                  {t('common.back')}
                </button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="sale-confirmation-step">
              <p className="sale-confirmation-text">
                {t('myListings.saleConfirmation.reviewText')}
              </p>
              <div className="review-form">
                <div className="review-rating">
                  <label className="review-label">{t('myListings.saleConfirmation.rating')}</label>
                  <StarRating 
                    rating={rating} 
                    onRatingChange={setRating}
                    size="large"
                  />
                </div>
                <div className="review-comment">
                  <label className="review-label">{t('myListings.saleConfirmation.comment')}</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t('myListings.saleConfirmation.commentPlaceholder')}
                    className="review-textarea"
                    rows={3}
                  />
                </div>
              </div>
              <div className="sale-confirmation-buttons">
                <button 
                  onClick={handleSubmitReview}
                  className="sale-confirmation-button confirm"
                  disabled={rating === 0}
                >
                  {t('myListings.saleConfirmation.submitReview')}
                </button>
                <button 
                  onClick={handleSkipReview}
                  className="sale-confirmation-button skip"
                >
                  {t('myListings.saleConfirmation.skipReview')}
                </button>
                <button 
                  onClick={() => setStep('select-buyer')}
                  className="sale-confirmation-button back"
                >
                  {t('common.back')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaleConfirmationModal; 