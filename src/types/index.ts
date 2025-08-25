// Модели данных, основанные на Swift коде

// Основные типы
export type Currency = 'RSD' | 'EUR';

export interface ListingImage {
  id: string;
  src: string;
  w?: number;
  h?: number;
  alt?: string;
}

export interface Listing {
  id: string;
  title: string;
  price: string;
  currency: Currency;
  city: string;
  category: string;
  subcategory?: string;
  sellerName: string;
  isCompany: boolean;
  // НОВОЕ: предпочтительно использовать images[]
  images?: ListingImage[];
  // СТАРОЕ: fallback для обратной совместимости
  imageName?: string;
  description?: string;
  createdAt: string; // ISO строка
  updatedAt?: string; // ISO строка
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
  createdAt: string; // ISO строка
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
  createdAt: string; // ISO строка
  isVerified: boolean;
  reviewerName: string;
}

export interface SellerRating {
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

// Система отслеживания диалогов
export interface Dialog {
  id: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  createdAt: string; // ISO строка
  lastMessageAt: string; // ISO строка
  messageCount: number;
  isActive: boolean;
  hasSellerResponse: boolean; // Есть ли ответ от продавца
  buyerMessageCount: number; // Количество сообщений от покупателя
  sellerMessageCount: number; // Количество сообщений от продавца
} 