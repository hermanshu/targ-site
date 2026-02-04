import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
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
import SharedFavoritesView from './SharedFavoritesView';
import SharedFolderView from './SharedFolderView';
import { ListingPage } from './listing/ListingPage';
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
import defaultAvatar from '../assets/default-avatar.png';
import LanguageSelectorModal from './LanguageSelectorModal';
import AuthModal from './AuthModal';

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

interface AuthModalProps {
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AddListingViewWrapper: React.FC<AuthModalProps> = ({ showAuthModal, setShowAuthModal }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return null;
  }
  return <AddListingView />;
};

const FavoritesViewWrapper: React.FC<AuthModalProps> = ({ showAuthModal, setShowAuthModal }) => {
  const { currentUser } = useAuth();
  const { isFavorite, removeFromFavorites } = useFavorites();
  const { incrementViews } = useListings();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const navigate = useNavigate();
  if (!currentUser) {
    return null;
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

  const handleNavigateToProfile = (mode?: 'signin' | 'signup') => {
    navigate('/profile');
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
      <ListingPage
        listingId={selectedListing.id}
        onBack={handleBackToList}
        onFavoriteToggle={handleFavoriteToggle}
        isFavorite={isFavorite(selectedListing.id)}
        onNavigateToProfile={handleNavigateToProfile}
        onNavigateToSellerProfile={handleNavigateToSellerProfile}
      />
    );
  }
  
  return <FavoritesView onCardClick={handleCardClick} />;
};

const SharedFavoritesViewWrapper = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  
  const handleCardClick = (listing: Listing) => {
    // Навигация к детальной странице объявления
    navigate(`/listing/${listing.id}`);
  };

  if (!userId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Ошибка</h2>
        <p>Не указан ID пользователя</p>
        <button onClick={() => navigate('/')}>Вернуться на главную</button>
      </div>
    );
  }

  return <SharedFavoritesView userId={userId} onCardClick={handleCardClick} />;
};

const SharedFolderViewWrapper = () => {
  const navigate = useNavigate();
  const { shareId } = useParams<{ shareId: string }>();
  
  const handleCardClick = (listing: Listing) => {
    // Навигация к детальной странице объявления
    navigate(`/listing/${listing.id}`);
  };

  if (!shareId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Ошибка</h2>
        <p>Не указан ID папки</p>
        <button onClick={() => navigate('/')}>Вернуться на главную</button>
      </div>
    );
  }

  return <SharedFolderView shareId={shareId} onCardClick={handleCardClick} />;
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

const MessagesViewWrapper: React.FC<AuthModalProps> = ({ showAuthModal, setShowAuthModal }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  if (!currentUser) {
    return null;
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



const TabBar: React.FC<{ showAuthModal: boolean; setShowAuthModal: (show: boolean) => void }> = ({ showAuthModal, setShowAuthModal }) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const navigate = useNavigate();

  const tabs = useMemo(() => {
    const baseTabs = [
      { name: t('navigation.home'), href: '/', icon: HomeIcon, activeIcon: HomeIconSolid },
      { name: t('navigation.messages'), href: '/messages', icon: ChatBubbleLeftRightIcon, activeIcon: ChatIconSolid },
      { name: t('navigation.favorites'), href: '/favorites', icon: HeartIcon, activeIcon: HeartIconSolid },
      { name: t('navigation.profile'), href: '/profile', icon: UserIcon, activeIcon: UserIconSolid },
    ];
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
        // Для сообщений и избранного: если неавторизован, открывать модалку
        if ((tab.href === '/messages' || tab.href === '/favorites') && !currentUser) {
          return (
            <button
              key={tab.name}
              className={`tab-item`}
              style={{ opacity: 1, cursor: 'pointer' }}
              onClick={() => setShowAuthModal(true)}
            >
              <div style={{ position: 'relative' }}>
                <Icon style={{ width: '20px', height: '20px' }} />
              </div>
              <span style={{ marginTop: '4px' }}>{tab.name}</span>
            </button>
          );
        }
        
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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);

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
  const shouldShowProfileBackground = !isAuthenticated && (location.pathname === '/profile' || location.pathname === '/messages' || location.pathname === '/favorites') && !showAuthModal;
  
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

  // Закрытие выпадающего меню профиля при клике вне меню
  useEffect(() => {
    if (!showProfileMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showProfileMenu]);

  // Получаем children для текущего маршрута
  // (Вариант: если children === null, не добавлять profile-background)
  //
  // Для этого оборачиваем Routes в переменную
  const routes = (
    <Routes>
      <Route path="/" element={
        isMobile ? <MobileHomeView /> : <WebsiteAnnouncementsView 
          showSortSheet={showSortSheet}
          setShowSortSheet={setShowSortSheet}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          showAuthModal={showAuthModal}
          setShowAuthModal={setShowAuthModal}
        />
      } />
      <Route path="/add" element={<AddListingViewWrapper showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} />} />
      <Route path="/favorites" element={<FavoritesViewWrapper showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} />} />
      <Route path="/favorites/shared/:userId" element={<SharedFavoritesViewWrapper />} />
      <Route path="/favorites/folder/:shareId" element={<SharedFolderViewWrapper />} />
      <Route path="/messages" element={
        isMobile ? 
        <MobileMessagesViewWrapper /> : 
        <MessagesViewWrapper showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} />
      } />
      <Route path="/my-listings" element={<MyListingsView />} />
      <Route path="/notifications-settings" element={<NotificationsSettingsView />} />
      <Route path="/help-support" element={<HelpAndSupportView />} />
      <Route path="/reviews" element={<ReviewsView />} />
      <Route path="/seller" element={<SellerProfileViewWrapper />} />
    </Routes>
  );

  // Проверяем, есть ли контент для текущего маршрута
  // Если children === null, не добавляем profile-background
  // (Вариант: используем useLocation и проверяем pathname)

  return (
    <div className="main-container">
      {/* Приветственное модальное окно для всех устройств */}
      <WelcomeModal 
        isVisible={showWelcomeModal} 
        onClose={handleCloseWelcomeModal} 
      />
      {/* Новая верхняя панель навигации */}
      <div className="website-navigation-panel">
        <div className="website-nav-container">
          {/* Левая группа: логотип и навигация */}
          <div className="website-nav-group nav-left">
            <div className="website-nav-logo" onClick={() => navigate('/')}> 
              <img src="/images/logo.png" alt="TARG Logo" style={{height: '56px', width: '56px', objectFit: 'contain'}} />
            </div>
            <button 
              className={`website-nav-item${location.pathname === '/' ? ' active' : ''}`}
              onClick={() => navigate('/')}
              title={t('navigation.home')}
            >
              <HomeIcon className="website-nav-icon" />
            </button>
            <button 
              className={`website-nav-item${location.pathname === '/messages' ? ' active' : ''}`}
              onClick={() => navigate('/messages')}
              title={t('navigation.messages')}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <ChatBubbleLeftRightIcon className="website-nav-icon" />
                {currentUser && unreadMessagesCount > 0 && (
                  <div className="website-unread-badge">
                    {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                  </div>
                )}
              </div>
            </button>
            <button 
              className={`website-nav-item${location.pathname === '/favorites' ? ' active' : ''}`}
              onClick={() => navigate('/favorites')}
              title={t('navigation.favorites')}
            >
              <HeartIcon className="website-nav-icon" />
            </button>
          </div>
          {/* Визуальный разделитель */}
          <div className="website-nav-divider" />
          {/* Правая группа: действия */}
          <div className="website-nav-group nav-right">
            {isAuthenticated ? (
              <>
                <button 
                  className="add-listing-primary"
                  onClick={() => navigate('/add')}
                  title={t('navigation.addListing')}
                >
                  <PlusIcon className="add-icon" />
                  <span>Добавить</span>
                </button>
                {/* Аватар профиля с дропдауном */}
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <button
                    className="profile-dropdown-trigger"
                    style={{gap: 8}}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <UserIcon style={{ width: 20, height: 20 }} />
                    <span>Профиль</span>
                  </button>
                  <div
                    ref={profileMenuRef}
                    className={`profile-dropdown-menu${showProfileMenu ? ' open' : ''}`}
                  >
                    <button onClick={() => { setShowProfileMenu(false); navigate('/profile'); }}>Профиль</button>
                    <button onClick={() => { setShowProfileMenu(false); navigate('/my-listings'); }}>Мои объявления</button>
                    <button onClick={() => { setShowProfileMenu(false); navigate('/notifications-settings'); }}>Настройки</button>
                    <button onClick={() => { setShowProfileMenu(false); setShowLanguageModal(true); }}>Сменить язык</button>
                    <button onClick={() => { setShowProfileMenu(false); onLogout(); }}>Выйти</button>
                  </div>
                </div>
              </>
            ) : (
              <button
                className="add-listing-primary"
                type="button"
                onClick={() => setShowAuthModal(true)}
                tabIndex={0}
              >
                <UserIcon style={{ width: 20, height: 20 }} />
                <span>Войти или зарегистрироваться</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={`content-area${shouldShowProfileBackground && location.pathname !== '/messages' && location.pathname !== '/favorites' ? ' profile-background' : ''}`}>
        {routes}
      </div>
      {isMobile && (location.pathname !== '/' || !showWelcomeModal) && <TabBar showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} />}
      
      {/* Модальное окно сортировки - на том же уровне, что и панель навигации */}
      <SortSheet
        isOpen={showSortSheet}
        onClose={() => setShowSortSheet(false)}
        selectedSort={selectedSort}
        onSortSelect={setSelectedSort}
      />
      {/* Модальное окно выбора языка */}
      <LanguageSelectorModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default MainTabView;