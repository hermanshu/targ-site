import React, { lazy, Suspense } from 'react';

// Ленивая загрузка тяжелых компонентов
export const LazyMessagesView = lazy(() => import('./MessagesView'));
export const LazyEditListingView = lazy(() => import('./EditListingView'));
export const LazyAddListingView = lazy(() => import('./AddListingView'));
export const LazySellerProfileView = lazy(() => import('./SellerProfileView'));

// Компонент загрузки
export const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Загрузка...</p>
  </div>
);

// HOC для ленивой загрузки с fallback
export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => (
    <Suspense fallback={<LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  );
}; 