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
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { ListingPage } from './listing/ListingPage';
import { Listing } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import AuthRequiredView from './AuthRequiredView';
import { nowIso } from '../utils/datetime';
import LanguageInfoModal from './LanguageInfoModal';


interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isPinned?: boolean; // Закреплен ли чат
  userLanguage?: 'RU' | 'EN' | 'SR'; // Язык собеседника
  listing: {
    id: string;
    title: string;
    price: string;
    currency: string;
    category: string;
    subcategory?: string;
    imageName?: string;
    images?: { id: string; src: string; alt?: string; w?: number; h?: number }[];
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
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
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
  const [showLanguageInfoModal, setShowLanguageInfoModal] = useState(false);
  
  // Состояния для кастомных модальных окон
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const [fullscreenImageSrc, setFullscreenImageSrc] = useState('');
  const [fullscreenImageAlt, setFullscreenImageAlt] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const processedRequestsRef = useRef<Set<string>>(new Set());
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  // Функция для определения языка собеседника и создания предупреждения
  const getLanguageWarning = (chat: Chat) => {
    if (!chat.userLanguage || chat.userLanguage === currentLanguage) {
      return null;
    }

    const languageNames = {
      'RU': 'русском',
      'EN': 'английском', 
      'SR': 'сербском'
    };

    const currentLanguageName = languageNames[currentLanguage];
    const chatLanguageName = languageNames[chat.userLanguage];

    return {
      text: `Собеседник говорит на ${chatLanguageName}`,
      type: 'warning' as const
    };
  };

  // Обработчик клика на предупреждение о языке
  const handleLanguageWarningClick = () => {
    setShowLanguageInfoModal(true);
  };

  // Функция для сохранения чатов в localStorage
  const saveChatsToStorage = (chats: Chat[]) => {
    try {
      // Убеждаемся, что у всех чатов есть информация о языке и закреплении
      const chatsWithLanguage = chats.map((chat: Chat) => {
        let updatedChat = chat;
        
        if (!chat.userLanguage) {
          // Добавляем язык на основе имени собеседника
          if (chat.name === 'Мария Иванова') {
            updatedChat = { ...updatedChat, userLanguage: 'SR' };
          } else if (chat.name === 'Дмитрий Козлов') {
            updatedChat = { ...updatedChat, userLanguage: 'EN' };
          } else if (chat.name === 'Алексей Петров' || chat.name === 'Анна Волкова') {
            updatedChat = { ...updatedChat, userLanguage: 'RU' };
          }
        }
        
        // Убеждаемся что поле isPinned присутствует
        return { ...updatedChat, isPinned: updatedChat.isPinned || false };
      });
      
      localStorage.setItem('targ-chats', JSON.stringify(chatsWithLanguage));
      // Отправляем кастомное событие для обновления счетчика
      window.dispatchEvent(new Event('targ-chats-updated'));
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
      unreadCount: 5,
      isOnline: true,
      isPinned: true, // Закрепленный чат
      userLanguage: 'RU',
      listing: {
        id: '1',
        title: 'iPhone 14 Pro Max',
        price: '1200',
        currency: 'EUR',
        category: 'electronics',
        subcategory: undefined,
        imageName: 'iphone',
        contactMethod: 'phone'
      }
    },
    {
      id: '2',
      name: 'Мария Иванова',
      lastMessage: 'Спасибо за быструю доставку!',
      timestamp: '12:15',
      unreadCount: 0,
      isOnline: false,
      userLanguage: 'SR',
      listing: {
        id: '8',
        title: '2-комнатная квартира в центре',
        price: '850',
        currency: 'EUR',
        category: 'realEstate',
        subcategory: 'rent',
        imageName: 'apartment-2room',
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
      userLanguage: 'EN',
      listing: {
        id: '3',
        title: 'BMW X5 2020',
        price: '45000',
        currency: 'EUR',
        category: 'transport',
        subcategory: undefined,
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
      userLanguage: 'RU',
      listing: {
        id: '4',
        title: 'MacBook Pro 2023',
        price: '2500',
        currency: 'EUR',
        category: 'electronics',
        subcategory: undefined,
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
      userLanguage: 'RU',
      listing: {
        id: '5',
        title: 'PlayStation 5',
        price: '500',
        currency: 'EUR',
        category: 'electronics',
        subcategory: undefined,
        imageName: 'ps5',
        contactMethod: 'phone'
      }
    },
    {
      id: '6',
      name: 'Мария Иванова',
      lastMessage: 'Комод еще доступен?',
      timestamp: 'Вт',
      unreadCount: 2,
      isOnline: true,
      userLanguage: 'SR',
      listing: {
        id: '2',
        title: 'Винтажный комод с зеркалом',
        price: '32.000',
        currency: 'RSD',
        category: 'furniture',
        subcategory: undefined,
        imageName: 'vintage-chest-1',
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
        const parsedChats = JSON.parse(savedChats);
        
        // Обновляем чаты, добавляя информацию о языке, если её нет
        const updatedChats = parsedChats.map((chat: Chat) => {
          if (!chat.userLanguage) {
            // Добавляем язык на основе имени собеседника
            if (chat.name === 'Мария Иванова') {
              return { ...chat, userLanguage: 'SR' };
            } else if (chat.name === 'Дмитрий Козлов') {
              return { ...chat, userLanguage: 'EN' };
            } else if (chat.name === 'Алексей Петров' || chat.name === 'Анна Волкова') {
              return { ...chat, userLanguage: 'RU' };
            }
          }
          return chat;
        });
        
        return updatedChats;
      } catch (e) {
        console.error('Ошибка при загрузке чатов из localStorage:', e);
        return initialChats;
      }
    }
    return initialChats;
  });

  // Обработка URL параметров для создания нового чата
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
            return;
  }
      
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
          createdAt: nowIso(),
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
  }, [location.search, navigate, t]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Функция для загрузки сообщений чата
  const loadChatMessages = useCallback((chatId: string) => {
    // Сначала пытаемся загрузить сообщения из localStorage
    const savedMessages = loadMessagesFromStorage(chatId);
    
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    } else {
      // Проверяем, является ли это новым чатом (созданным из URL параметров)
      // Новые чаты имеют ID вида 'chat-{userId}', а существующие имеют ID '1', '2', etc.
      const isNewChat = chatId.startsWith('chat-') && chatId.length > 5;
      
      if (isNewChat) {
        // Для новых чатов загружаем пустые сообщения
        setMessages([]);
      } else {
        // Для существующих чатов загружаем мок-данные
        setMessages(initialMessages);
      }
    }
  }, [initialMessages]);

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
          setMessages([]);
        } else {
          setMessages(initialMessages);
        }
      }
      setAttachments([]);
    }
  }, [selectedChat, initialMessages, loadChatMessages]);

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
    const currentRef = processedRequestsRef.current;
    return () => {
      currentRef.clear();
    };
  }, []);

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chatList;
    return chatList.filter((chat: Chat) => 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chatList, searchQuery]);

  // Получаем уникальные категории из чатов для фильтров
  const chatCategories = useMemo(() => {
    const categories = new Set<string>();
    chatList.forEach(chat => {
      if (chat.listing.category) {
        categories.add(chat.listing.category);
      }
      if (chat.listing.subcategory) {
        categories.add(chat.listing.subcategory);
      }
    });
    return Array.from(categories);
  }, [chatList]);

  // Состояние для выбранной категории фильтра
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Функция для переключения закрепления чата
  const togglePinChat = (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Предотвращаем открытие чата
    setChatList(prevChats => {
      const updatedChats = prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, isPinned: !chat.isPinned }
          : chat
      );
      saveChatsToStorage(updatedChats);
      return updatedChats;
    });
  };

  // Фильтрованные и отсортированные чаты (закрепленные сверху)
  const filteredChatsByCategory = useMemo(() => {
    let filtered = selectedCategory === null ? filteredChats : filteredChats.filter(chat => 
      chat.listing.category === selectedCategory || 
      chat.listing.subcategory === selectedCategory
    );
    
    // Сортируем: закрепленные сверху, затем по времени
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [filteredChats, selectedCategory]);

  // Обработчик клика на категорию
  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  // Функция для получения иконки категории
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'electronics': '📱',
      'transport': '🚗',
      'realEstate': '🏠',
      'furniture': '🪑',
      'work': '💼',
      'vacancies': '💼',
      'rent': '🏠',
      'services': '🔧',
      'clothing': '👕',
      'sports': '⚽',
      'books': '📚',
      'pets': '🐕',
      'garden': '🌱',
      'music': '🎵',
      'art': '🎨',
      'food': '🍕',
      'health': '💊',
      'education': '🎓'
    };
    return icons[category] || '📦';
  };

  // Функция для получения названия категории
  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      'electronics': 'Электроника',
      'transport': 'Транспорт',
      'realEstate': 'Недвижимость',
      'furniture': 'Мебель',
      'work': 'Работа',
      'vacancies': 'Вакансии',
      'rent': 'Аренда',
      'services': 'Услуги',
      'clothing': 'Одежда',
      'sports': 'Спорт',
      'books': 'Книги',
      'pets': 'Животные',
      'garden': 'Сад',
      'music': 'Музыка',
      'art': 'Искусство',
      'food': 'Еда',
      'health': 'Здоровье',
      'education': 'Образование'
    };
    return names[category] || category;
  };

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
        createdAt: nowIso(),
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
        subcategory: listing.subcategory,
        imageName: listing.imageName,
        contactMethod: listing.contactMethod
      }
    };
    
    // Проверяем в localStorage, существует ли уже чат с этим продавцом
    const savedChats = JSON.parse(localStorage.getItem('targ-chats') || '[]');
    
    // Проверяем по ID чата (продавец) И по ID объявления
    const existingChatBySeller = savedChats.find((chat: Chat) => chat.id === newChat.id);
    const existingChatByListing = savedChats.find((chat: Chat) => chat.listing.id === listing.id);
    
    if (existingChatBySeller || existingChatByListing) {
      const existingChat = existingChatBySeller || existingChatByListing;
      console.log('Чат уже существует в localStorage, просто переходим к нему');
      setSelectedChat(existingChat);
      loadChatMessages(existingChat.id);
      setSelectedListing(null);
      return;
    }
    
    // Используем функциональное обновление состояния для проверки существующих чатов
    setChatList(prevChats => {
      // Проверяем, существует ли уже чат с этим продавцом ИЛИ с этим объявлением
      const existingChatBySellerIndex = prevChats.findIndex((chat: Chat) => chat.id === newChat.id);
      const existingChatByListingIndex = prevChats.findIndex((chat: Chat) => chat.listing.id === listing.id);
      
      if (existingChatBySellerIndex === -1 && existingChatByListingIndex === -1) {
        // Добавляем новый чат в начало списка
        const newChats = [newChat, ...prevChats];
        saveChatsToStorage(newChats);
        
        // Устанавливаем новый чат как выбранный
        setSelectedChat(newChat);
        setMessages([]);
        
        return newChats;
      } else {
        // Находим существующий чат (по продавцу или по объявлению)
        const existingIndex = existingChatBySellerIndex !== -1 ? existingChatBySellerIndex : existingChatByListingIndex;
        const updatedChats = [...prevChats];
        const movedChat = updatedChats.splice(existingIndex, 1)[0];
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

  // Проверяем авторизацию после всех хуков
  if (!currentUser) {
    return (
      <AuthRequiredView 
        title={t('messages.messagesUnavailable')}
        description={t('messages.signInToChat')}
      />
    );
  }

  // Если выбрано объявление для просмотра, показываем детальную страницу
  if (selectedListing) {
    return (
      <ListingPage
        listingId={selectedListing.id}
        onBack={handleBackToChat}
        onFavoriteToggle={handleFavoriteToggle}
        isFavorite={isFavorite(selectedListing.id)}
        onNavigateToMessages={handleNavigateToMessages}
        onNavigateToProfile={handleNavigateToProfile}
      />
    );
  }

  // Функции для полноэкранного просмотра изображений
  const handleImageClick = (imageSrc: string, imageAlt: string) => {
    setFullscreenImageSrc(imageSrc);
    setFullscreenImageAlt(imageAlt);
    setShowFullscreenImage(true);
  };

  const handleCloseFullscreen = () => {
    setShowFullscreenImage(false);
  };

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
          {filteredChatsByCategory.map((chat) => (
            <div 
              key={chat.id} 
              className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''} ${chat.isPinned ? 'pinned' : ''}`}
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
                
                // Сбрасываем фильтр по категориям при открытии диалога
                setSelectedCategory(null);
                
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
                {currentUser && chat.unreadCount > 0 && (
                  <div className="unread-badge">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
              
              <div className="chat-content">
                <div className="chat-header-row">
                  <h3 className="chat-name">{chat.name}</h3>
                  <div className="chat-header-actions">
                    <button
                      className={`pin-button ${chat.isPinned ? 'pinned' : ''}`}
                      onClick={(e) => togglePinChat(chat.id, e)}
                      title={chat.isPinned ? 'Открепить чат' : 'Закрепить чат'}
                    >
                      📌
                    </button>
                    <span className="chat-time">{chat.timestamp}</span>
                  </div>
                </div>
                
                <div className="chat-listing-info">
                  <span className="listing-title">{chat.listing.title}</span>
                  <span className="listing-price">
                    {chat.listing.price} {chat.listing.currency}
                    {(chat.listing.category === 'work' || chat.listing.category === 'vacancies' || chat.listing.subcategory === 'vacancies' || chat.listing.subcategory === 'rent') && ' / месяц'}
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
                className="back-button"
                onClick={() => setSelectedChat(null)}
                title="Вернуться к списку сообщений"
              >
                <ArrowLeftIcon className="back-icon" />
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
              
              {/* Предупреждение о языке собеседника */}
              {(() => {
                const warning = getLanguageWarning(selectedChat);
                return warning ? (
                  <div className="language-warning" onClick={handleLanguageWarningClick}>
                    <div className="language-warning-icon">🌐</div>
                    <span className="language-warning-text">
                      {warning.text}
                    </span>
                  </div>
                ) : null;
              })()}
              
              {/* Превью объявления */}
              <div 
                className="chat-listing-preview clickable"
                onClick={handleListingPreviewClick}
                title={t('favorites.clickToViewListing')}
              >
                <div className="listing-preview-image">
                  {selectedChat.listing.images && selectedChat.listing.images.length > 0 ? (
                    <img 
                      src={selectedChat.listing.images[0]?.src || ''} 
                      alt={selectedChat.listing.images[0]?.alt || selectedChat.listing.title}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : selectedChat.listing.imageName ? (
                    <img 
                      src={`/images/${selectedChat.listing.imageName}.jpg`} 
                      alt={selectedChat.listing.title}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`listing-preview-placeholder ${(selectedChat.listing.images && selectedChat.listing.images.length > 0) || selectedChat.listing.imageName ? 'hidden' : ''}`}>
                    <div className="placeholder-icon">📷</div>
                  </div>
                </div>
                <div className="listing-preview-info">
                  <h3 className="listing-preview-title">{selectedChat.listing.title}</h3>
                  <span className="listing-preview-price">
                    {selectedChat.listing.price} {selectedChat.listing.currency}
                    {(selectedChat.listing.category === 'work' || selectedChat.listing.category === 'vacancies' || selectedChat.listing.subcategory === 'vacancies' || selectedChat.listing.subcategory === 'rent') && ' / месяц'}
                  </span>
                </div>
                <div className="listing-preview-arrow">→</div>
              </div>
              
              {/* Кнопки действий */}
              <div className="chat-actions">
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
                            <img 
                              src={attachment} 
                              alt={t('favorites.attachment')}
                              onClick={() => handleImageClick(attachment, t('favorites.attachment'))}
                              style={{ cursor: 'pointer' }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {message.text && <p className="message-text">{message.text}</p>}
                    {message.isOwn ? (
                      <div className="message-status">
                        <span className={`read-indicator ${message.isRead ? 'read' : 'unread'}`}>
                          {message.isRead ? '✓✓' : '✓'}
                        </span>
                        <span className="message-time">{message.timestamp}</span>
                      </div>
                    ) : (
                      <div className="message-status other">
                        <span className="message-time">{message.timestamp}</span>
                      </div>
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
              <div className="empty-chat-icon">🔍</div>
              
              {/* Кнопки категорий в строчку */}
              {chatCategories.length > 0 && (
                <div className="category-filters-row">
                  <p className="category-filters-hint">Выбери категорию, чтобы увидеть сообщения по ней</p>
                  <div className="category-filters-buttons">
                    {/* Кнопка "Все сообщения" всегда первая */}
                    <button
                      className={`website-category-button ${selectedCategory === null ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(null)}
                    >
                      <span className="website-category-emoji">💬</span>
                      <span>Все сообщения</span>
                    </button>
                    
                    {/* Остальные категории */}
                    {chatCategories.map((category, index) => (
                      <button
                        key={category}
                        className={`website-category-button ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(category)}
                      >
                        <span className="website-category-emoji">
                          {getCategoryIcon(category)}
                        </span>
                        <span>{getCategoryName(category)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Если нет категорий, показываем подсказку */}
              {chatCategories.length === 0 && (
                <div className="no-categories-hint">
                  <p>Нет активных диалогов</p>
                </div>
              )}
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

      {/* Полноэкранный просмотр изображений */}
      {showFullscreenImage && (
        <div className="fullscreen-image-overlay" onClick={handleCloseFullscreen}>
          <div className="fullscreen-image-container" onClick={(e) => e.stopPropagation()}>
            <img 
              src={fullscreenImageSrc}
              alt={fullscreenImageAlt}
              className="fullscreen-image"
            />
            
            {/* Кнопка закрытия */}
            <button className="fullscreen-close-button" onClick={handleCloseFullscreen}>
              <XMarkIcon className="fullscreen-close-icon" />
            </button>
          </div>
        </div>
      )}

      {/* Модальное окно информации о языке */}
      <LanguageInfoModal
        isOpen={showLanguageInfoModal}
        onClose={() => setShowLanguageInfoModal(false)}
        interlocutorLanguage={selectedChat?.userLanguage || 'RU'}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};

export default MessagesView; 