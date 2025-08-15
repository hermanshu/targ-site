// Модели данных, основанные на Swift коде

export interface Listing {
  id: string;
  title: string;
  price: string;
  currency: 'EUR' | 'RSD';
  city: string;
  category: string;
  sellerName: string;
  isCompany: boolean;
  imageName: string;
  description?: string;
  createdAt: Date;
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

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export interface ChatPreview {
  id: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  participantId: string;
  participantName: string;
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