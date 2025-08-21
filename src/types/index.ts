// Модели данных, основанные на Swift коде

// Основные типы
export interface Listing {
  id: string;
  title: string;
  price: string;
  currency: 'EUR' | 'RSD';
  city: string;
  category: string;
  subcategory?: string;
  sellerName: string;
  isCompany: boolean;
  imageName: string;
  description?: string;
  createdAt: Date | string;
  userId: string;
  // Дополнительные поля для "Мои объявления"
  status?: 'active' | 'archived' | 'draft';
  views?: number;
  favorites?: number;
  isPublished?: boolean;
  characteristics?: Record<string, string>;
  contactMethod?: 'phone' | 'chat';
  delivery?: 'pickup' | 'delivery';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories?: string[];
}





export interface User {
  id: string;
  name: string;
  email: string;
  isCompany: boolean;
  phone?: string;
  avatar?: string;
  createdAt?: Date;
  emailVerified?: boolean;
}

export interface LanguageOption {
  flag: string;
  name: string;
  code: string;
}

export type AppLanguage = 'RU' | 'EN' | 'SR';

// Система рейтинга и отзывов
export interface Review {
  id: string;
  reviewerId: string;
  sellerId: string;
  listingId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: Date;
  isVerified: boolean;
  reviewerName: string;
}

export interface SellerRating {
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
} 