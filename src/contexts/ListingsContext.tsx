import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Listing } from '../types';
import { newId } from '../utils/id';

interface ListingsContextType {
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'views' | 'favorites'>) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  getUserListings: (userId: string) => Listing[];
  getPublishedListings: (page?: number, limit?: number) => { listings: Listing[]; hasMore: boolean };
  loadMoreListings: () => Promise<void>;
  isLoading: boolean;
  hasMore: boolean;
  incrementViews: (listingId: string) => void;
  incrementFavorites: (listingId: string) => void;
  decrementFavorites: (listingId: string) => void;
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

// Начальные данные из AnnouncementsView
const initialListings: Listing[] = [
  // Мебель - комоды
  { 
    id: '1', 
    title: "Комод из массива дерева", 
    price: "45.000", 
    currency: 'RSD', 
    city: "Белград", 
    category: "furniture", 
    sellerName: "Алексей Петров", 
    isCompany: false, 
    imageName: "chest-1", 
    images: [
      { id: 'img-chest-1-1', src: "/images/chest-1.jpg", alt: "Комод из массива дерева", w: 800, h: 600 },
      { id: 'img-chest-1-2', src: "/images/chest-2.jpg", alt: "Комод из массива дерева", w: 800, h: 600 },
      { id: 'img-chest-1-3', src: "/images/chest-3.jpg", alt: "Комод из массива дерева", w: 800, h: 600 },
      { id: 'img-chest-1-4', src: "/images/chest-4.jpg", alt: "Комод из массива дерева", w: 800, h: 600 }
    ],
    description: "Качественный комод из массива дерева, изготовленный вручную. Идеально подходит для спальни или детской комнаты. Имеет 4 вместительных ящика и стильный дизайн. Состояние отличное, все механизмы работают исправно.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '1', 
    status: 'active', 
    views: 45, 
    favorites: 3, 
    isPublished: true,
    characteristics: {
      "Материал": "Массив дерева",
      "Состояние": "Отличное",
      "Размеры": "120x45x80 см",
      "Цвет": "Натуральный"
    },
    delivery: 'pickup',
    contactMethod: 'chat'
  },
  { 
    id: '2', 
    title: "Винтажный комод с зеркалом", 
    price: "32.000", 
    currency: 'RSD', 
    city: "Нови Сад", 
    category: "furniture", 
    sellerName: "Мария Иванова", 
    isCompany: false, 
    imageName: "vintage-chest-1", 
    images: [
      { id: 'img-vintage-1', src: "/images/vintage-chest-1.jpg", alt: "Винтажный комод", w: 800, h: 600 },
      { id: 'img-vintage-2', src: "/images/vintage-chest-2.jpg", alt: "Винтажный комод", w: 800, h: 600 },
      { id: 'img-vintage-3', src: "/images/vintage-chest-3.jpg", alt: "Винтажный комод", w: 800, h: 600 },
      { id: 'img-vintage-4', src: "/images/vintage-chest-4.jpg", alt: "Винтажный комод", w: 800, h: 600 }
    ],
    description: "Уникальный винтажный комод с большим зеркалом в стиле ретро. Идеально подходит для прихожей или спальни. Зеркало в отличном состоянии, рама украшена резными элементами. Комод имеет 3 ящика и полку для обуви.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '2', 
    status: 'active', 
    views: 32, 
    favorites: 2, 
    isPublished: true,
    characteristics: {
      "Стиль": "Винтажный",
      "Состояние": "Хорошее",
      "Материал": "Дерево",
      "Зеркало": "Есть"
    },
    delivery: 'delivery',
    contactMethod: 'phone'
  },
  { 
    id: '3', 
    title: "Современный комод белый", 
    price: "28.500", 
    currency: 'RSD', 
    city: "Ниш", 
    category: "furniture", 
    sellerName: "Игорь Сидоров", 
    isCompany: true, 
    imageName: "modern-chest-1", 
    images: [
      { id: 'img-modern-1', src: "/images/modern-chest-1.jpg", alt: "Современный комод", w: 800, h: 600 },
      { id: 'img-modern-2', src: "/images/modern-chest-2.jpg", alt: "Современный комод", w: 800, h: 600 }
    ],
    description: "Современный белый комод в стиле минимализм. Идеально подходит для современного интерьера. Имеет 5 ящиков с плавным выдвижением и скрытые ручки. Материал высокого качества, легко собирается.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '3', 
    status: 'active', 
    views: 28, 
    favorites: 1, 
    isPublished: true,
    characteristics: {
      "Стиль": "Современный",
      "Цвет": "Белый",
      "Материал": "ЛДСП",
      "Состояние": "Новое"
    },
    delivery: 'pickup',
    contactMethod: 'chat'
  },
  { 
    id: '4', 
    title: "Комод в стиле лофт", 
    price: "38.000", 
    currency: 'RSD', 
    city: "Крагуевац", 
    category: "furniture", 
    sellerName: "Елена Козлова", 
    isCompany: false, 
    imageName: "loft-chest-1", 
    images: [
      { id: "img-loft-1", src: "/images/loft-chest-1.jpg", alt: "Комод в стиле лофт", w: 800, h: 600 },
      { id: "img-loft-2", src: "/images/loft-chest-2.jpg", alt: "Комод в стиле лофт", w: 800, h: 600 }
    ],
    description: "Стильный комод в стиле лофт с металлическим каркасом и деревянными фасадами. Идеально подходит для современных интерьеров. Имеет 4 ящика с металлическими ручками и открытую полку сверху.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '4', 
    status: 'active', 
    views: 38, 
    favorites: 4, 
    isPublished: true,
    characteristics: {
      "Стиль": "Лофт",
      "Материал": "Металл + дерево",
      "Состояние": "Отличное",
      "Размеры": "120x45x80 см",
      "Цвет": "Черный"
    },
    delivery: 'delivery',
    contactMethod: 'chat'
  },
  // Работа в офисе
  { 
    id: '5', 
    title: "Работа в офисе - администратор", 
    price: "1000", 
    currency: 'EUR', 
    city: "Белград", 
    category: "vacancies", 
    sellerName: "Дмитрий Волков", 
    isCompany: true, 
    imageName: "office-admin", 
    description: "Требуется администратор в современный офис в центре Белграда. Обязанности: прием звонков, работа с документами, координация встреч. Условия: полная занятость, официальное трудоустройство, социальный пакет.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '5', 
    status: 'active', 
    views: 156, 
    favorites: 12, 
    isPublished: true,
    characteristics: {
      "Тип работы": "Полная занятость",
      "Опыт": "От 1 года",
      "Образование": "Высшее",
      "Языки": "Русский, английский"
    },
    contactMethod: 'phone'
  },
  { 
    id: '6', 
    title: "Офис-менеджер в IT компании", 
    price: "1200", 
    currency: 'EUR', 
    city: "Нови Сад", 
    category: "work", 
    subcategory: "vacancies",
    sellerName: "Анна Смирнова", 
    isCompany: true, 
    imageName: "office-manager", 
    description: "IT компания в Нови Саде ищет офис-менеджера. Обязанности: организация офисных процессов, координация команды, работа с поставщиками. Требования: опыт работы в IT сфере, знание английского языка.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '6', 
    status: 'active', 
    views: 189, 
    favorites: 15, 
    isPublished: true,
    characteristics: {
      "Тип работы": "Полная занятость",
      "Опыт": "От 2 лет",
      "Образование": "Высшее",
      "Языки": "Русский, английский, сербский"
    },
    contactMethod: 'chat'
  },
  { 
    id: '7', 
    title: "Секретарь в международной компании", 
    price: "900", 
    currency: 'EUR', 
    city: "Ниш", 
    category: "vacancies", 
    sellerName: "Алексей Петров", 
    isCompany: true, 
    imageName: "secretary", 
    description: "Международная компания в Нише приглашает на работу секретаря. Обязанности: делопроизводство, организация встреч, работа с клиентами. Условия: стабильная зарплата, карьерный рост, обучение.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '7', 
    status: 'active', 
    views: 134, 
    favorites: 8, 
    isPublished: true,
    characteristics: {
      "Тип работы": "Полная занятость",
      "Опыт": "От 1 года",
      "Образование": "Среднее специальное",
      "Языки": "Русский, английский"
    },
    contactMethod: 'phone'
  },
  // Недвижимость
  { 
    id: '8', 
    title: "2-комнатная квартира в центре", 
    price: "850", 
    currency: 'EUR', 
    city: "Белград", 
    category: "realEstate", 
    subcategory: "rent",
    sellerName: "Мария Иванова", 
    isCompany: false, 
    imageName: "apartment-2room", 
    images: [
      { id: "img-apartment-1", src: "/images/apartment-2room-1.jpg", alt: "2-комнатная квартира", w: 800, h: 600 },
      { id: "img-apartment-2", src: "/images/apartment-2room-2.jpg", alt: "2-комнатная квартира", w: 800, h: 600 }
    ],
    description: "Уютная 2-комнатная квартира в центре Белграда. Идеальное расположение рядом с транспортом и магазинами. Квартира полностью меблирована, есть кондиционер и интернет. Отличное состояние, свежий ремонт.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '8', 
    status: 'active', 
    views: 567, 
    favorites: 45, 
    isPublished: true,
    characteristics: {
      "Тип недвижимости": "Квартира",
      "Комнаты": "2",
      "Площадь": "65 м²",
      "Этаж": "5",
      "Состояние": "Отличное"
    },
    delivery: 'pickup',
    contactMethod: 'chat'
  },
  { 
    id: '9', 
    title: "Студия с ремонтом", 
    price: "650", 
    currency: 'EUR', 
    city: "Нови Сад", 
    category: "realEstate", 
    subcategory: "rent",
    sellerName: "Игорь Сидоров", 
    isCompany: true, 
    imageName: "studio-1", 
    images: [
      { id: "img-studio-1", src: "/images/studio-1.jpg", alt: "Студия с ремонтом", w: 800, h: 600 },
      { id: "img-studio-2", src: "/images/studio-2.jpg", alt: "Студия с ремонтом", w: 800, h: 600 },
      { id: "img-studio-3", src: "/images/studio-3.jpg", alt: "Студия с ремонтом", w: 800, h: 600 },
      { id: "img-studio-4", src: "/images/studio-4.jpg", alt: "Студия с ремонтом", w: 800, h: 600 },
      { id: "img-studio-5", src: "/images/studio-5.jpg", alt: "Студия с ремонтом", w: 800, h: 600 }
    ],
    description: "Современная студия в Нови Саде с качественным ремонтом. Идеально подходит для одного человека или пары. Есть вся необходимая мебель и техника. Рядом парк и остановка транспорта.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '9', 
    status: 'active', 
    views: 423, 
    favorites: 18, 
    isPublished: true,
    characteristics: {
      "Тип недвижимости": "Студия",
      "Количество комнат": "1",
      "Площадь": "35 м²",
      "Этаж": "3",
      "Состояние": "С ремонтом"
    },
    delivery: 'pickup',
    contactMethod: 'phone'
  },
  // Домашние растения
  { 
    id: '10', 
    title: "Монстера деликатесная", 
    price: "8.500", 
    currency: 'RSD', 
    city: "Ниш", 
    category: "plants", 
    sellerName: "Елена Козлова", 
    isCompany: false, 
    imageName: "monstera-1", 
    description: "Красивая монстера деликатесная высотой 80 см. Растение здоровое, с крупными резными листьями. Продается в красивом керамическом горшке. Идеально подходит для украшения интерьера.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '10', 
    status: 'active', 
    views: 67, 
    favorites: 5, 
    isPublished: true,
    characteristics: {
      "Вид": "Монстера деликатесная",
      "Высота": "80 см",
      "Состояние": "Отличное",
      "Горшок": "Включен"
    },
    delivery: 'delivery',
    contactMethod: 'chat'
  },
  { 
    id: '11', 
    title: "Фикус Бенджамина", 
    price: "6.200", 
    currency: 'RSD', 
    city: "Крагуевац", 
    category: "plants", 
    sellerName: "Дмитрий Волков", 
    isCompany: false, 
    imageName: "ficus-1", 
    description: "Фикус Бенджамина высотой 60 см в отличном состоянии. Растение с густой кроной и здоровыми листьями. Продается в пластиковом горшке. Неприхотлив в уходе, идеален для начинающих.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '11', 
    status: 'active', 
    views: 45, 
    favorites: 3, 
    isPublished: true,
    characteristics: {
      "Вид": "Фикус Бенджамина",
      "Высота": "60 см",
      "Состояние": "Хорошее",
      "Горшок": "Включен"
    },
    delivery: 'pickup',
    contactMethod: 'chat'
  },
  // Автомобили
  { 
    id: '12', 
    title: "BMW X5 2019 года", 
    price: "45.000", 
    currency: 'EUR', 
    city: "Белград", 
    category: "transport", 
    sellerName: "Анна Смирнова", 
    isCompany: true, 
    imageName: "bmw-1", 
    images: [
      { id: "img-bmw-1", src: "/images/bmw-1.jpg", alt: "BMW X5 2019", w: 800, h: 600 },
      { id: "img-bmw-2", src: "/images/bmw-2.jpg", alt: "BMW X5 2019", w: 800, h: 600 },
      { id: "img-bmw-3", src: "/images/bmw-3.jpg", alt: "BMW X5 2019", w: 800, h: 600 },
      { id: "img-bmw-4", src: "/images/bmw-4.jpg", alt: "BMW X5 2019", w: 800, h: 600 }
    ],
    description: "BMW X5 2019 года в отличном состоянии. Пробег 45,000 км, полный привод, автоматическая коробка передач. Комплектация: кожаный салон, навигация, камера заднего вида, парктроники.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '12', 
    status: 'active', 
    views: 234, 
    favorites: 12, 
    isPublished: true,
    characteristics: {
      "Марка": "BMW",
      "Модель": "X5",
      "Год": "2019",
      "Пробег": "45,000 км",
      "Топливо": "Бензин",
      "Коробка": "Автомат"
    },
    delivery: 'pickup',
    contactMethod: 'chat'
  },
  // Визаран
  { 
    id: '14', 
    title: "Визаран", 
    price: "Договорная", 
    currency: 'EUR', 
    city: "Ниш", 
    category: "services", 
    sellerName: "Мария Иванова", 
    isCompany: false, 
    imageName: "visaran-1", 
    description: "Профессиональные услуги по оформлению визарана. Опыт работы более 5 лет, все документы включены в стоимость. Быстрое оформление, индивидуальный подход к каждому клиенту.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '14', 
    status: 'active', 
    views: 234, 
    favorites: 16, 
    isPublished: true,
    characteristics: {
      "Тип услуги": "Визаран",
      "Документы": "Все включены",
      "Срок": "По договоренности",
      "Опыт": "5+ лет"
    },
    delivery: 'pickup',
    contactMethod: 'phone'
  },
  // iPhone
  { 
    id: '15', 
    title: "iPhone 16 Plus 256GB", 
    price: "1.250", 
    currency: 'EUR', 
    city: "Крагуевац", 
    category: "electronics", 
    sellerName: "Игорь Сидоров", 
    isCompany: false, 
    imageName: "iphone-1", 
    images: [
      { id: "img-iphone-1", src: "/images/iphone-1.jpg", alt: "iPhone 16 Plus", w: 800, h: 600 },
      { id: "img-iphone-2", src: "/images/iphone-2.jpg", alt: "iPhone 16 Plus", w: 800, h: 600 },
      { id: "img-iphone-3", src: "/images/iphone-3.jpg", alt: "iPhone 16 Plus", w: 800, h: 600 }
    ],
    description: "Новый iPhone 16 Plus 256GB в черном цвете. Телефон в оригинальной упаковке с полной гарантией. Все аксессуары в комплекте. Покупка в официальном магазине Apple.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '15', 
    status: 'active', 
    views: 345, 
    favorites: 28, 
    isPublished: true,
    characteristics: {
      "Бренд": "Apple",
      "Модель": "iPhone 16 Plus",
      "Память": "256GB",
      "Состояние": "Новое",
      "Гарантия": "Есть",
      "Цвет": "Черный"
    },
    delivery: 'delivery',
    contactMethod: 'chat'
  },
  // Лампа
  { 
    id: '16', 
    title: "Дизайнерская лампа настольная", 
    price: "12.000", 
    currency: 'RSD', 
    city: "Белград", 
    category: "furniture", 
    sellerName: "Елена Козлова", 
    isCompany: false, 
    imageName: "lamp-1", 
    images: [
      { id: "img-lamp-1", src: "/images/lamp-1.jpg", alt: "Дизайнерская лампа", w: 800, h: 600 },
      { id: "img-lamp-2", src: "/images/lamp-2.jpg", alt: "Дизайнерская лампа", w: 800, h: 600 }
    ],
    description: "Элегантная дизайнерская настольная лампа в золотом цвете. Изготовлена из металла и стекла, создает уютную атмосферу. Идеально подходит для рабочего стола или прикроватной тумбочки.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '16', 
    status: 'active', 
    views: 89, 
    favorites: 7, 
    isPublished: true,
    characteristics: {
      "Стиль": "Дизайнерский",
      "Материал": "Металл + стекло",
      "Цвет": "Золотой",
      "Тип": "Настольная"
    },
    delivery: 'pickup',
    contactMethod: 'chat'
  },
  // Груминг
  { 
    id: '17', 
    title: "Груминг для собак на дому", 
    price: "3.500", 
    currency: 'RSD', 
    city: "Нови Сад", 
    category: "services", 
    sellerName: "Дмитрий Волков", 
    isCompany: false, 
    imageName: "grooming-1", 
    description: "Профессиональный груминг собак на дому в Нови Саде. Опыт работы более 3 лет. Выезжаю к вам домой со всем необходимым оборудованием. Стрижка, мытье, стрижка когтей.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '17', 
    status: 'active', 
    views: 89, 
    favorites: 7, 
    isPublished: true,
    characteristics: {
      "Тип услуги": "Груминг",
      "Место": "На дому",
      "Животные": "Собаки",
      "Опыт": "3+ года"
    },
    delivery: 'pickup',
    contactMethod: 'phone'
  },
  // Велосипед
  { 
    id: '18', 
    title: "Велосипед горный", 
    price: "15.000", 
    currency: 'RSD', 
    city: "Ниш", 
    category: "sport", 
    sellerName: "Анна Смирнова", 
    isCompany: false, 
    imageName: "bike-1", 
    images: [
      { id: "img-bike-1", src: "/images/bike-1.jpg", alt: "Горный велосипед", w: 800, h: 600 },
      { id: "img-bike-2", src: "/images/bike-2.jpg", alt: "Горный велосипед", w: 800, h: 600 },
      { id: "img-bike-3", src: "/images/bike-3.jpg", alt: "Горный велосипед", w: 800, h: 600 },
      { id: "img-bike-4", src: "/images/bike-4.jpg", alt: "Горный велосипед", w: 800, h: 600 },
      { id: "img-bike-5", src: "/images/bike-5.jpg", alt: "Горный велосипед", w: 800, h: 600 }
    ],
    description: "Горный велосипед Trek 2020 года выпуска в хорошем состоянии. Размер рамы 18 дюймов, подходит для роста 170-185 см. Идеален для активного отдыха и спорта.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '18', 
    status: 'active', 
    views: 56, 
    favorites: 4, 
    isPublished: true,
    characteristics: {
      "Тип": "Горный велосипед",
      "Бренд": "Trek",
      "Размер рамы": "18\"",
      "Состояние": "Хорошее",
      "Год выпуска": "2020"
    },
    delivery: 'delivery',
    contactMethod: 'chat'
  },
  // Книги
  { 
    id: '19', 
    title: "Книги по программированию", 
    price: "2.500", 
    currency: 'RSD', 
    city: "Крагуевац", 
    category: "books", 
    sellerName: "Алексей Петров", 
    isCompany: false, 
    imageName: "books-1", 
    images: [
      { id: "img-books-1", src: "/images/books-1.jpg", alt: "Книги по программированию", w: 800, h: 600 },
      { id: "img-books-2", src: "/images/books-2.jpg", alt: "Книги по программированию", w: 800, h: 600 },
      { id: "img-books-3", src: "/images/books-3.jpg", alt: "Книги по программированию", w: 800, h: 600 },
      { id: "img-books-4", src: "/images/books-4.jpg", alt: "Книги по программированию", w: 800, h: 600 }
    ],
    description: "Коллекция из 5 книг по программированию на русском языке. Все книги в отличном состоянии, без пометок. Идеально подходят для изучения программирования с нуля.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '19', 
    status: 'active', 
    views: 34, 
    favorites: 2, 
    isPublished: true,
    characteristics: {
      "Жанр": "Программирование",
      "Язык": "Русский",
      "Количество": "5 книг",
      "Состояние": "Отличное"
    },
    delivery: 'pickup',
    contactMethod: 'chat'
  },
  // Детская одежда
  { 
    id: '20', 
    title: "Детская одежда", 
    price: "1.800", 
    currency: 'RSD', 
    city: "Белград", 
    category: "kids", 
    sellerName: "Мария Иванова", 
    isCompany: false, 
    imageName: "kids-clothes-1", 
    images: [
      { id: "img-kids-1", src: "/images/kids-clothes-1.jpg", alt: "Детская одежда", w: 800, h: 600 },
      { id: "img-kids-2", src: "/images/kids-clothes-2.jpg", alt: "Детская одежда", w: 800, h: 600 },
      { id: "img-kids-3", src: "/images/kids-clothes-3.jpg", alt: "Детская одежда", w: 800, h: 600 },
      { id: "img-kids-4", src: "/images/kids-clothes-4.jpg", alt: "Детская одежда", w: 800, h: 600 }
    ],
    description: "Качественная детская одежда для детей 3-4 лет. Комплект включает футболки, штаны и кофты. Все вещи в отличном состоянии, из натуральных материалов. Подходит для мальчиков и девочек.",
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '20', 
    status: 'active', 
    views: 67, 
    favorites: 5, 
    isPublished: true,
    characteristics: {
      "Тип": "Детская одежда",
      "Размер": "3-4 года",
      "Пол": "Унисекс",
      "Состояние": "Отличное",
      "Количество": "10 предметов"
    },
    delivery: 'delivery',
    contactMethod: 'chat'
  },
  { 
    id: '21', 
    title: "Щенок немецкой овчарки", 
    price: "25.000", 
    currency: 'RSD', 
    city: "Белград", 
    category: "animals", 
    sellerName: "Петр Козлов", 
    isCompany: false, 
    imageName: "", 
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '21', 
    status: 'active', 
    views: 89, 
    favorites: 12, 
    isPublished: true,
    characteristics: {
      "Порода": "Немецкая овчарка",
      "Возраст": "3 месяца",
      "Пол": "Мальчик",
      "Прививки": "Есть",
      "Документы": "Есть"
    },
    delivery: 'pickup',
    contactMethod: 'phone'
  },
  { 
    id: '22', 
    title: "Ремонт квартир под ключ", 
    price: "15.000", 
    currency: 'RSD', 
    city: "Нови Сад", 
    category: "construction", 
    sellerName: "Строительная компания", 
    isCompany: true, 
    imageName: "", 
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '22', 
    status: 'active', 
    views: 45, 
    favorites: 3, 
    isPublished: true,
    characteristics: {
      "Тип работ": "Ремонт под ключ",
      "Опыт": "10+ лет",
      "Гарантия": "2 года",
      "Сроки": "1-3 месяца"
    },
    delivery: 'pickup',
    contactMethod: 'phone'
  },
  { 
    id: '23', 
    title: "Бесплатно: детские игрушки", 
    price: "0", 
    currency: 'RSD', 
    city: "Ниш", 
    category: "free", 
    sellerName: "Анна Смирнова", 
    isCompany: false, 
    imageName: "", 
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '23', 
    status: 'active', 
    views: 156, 
    favorites: 8, 
    isPublished: true,
    characteristics: {
      "Тип": "Детские игрушки",
      "Возраст": "3-6 лет",
      "Состояние": "Хорошее",
      "Количество": "Много"
    },
    delivery: 'pickup',
    contactMethod: 'chat'
  },
  { 
    id: '24', 
    title: "Различные вещи для дома", 
    price: "5.000", 
    currency: 'RSD', 
    city: "Крагуевац", 
    category: "other", 
    sellerName: "Иван Дмитриев", 
    isCompany: false, 
    imageName: "", 
    createdAt: "2024-01-15T00:00:00.000Z", 
    userId: '24', 
    status: 'active', 
    views: 23, 
    favorites: 1, 
    isPublished: true,
    characteristics: {
      "Тип": "Различные вещи",
      "Состояние": "Хорошее",
      "Описание": "Много разных вещей"
    },
    delivery: 'pickup',
    contactMethod: 'chat'
  }
];

export const ListingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Функция для загрузки объявлений из localStorage
  const loadListingsFromStorage = (): Listing[] => {
    const savedListings = localStorage.getItem('listings');
    if (savedListings) {
      try {
        const listings = JSON.parse(savedListings);
        // Просто возвращаем сохраненные данные без модификации
        // Хук useListingImages сам разберется с изображениями
        return listings;
      } catch (error) {
        console.error('Ошибка при загрузке объявлений из localStorage:', error);
        localStorage.removeItem('listings');
      }
    }
    return initialListings;
  };

  // Функция для сохранения объявлений в localStorage
  const saveListingsToStorage = (listingsToSave: Listing[]) => {
    localStorage.setItem('listings', JSON.stringify(listingsToSave));
  };

  const [listings, setListings] = useState<Listing[]>(loadListingsFromStorage);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadedListings, setLoadedListings] = useState<Listing[]>([]);



  const ITEMS_PER_PAGE = 20;

  const addListing = (listingData: Omit<Listing, 'id' | 'createdAt' | 'views' | 'favorites'>) => {
    const newListing: Listing = {
      ...listingData,
      id: newId(),
      createdAt: "2024-01-15T00:00:00.000Z",
      views: 0,
      favorites: 0,
      status: 'active',
      isPublished: true,
      // Обработка изображений: добавляем id если их нет
      images: listingData.images?.map(img => ({ ...img, id: img.id || newId() }))
    };
    
    setListings(prev => {
      const updatedListings = [newListing, ...prev];
      saveListingsToStorage(updatedListings);
      return updatedListings;
    });
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    setListings(prev => {
      const updatedListings = prev.map(listing => {
        if (listing.id === id) {
          const updatedListing = { ...listing, ...updates };
          // Если обновляются изображения, добавляем id для новых
          if (updates.images) {
            updatedListing.images = updates.images.map(img => ({ 
              ...img, 
              id: img.id || newId() 
            }));
          }
          return updatedListing;
        }
        return listing;
      });
      saveListingsToStorage(updatedListings);
      return updatedListings;
    });
  };

  const deleteListing = (id: string) => {
    setListings(prev => {
      const updatedListings = prev.filter(listing => listing.id !== id);
      saveListingsToStorage(updatedListings);
      return updatedListings;
    });
  };

  const incrementViews = (listingId: string) => {
    setListings(prev => {
      const updatedListings = prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, views: (listing.views || 0) + 1 }
          : listing
      );
      saveListingsToStorage(updatedListings);
      return updatedListings;
    });
    
    // На продакшене здесь будет API запрос для сохранения статистики
    // Пример: await api.incrementViews(listingId);
    
    // Для демонстрации сохраняем в localStorage
    const stats = JSON.parse(localStorage.getItem('listing_stats') || '{}');
    stats[listingId] = stats[listingId] || {};
    stats[listingId].views = (stats[listingId].views || 0) + 1;
    localStorage.setItem('listing_stats', JSON.stringify(stats));
  };

  const incrementFavorites = (listingId: string) => {
    setListings(prev => {
      const updatedListings = prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, favorites: (listing.favorites || 0) + 1 }
          : listing
      );
      saveListingsToStorage(updatedListings);
      return updatedListings;
    });
    
    // На продакшене здесь будет API запрос для сохранения статистики
    // Пример: await api.incrementFavorites(listingId);
    
    // Для демонстрации сохраняем в localStorage
    const stats = JSON.parse(localStorage.getItem('listing_stats') || '{}');
    stats[listingId] = stats[listingId] || {};
    stats[listingId].favorites = (stats[listingId].favorites || 0) + 1;
    localStorage.setItem('listing_stats', JSON.stringify(stats));
  };

  const decrementFavorites = (listingId: string) => {
    setListings(prev => {
      const updatedListings = prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, favorites: Math.max(0, (listing.favorites || 0) - 1) }
          : listing
      );
      saveListingsToStorage(updatedListings);
      return updatedListings;
    });
    
    // На продакшене здесь будет API запрос для сохранения статистики
    // Пример: await api.decrementFavorites(listingId);
    
    // Для демонстрации сохраняем в localStorage
    const stats = JSON.parse(localStorage.getItem('listing_stats') || '{}');
    stats[listingId] = stats[listingId] || {};
    stats[listingId].favorites = Math.max(0, (stats[listingId].favorites || 0) - 1);
    localStorage.setItem('listing_stats', JSON.stringify(stats));
  };

  const getUserListings = (userId: string) => {
    return listings.filter(listing => listing.userId === userId);
  };

  const getPublishedListings = useCallback((page: number = 1, limit: number = ITEMS_PER_PAGE) => {
    const publishedListings = listings.filter(listing => listing.isPublished && listing.status === 'active');
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const pageListings = publishedListings.slice(startIndex, endIndex);
    
    return {
      listings: pageListings,
      hasMore: endIndex < publishedListings.length
    };
  }, [listings]);

  const loadMoreListings = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const nextPage = currentPage + 1;
    const { listings: newListings, hasMore: moreAvailable } = getPublishedListings(nextPage, ITEMS_PER_PAGE);
    
    setLoadedListings(prev => [...prev, ...newListings]);
    setCurrentPage(nextPage);
    setHasMore(moreAvailable);
    setIsLoading(false);
  };

  // Инициализация первой страницы
  React.useEffect(() => {
    const { listings: initialListings, hasMore: moreAvailable } = getPublishedListings(1, ITEMS_PER_PAGE);
    setLoadedListings(initialListings);
    setHasMore(moreAvailable);
  }, [listings, getPublishedListings]);

  return (
    <ListingsContext.Provider value={{
      listings: loadedListings,
      addListing,
      updateListing,
      deleteListing,
      getUserListings,
      getPublishedListings,
      loadMoreListings,
      isLoading,
      hasMore,
      incrementViews,
      incrementFavorites,
      decrementFavorites
    }}>
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingsContext);
  if (context === undefined) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  return context;
}; 