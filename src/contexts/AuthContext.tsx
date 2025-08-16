import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, isCompany: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  verifyEmailCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Функция для загрузки пользователей из localStorage
const loadMockUsers = (): User[] => {
  const savedUsers = localStorage.getItem('mockUsers');
  if (savedUsers) {
    try {
      const users = JSON.parse(savedUsers);
      // Преобразуем строки дат обратно в объекты Date
      return users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt)
      }));
    } catch (error) {
      console.error('Ошибка при загрузке пользователей из localStorage:', error);
    }
  }
  
  // Возвращаем дефолтных пользователей, если нет сохраненных
  return [
    {
      id: '1',
      name: 'Админ',
      email: 'admin@admin.ru',
      isCompany: false,
      createdAt: new Date(),
      emailVerified: true
    }
  ];
};

// Функция для сохранения пользователей в localStorage
const saveMockUsers = (users: User[]) => {
  localStorage.setItem('mockUsers', JSON.stringify(users));
};

// Мок-данные для демонстрации
let mockUsers: User[] = loadMockUsers();

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState<{email: string, code: string} | null>(null);

  // Загружаем пользователя из localStorage при инициализации
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        // Преобразуем строки дат обратно в объекты Date
        if (user.createdAt) {
          user.createdAt = new Date(user.createdAt);
        }
        setCurrentUser(user);
        setUserProfile(user);
      } catch (error) {
        console.error('Ошибка при загрузке пользователя из localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }
    
    // Имитируем загрузку
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Имитируем задержку сети
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Простая проверка для демо
      if (email === 'admin@admin.ru' && password === 'admin') {
        const user = mockUsers[0];
        setCurrentUser(user);
        setUserProfile(user);
        // Сохраняем в localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        return;
      }
      
      // Проверяем существующих пользователей
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser && existingUser.emailVerified) {
        setCurrentUser(existingUser);
        setUserProfile(existingUser);
        // Сохраняем в localStorage
        localStorage.setItem('currentUser', JSON.stringify(existingUser));
        return;
      }
      
      // Возвращаем ошибку, которую компонент переведет
      throw new Error('INVALID_EMAIL_OR_PASSWORD');
    } catch (error: any) {
      throw new Error(error.message || 'NETWORK_ERROR');
    }
  };

  const signUp = async (email: string, password: string, name: string, isCompany: boolean) => {
    try {
      // Имитируем задержку сети
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Проверяем, не существует ли уже пользователь
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        throw new Error('USER_ALREADY_EXISTS');
      }
      
      // Генерируем код подтверждения
      const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Сохраняем данные для подтверждения
      setPendingVerification({ email, code: verificationCode });
      
      // Создаем временного пользователя
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        isCompany,
        createdAt: new Date(),
        emailVerified: false
      };
      
      // Добавляем в мок-данные
      mockUsers.push(newUser);
      saveMockUsers(mockUsers);
      
      // Код подтверждения отправлен на email
      
    } catch (error: any) {
      throw new Error(error.message || 'NETWORK_ERROR');
    }
  };

  const verifyEmailCode = async (code: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!pendingVerification || pendingVerification.code !== code) {
        throw new Error('INVALID_VERIFICATION_CODE');
      }
      
      // Находим пользователя и подтверждаем email
      const userIndex = mockUsers.findIndex(u => u.email === pendingVerification.email);
      if (userIndex !== -1) {
        mockUsers[userIndex].emailVerified = true;
        setCurrentUser(mockUsers[userIndex]);
        setUserProfile(mockUsers[userIndex]);
        // Сохраняем в localStorage
        localStorage.setItem('currentUser', JSON.stringify(mockUsers[userIndex]));
        saveMockUsers(mockUsers);
        setPendingVerification(null);
      }
      
    } catch (error: any) {
      throw new Error(error.message || 'NETWORK_ERROR');
    }
  };

  const signOut = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentUser(null);
      setUserProfile(null);
      // Удаляем из localStorage
      localStorage.removeItem('currentUser');
    } catch (error: any) {
      throw new Error('NETWORK_ERROR');
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        throw new Error('EMAIL_NOT_FOUND');
      }
      // Ссылка для сброса пароля отправлена на email
    } catch (error: any) {
      throw new Error(error.message || 'NETWORK_ERROR');
    }
  };

  const resendVerificationEmail = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!pendingVerification) {
        throw new Error('NO_PENDING_VERIFICATION');
      }
      // Email с подтверждением отправлен повторно
    } catch (error: any) {
      throw new Error(error.message || 'NETWORK_ERROR');
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    sendPasswordReset,
    resendVerificationEmail,
    verifyEmailCode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 