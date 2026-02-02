import React, { Suspense } from 'react';
import { ListingsGridSkeleton } from './LoadingSkeletons';

/**
 * Обёртка для lazy-loaded компонентов с fallback UI
 */
export const LazyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<ListingsGridSkeleton count={8} />}>{children}</Suspense>
);
