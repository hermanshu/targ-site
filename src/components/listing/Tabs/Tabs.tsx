import React, { useState, Suspense } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

// Ленивая загрузка компонентов вкладок
const Reviews = React.lazy(() => import('./Reviews'));
const QnA = React.lazy(() => import('./QnA'));
const Delivery = React.lazy(() => import('./Delivery'));

interface TabsProps {
  listingId: string;
}

export const Tabs: React.FC<TabsProps> = ({ listingId }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('reviews');

  const tabs = [
    { id: 'reviews', label: t('listingDetail.reviews'), component: Reviews },
    { id: 'qna', label: t('listingDetail.qna'), component: QnA },
    { id: 'delivery', label: t('listingDetail.delivery'), component: Delivery }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="listing-tabs">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="tab-content">
        <Suspense fallback={
          <div className="tab-loading">
            <div className="loading-spinner">⏳</div>
            <p>Загрузка...</p>
          </div>
        }>
          {ActiveComponent && <ActiveComponent listingId={listingId} />}
        </Suspense>
      </div>
    </div>
  );
}; 