import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, PlusIcon, HeartIcon, ChatBubbleLeftRightIcon, UserIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
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
import WelcomeModal from './WelcomeModal';
import SellerProfileView from './SellerProfileView';
import SortSheet from './SortSheet';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useListings } from '../contexts/ListingsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { useDeviceType } from '../hooks/useDeviceType';
import { Listing } from '../types';

// Временные компоненты для демонстрации
const SellerProfileViewWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const sellerId = searchParams.get('sellerId');
  const sellerName = searchParams.get('sellerName');
  const isCompany = searchParams.get('isCompany') === 'true';
  
  if (!sellerId || !sellerName) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Продавец не найден</h2>
        <p>Отсутствуют необходимые параметры: sellerId или sellerName</p>
        <button onClick={() => navigate('/')}>Вернуться на главную</button>
      </div>
    );
  }
  
  const handleBack = () => {
    navigate(-1); // Возврат на предыдущую страницу
  };
  
  const handleNavigateToMessages = (listing: Listing) => {
    // Навигация к сообщениям
    navigate('/messages');
  };
  
  return (
    <SellerProfileView
      sellerId={sellerId}
      sellerName={sellerName}
      isCompany={isCompany}
      onBack={handleBack}
      onNavigateToMessages={handleNavigateToMessages}
    />
  );
};

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
  const { incrementViews } = useListings();
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
    // Увеличиваем счетчик просмотров при клике на карточку
    incrementViews(listing.id);
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

  const handleNavigateToSellerProfile = (sellerId: string, sellerName: string, isCompany: boolean) => {
    // Навигация к отдельной странице профиля продавца
    const params = new URLSearchParams({
      sellerId,
      sellerName,
      isCompany: isCompany.toString()
    });
    navigate(`/seller?${params.toString()}`);
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
        onNavigateToSellerProfile={handleNavigateToSellerProfile}
      />
    );
  }
  
  return <FavoritesView onCardClick={handleCardClick} />;
};

const MobileMessagesViewWrapper = () => {
  const navigate = useNavigate();
  
  const handleNavigateToMessages = (listing: Listing) => {
    // Логика навигации к сообщениям
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
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

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

  // Функция для подсчета непрочитанных сообщений
  const calculateUnreadMessages = useCallback(() => {
    // Не подсчитываем сообщения для неавторизованных пользователей
    if (!currentUser) {
      setUnreadMessagesCount(0);
      return;
    }
    
    try {
      const chatsData = localStorage.getItem('targ-chats');
      if (chatsData) {
        const chats = JSON.parse(chatsData);
        const totalUnread = chats.reduce((sum: number, chat: any) => sum + (chat.unreadCount || 0), 0);
        setUnreadMessagesCount(totalUnread);
      }
    } catch (error) {
      console.error('Ошибка при подсчете непрочитанных сообщений:', error);
    }
  }, [currentUser]);

  // Обновляем счетчик при изменении localStorage
  useEffect(() => {
    // Принудительно инициализируем тестовые данные, если их нет
    const existingChats = localStorage.getItem('targ-chats');
    if (!existingChats) {
      const testChats = [
        {
          id: '1',
          name: 'Алексей Петров',
          lastMessage: 'Здравствуйте! Интересует ваш товар',
          timestamp: '14:30',
          unreadCount: 5,
          isOnline: true,
          listing: {
            id: '1',
            title: 'iPhone 14 Pro Max',
            price: '1200',
            currency: 'EUR',
            category: 'electronics',
            imageName: 'iphone',
            contactMethod: 'phone'
          }
        },
        {
          id: '2',
          name: 'Мария Сидорова',
          lastMessage: 'Спасибо за быструю доставку!',
          timestamp: '12:15',
          unreadCount: 0,
          isOnline: false,
          listing: {
            id: '2',
            title: 'Квартира в центре',
            price: '150000',
            currency: 'EUR',
            category: 'realEstate',
            subcategory: 'rent',
            imageName: 'apartment',
            contactMethod: 'chat'
          }
        },
        {
          id: '3',
          name: 'Дмитрий Козлов',
          lastMessage: 'Можете ли вы снизить цену?',
          timestamp: 'Вчера',
          unreadCount: 1,
          isOnline: true,
          listing: {
            id: '3',
            title: 'BMW X5 2020',
            price: '45000',
            currency: 'EUR',
            category: 'transport',
            imageName: 'bmw',
            contactMethod: 'phone'
          }
        },
        {
          id: '4',
          name: 'Анна Волкова',
          lastMessage: 'Когда будете дома?',
          timestamp: 'Пн',
          unreadCount: 3,
          isOnline: false,
          listing: {
            id: '4',
            title: 'MacBook Pro 2023',
            price: '2500',
            currency: 'EUR',
            category: 'electronics',
            imageName: 'macbook',
            contactMethod: 'chat'
          }
        },
        {
          id: '5',
          name: 'Сергей Иванов',
          lastMessage: 'Отличное предложение!',
          timestamp: 'Пн',
          unreadCount: 7,
          isOnline: true,
          listing: {
            id: '5',
            title: 'PlayStation 5',
            price: '500',
            currency: 'EUR',
            category: 'electronics',
            imageName: 'ps5',
            contactMethod: 'phone'
          }
        }
      ];
      localStorage.setItem('targ-chats', JSON.stringify(testChats));
    }

    calculateUnreadMessages();
    
    const handleStorageChange = () => {
      calculateUnreadMessages();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Также слушаем изменения в текущем окне
    const interval = setInterval(calculateUnreadMessages, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentUser, calculateUnreadMessages]);

  return (
    <div className="tab-bar">
      {tabs.map((tab, index) => {
        const isActive = location.pathname === tab.href;
        const Icon = isActive ? tab.activeIcon : tab.icon;
        
        // Если это кнопка "Главная" и мы уже на главной странице, добавляем функцию прокрутки
        if (tab.href === '/' && location.pathname === '/') {
          return (
            <button
              key={tab.name}
              className={`tab-item ${isActive ? 'active' : ''}`}
              onClick={() => {
            
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
              }}
            >
              <div style={{ position: 'relative' }}>
                <Icon style={{ width: '20px', height: '20px' }} />
              </div>
              <span style={{ marginTop: '4px' }}>{tab.name}</span>
            </button>
          );
        }
        
        return (
          <Link
            key={tab.name}
            to={tab.href}
            className={`tab-item ${isActive ? 'active' : ''}`}
          >
            <div style={{ position: 'relative' }}>
              {/* Специальная обработка для вкладки "Добавить объявление" */}
              {tab.href === '/add' ? (
                <div className="add-listing-icon">
                  <PlusIcon style={{ width: '16px', height: '16px' }} />
                </div>
              ) : (
                <Icon style={{ width: '20px', height: '20px' }} />
              )}
              {tab.href === '/messages' && currentUser && unreadMessagesCount > 0 && (
                <div className="unread-badge">
                  {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                </div>
              )}
            </div>
            {/* Скрываем текст для вкладки "Добавить объявление" */}
            {tab.href !== '/add' && (
              <span style={{ marginTop: '4px' }}>{tab.name}</span>
            )}
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

const MainTabViewContent: React.FC<{ isAuthenticated: boolean; onLogout: () => void }> = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const { isMobile } = useDeviceType();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [selectedSort, setSelectedSort] = useState('newest');

  // Функция для подсчета непрочитанных сообщений
  const calculateUnreadMessages = useCallback(() => {
    // Не подсчитываем сообщения для неавторизованных пользователей
    if (!isAuthenticated) {
      setUnreadMessagesCount(0);
      return;
    }
    
    try {
      const chatsData = localStorage.getItem('targ-chats');
      if (chatsData) {
        const chats = JSON.parse(chatsData);
        const totalUnread = chats.reduce((sum: number, chat: any) => sum + (chat.unreadCount || 0), 0);
        setUnreadMessagesCount(totalUnread);
      } else {
        setUnreadMessagesCount(0);
      }
    } catch (error) {
      console.error('Ошибка при подсчете непрочитанных сообщений:', error);
    }
  }, [isAuthenticated]);

  // Обновляем счетчик при изменении localStorage
  useEffect(() => {
    calculateUnreadMessages();
    
    const handleStorageChange = () => {
      calculateUnreadMessages();
    };

    // Слушаем изменения localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Создаем кастомное событие для обновления счетчика
    const handleCustomStorageChange = () => {
      calculateUnreadMessages();
    };
    
    window.addEventListener('targ-chats-updated', handleCustomStorageChange);
    
    // Также слушаем изменения в текущем окне
    const interval = setInterval(calculateUnreadMessages, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('targ-chats-updated', handleCustomStorageChange);
      clearInterval(interval);
    };
  }, [isAuthenticated, calculateUnreadMessages]);

  // Определяем, нужно ли добавить фон профиля
  const shouldShowProfileBackground = !isAuthenticated && (location.pathname === '/profile' || location.pathname === '/messages' || location.pathname === '/favorites');
  
  const currentLanguageOption = languages.find(lang => lang.code === currentLanguage);

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  const handleLanguageSelect = (languageCode: string) => {
    setLanguage(languageCode as any);
    setShowLanguageMenu(false);
  };

  // Закрытие выпадающего меню языка при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.website-language-selector')) {
        setShowLanguageMenu(false);
      }
    };

    if (showLanguageMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageMenu]);

  // Показываем приветственное окно при каждом обновлении страницы для тестирования
  useEffect(() => {
    // Показываем модальное окно на всех устройствах
    setShowWelcomeModal(true);
  }, []);

  return (
    <div className="main-container">
      {/* Приветственное модальное окно для всех устройств */}
      <WelcomeModal 
        isVisible={showWelcomeModal} 
        onClose={handleCloseWelcomeModal} 
      />
      
      {/* Навигационная панель для десктопа */}
      <div className="website-navigation-panel">
        <div className="website-nav-container">
          {/* Логотип */}
          <div className="website-nav-logo">
            <img 
              src="/images/logo.png" 
              alt="TARG Logo" 
              className="website-nav-logo-img"
              onError={(e) => {
                console.error('Ошибка загрузки логотипа:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          
          {/* Центральная группа кнопок навигации */}
          <div className="website-nav-center">
            <button 
              className={`website-nav-item ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => navigate('/')}
            >
              <HomeIcon className="website-nav-icon" />
              <span className="website-nav-text">{t('navigation.home')}</span>
            </button>
            
            <button 
              className={`website-nav-item ${location.pathname === '/messages' ? 'active' : ''}`}
              onClick={() => navigate('/messages')}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <ChatBubbleLeftRightIcon className="website-nav-icon" />
                {currentUser && unreadMessagesCount > 0 && (
                  <div className="website-unread-badge">
                    {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                  </div>
                )}
              </div>
              <span className="website-nav-text">{t('navigation.messages')}</span>
            </button>
            
            <button 
              className={`website-nav-item ${location.pathname === '/favorites' ? 'active' : ''}`}
              onClick={() => navigate('/favorites')}
            >
              <HeartIcon className="website-nav-icon" />
              <span className="website-nav-text">{t('navigation.favorites')}</span>
            </button>
            
            {isAuthenticated && (
              <button 
                className={`website-nav-item ${location.pathname === '/add' ? 'active' : ''}`}
                onClick={() => navigate('/add')}
              >
                <svg className="website-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="website-nav-text">{t('navigation.addListing')}</span>
              </button>
            )}
            
            <button 
              className={`website-nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
              onClick={() => navigate('/profile')}
            >
              <UserIcon className="website-nav-icon" />
              <span className="website-nav-text">{t('navigation.profile')}</span>
            </button>
            

          </div>
          
          {/* Кнопка переключения языка */}
          <div className="website-language-selector">
            <button 
              className="website-language-button"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              <GlobeAltIcon className="website-language-icon" />
              <span className="website-language-text">{currentLanguageOption?.flag}</span>
            </button>
            
            {showLanguageMenu && (
              <div className="website-language-dropdown">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    className={`website-language-option ${currentLanguage === language.code ? 'active' : ''}`}
                    onClick={() => handleLanguageSelect(language.code)}
                  >
                    <span className="website-language-flag">{language.flag}</span>
                    <span className="website-language-name">{language.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className={`content-area ${shouldShowProfileBackground ? 'profile-background' : ''}`}>
        <Routes>
          <Route path="/" element={
            isMobile ? <MobileHomeView /> : <WebsiteAnnouncementsView 
              showSortSheet={showSortSheet}
              setShowSortSheet={setShowSortSheet}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
            />
          } />
          <Route path="/add" element={<AddListingViewWrapper />} />
          <Route path="/favorites" element={<FavoritesViewWrapper />} />
          <Route path="/messages" element={
            isMobile ? 
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
          <Route path="/seller" element={<SellerProfileViewWrapper />} />
        </Routes>
      </div>
      {isMobile && (location.pathname !== '/' || !showWelcomeModal) && <TabBar />}
      
      {/* Модальное окно сортировки - на том же уровне, что и панель навигации */}
      <SortSheet
        isOpen={showSortSheet}
        onClose={() => setShowSortSheet(false)}
        selectedSort={selectedSort}
        onSortSelect={setSelectedSort}
      />
    </div>
  );
};

export default MainTabView; 