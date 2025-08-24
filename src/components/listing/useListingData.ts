import { useState, useEffect } from 'react';
import { Listing } from '../../types';
import { useListings } from '../../contexts/ListingsContext';

export const useListingData = (id: string) => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getPublishedListings } = useListings();

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

        // Получаем данные из контекста
        const { listings } = getPublishedListings();
        
        const foundListing = listings.find(l => l.id === id);
        
        if (!foundListing) {
          setError(`Объявление с ID ${id} не найдено`);
          setLoading(false);
          return;
        }
        
        // Имитируем задержку сети
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setListing(foundListing);
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
  }, [id, getPublishedListings]); // Добавляем getPublishedListings обратно для корректной работы

  return { listing, loading, error };
}; 