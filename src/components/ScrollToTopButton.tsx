import React, { useState, useEffect } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Показываем кнопку когда пользователь прокрутил больше 300px
  const toggleVisibility = () => {
    const contentArea = document.querySelector('.content-area');
    const scrollTop = contentArea ? contentArea.scrollTop : window.pageYOffset;
    
    if (scrollTop > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Прокручиваем наверх
  const scrollToTop = () => {
    console.log('Нажата кнопка "Наверх"');
    // Прокручиваем к началу списка объявлений
    const listingsGrid = document.querySelector('.website-listings-grid');
    const contentArea = document.querySelector('.content-area');
    
    if (listingsGrid && contentArea) {
      // Вычисляем позицию элемента относительно content-area
      const contentRect = contentArea.getBoundingClientRect();
      const gridRect = listingsGrid.getBoundingClientRect();
      const scrollTop = contentArea.scrollTop + (gridRect.top - contentRect.top);
      
      contentArea.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    } else if (contentArea) {
      // Fallback на content-area
      contentArea.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const contentArea = document.querySelector('.content-area');
    const target = contentArea || window;
    
    target.addEventListener('scroll', toggleVisibility);
    return () => {
      target.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top-button"
          title="Наверх"
        >
          <ChevronUpIcon className="scroll-to-top-icon" />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton; 