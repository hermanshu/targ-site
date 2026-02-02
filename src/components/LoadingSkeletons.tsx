import React from 'react';

/**
 * Скелетон для карточки объявления
 */
export const ListingCardSkeleton: React.FC = () => (
  <div className="bg-gray-200 rounded-lg overflow-hidden animate-pulse">
    <div className="w-full h-40 bg-gray-300" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-300 rounded w-1/2" />
      <div className="h-4 bg-gray-300 rounded w-full" />
    </div>
  </div>
);

/**
 * Скелетон для сетки объявлений
 */
export const ListingsGridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ListingCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Скелетон для детальной страницы объявления
 */
export const ListingDetailSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="w-full h-96 bg-gray-300 rounded-lg" />
    <div className="space-y-2">
      <div className="h-8 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-full" />
      <div className="h-4 bg-gray-300 rounded w-full" />
      <div className="h-4 bg-gray-300 rounded w-2/3" />
    </div>
  </div>
);

/**
 * Скелетон для профиля
 */
export const ProfileSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gray-300 rounded-full" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="h-3 bg-gray-300 rounded w-1/3" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-full" />
      <div className="h-4 bg-gray-300 rounded w-full" />
    </div>
  </div>
);

/**
 * Ошибка загрузки
 */
export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = 'Ошибка',
  message = 'Не удалось загрузить данные',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-4xl mb-4">⚠️</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Попробовать еще раз
      </button>
    )}
  </div>
);

/**
 * Пусто
 */
export const EmptyState: React.FC<{
  title?: string;
  message?: string;
  icon?: string;
}> = ({
  title = 'Ничего не найдено',
  message = 'Попробуйте изменить фильтры',
  icon = '📭',
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{message}</p>
  </div>
);
