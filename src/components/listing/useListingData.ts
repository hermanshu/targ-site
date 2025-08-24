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
        // Пока используем моковые данные
        const mockListing: NormalizedListing = {
          id,
          title: 'Винтажный комод с зеркалом',
          description: 'Прекрасный винтажный комод с зеркалом в отличном состоянии. Изготовлен из качественного дерева, имеет классический дизайн, который подойдет к любому интерьеру.',
          price: 15000,
          currency: 'RSD',
          images: [
            { src: '/images/chest-1.jpg', alt: 'Винтажный комод', w: 800, h: 600 },
            { src: '/images/chest-2.jpg', alt: 'Комод с зеркалом', w: 800, h: 600 },
            { src: '/images/chest-3.jpg', alt: 'Детали комода', w: 800, h: 600 },
            { src: '/images/chest-4.jpg', alt: 'Интерьер с комодом', w: 800, h: 600 }
          ],
          category: 'furniture',
          city: 'Белград',
          createdAt: new Date().toISOString(),
          views: 156,
          delivery: 'pickup',
          contactMethod: 'both',
          characteristics: {
            brand: 'Vintage',
            material: 'Дерево',
            condition: 'Отличное',
            dimensions: '120x45x85 см',
            year: '1980'
          },
          seller: {
            id: 'seller-1',
            name: 'Анна Петрова',
            isCompany: false,
            rating: 4.8,
            deals: 23,
            online: true
          }
        };

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