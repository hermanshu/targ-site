import React, { useState } from 'react';
import { 
  ArrowLeftIcon,
  StarIcon,
  UserIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

interface Review {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  date: string;
  listingTitle: string;
  listingPrice: string;
}

const ReviewsView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');

  // Моковые данные для демонстрации
  const receivedReviews: Review[] = [
    {
      id: '1',
      author: {
        name: 'Алексей Петров',
        avatar: undefined
      },
      rating: 5,
      comment: 'Отличный продавец! Товар точно соответствует описанию, быстрая доставка. Рекомендую!',
      date: '2024-01-15',
      listingTitle: 'iPhone 14 Pro 128GB',
      listingPrice: '85 000 ₽'
    },
    {
      id: '2',
      author: {
        name: 'Мария Сидорова',
        avatar: undefined
      },
      rating: 4,
      comment: 'Хороший товар, но немного задержалась доставка. В целом довольна покупкой.',
      date: '2024-01-10',
      listingTitle: 'MacBook Air M2',
      listingPrice: '120 000 ₽'
    },
    {
      id: '3',
      author: {
        name: 'Дмитрий Козлов',
        avatar: undefined
      },
      rating: 5,
      comment: 'Супер! Все как на фото, цена отличная. Спасибо за быструю сделку!',
      date: '2024-01-05',
      listingTitle: 'Sony WH-1000XM4',
      listingPrice: '25 000 ₽'
    }
  ];

  const givenReviews: Review[] = [
    {
      id: '4',
      author: {
        name: 'Иван Иванов',
        avatar: undefined
      },
      rating: 5,
      comment: 'Отличный покупатель! Быстрая оплата, приятное общение. Рекомендую!',
      date: '2024-01-12',
      listingTitle: 'Samsung Galaxy S23',
      listingPrice: '65 000 ₽'
    },
    {
      id: '5',
      author: {
        name: 'Елена Волкова',
        avatar: undefined
      },
      rating: 4,
      comment: 'Хороший покупатель, но немного торговался. В итоге договорились.',
      date: '2024-01-08',
      listingTitle: 'iPad Air 5',
      listingPrice: '45 000 ₽'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index}>
        {index < rating ? (
          <StarIconSolid className="w-4 h-4 text-yellow-400" />
        ) : (
          <StarIcon className="w-4 h-4 text-gray-300" />
        )}
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return '0.0';
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const currentReviews = activeTab === 'received' ? receivedReviews : givenReviews;
  const averageRating = getAverageRating(currentReviews);

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <button 
          className="back-button"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeftIcon className="back-icon" />
        </button>
        <h1 className="reviews-title">{t('reviews.title')}</h1>
      </div>

      <div className="reviews-content">
        {/* Статистика */}
        <div className="reviews-stats">
          <div className="stats-card">
            <div className="stats-number">{averageRating}</div>
            <div className="stats-label">
              {activeTab === 'received' ? t('reviews.averageRating') : t('reviews.averageGivenRating')}
            </div>
            <div className="stats-stars">
              {renderStars(Math.round(parseFloat(averageRating)))}
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-number">{currentReviews.length}</div>
            <div className="stats-label">
              {activeTab === 'received' ? t('reviews.totalReviews') : t('reviews.totalGivenReviews')}
            </div>
          </div>
        </div>

        {/* Табы */}
        <div className="reviews-tabs">
          <button 
            className={`tab-button ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            <StarIcon className="tab-icon" />
            <span>{t('reviews.receivedReviews')}</span>
            <span className="tab-count">({receivedReviews.length})</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'given' ? 'active' : ''}`}
            onClick={() => setActiveTab('given')}
          >
            <ChatBubbleLeftRightIcon className="tab-icon" />
            <span>{t('reviews.givenReviews')}</span>
            <span className="tab-count">({givenReviews.length})</span>
          </button>
        </div>

        {/* Список отзывов */}
        <div className="reviews-list">
          {currentReviews.length > 0 ? (
            currentReviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="review-author">
                    <div className="author-avatar">
                      {review.author.avatar ? (
                        <img src={review.author.avatar} alt={review.author.name} />
                      ) : (
                        <UserIcon className="avatar-icon" />
                      )}
                    </div>
                    <div className="author-info">
                      <div className="author-name">{review.author.name}</div>
                      <div className="review-date">
                        <CalendarIcon className="date-icon" />
                        {formatDate(review.date)}
                      </div>
                    </div>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                <div className="review-listing">
                  <div className="listing-title">{review.listingTitle}</div>
                  <div className="listing-price">{review.listingPrice}</div>
                </div>
                
                <div className="review-comment">
                  {review.comment}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-reviews">
              <StarIcon className="empty-icon" />
              <h3 className="empty-title">
                {activeTab === 'received' 
                  ? t('reviews.noReceivedReviews') 
                  : t('reviews.noGivenReviews')
                }
              </h3>
              <p className="empty-description">
                {activeTab === 'received' 
                  ? t('reviews.noReceivedReviewsDescription') 
                  : t('reviews.noGivenReviewsDescription')
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsView; 