import { useState, useEffect } from 'react';
import { Listing } from '../../types';

export interface NormalizedListing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'RSD' | 'EUR';
  images: { src: string; alt?: string; w?: number; h?: number }[];
  category: string;
  subcategory?: string;
  city: string;
  createdAt: string; // ISO string
  views?: number;
  delivery?: 'pickup' | 'sellerDelivery';
  contactMethod?: 'chat' | 'phone' | 'both';
  characteristics?: Record<string, string | number>;
  seller: {
    id: string;
    name: string;
    isCompany: boolean;
    rating: number;
    deals: number;
    online?: boolean;
  };
}

export const useListingData = (id: string) => {
  const [listing, setListing] = useState<NormalizedListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        
        // Проверяем, что ID не пустой
        if (!id || id.trim() === '') {
          setError('ID объявления не указан');
          setLoading(false);
          return;
        }

        // TODO: Заменить на реальный API вызов
        // Пока используем моковые данные с разными объявлениями
        // Пока используем моковые данные с разными объявлениями
        const mockListings: Record<string, NormalizedListing> = {
          '1': {
            id: '1',
            title: 'Комод из массива дерева',
            description: 'Качественный комод из массива дерева, изготовленный вручную. Идеально подходит для спальни или детской комнаты. Имеет 4 вместительных ящика и стильный дизайн.',
            price: 45000,
            currency: 'RSD',
            images: [
              { src: '/images/chest-1.jpg', alt: 'Комод из массива дерева', w: 800, h: 600 },
              { src: '/images/chest-2.jpg', alt: 'Комод из массива дерева', w: 800, h: 600 },
              { src: '/images/chest-3.jpg', alt: 'Комод из массива дерева', w: 800, h: 600 },
              { src: '/images/chest-4.jpg', alt: 'Комод из массива дерева', w: 800, h: 600 }
            ],
            category: 'furniture',
            city: 'Белград',
            createdAt: new Date().toISOString(),
            views: 45,
            delivery: 'pickup',
            contactMethod: 'both',
            characteristics: {
              brand: 'Массив дерева',
              material: 'Дерево',
              condition: 'Отличное',
              dimensions: '120x45x80 см',
              color: 'Натуральный'
            },
            seller: {
              id: 'seller-1',
              name: 'Алексей Петров',
              isCompany: false,
              rating: 4.8,
              deals: 23,
              online: true
            }
          },
          '2': {
            id: '2',
            title: 'Винтажный комод с зеркалом',
            description: 'Уникальный винтажный комод с большим зеркалом в стиле ретро. Идеально подходит для прихожей или спальни. Зеркало в отличном состоянии, рама украшена резными элементами.',
            price: 32000,
            currency: 'RSD',
            images: [
              { src: '/images/vintage-chest-1.jpg', alt: 'Винтажный комод', w: 800, h: 600 },
              { src: '/images/vintage-chest-2.jpg', alt: 'Винтажный комод', w: 800, h: 600 },
              { src: '/images/vintage-chest-3.jpg', alt: 'Винтажный комод', w: 800, h: 600 },
              { src: '/images/vintage-chest-4.jpg', alt: 'Винтажный комод', w: 800, h: 600 }
            ],
            category: 'furniture',
            city: 'Нови Сад',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 день назад
            views: 32,
            delivery: 'sellerDelivery',
            contactMethod: 'both',
            characteristics: {
              brand: 'Vintage',
              material: 'Дерево',
              condition: 'Хорошее',
              dimensions: '120x45x85 см',
              mirror: 'Есть'
            },
            seller: {
              id: 'seller-2',
              name: 'Мария Иванова',
              isCompany: false,
              rating: 4.6,
              deals: 15,
              online: false
            }
          },
          '3': {
            id: '3',
            title: 'Современный комод белый',
            description: 'Современный белый комод в стиле минимализм. Идеально подходит для современного интерьера. Имеет 5 ящиков с плавным выдвижением и скрытые ручки.',
            price: 28500,
            currency: 'RSD',
            images: [
              { src: '/images/modern-chest-1.jpg', alt: 'Современный комод', w: 800, h: 600 },
              { src: '/images/modern-chest-2.jpg', alt: 'Современный комод', w: 800, h: 600 }
            ],
            category: 'furniture',
            city: 'Ниш',
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 дня назад
            views: 28,
            delivery: 'pickup',
            contactMethod: 'both',
            characteristics: {
              brand: 'Современный',
              material: 'ЛДСП',
              condition: 'Новое',
              dimensions: '120x45x80 см',
              color: 'Белый'
            },
            seller: {
              id: 'seller-3',
              name: 'Игорь Сидоров',
              isCompany: true,
              rating: 4.9,
              deals: 156,
              online: true
            }
          },
          '4': {
            id: '4',
            title: 'Комод в стиле лофт',
            description: 'Стильный комод в стиле лофт с металлическим каркасом и деревянными фасадами. Идеально подходит для современных интерьеров. Имеет 4 ящика с металлическими ручками и открытую полку сверху.',
            price: 38000,
            currency: 'RSD',
            images: [
              { src: '/images/loft-chest-1.jpg', alt: 'Комод в стиле лофт', w: 800, h: 600 },
              { src: '/images/loft-chest-2.jpg', alt: 'Комод в стиле лофт', w: 800, h: 600 }
            ],
            category: 'furniture',
            city: 'Крагуевац',
            createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 дня назад
            views: 38,
            delivery: 'sellerDelivery',
            contactMethod: 'both',
            characteristics: {
              brand: 'Лофт',
              material: 'Металл + дерево',
              condition: 'Отличное',
              dimensions: '120x45x80 см',
              color: 'Черный'
            },
            seller: {
              id: 'seller-4',
              name: 'Елена Козлова',
              isCompany: false,
              rating: 4.7,
              deals: 45,
              online: false
            }
          },
          '5': {
            id: '5',
            title: 'Работа в офисе - администратор',
            description: 'Требуется администратор в современный офис в центре Белграда. Обязанности: прием звонков, работа с документами, координация встреч. Условия: полная занятость, официальное трудоустройство, социальный пакет.',
            price: 1000,
            currency: 'EUR',
            images: [
              { src: '/images/office-admin.jpg', alt: 'Работа администратор', w: 800, h: 600 }
            ],
            category: 'work',
            subcategory: 'vacancies',
            city: 'Белград',
            createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 дня назад
            views: 156,
            delivery: 'pickup',
            contactMethod: 'phone',
            characteristics: {
              workType: 'Полная занятость',
              experience: 'От 1 года',
              education: 'Высшее',
              languages: 'Русский, английский'
            },
            seller: {
              id: 'seller-5',
              name: 'Дмитрий Волков',
              isCompany: true,
              rating: 4.5,
              deals: 67,
              online: true
            }
          },
          '6': {
            id: '6',
            title: 'Офис-менеджер в IT компании',
            description: 'IT компания в Нови Саде ищет офис-менеджера. Обязанности: организация офисных процессов, координация команды, работа с поставщиками. Требования: опыт работы в IT сфере, знание английского языка.',
            price: 1200,
            currency: 'EUR',
            images: [
              { src: '/images/office-manager.jpg', alt: 'Работа офис-менеджер', w: 800, h: 600 }
            ],
            category: 'work',
            subcategory: 'vacancies',
            city: 'Нови Сад',
            createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 дней назад
            views: 189,
            delivery: 'pickup',
            contactMethod: 'both',
            characteristics: {
              workType: 'Полная занятость',
              experience: 'От 2 лет',
              education: 'Высшее',
              languages: 'Русский, английский, сербский'
            },
            seller: {
              id: 'seller-6',
              name: 'Анна Смирнова',
              isCompany: true,
              rating: 4.6,
              deals: 89,
              online: false
            }
          },
          '7': {
            id: '7',
            title: 'Секретарь в международной компании',
            description: 'Международная компания в Нише приглашает на работу секретаря. Обязанности: делопроизводство, организация встреч, работа с клиентами. Условия: стабильная зарплата, карьерный рост, обучение.',
            price: 900,
            currency: 'EUR',
            images: [
              { src: '/images/secretary.jpg', alt: 'Работа секретарь', w: 800, h: 600 }
            ],
            category: 'work',
            subcategory: 'vacancies',
            city: 'Ниш',
            createdAt: new Date(Date.now() - 518400000).toISOString(), // 6 дней назад
            views: 134,
            delivery: 'pickup',
            contactMethod: 'phone',
            characteristics: {
              workType: 'Полная занятость',
              experience: 'От 1 года',
              education: 'Среднее специальное',
              languages: 'Русский, английский'
            },
            seller: {
              id: 'seller-7',
              name: 'Алексей Петров',
              isCompany: true,
              rating: 4.4,
              deals: 56,
              online: true
            }
          },
          '8': {
            id: '8',
            title: '2-комнатная квартира в центре',
            description: 'Уютная 2-комнатная квартира в центре Белграда. Идеальное расположение рядом с транспортом и магазинами. Квартира полностью меблирована, есть кондиционер и интернет. Отличное состояние, свежий ремонт.',
            price: 850,
            currency: 'EUR',
            images: [
              { src: '/images/apartment-2room-1.jpg', alt: '2-комнатная квартира', w: 800, h: 600 },
              { src: '/images/apartment-2room-2.jpg', alt: '2-комнатная квартира', w: 800, h: 600 }
            ],
            category: 'realEstate',
            subcategory: 'rent',
            city: 'Белград',
            createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 дней назад
            views: 567,
            delivery: 'pickup',
            contactMethod: 'both',
            characteristics: {
              propertyType: 'Квартира',
              rooms: '2',
              area: '65 м²',
              floor: '5',
              condition: 'Отличное'
            },
            seller: {
              id: 'seller-8',
              name: 'Мария Иванова',
              isCompany: false,
              rating: 4.8,
              deals: 123,
              online: false
            }
          },
          '9': {
            id: '9',
            title: 'Студия с ремонтом',
            description: 'Современная студия в Нови Саде с качественным ремонтом. Идеально подходит для одного человека или пары. Есть вся необходимая мебель и техника. Рядом парк и остановка транспорта.',
            price: 650,
            currency: 'EUR',
            images: [
              { src: '/images/studio-1.jpg', alt: 'Студия с ремонтом', w: 800, h: 600 },
              { src: '/images/studio-2.jpg', alt: 'Студия с ремонтом', w: 800, h: 600 },
              { src: '/images/studio-3.jpg', alt: 'Студия с ремонтом', w: 800, h: 600 },
              { src: '/images/studio-4.jpg', alt: 'Студия с ремонтом', w: 800, h: 600 },
              { src: '/images/studio-5.jpg', alt: 'Студия с ремонтом', w: 800, h: 600 }
            ],
            category: 'realEstate',
            subcategory: 'rent',
            city: 'Нови Сад',
            createdAt: new Date(Date.now() - 691200000).toISOString(), // 8 дней назад
            views: 423,
            delivery: 'pickup',
            contactMethod: 'both',
            characteristics: {
              propertyType: 'Студия',
              rooms: '1',
              area: '35 м²',
              floor: '3',
              condition: 'Отличное'
            },
            seller: {
              id: 'seller-9',
              name: 'Игорь Сидоров',
              isCompany: true,
              rating: 4.7,
              deals: 234,
              online: true
            }
          }
        };

        // Получаем объявление по ID или возвращаем первое как fallback
        const mockListing = mockListings[id] || mockListings['1'];

        // Имитируем задержку сети
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setListing(mockListing);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки объявления');
      } finally {
        setLoading(false);
      }
    };

    if (id && id.trim() !== '') {
      fetchListing();
    } else {
      setLoading(false);
      setError('ID объявления не указан');
    }
  }, [id]);

  return { listing, loading, error };
}; 