import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon
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
  userLanguage?: 'RU' | 'EN' | 'SR'; // Язык собеседника
  listing: {
    id: string;
    title: string;
    price: string;
    currency: string;
    category: string;
    subcategory?: string;
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

interface MobileMessagesViewProps {
  onNavigateToMessages?: (listing: Listing) => void;
  onNavigateToProfile?: (mode?: 'signin' | 'signup') => void;
}

const MobileMessagesView: React.FC<MobileMessagesViewProps> = ({ 
  onNavigateToMessages, 
  onNavigateToProfile 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

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
  
  // Все хуки должны быть в начале компонента
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [showLanguageInfoModal, setShowLanguageInfoModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedRequestsRef = useRef<Set<string>>(new Set());

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

  // Инициализация состояния чатов
  const [chatList, setChatList] = useState<Chat[]>(() => {
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
        return [];
      }
    }
    return [];
  });

  // Фильтрация чатов по поиску
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chatList;
    return chatList.filter(chat => 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chatList, searchQuery]);

  // Функция для загрузки сообщений чата
  const loadChatMessages = useCallback((chatId: string) => {
    const savedMessages = loadMessagesFromStorage(chatId);
    setMessages(savedMessages);
  }, []);

  // Функция для сохранения чатов в localStorage
  const saveChatsToStorage = (chats: Chat[]) => {
    try {
      // Убеждаемся, что у всех чатов есть информация о языке
      const chatsWithLanguage = chats.map((chat: Chat) => {
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
      
      localStorage.setItem('targ-chats', JSON.stringify(chatsWithLanguage));
      // Отправляем кастомное событие для обновления счетчика
      window.dispatchEvent(new Event('targ-chats-updated'));
    } catch (e) {
      console.error('Ошибка при сохранении чатов в localStorage:', e);
    }
  };

  // Функция для навигации к сообщениям
  const handleNavigateToMessages = useCallback((listing: Listing) => {
    const chatId = `chat-${listing.userId}`;
    
    // Проверяем, существует ли уже чат
    const existingChat = chatList.find(chat => chat.id === chatId);
    
    if (existingChat) {
      setSelectedChat(existingChat);
      loadChatMessages(existingChat.id);
      setView('chat');
    } else {
      // Создаем новый чат
      const newChat: Chat = {
        id: chatId,
        name: listing.sellerName,
        lastMessage: '',
        timestamp: new Date().toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        unreadCount: 0,
        isOnline: true,
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

      const updatedChats = [newChat, ...chatList];
      setChatList(updatedChats);
      saveChatsToStorage(updatedChats);
      
      setSelectedChat(newChat);
      setMessages([]);
      setView('chat');
    }
  }, [chatList, loadChatMessages]);

  // Функция для отправки сообщения
  const sendMessage = () => {
    if (!messageText.trim() && attachments.length === 0) return;
    
    if (!selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isOwn: true,
      isRead: true,
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    saveMessagesToStorage(selectedChat.id, updatedMessages);

    // Обновляем последнее сообщение в списке чатов
    setChatList(prevChats => {
      const updatedChats = prevChats.map(chat => 
        chat.id === selectedChat.id 
          ? { 
              ...chat, 
              lastMessage: messageText.trim() || 'Фото',
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

    setMessageText('');
    setAttachments([]);
  };

  // Функция для обработки нажатия Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Функция для обработки файлов
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map(file => URL.createObjectURL(file));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  // Функция для удаления вложения
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Функция для обработки избранного
  const handleFavoriteToggle = (listing: Listing) => {
    if (isFavorite(listing.id)) {
      removeFromFavorites(listing.id);
    } else {
      addToFavorites(listing);
    }
  };

  // Функция для возврата к списку чатов
  const handleBackToList = () => {
    setView('list');
    setSelectedChat(null);
  };

  // Функция для возврата к чату
  const handleBackToChat = () => {
    setSelectedListing(null);
  };

  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      const requestKey = `${listingId}-${sellerId}-${title}-${sellerName}`;
      
      if (processedRequestsRef.current.has(requestKey)) {
        return;
      }
      
      processedRequestsRef.current.add(requestKey);
      
      const chatId = `chat-${sellerId}`;
      const savedChats = JSON.parse(localStorage.getItem('targ-chats') || '[]');
      const existingChat = savedChats.find((chat: Chat) => chat.id === chatId);
      
      if (existingChat) {
        setChatList(prevChats => {
          const existingInList = prevChats.find(chat => chat.id === chatId);
          if (!existingInList) {
            return [existingChat, ...prevChats];
          }
          return prevChats;
        });
        
        setSelectedChat(existingChat);
        loadChatMessages(existingChat.id);
        setView('chat');
      } else {
        const newListing: Listing = {
          id: listingId,
          title: decodeURIComponent(title),
          price: price || '0',
          currency: (currency as 'EUR' | 'RSD') || 'EUR',
          city: city || 'Неизвестно',
          category: category || 'Объявление',
          sellerName: decodeURIComponent(sellerName),
          isCompany: isCompany === 'true',
          imageName: imageName || '',
          description: '',
          createdAt: nowIso(),
          userId: sellerId,
          contactMethod: (contactMethod as 'phone' | 'chat') || 'chat',
          views: 0
        };

        handleNavigateToMessages(newListing);
      }

      navigate('/messages', { replace: true });
    }
  }, [location.search, navigate, t, loadChatMessages, handleNavigateToMessages]);
  
  // Если пользователь не авторизован, показываем заглушку
  if (!currentUser) {
    return (
      <AuthRequiredView 
        title={t('messages.messagesUnavailable')}
        description={t('messages.signInToChat')}
      />
    );
  }

  // Если выбран листинг для просмотра
  if (selectedListing) {
    return (
      <ListingPage
        listingId={selectedListing.id}
        onBack={handleBackToChat}
        onFavoriteToggle={handleFavoriteToggle}
        isFavorite={isFavorite(selectedListing.id)}
        onNavigateToMessages={handleNavigateToMessages}
        onNavigateToProfile={onNavigateToProfile}
      />
    );
  }

  return (
    <div className="mobile-messages-container">
      {view === 'list' ? (
        // Список чатов
        <div className="mobile-chats-list">
          <div className="mobile-chats-header">
            <h1 className="mobile-chats-title">{t('messages.title')}</h1>
            <div className="mobile-search-container">
              <MagnifyingGlassIcon className="mobile-search-icon" />
              <input
                type="text"
                placeholder={t('favorites.searchChats')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-search-input"
              />
            </div>
          </div>

          <div className="mobile-chats-content">
            {filteredChats.length === 0 ? (
              <div className="mobile-empty-state">
                <div className="empty-icon">
                  <ChatBubbleLeftRightIcon className="empty-icon-svg" />
                </div>
                <h3 className="empty-title">{t('messages.noMessages')}</h3>
                <p className="empty-description">{t('messages.startChat')}</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div 
                  key={chat.id} 
                  className="mobile-chat-item"
                  onClick={() => {
                    setChatList(prevChats => {
                      const updatedChats = prevChats.map(c => 
                        c.id === chat.id 
                          ? { ...c, unreadCount: 0 }
                          : c
                      );
                      saveChatsToStorage(updatedChats);
                      return updatedChats;
                    });
                    
                    setSelectedChat(chat);
                    loadChatMessages(chat.id);
                    setView('chat');
                  }}
                >
                  <div className="mobile-chat-avatar">
                    <div className="mobile-avatar-initial">
                      {chat.name.charAt(0)}
                    </div>
                    {chat.isOnline && <div className="mobile-online-indicator" />}
                    {currentUser && chat.unreadCount > 0 && (
                      <div className="mobile-unread-badge">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                  
                  <div className="mobile-chat-content">
                    <div className="mobile-chat-header-row">
                      <h3 className="mobile-chat-name">{chat.name}</h3>
                      <span className="mobile-chat-time">{chat.timestamp}</span>
                    </div>
                    
                    <div className="mobile-chat-listing-info">
                      <span className="mobile-listing-title">{chat.listing.title}</span>
                      <span className="mobile-listing-price">
                        {chat.listing.price} {chat.listing.currency}
                        {(chat.listing.category === 'work' || chat.listing.category === 'vacancies' || chat.listing.subcategory === 'vacancies' || chat.listing.subcategory === 'rent') && ' / месяц'}
                      </span>
                    </div>
                    
                    <div className="mobile-chat-message-row">
                      <p className="mobile-chat-last-message">{chat.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {/* Дополнительное пространство внизу для панели навигации */}
            <div style={{ height: '100px', width: '100%' }}></div>
          </div>
        </div>
      ) : (
        // Чат
        <div className="mobile-chat-view">
          <div className="mobile-chat-header">
            <button 
              className="mobile-back-button"
              onClick={handleBackToList}
            >
              <ArrowLeftIcon className="mobile-back-icon" />
            </button>
            
            <div className="mobile-chat-info">
              <div className="mobile-chat-avatar">
                <div className="mobile-avatar-initial">
                  {selectedChat?.name.charAt(0)}
                </div>
                {selectedChat?.isOnline && <div className="mobile-online-indicator" />}
              </div>
              
              <div className="mobile-chat-details">
                <h3 className="mobile-chat-name">{selectedChat?.name}</h3>
                <span className="mobile-chat-status">
                  {selectedChat?.isOnline ? t('messages.online') : t('favorites.offline')}
                </span>
              </div>
            </div>
            
            {/* Предупреждение о языке собеседника */}
            {selectedChat && (() => {
              const warning = getLanguageWarning(selectedChat);
              return warning ? (
                <div className="mobile-language-warning" onClick={handleLanguageWarningClick}>
                  <div className="mobile-language-warning-icon">🌐</div>
                  <span className="mobile-language-warning-text">
                    {warning.text}
                  </span>
                </div>
              ) : null;
            })()}
            
            <button 
              className="mobile-chat-menu-button"
              onClick={() => {}}
            >
              <EllipsisVerticalIcon className="mobile-menu-icon" />
            </button>
          </div>

          <div className="mobile-messages-area">
            {messages.length === 0 ? (
              <div className="mobile-empty-chat">
                <div className="empty-chat-icon">
                  <ChatBubbleLeftRightIcon className="empty-chat-icon-svg" />
                </div>
                <h3 className="empty-chat-title">{t('messages.noMessages')}</h3>
                <p className="empty-chat-description">{t('messages.startChat')}</p>
              </div>
            ) : (
              <div className="mobile-messages-list">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`mobile-message ${message.isOwn ? 'own' : 'other'}`}
                  >
                    <div className="mobile-message-content">
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mobile-message-attachments">
                          {message.attachments.map((attachment, index) => (
                            <img 
                              key={index} 
                              src={attachment} 
                              alt="Вложение" 
                              className="mobile-message-attachment"
                            />
                          ))}
                        </div>
                      )}
                      {message.text && (
                        <p className="mobile-message-text">{message.text}</p>
                      )}
                      <span className="mobile-message-time">{message.timestamp}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="mobile-message-input">
            {attachments.length > 0 && (
              <div className="mobile-attachments-preview">
                {attachments.map((attachment, index) => (
                  <div key={index} className="mobile-attachment-preview">
                    <img src={attachment} alt="Вложение" />
                    <button 
                      className="mobile-remove-attachment"
                      onClick={() => removeAttachment(index)}
                    >
                      <XMarkIcon className="mobile-remove-icon" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mobile-input-container">
              <button 
                className="mobile-attachment-button"
                onClick={() => fileInputRef.current?.click()}
              >
                <PhotoIcon className="mobile-attachment-icon" />
              </button>
              
              <input
                type="text"
                placeholder={t('messages.typeMessage')}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="mobile-message-input-field"
              />
              
              <button 
                className="mobile-send-button"
                onClick={sendMessage}
                disabled={!messageText.trim() && attachments.length === 0}
              >
                <PaperAirplaneIcon className="mobile-send-icon" />
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
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

export default MobileMessagesView; 