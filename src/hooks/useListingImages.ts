import { useState, useEffect } from 'react';

interface UseListingImagesProps {
  imageName: string;
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
 * Хук для работы с изображениями объявлений
 * 
 * Автоматически определяет количество изображений для объявления
 * и предоставляет функции для навигации между ними
 * 
 * @param imageName - имя изображения из объявления
 * @returns объект с функциями и состоянием для работы с изображениями
 */
export const useListingImages = ({ imageName }: UseListingImagesProps) => {
  const [totalImages, setTotalImages] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Сбрасываем индекс при смене объявления
    setCurrentIndex(0);
    
    // Определяем количество изображений из конфигурации
    const imageCount = MULTI_IMAGE_CONFIG[imageName] || 1;
    setTotalImages(imageCount);
  }, [imageName]);

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
    // Если это объявление с множественными изображениями
    if (MULTI_IMAGE_CONFIG[imageName]) {
      // Извлекаем базовое имя из imageName (например, 'studio-1' -> 'studio')
      const baseName = imageName.replace(/-1$/, '');
      return `/images/${baseName}-${currentIndex + 1}.jpg`;
    }
    
    // Для обычных объявлений с одним изображением
    return `/images/${imageName}.jpg`;
  };

  return {
    currentIndex,        // Текущий индекс изображения (начиная с 0)
    totalImages,         // Общее количество изображений
    nextImage,          // Функция для перехода к следующему изображению
    prevImage,          // Функция для перехода к предыдущему изображению
    getImageSrc,        // Функция для получения пути к текущему изображению
    hasMultipleImages: totalImages > 1  // Флаг наличия множественных изображений
  };
}; 