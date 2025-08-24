import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { newId } from '../utils/id';
import { nowIso } from '../utils/datetime';

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
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  // Firebase-specific methods
  verifyEmailLink: (emailLink: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
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

// TODO: Firebase imports (раскомментировать после настройки Firebase)
// import { 
//   getAuth, 
//   createUserWithEmailAndPassword, 
//   signInWithEmailAndPassword,
//   sendEmailVerification,
//   sendPasswordResetEmail,
//   signOut as firebaseSignOut,
//   onAuthStateChanged,
//   User as FirebaseUser,
//   isSignInWithEmailLink,
//   signInWithEmailLink
// } from 'firebase/auth';
// import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Функция для загрузки пользователей из localStorage (временно, для демо)
const loadMockUsers = (): User[] => {
  const savedUsers = localStorage.getItem('mockUsers');
  if (savedUsers) {
    try {
      const users = JSON.parse(savedUsers);
      return users.map((user: any) => ({
        ...user,
        createdAt: user.createdAt || nowIso()
      }));
    } catch (error) {
      console.error('Ошибка при загрузке пользователей из localStorage:', error);
    }
  }
  
  return [
    {
      id: '1',
      name: 'Админ',
      email: 'admin@admin.ru',
      isCompany: false,
      createdAt: nowIso(),
      emailVerified: true
    }
  ];
};

const saveMockUsers = (users: User[]) => {
  localStorage.setItem('mockUsers', JSON.stringify(users));
};

let mockUsers: User[] = loadMockUsers();

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState<{email: string, code: string} | null>(null);

  // TODO: Firebase auth initialization
  // const auth = getAuth();
  // const db = getFirestore();

  // TODO: Firebase auth state listener
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  //     if (firebaseUser) {
  //       // Пользователь вошел в систему
  //       const userData = await getUserData(firebaseUser.uid);
  //       setCurrentUser(userData);
  //       setUserProfile(userData);
  //     } else {
  //       // Пользователь вышел из системы
  //       setCurrentUser(null);
  //       setUserProfile(null);
  //     }
  //     setLoading(false);
  //   });
  //   return unsubscribe;
  // }, []);

  // Временная логика для демо
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (!user.createdAt) {
          user.createdAt = nowIso();
        }
        setCurrentUser(user);
        setUserProfile(user);
      } catch (error) {
        console.error('Ошибка при загрузке пользователя из localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }
    
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // TODO: Firebase sign in
  const signIn = async (email: string, password: string) => {
    try {
      // TODO: Firebase implementation
      // const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // const firebaseUser = userCredential.user;
      
      // Временная логика для демо
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@admin.ru' && password === 'admin') {
        const user = mockUsers[0];
        setCurrentUser(user);
        setUserProfile(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return;
      }
      
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser && existingUser.emailVerified) {
        setCurrentUser(existingUser);
        setUserProfile(existingUser);
        localStorage.setItem('currentUser', JSON.stringify(existingUser));
        return;
      }
      
      throw new Error('INVALID_EMAIL_OR_PASSWORD');
    } catch (error: any) {
      throw new Error(error.message || 'NETWORK_ERROR');
    }
  };

  // TODO: Firebase sign up
  const signUp = async (email: string, password: string, name: string, isCompany: boolean) => {
    try {
      // TODO: Firebase implementation
      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // const firebaseUser = userCredential.user;
      
      // // Отправляем email для подтверждения
      // await sendEmailVerification(firebaseUser);
      
      // // Сохраняем дополнительные данные пользователя в Firestore
      // await setDoc(doc(db, 'users', firebaseUser.uid), {
      //   name,
      //   email,
      //   isCompany,
      //   createdAt: new Date(),
      //   emailVerified: false
      // });
      
      // Временная логика для демо
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        throw new Error('USER_ALREADY_EXISTS');
      }
      
      const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      setPendingVerification({ email, code: verificationCode });
      
      const newUser: User = {
        id: newId(),
        name,
        email,
        isCompany,
        createdAt: nowIso(),
        emailVerified: false
      };
      
      mockUsers.push(newUser);
      saveMockUsers(mockUsers);
      
    } catch (error: any) {
      throw new Error(error.message || 'NETWORK_ERROR');
    }
  };

  // TODO: Firebase email verification
  const verifyEmailCode = async (code: string) => {
    try {
      // TODO: Firebase implementation - проверка email link
      // if (isSignInWithEmailLink(auth, window.location.href)) {
      //   let email = window.localStorage.getItem('emailForSignIn');
      //   if (!email) {
      //     email = window.prompt('Пожалуйста, введите ваш email для подтверждения');
      //   }
      //   await signInWithEmailLink(auth, email, window.location.href);
      //   window.localStorage.removeItem('emailForSignIn');
      // }
      
      // Временная логика для демо
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!pendingVerification || pendingVerification.code !== code) {
        throw new Error('INVALID_VERIFICATION_CODE');
      }
      
      const userIndex = mockUsers.findIndex(u => u.email === pendingVerification.email);
      if (userIndex !== -1) {
        mockUsers[userIndex].emailVerified = true;
        setCurrentUser(mockUsers[userIndex]);
        setUserProfile(mockUsers[userIndex]);
        localStorage.setItem('currentUser', JSON.stringify(mockUsers[userIndex]));
        saveMockUsers(mockUsers);
        setPendingVerification(null);
      }
      
    } catch (error: any) {
      throw new Error(error.message || 'NETWORK_ERROR');
    }
  };

  // TODO: Firebase email link verification
  const verifyEmailLink = async (emailLink: string) => {
    try {
      // TODO: Firebase implementation
      // if (isSignInWithEmailLink(auth, emailLink)) {
      //   let email = window.localStorage.getItem('emailForSignIn');
      //   if (!email) {
      //     email = window.prompt('Пожалуйста, введите ваш email для подтверждения');
      //   }
      //   const result = await signInWithEmailLink(auth, email, emailLink);
      //   window.localStorage.removeItem('emailForSignIn');
      //   
      //   // Обновляем статус emailVerified в Firestore
      //   await setDoc(doc(db, 'users', result.user.uid), {
      //     emailVerified: true
      //   }, { merge: true });
      // }
      
      // Временная логика для демо
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Email link verification:', emailLink);
      
    } catch (error: any) {
      throw new Error(error.message || 'NETWORK_ERROR');
    }
  };

  // TODO: Firebase send email verification
  const sendEmailVerification = async () => {
    try {
      // TODO: Firebase implementation
      // if (auth.currentUser) {
      //   await sendEmailVerification(auth.currentUser);
      // }
      
      // Временная логика для демо
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Email verification sent');
      
    } catch (error: any) {
      throw new Error(error.message || 'NETWORK_ERROR');
    }
  };

  const resendVerificationEmail = async () => {
    try {
      // TODO: Firebase implementation
      // if (auth.currentUser) {
      //   await sendEmailVerification(auth.currentUser);
      // }
      
      // Временная логика для демо
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Verification email resent');
      
    } catch (error: any) {
      throw new Error(error.message || 'NETWORK_ERROR');
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      // TODO: Firebase implementation
      // await sendPasswordResetEmail(auth, email);
      
      // Временная логика для демо
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password reset email sent to:', email);
      
    } catch (error: any) {
      throw new Error(error.message || 'NETWORK_ERROR');
    }
  };

  const signOut = async () => {
    try {
      // TODO: Firebase implementation
      // await firebaseSignOut(auth);
      
      // Временная логика для демо
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('currentUser');
    } catch (error: any) {
      throw new Error(error.message || 'NETWORK_ERROR');
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    try {
      // TODO: Firebase implementation
      // if (auth.currentUser) {
      //   await setDoc(doc(db, 'users', auth.currentUser.uid), updates, { merge: true });
      // }
      
      // Временная логика для демо
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        setCurrentUser(updatedUser);
        setUserProfile(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
          mockUsers[userIndex] = updatedUser;
          saveMockUsers(mockUsers);
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'NETWORK_ERROR');
    }
  };

  // TODO: Helper function for getting user data from Firestore
  // const getUserData = async (uid: string): Promise<User> => {
  //   const userDoc = await getDoc(doc(db, 'users', uid));
  //   if (userDoc.exists()) {
  //     return { id: uid, ...userDoc.data() } as User;
  //   }
  //   throw new Error('User not found');
  // };

  const value = {
    currentUser,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    sendPasswordReset,
    resendVerificationEmail,
    verifyEmailCode,
    updateUserProfile,
    verifyEmailLink,
    sendEmailVerification,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 