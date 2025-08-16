import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  XMarkIcon,
  TrashIcon,
  NoSymbolIcon,
  ExclamationTriangleIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import ListingDetailView from './ListingDetailView';
import { Listing } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTranslation } from '../hooks/useTranslation';

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  listing: {
    id: string;
    title: string;
    price: string;
    currency: string;
    category: string;
    imageName?: string;
    contactMethod?: 'phone' | 'chat';
  };
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  isRead: boolean;
  attachments?: string[];
}

interface MessagesViewProps {
  onNavigateToMessages?: (listing: Listing) => void;
  onNavigateToProfile?: (mode?: 'signin' | 'signup') => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({ 
  onNavigateToMessages, 
  onNavigateToProfile 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);

  // Функция для сохранения сообщений в localStorage
  const saveMessagesToStorage = (chatId: string, messages: Message[]) => {
    try {
      const key = `targ-messages-${chatId}`;
      localStorage.setItem(key, JSON.stringify(messages));
    } catch (e) {
      console.error('Ошибка при сохранении сообщений в localStorage:', e);
    }
  };

  // Функция для загрузки сообщений из localStorage
  const loadMessagesFromStorage = (chatId: string): Message[] => {
    try {
      const key = `targ-messages-${chatId}`;
      const savedMessages = localStorage.getItem(key);
      if (savedMessages) {
        return JSON.parse(savedMessages);
      }
    } catch (e) {
      console.error('Ошибка при загрузке сообщений из localStorage:', e);
    }
    return [];
  };
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  
  // Состояния для кастомных модальных окон
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const processedRequestsRef = useRef<Set<string>>(new Set());
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { t } = useTranslation();

  // Функция для сохранения чатов в localStorage
  const saveChatsToStorage = (chats: Chat[]) => {
    try {
      localStorage.setItem('targ-chats', JSON.stringify(chats));
    } catch (e) {
      console.error('Ошибка при сохранении чатов в localStorage:', e);
    }
  };

  // Мок-данные для чатов
  const initialChats: Chat[] = [
    {
      id: '1',
      name: 'Алексей Петров',
      lastMessage: 'Здравствуйте! Интересует ваш товар',
      timestamp: '14:30',
      unreadCount: 2,
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
        category: 'rent',
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
      unreadCount: 0,
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
      unreadCount: 3,
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

  // Инициализация состояния чатов
  const [chatList, setChatList] = useState<Chat[]>(() => {
    // Загружаем чаты из localStorage при инициализации
    const savedChats = localStorage.getItem('targ-chats');
    if (savedChats) {
      try {
        return JSON.parse(savedChats);
      } catch (e) {
        console.error('Ошибка при загрузке чатов из localStorage:', e);
        return initialChats;
      }
    }
    return initialChats;
  });

  // Обработка URL параметров для создания нового чата
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const listingId = searchParams.get('listingId');
    const sellerId = searchParams.get('sellerId');
    const title = searchParams.get('title');
    const sellerName = searchParams.get('sellerName');
    const price = searchParams.get('price');
    const currency = searchParams.get('currency');
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const isCompany = searchParams.get('isCompany');
    const imageName = searchParams.get('imageName');
    const contactMethod = searchParams.get('contactMethod');

    if (listingId && sellerId && title && sellerName) {
      // Создаем уникальный ключ для этого запроса
      const requestKey = `${listingId}-${sellerId}-${title}-${sellerName}`;
      
      // Проверяем, не обрабатывали ли мы уже этот запрос
      if (processedRequestsRef.current.has(requestKey)) {
        console.log('Запрос уже обработан, пропускаем');
        return;
      }
      
      console.log('Обрабатываем запрос чата для объявления:', { listingId, sellerId, title, sellerName });
      
      // Добавляем запрос в обработанные
      processedRequestsRef.current.add(requestKey);
      
      // Проверяем, не обрабатывали ли мы уже этот запрос
      const chatId = `chat-${sellerId}`;
      
      // Проверяем в localStorage, существует ли уже чат
      const savedChats = JSON.parse(localStorage.getItem('targ-chats') || '[]');
      const existingChat = savedChats.find((chat: Chat) => chat.id === chatId);
      
      if (existingChat) {
        console.log('Чат уже существует в localStorage, просто переходим к нему');
        
        // Используем функциональное обновление состояния для безопасной проверки
        setChatList(prevChats => {
          const existingInList = prevChats.find(chat => chat.id === chatId);
          if (!existingInList) {
            // Добавляем чат в список только если его там нет
            return [existingChat, ...prevChats];
          }
          return prevChats;
        });
        
        setSelectedChat(existingChat);
        loadChatMessages(existingChat.id);
      } else {
        console.log('Создаем новый чат для объявления');
        
        // Создаем новое объявление на основе URL параметров
        const newListing: Listing = {
          id: listingId,
          title: decodeURIComponent(title),
          price: price || '0',
          currency: (currency as 'EUR' | 'RSD') || 'EUR',
          city: city || t('favorites.unknown'),
          category: category || t('favorites.listing'),
          sellerName: decodeURIComponent(sellerName),
          isCompany: isCompany === 'true',
          imageName: imageName || '',
          description: '',
          createdAt: new Date(),
          userId: sellerId,
          contactMethod: (contactMethod as 'phone' | 'chat') || 'chat',
          views: 0
        };

        // Используем единую функцию для создания чата
        handleNavigateToMessages(newListing);
      }

      // Очищаем URL параметры
      navigate('/messages', { replace: true });
    }
  }, [location.search, navigate, t]);

  // Функция для загрузки сообщений чата
  const loadChatMessages = useCallback((chatId: string) => {
    console.log('Загружаем сообщения для чата:', chatId);
    
    // Сначала пытаемся загрузить сообщения из localStorage
    const savedMessages = loadMessagesFromStorage(chatId);
    
    if (savedMessages.length > 0) {
      console.log('Загружаем сохраненные сообщения из localStorage');
      setMessages(savedMessages);
    } else {
      // Проверяем, является ли это новым чатом (созданным из URL параметров)
      // Новые чаты имеют ID вида 'chat-{userId}', а существующие имеют ID '1', '2', etc.
      const isNewChat = chatId.startsWith('chat-') && chatId.length > 5;
      
      if (isNewChat) {
        console.log('Новый чат - загружаем пустые сообщения');
        // Для новых чатов загружаем пустые сообщения
        setMessages([]);
      } else {
        console.log('Существующий чат - загружаем мок-данные');
        // Для существующих чатов загружаем мок-данные
        setMessages(initialMessages);
      }
    }
  }, []);

  // Мок-данные для сообщений
  const initialMessages = useMemo(() => [
    {
      id: '1',
      text: 'Здравствуйте! Интересует ваш товар',
      timestamp: '14:30',
      isOwn: false,
      isRead: true
    },
    {
      id: '2',
      text: 'Добрый день! Конечно, расскажите подробнее',
      timestamp: '14:32',
      isOwn: true,
      isRead: true
    },
    {
      id: '3',
      text: 'Какая цена и условия доставки?',
      timestamp: '14:35',
      isOwn: false,
      isRead: false
    }
  ], []);

  // Инициализация сообщений при выборе чата
  useEffect(() => {
    if (selectedChat) {
      // Сначала пытаемся загрузить сообщения из localStorage
      const savedMessages = loadMessagesFromStorage(selectedChat.id);
      
      if (savedMessages.length > 0) {
        console.log('Загружаем сохраненные сообщения из localStorage');
        setMessages(savedMessages);
      } else {
        // Проверяем, является ли это новым чатом (созданным из URL параметров)
        // Новые чаты имеют ID вида 'chat-{userId}', а существующие имеют ID '1', '2', etc.
        const isNewChat = selectedChat.id.startsWith('chat-') && selectedChat.id.length > 5;
        
        if (isNewChat) {
          console.log('Новый чат - показываем пустые сообщения');
          setMessages([]);
        } else {
          console.log('Существующий чат - показываем мок-данные');
          setMessages(initialMessages);
        }
      }
      setAttachments([]);
    }
  }, [selectedChat, initialMessages]);

  // Автопрокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText.trim() || attachments.length > 0) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        timestamp: new Date().toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isOwn: true,
        isRead: false,
        attachments: attachments.length > 0 ? [...attachments] : undefined
      };

      setMessages(prev => {
        const newMessages = [...prev, newMessage];
        if (selectedChat) {
          saveMessagesToStorage(selectedChat.id, newMessages);
        }
        return newMessages;
      });
      
      // Обновляем последнее сообщение в списке чатов
      if (selectedChat) {
        setChatList(prevChats => {
          const updatedChats = prevChats.map(chat => 
            chat.id === selectedChat.id 
              ? { 
                  ...chat, 
                  lastMessage: messageText || 'Файл отправлен',
                  timestamp: new Date().toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })
                }
              : chat
          );
          saveChatsToStorage(updatedChats);
          return updatedChats;
        });
      }
      
      setMessageText('');
      setAttachments([]);
      
      // Сброс высоты поля ввода
      const textarea = document.querySelector('.message-input') as HTMLTextAreaElement;
      if (textarea) {
        requestAnimationFrame(() => {
          textarea.style.height = '44px';
        });
      }
      
      // Имитация ответа собеседника только для существующих чатов
      if (selectedChat && !selectedChat.id.startsWith('chat-')) {
        setTimeout(() => {
          const replyMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: 'Спасибо за сообщение! Я скоро отвечу.',
            timestamp: new Date().toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            isOwn: false,
            isRead: true
          };
          setMessages(prev => {
          const newMessages = [...prev, replyMessage];
          if (selectedChat) {
            saveMessagesToStorage(selectedChat.id, newMessages);
          }
          return newMessages;
        });
          
                  // Обновляем последнее сообщение в списке чатов
        if (selectedChat) {
          setChatList(prevChats => {
            const updatedChats = prevChats.map(chat => 
              chat.id === selectedChat.id 
                ? { 
                    ...chat, 
                    lastMessage: replyMessage.text,
                    timestamp: replyMessage.timestamp,
                    unreadCount: chat.unreadCount + 1
                  }
                : chat
            );
            saveChatsToStorage(updatedChats);
            return updatedChats;
          });
        }
        }, 1000);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAttachments: string[] = [];
      
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result;
            if (result) {
              newAttachments.push(result as string);
              setAttachments(prev => [...prev, result as string]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Обработчики для меню чата
  const handleMenuClick = () => {
    setShowChatMenu(!showChatMenu);
  };

  const handleMenuAction = (action: string) => {
    setShowChatMenu(false);
    
    if (action === 'delete') {
      setShowDeleteModal(true);
    } else if (action === 'block') {
      setShowBlockModal(true);
    } else if (action === 'report') {
      setShowReportModal(true);
    }
  };

  // Обработчики для модальных окон
  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    setSuccessMessage(t('favorites.dialogDeleted'));
    setShowSuccessModal(true);
    setSelectedChat(null);
    
    // Удаляем чат из списка
    if (selectedChat) {
      setChatList(prevChats => {
        const updatedChats = prevChats.filter(chat => chat.id !== selectedChat.id);
        saveChatsToStorage(updatedChats);
        return updatedChats;
      });
    }
    
    setTimeout(() => setShowSuccessModal(false), 2000);
  };

  const handleBlockConfirm = () => {
    setShowBlockModal(false);
    setSuccessMessage(t('favorites.userBlocked'));
    setShowSuccessModal(true);
    setSelectedChat(null);
    
    // Удаляем чат из списка
    if (selectedChat) {
      setChatList(prevChats => {
        const updatedChats = prevChats.filter(chat => chat.id !== selectedChat.id);
        saveChatsToStorage(updatedChats);
        return updatedChats;
      });
    }
    
    setTimeout(() => setShowSuccessModal(false), 2000);
  };

  const handleReportSubmit = () => {
    if (selectedReportType && reportReason.trim()) {
      setShowReportModal(false);
      setSuccessMessage(`${t('favorites.reportSent')} ${selectedReportType}`);
      setShowSuccessModal(true);
      setReportReason('');
      setSelectedReportType('');
      setTimeout(() => setShowSuccessModal(false), 2000);
    }
  };

  const handleReportTypeSelect = (type: string) => {
    setSelectedReportType(type);
  };

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowChatMenu(false);
      }
    };

    if (showChatMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showChatMenu]);

  // Обработка ошибок ResizeObserver
  useEffect(() => {
    const handleResizeObserverError = (e: ErrorEvent) => {
      if (e.message.includes('ResizeObserver')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('error', handleResizeObserverError);
    
    return () => {
      window.removeEventListener('error', handleResizeObserverError);
    };
  }, []);

  // Очистка обработанных запросов при размонтировании
  useEffect(() => {
    return () => {
      processedRequestsRef.current.clear();
    };
  }, []);

  const filteredChats = chatList.filter((chat: Chat) => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Обработчик клика на превью объявления
  const handleListingPreviewClick = () => {
    if (selectedChat) {
      const listing: Listing = {
        id: selectedChat.listing.id,
        title: selectedChat.listing.title,
        price: selectedChat.listing.price,
        currency: selectedChat.listing.currency as 'EUR' | 'RSD',
        imageName: selectedChat.listing.imageName || '',
        description: `${t('favorites.listing')} "${selectedChat.listing.title}" - ${selectedChat.listing.price} ${selectedChat.listing.currency}`,
                  category: t('favorites.listings'),
                  city: t('favorites.notSpecified'),
        sellerName: selectedChat.name,
        isCompany: false,
        createdAt: new Date(Date.now()),
        userId: selectedChat.id,
        views: Math.floor(Math.random() * 200) + 50
      };
      setSelectedListing(listing);
    }
  };

  // Обработчик возврата к диалогу
  const handleBackToChat = () => {
    setSelectedListing(null);
  };

  // Обработчик переключения избранного
  const handleFavoriteToggle = (listing: Listing) => {
    if (isFavorite(listing.id)) {
      removeFromFavorites(listing.id);
    } else {
      addToFavorites(listing);
    }
  };

  // Обработчик навигации к сообщениям
  const handleNavigateToMessages = useCallback((listing: Listing) => {
    console.log('Создаем чат с продавцом:', listing.sellerName, 'для объявления:', listing.title);
    
    const newChat: Chat = {
      id: `chat-${listing.userId}`,
      name: listing.sellerName,
      lastMessage: `${t('favorites.chatForListing')} "${listing.title}"`,
      timestamp: new Date().toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      unreadCount: 0,
      isOnline: false,
      listing: {
        id: listing.id,
        title: listing.title,
        price: listing.price,
        currency: listing.currency,
        category: listing.category,
        imageName: listing.imageName,
        contactMethod: listing.contactMethod
      }
    };
    
    // Проверяем в localStorage, существует ли уже чат
    const savedChats = JSON.parse(localStorage.getItem('targ-chats') || '[]');
    const existingChatInStorage = savedChats.find((chat: Chat) => chat.id === newChat.id);
    
    if (existingChatInStorage) {
      console.log('Чат уже существует в localStorage, просто переходим к нему');
      setSelectedChat(existingChatInStorage);
      loadChatMessages(existingChatInStorage.id);
      setSelectedListing(null);
      return;
    }
    
    // Используем функциональное обновление состояния для проверки существующих чатов
    setChatList(prevChats => {
      // Проверяем, существует ли уже чат с этим продавцом
      const existingChatIndex = prevChats.findIndex((chat: Chat) => chat.id === newChat.id);
      
      if (existingChatIndex === -1) {
        console.log('Создаем новый чат');
        // Добавляем новый чат в начало списка
        const newChats = [newChat, ...prevChats];
        saveChatsToStorage(newChats);
        
        // Устанавливаем новый чат как выбранный
        setSelectedChat(newChat);
        setMessages([]);
        
        return newChats;
      } else {
        console.log('Чат уже существует, перемещаем в начало');
        // Перемещаем существующий чат в начало списка
        const updatedChats = [...prevChats];
        const movedChat = updatedChats.splice(existingChatIndex, 1)[0];
        const newChats = [movedChat, ...updatedChats];
        saveChatsToStorage(newChats);
        
        // Устанавливаем существующий чат как выбранный
        setSelectedChat(movedChat);
        loadChatMessages(movedChat.id);
        
        return newChats;
      }
    });
    
    // Устанавливаем выбранный чат и загружаем сообщения только для новых чатов
    // Для существующих чатов это делается внутри setChatList
    setSelectedListing(null);
  }, [t, loadChatMessages]);

  const handleNavigateToProfile = (mode?: 'signin' | 'signup') => {
    if (onNavigateToProfile) {
      onNavigateToProfile(mode);
    } else {
      navigate('/profile');
    }
  };

  // Если выбрано объявление для просмотра, показываем детальную страницу
  if (selectedListing) {
    return (
      <ListingDetailView
        listing={selectedListing}
        onBack={handleBackToChat}
        onFavoriteToggle={handleFavoriteToggle}
        isFavorite={isFavorite(selectedListing.id)}
        onNavigateToMessages={handleNavigateToMessages}
        onNavigateToProfile={handleNavigateToProfile}
      />
    );
  }

  return (
    <div className="telegram-layout">
      {/* Боковая панель с чатами */}
      <div className={`sidebar ${!showSidebar ? 'hidden' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">{t('favorites.messages')}</h1>
          <div className="search-container">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              placeholder={t('favorites.searchChats')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="chats-list">
          {filteredChats.map((chat) => (
            <div 
              key={chat.id} 
              className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
              onClick={() => {
                // Сначала сбрасываем счетчик непрочитанных сообщений
                setChatList(prevChats => {
                  const updatedChats = prevChats.map(c => 
                    c.id === chat.id 
                      ? { ...c, unreadCount: 0 }
                      : c
                  );
                  saveChatsToStorage(updatedChats);
                  return updatedChats;
                });
                
                // Затем устанавливаем выбранный чат и загружаем сообщения
                setSelectedChat(chat);
                loadChatMessages(chat.id);
              }}
            >
              <div className="chat-avatar">
                <div className="avatar-initial">
                  {chat.name.charAt(0)}
                </div>
                {chat.isOnline && <div className="online-indicator" />}
                {chat.unreadCount > 0 && (
                  <div className="unread-badge">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
              
              <div className="chat-content">
                <div className="chat-header-row">
                  <h3 className="chat-name">{chat.name}</h3>
                  <span className="chat-time">{chat.timestamp}</span>
                </div>
                
                <div className="chat-listing-info">
                  <span className="listing-title">{chat.listing.title}</span>
                  <span className="listing-price">
                    {chat.listing.price} {chat.listing.currency}
                    {(chat.listing.category === 'work' || chat.listing.category === 'vacancies' || chat.listing.category === 'rent') && ' / месяц'}
                  </span>
                </div>
                
                <div className="chat-message-row">
                  <p className="chat-last-message">{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Основная область чата */}
      <div className="chat-area">
        {selectedChat ? (
          <>
            {/* Заголовок чата */}
            <div className="chat-header">
              <button 
                className="sidebar-toggle"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <ArrowLeftIcon className="toggle-icon" />
              </button>
              
              <div className="chat-info">
                <div className="chat-avatar">
                  <div className="avatar-initial">
                    {selectedChat.name.charAt(0)}
                  </div>
                  {selectedChat.isOnline && <div className="online-indicator" />}
                </div>
                <div className="chat-details">
                  <h2 className="chat-name">{selectedChat.name}</h2>
                  <span className="chat-status">
                    {selectedChat.isOnline ? t('favorites.online') : t('favorites.offline')}
                  </span>
                </div>
              </div>
              
              {/* Превью объявления */}
              <div 
                className="chat-listing-preview clickable"
                onClick={handleListingPreviewClick}
                title={t('favorites.clickToViewListing')}
              >
                <div className="listing-preview-image">
                  {selectedChat.listing.imageName ? (
                    <img 
                      src={`/images/${selectedChat.listing.imageName}.jpg`} 
                      alt={selectedChat.listing.title}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`listing-preview-placeholder ${selectedChat.listing.imageName ? 'hidden' : ''}`}>
                    <div className="placeholder-icon">📷</div>
                  </div>
                </div>
                <div className="listing-preview-info">
                  <h3 className="listing-preview-title">{selectedChat.listing.title}</h3>
                  <span className="listing-preview-price">
                    {selectedChat.listing.price} {selectedChat.listing.currency}
                    {(selectedChat.listing.category === 'work' || selectedChat.listing.category === 'vacancies' || selectedChat.listing.category === 'rent') && ' / месяц'}
                  </span>
                </div>
                <div className="listing-preview-arrow">→</div>
              </div>
              
              {/* Кнопки действий */}
              <div className="chat-actions">
                <button className="action-button">
                  <PhoneIcon className="action-icon" />
                </button>
                <div className="chat-menu-container" ref={menuRef}>
                  <button 
                    className="chat-menu-button"
                    onClick={handleMenuClick}
                  >
                    <EllipsisVerticalIcon className="menu-icon" />
                  </button>
                  
                  {showChatMenu && (
                    <div className="chat-menu-dropdown">
                      <button 
                        className="menu-item"
                        onClick={() => handleMenuAction('delete')}
                      >
                        <div className="menu-item-content">
                          <div className="icon-container">
                            <TrashIcon className="menu-item-icon" />
                          </div>
                          <span className="menu-item-text">{t('favorites.deleteDialog')}</span>
                        </div>
                      </button>
                      <button 
                        className="menu-item"
                        onClick={() => handleMenuAction('block')}
                      >
                        <div className="menu-item-content">
                          <div className="icon-container">
                            <NoSymbolIcon className="menu-item-icon" />
                          </div>
                          <span className="menu-item-text">{t('favorites.blockUser')}</span>
                        </div>
                      </button>
                      <button 
                        className="menu-item"
                        onClick={() => handleMenuAction('report')}
                      >
                        <div className="menu-item-content">
                          <div className="icon-container">
                            <ExclamationTriangleIcon className="menu-item-icon" />
                          </div>
                          <span className="menu-item-text">{t('favorites.reportUser')}</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Сообщения */}
            <div className="messages-list">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message ${message.isOwn ? 'own' : 'other'}`}
                >
                  <div className="message-content">
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="message-attachments">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="attachment-image">
                            <img src={attachment} alt={t('favorites.attachment')} />
                          </div>
                        ))}
                      </div>
                    )}
                    {message.text && <p className="message-text">{message.text}</p>}
                    <span className="message-time">{message.timestamp}</span>
                    {message.isOwn && (
                      <span className={`read-indicator ${message.isRead ? 'read' : 'unread'}`}>
                        {message.isRead ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Поле ввода */}
            <div className="message-input-container">
              <button 
                className="attach-button"
                onClick={() => fileInputRef.current?.click()}
              >
                <PhotoIcon className="attach-icon" />
              </button>
              
              <div className="input-wrapper">
                <div className="input-content">
                  {attachments.length > 0 && (
                    <div className="attachments-preview">
                      {attachments.map((attachment, index) => (
                        <div key={index} className="attachment-preview">
                          <img src={attachment} alt={t('favorites.preview')} />
                          <button 
                            className="remove-attachment"
                            onClick={() => removeAttachment(index)}
                          >
                            <XMarkIcon className="remove-icon" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={t('favorites.enterMessage')}
                    className="message-input"
                    onKeyPress={handleKeyPress}
                    rows={1}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      // Используем requestAnimationFrame для предотвращения ошибки ResizeObserver
                      requestAnimationFrame(() => {
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                      });
                    }}
                  />
                </div>
              </div>
              
              <button 
                className="send-button"
                onClick={handleSendMessage}
                disabled={!messageText.trim() && attachments.length === 0}
              >
                <PaperAirplaneIcon className="send-icon" />
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          </>
        ) : (
          // Пустое состояние
          <div className="empty-chat">
            <div className="empty-chat-content">
              <div className="empty-chat-icon">💬</div>
              <h2 className="empty-chat-title">{t('favorites.selectChat')}</h2>
              <p className="empty-chat-description">
                {t('favorites.selectChatDescription')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Кастомные модальные окна */}
      
      {/* Модальное окно удаления диалога */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('favorites.deleteDialog')}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                <XMarkIcon className="close-icon" />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-message">{t('favorites.confirmDeleteDialog')}</p>
            </div>
            <div className="modal-actions">
              <button 
                className="modal-button secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                {t('favorites.cancel')}
              </button>
              <button 
                className="modal-button danger"
                onClick={handleDeleteConfirm}
              >
                {t('favorites.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно блокировки пользователя */}
      {showBlockModal && (
        <div className="modal-overlay" onClick={() => setShowBlockModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('favorites.blockUser')}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowBlockModal(false)}
              >
                <XMarkIcon className="close-icon" />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-message">{t('favorites.confirmBlockUser')}</p>
            </div>
            <div className="modal-actions">
              <button 
                className="modal-button secondary"
                onClick={() => setShowBlockModal(false)}
              >
                {t('favorites.cancel')}
              </button>
              <button 
                className="modal-button danger"
                onClick={handleBlockConfirm}
              >
                {t('favorites.block')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно жалобы */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('favorites.reportUser')}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowReportModal(false)}
              >
                <XMarkIcon className="close-icon" />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-message">{t('favorites.selectReportReason')}</p>
              
              <div className="report-reasons-grid">
                <button 
                  className={`report-reason-button ${selectedReportType === 'spam' ? 'selected' : ''}`}
                  onClick={() => handleReportTypeSelect('spam')}
                >
                  <div className="report-reason-icon">🚫</div>
                  <div className="report-reason-content">
                    <span className="report-reason-title">{t('favorites.reportSpam')}</span>
                    <span className="report-reason-description">{t('favorites.reportSpamDesc')}</span>
                  </div>
                </button>
                
                <button 
                  className={`report-reason-button ${selectedReportType === 'inappropriate' ? 'selected' : ''}`}
                  onClick={() => handleReportTypeSelect('inappropriate')}
                >
                  <div className="report-reason-icon">⚠️</div>
                  <div className="report-reason-content">
                    <span className="report-reason-title">{t('favorites.reportInappropriate')}</span>
                    <span className="report-reason-description">{t('favorites.reportInappropriateDesc')}</span>
                  </div>
                </button>
                
                <button 
                  className={`report-reason-button ${selectedReportType === 'harassment' ? 'selected' : ''}`}
                  onClick={() => handleReportTypeSelect('harassment')}
                >
                  <div className="report-reason-icon">😡</div>
                  <div className="report-reason-content">
                    <span className="report-reason-title">{t('favorites.reportHarassment')}</span>
                    <span className="report-reason-description">{t('favorites.reportHarassmentDesc')}</span>
                  </div>
                </button>
                
                <button 
                  className={`report-reason-button ${selectedReportType === 'fraud' ? 'selected' : ''}`}
                  onClick={() => handleReportTypeSelect('fraud')}
                >
                  <div className="report-reason-icon">💸</div>
                  <div className="report-reason-content">
                    <span className="report-reason-title">{t('favorites.reportFraud')}</span>
                    <span className="report-reason-description">{t('favorites.reportFraudDesc')}</span>
                  </div>
                </button>
                
                <button 
                  className={`report-reason-button ${selectedReportType === 'other' ? 'selected' : ''}`}
                  onClick={() => handleReportTypeSelect('other')}
                >
                  <div className="report-reason-icon">❓</div>
                  <div className="report-reason-content">
                    <span className="report-reason-title">{t('favorites.reportOther')}</span>
                    <span className="report-reason-description">{t('favorites.reportOtherDesc')}</span>
                  </div>
                </button>
              </div>
              
              {selectedReportType && (
                <div className="report-details">
                  <textarea
                    className="modal-textarea"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder={t('favorites.enterReportDetails')}
                    rows={3}
                  />
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button 
                className="modal-button secondary"
                onClick={() => setShowReportModal(false)}
              >
                {t('favorites.cancel')}
              </button>
              <button 
                className="modal-button primary"
                onClick={handleReportSubmit}
                disabled={!selectedReportType || !reportReason.trim()}
              >
                {t('favorites.send')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно успеха */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content success" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <div className="success-icon">✓</div>
              <p className="modal-message">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesView; 