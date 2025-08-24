import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Review, SellerRating } from '../types';
import { newId } from '../utils/id';
import { nowIso } from '../utils/datetime';

interface ReviewsContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getSellerRating: (sellerId: string) => SellerRating;
  getReviewsBySeller: (sellerId: string) => Review[];
  hasUserReviewedSeller: (userId: string, sellerId: string) => boolean;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};

interface ReviewsProviderProps {
  children: ReactNode;
}

// Тестовые данные для отзывов
const initialReviews: Review[] = [
  {
    id: '1',
    reviewerId: 'user1',
    sellerId: '1', // Алексей Петров
    listingId: 'listing1',
    rating: 5,
    comment: 'Отличный продавец! Товар точно как на фото, доставка быстрая.',
    createdAt: '2024-01-15T00:00:00.000Z',
    isVerified: true,
    reviewerName: 'Анна К.'
  },
  {
    id: '2',
    reviewerId: 'user2',
    sellerId: '1', // Алексей Петров
    listingId: 'listing2',
    rating: 4,
    comment: 'Хороший продавец, рекомендую. Товар качественный.',
    createdAt: '2024-01-10T00:00:00.000Z',
    isVerified: true,
    reviewerName: 'Михаил П.'
  },
  {
    id: '3',
    reviewerId: 'user3',
    sellerId: '2', // Мария Иванова
    listingId: 'listing3',
    rating: 3,
    comment: 'Нормально, но можно было бы лучше.',
    createdAt: '2024-01-08T00:00:00.000Z',
    isVerified: true,
    reviewerName: 'Елена С.'
  },
  {
    id: '4',
    reviewerId: 'user4',
    sellerId: '3', // Игорь Сидоров
    listingId: 'listing4',
    rating: 5,
    comment: 'Отличная компания! Быстрая доставка, качественный товар.',
    createdAt: '2024-01-12T00:00:00.000Z',
    isVerified: true,
    reviewerName: 'Дмитрий В.'
  },
  {
    id: '5',
    reviewerId: 'user5',
    sellerId: '3', // Игорь Сидоров
    listingId: 'listing5',
    rating: 4,
    comment: 'Хорошая компания, рекомендую.',
    createdAt: '2024-01-09T00:00:00.000Z',
    isVerified: true,
    reviewerName: 'Ольга М.'
  }
];

export const ReviewsProvider: React.FC<ReviewsProviderProps> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    const savedReviews = localStorage.getItem('reviews');
    return savedReviews ? JSON.parse(savedReviews) : initialReviews;
  });

  const saveReviewsToStorage = (reviewsToSave: Review[]) => {
    localStorage.setItem('reviews', JSON.stringify(reviewsToSave));
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: newId(),
      createdAt: nowIso()
    };

    setReviews(prev => {
      const updatedReviews = [newReview, ...prev];
      saveReviewsToStorage(updatedReviews);
      return updatedReviews;
    });
  };

  const getSellerRating = (sellerId: string): SellerRating => {
    const sellerReviews = reviews.filter(review => review.sellerId === sellerId);
    
    if (sellerReviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        reviews: []
      };
    }

    const totalRating = sellerReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Math.round((totalRating / sellerReviews.length) * 10) / 10;

    return {
      averageRating,
      totalReviews: sellerReviews.length,
      reviews: sellerReviews.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    };
  };

  const getReviewsBySeller = (sellerId: string): Review[] => {
    return reviews
      .filter(review => review.sellerId === sellerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const hasUserReviewedSeller = (userId: string, sellerId: string): boolean => {
    return reviews.some(review => 
      review.reviewerId === userId && review.sellerId === sellerId
    );
  };

  const value = {
    reviews,
    addReview,
    getSellerRating,
    getReviewsBySeller,
    hasUserReviewedSeller
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
}; 