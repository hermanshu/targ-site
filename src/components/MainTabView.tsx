import React, { useRef, useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, PlusIcon, HeartIcon, ChatBubbleLeftRightIcon, UserIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, PlusIcon as PlusIconSolid, HeartIcon as HeartIconSolid, ChatBubbleLeftRightIcon as ChatIconSolid, UserIcon as UserIconSolid } from '@heroicons/react/24/solid';
import WebsiteAnnouncementsView from './WebsiteAnnouncementsView';
import MobileHomeView from './MobileHomeView';
import MobileMessagesView from './MobileMessagesView';
import ProfileView from './ProfileView';
import AuthenticatedProfileView from './AuthenticatedProfileView';
import AuthRequiredView from './AuthRequiredView';
import MessagesView from './MessagesView';
import MyListingsView from './MyListingsView';
import AddListingView from './AddListingView';
import FavoritesView from './FavoritesView';
import ListingDetailView from './ListingDetailView';
import NotificationsSettingsView from './NotificationsSettingsView';
import HelpAndSupportView from './HelpAndSupportView';
import ReviewsView from './ReviewsView';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTranslation } from '../hooks/useTranslation';
import { Listing } from '../types';

// Временные компоненты для демонстрации
const AddListingViewWrapper = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  
  if (!currentUser) {
    return (
      <AuthRequiredView 
        title={t('profile.addListingUnavailable')}
        description={t('profile.signInToAddListings')}
      />
    );
  }
  
  return <AddListingView />;
};

const FavoritesViewWrapper = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const { isFavorite, removeFromFavorites } = useFavorites();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const navigate = useNavigate();
  
  if (!currentUser) {
    return (
      <AuthRequiredView 
        title={t('favorites.favoritesUnavailable')}
        description={t('favorites.signInToAccessFavorites')}
      />
    );
  }

  const handleCardClick = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const handleBackToList = () => {
    setSelectedListing(null);
  };

  const handleFavoriteToggle = (listing: Listing) => {
    // В избранном всегда удаляем объявление
    removeFromFavorites(listing.id);
  };

  const handleNavigateToMessages = (listing: Listing) => {
    // В избранном просто показываем уведомление
    window.alert(t('favorites.goToMessagesForContact'));
  };

  const handleNavigateToProfile = (mode?: 'signin' | 'signup') => {
    if (mode === 'signup') {
      navigate('/profile?mode=signup');
    } else if (mode === 'signin') {
      navigate('/profile?mode=signin');
    } else {
      navigate('/profile');
    }
  };

  if (selectedListing) {
    return (
      <ListingDetailView
        listing={selectedListing}
        onBack={handleBackToList}
        onFavoriteToggle={handleFavoriteToggle}
        isFavorite={isFavorite(selectedListing.id)}
        onNavigateToMessages={handleNavigateToMessages}
        onNavigateToProfile={handleNavigateToProfile}
      />
    );
  }
  
  return <FavoritesView onCardClick={handleCardClick} />;
};

const MobileMessagesViewWrapper = () => {
  const navigate = useNavigate();
  
  const handleNavigateToMessages = (listing: Listing) => {
    // Логика навигации к сообщениям
    console.log('Navigate to messages for listing:', listing);
  };

  const handleNavigateToProfile = (mode?: 'signin' | 'signup') => {
    if (mode === 'signup') {
      navigate('/profile?mode=signup');
    } else if (mode === 'signin') {
      navigate('/profile?mode=signin');
    } else {
      navigate('/profile');
    }
  };

  return (
    <MobileMessagesView 
      onNavigateToMessages={handleNavigateToMessages}
      onNavigateToProfile={handleNavigateToProfile}
    />
  );
};

const MessagesViewWrapper = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  if (!currentUser) {
    return (
      <AuthRequiredView 
        title={t('messages.messagesUnavailable')}
        description={t('messages.signInToChat')}
      />
    );
  }

  const handleNavigateToMessages = (listing: Listing) => {
    // Логика навигации к сообщениям
    console.log('Navigate to messages for listing:', listing);
  };

  const handleNavigateToProfile = (mode?: 'signin' | 'signup') => {
    if (mode === 'signup') {
      navigate('/profile?mode=signup');
    } else if (mode === 'signin') {
      navigate('/profile?mode=signin');
    } else {
      navigate('/profile');
    }
  };

  return (
    <MessagesView 
      onNavigateToMessages={handleNavigateToMessages}
      onNavigateToProfile={handleNavigateToProfile}
    />
  );
};



const TabBar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [lensStyle, setLensStyle] = useState({ left: '0px', width: '0px' });

  const tabs = useMemo(() => {
    const baseTabs = [
      { name: t('navigation.home'), href: '/', icon: HomeIcon, activeIcon: HomeIconSolid },
      { name: t('navigation.messages'), href: '/messages', icon: ChatBubbleLeftRightIcon, activeIcon: ChatIconSolid },
      { name: t('navigation.favorites'), href: '/favorites', icon: HeartIcon, activeIcon: HeartIconSolid },
      { name: t('navigation.profile'), href: '/profile', icon: UserIcon, activeIcon: UserIconSolid },
    ];

    // Добавляем вкладку "Добавить" только для авторизованных пользователей
    if (currentUser) {
      baseTabs.splice(2, 0, { name: t('navigation.addListing'), href: '/add', icon: PlusIcon, activeIcon: PlusIconSolid });
    }

    return baseTabs;
  }, [currentUser, t]);

  // Находим активную вкладку и позиционируем линзу
  useEffect(() => {
    const updateLensPosition = () => {
      const activeTabIndex = tabs.findIndex(tab => tab.href === location.pathname);
      
      if (activeTabIndex >= 0 && tabRefs.current[activeTabIndex]) {
        const activeTab = tabRefs.current[activeTabIndex];
        const tabBar = activeTab?.parentElement;
        
        if (activeTab && tabBar && activeTab.offsetWidth > 0) {
          const tabRect = activeTab.getBoundingClientRect();
          const barRect = tabBar.getBoundingClientRect();
          
          if (tabRect.width > 0 && barRect.width > 0) {
            const left = tabRect.left - barRect.left;
            const width = tabRect.width * 0.85; // Уменьшаем ширину на 15%
            
            setLensStyle({
              left: `${left + (tabRect.width - width) / 2}px`, // Центрируем линзу
              width: `${width}px`
            });
          }
        }
      }
    };

    // Увеличиваем задержку для более стабильного рендера
    const timeoutId = setTimeout(updateLensPosition, 100);
    return () => clearTimeout(timeoutId);
  }, [location.pathname, tabs]);

  return (
    <div className="tab-bar">
      {/* Анимированная линза */}
      <div 
        className="tab-lens"
        style={{
          left: lensStyle.left,
          width: lensStyle.width
        }}
      />
      
      {tabs.map((tab, index) => {
        const isActive = location.pathname === tab.href;
        const Icon = isActive ? tab.activeIcon : tab.icon;
        
        return (
          <Link
            key={tab.name}
            ref={(el) => { tabRefs.current[index] = el; }}
            to={tab.href}
            className={`tab-item ${isActive ? 'active' : ''}`}
          >
            <Icon style={{ width: '24px', height: '24px' }} />
            <span style={{ marginTop: '4px' }}>{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

const MainTabView: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const isAuthenticated = !!currentUser;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <Router>
      <MainTabViewContent 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout} 
      />
    </Router>
  );
};

const MainTabViewContent: React.FC<{
  isAuthenticated: boolean;
  onLogout: () => void;
}> = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();

  // Определяем, нужно ли добавить фон профиля
  const shouldShowProfileBackground = !isAuthenticated && location.pathname === '/profile';

  return (
    <div className="main-container">
      <div className={`content-area ${shouldShowProfileBackground ? 'profile-background' : ''}`}>
        <Routes>
          <Route path="/" element={
            window.innerWidth <= 767 ? <MobileHomeView /> : <WebsiteAnnouncementsView />
          } />
          <Route path="/add" element={<AddListingViewWrapper />} />
          <Route path="/favorites" element={<FavoritesViewWrapper />} />
          <Route path="/messages" element={
            window.innerWidth <= 767 ? 
            <MobileMessagesViewWrapper /> : 
            <MessagesViewWrapper />
          } />
          <Route path="/my-listings" element={<MyListingsView />} />
          <Route path="/notifications-settings" element={<NotificationsSettingsView />} />
          <Route path="/help-support" element={<HelpAndSupportView />} />
          <Route path="/reviews" element={<ReviewsView />} />
          <Route path="/profile" element={
            isAuthenticated ? (
              <AuthenticatedProfileView 
                onLogout={onLogout}
              />
            ) : (
              <ProfileView />
            )
          } />
        </Routes>
      </div>
      <TabBar />
    </div>
  );
};

export default MainTabView; 