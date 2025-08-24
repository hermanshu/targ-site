import { useState, useEffect } from 'react';
import type { ListingImage } from '../types';
import { newId } from '../utils/id';

interface UseListingImagesProps {
  images?: ListingImage[];
  imageName?: string;
}

/**
 * Конфигурация для объявлений с множественными изображениями
 * 
 * Для добавления нового объявления с множественными изображениями:
 * 1. Добавьте запись в MULTI_IMAGE_CONFIG: 'imageName': количество_фотографий
 * 2. Загрузите фотографии в папку public/images/ с именами:
 *    - imageName-1.jpg (первая фотография)
 *    - imageName-2.jpg (вторая фотография)
 *    - imageName-3.jpg (третья фотография)
 *    - и так далее...
 * 
 * Пример:
 * Если imageName = 'apartment-1', то фотографии должны называться:
 * - apartment-1.jpg
 * - apartment-2.jpg
 * - apartment-3.jpg
 */
const MULTI_IMAGE_CONFIG: { [key: string]: number } = {
  'studio-1': 5,      // Студия с ремонтом - 5 фотографий
  'monstera-1': 2,    // Монстера деликатесная - 2 фотографии
  'bmw-1': 4,         // BMW X5 2019 года - 4 фотографии
  'visaran-1': 1,     // Визаран - 1 фотография
  'lamp-1': 2,        // Дизайнерская лампа настольная - 2 фотографии
  'grooming-1': 3,    // Груминг для собак на дому - 3 фотографии
  'iphone-1': 3,      // iPhone 16 Plus 256GB - 3 фотографии
  'bike-1': 5,        // Велосипед горный - 5 фотографий
  'books-1': 4,       // Книги по программированию - 4 фотографии
  'kids-clothes-1': 4, // Детская одежда - 4 фотографии
  'chest-1': 4,       // Комод из массива дерева - 4 фотографии
  'vintage-chest-1': 2, // Винтажный комод с зеркалом - 2 фотографии
  'modern-chest-1': 2, // Современный комод белый - 2 фотографии
  'loft-chest-1': 2,  // Комод в стиле лофт - 2 фотографии
  // Можно легко добавить другие объявления
  // 'ficus-1': 2,     // Фикус Бенджамина - 1 фотография (убрано)
  // 'apartment-1': 3,  // 2-комнатная квартира - 3 фотографии
};

/**
 * Функция для построения массива изображений из разных источников
 * Поддерживает как новую схему (images[]), так и старую (imageName + MULTI_IMAGE_CONFIG)
 */
export function buildImages(input: { images?: ListingImage[]; imageName?: string }, multiMap: Record<string, number>): ListingImage[] {
  // Проверяем, содержит ли массив images только fallback изображения
  const hasOnlyFallbackImages = input.images && input.images.length > 0 && 
    input.images.every(img => img.id && img.id.startsWith('fallback-'));
  
  // Если есть только fallback изображения, игнорируем их и используем imageName
  if (hasOnlyFallbackImages) {
    // Игнорируем fallback изображения
  } else if (input.images && input.images.length) {
    return input.images;
  }
  
  if (input.imageName) {
    const count = multiMap[input.imageName] ?? 1;
    
    const result = Array.from({ length: count }, (_, i) => {
      // Для первого изображения используем базовое имя, для остальных добавляем номер
      const baseName = input.imageName!; // Мы знаем, что imageName существует здесь
      const fileName = i === 0 ? baseName : `${baseName.replace(/-1$/, '')}-${i + 1}`;
      return {
        id: newId(),
        src: `/images/${fileName}.jpg`,
        alt: baseName
      };
    });
    
    return result;
  }
  
  return [];
}

/**
 * Хук для работы с изображениями объявлений
 * 
 * Автоматически определяет количество изображений для объявления
 * и предоставляет функции для навигации между ними
 * 
 * @param images - массив изображений (предпочтительно)
 * @param imageName - имя изображения из объявления (fallback)
 * @returns объект с функциями и состоянием для работы с изображениями
 */
export const useListingImages = ({ images, imageName }: UseListingImagesProps) => {
  const [totalImages, setTotalImages] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processedImages, setProcessedImages] = useState<ListingImage[]>([]);

  useEffect(() => {
    // Сбрасываем индекс при смене объявления
    setCurrentIndex(0);
    
    // Строим массив изображений с поддержкой обеих схем
    const builtImages = buildImages({ images, imageName }, MULTI_IMAGE_CONFIG);
    
    setProcessedImages(builtImages);
    setTotalImages(builtImages.length);
  }, [images, imageName]);

  /**
   * Переход к следующему изображению
   */
  const nextImage = () => {
    setCurrentIndex(prev => prev < totalImages - 1 ? prev + 1 : 0);
  };

  /**
   * Переход к предыдущему изображению
   */
  const prevImage = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : totalImages - 1);
  };

  /**
   * Получение пути к текущему изображению
   */
  const getImageSrc = () => {
    if (processedImages.length > 0) {
      return processedImages[currentIndex]?.src || '';
    }
    return '';
  };

  /**
   * Получение текущего изображения
   */
  const getCurrentImage = () => {
    return processedImages[currentIndex];
  };

  return {
    currentIndex,        // Текущий индекс изображения (начиная с 0)
    totalImages,         // Общее количество изображений
    nextImage,          // Функция для перехода к следующему изображению
    prevImage,          // Функция для перехода к предыдущему изображению
    getImageSrc,        // Функция для получения пути к текущему изображению
    getCurrentImage,    // Функция для получения текущего изображения
    hasMultipleImages: totalImages > 1,  // Флаг наличия множественных изображений
    images: processedImages               // Обработанный массив изображений
  };
}; 