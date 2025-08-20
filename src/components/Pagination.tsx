import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../hooks/useTranslation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
  className = ''
}) => {
  const { t } = useTranslation();

  // Если всего одна страница, не показываем пагинацию
  if (totalPages <= 1) {
    return null;
  }

  // Вычисляем диапазон отображаемых страниц
  const getVisiblePages = () => {
    const delta = 2; // Количество страниц с каждой стороны от текущей
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  // Вычисляем информацию о показываемых элементах
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Обработчик изменения количества элементов на странице
  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage);
    }
  };

  return (
    <div className={`pagination-container ${className}`}>
      {/* Левая часть - информация о показываемых элементах */}
      <div className="pagination-info">
        <span className="pagination-text">
          {t('pagination.showing')} {startItem}-{endItem} {t('pagination.of')} {totalItems} {t('pagination.items')}
        </span>
      </div>

      {/* Центральная часть - навигация по страницам */}
      <div className="pagination-navigation">
        {/* Кнопка "Предыдущая" */}
        <button
          className={`pagination-button pagination-prev ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label={t('pagination.previous')}
        >
          <ChevronLeftIcon className="pagination-icon" />
        </button>

        {/* Номера страниц */}
        <div className="pagination-pages">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="pagination-dots">...</span>
              ) : (
                <button
                  className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                  onClick={() => onPageChange(page as number)}
                  aria-label={`${t('pagination.page')} ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Кнопка "Следующая" */}
        <button
          className={`pagination-button pagination-next ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label={t('pagination.next')}
        >
          <ChevronRightIcon className="pagination-icon" />
        </button>
      </div>

      {/* Правая часть - выбор количества элементов на странице */}
      {onItemsPerPageChange && (
        <div className="pagination-items-per-page">
          <span className="pagination-text">{t('pagination.itemsPerPage')}:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="pagination-select"
            aria-label={t('pagination.selectItemsPerPage')}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination; 