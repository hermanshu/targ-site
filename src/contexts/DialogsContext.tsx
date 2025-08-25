import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dialog } from '../types';
import { newId } from '../utils/id';
import { nowIso } from '../utils/datetime';

interface DialogsContextType {
  dialogs: Dialog[];
  createDialog: (buyerId: string, sellerId: string, listingId: string) => void;
  getDialog: (buyerId: string, sellerId: string) => Dialog | null;
  hasDialogWithSeller: (buyerId: string, sellerId: string) => boolean;
  updateDialogActivity: (dialogId: string) => void;
  incrementMessageCount: (dialogId: string) => void;
  addSellerMessage: (dialogId: string) => void;
  addBuyerMessage: (dialogId: string) => void;
}

const DialogsContext = createContext<DialogsContextType | undefined>(undefined);

export const useDialogs = () => {
  const context = useContext(DialogsContext);
  if (context === undefined) {
    throw new Error('useDialogs must be used within a DialogsProvider');
  }
  return context;
};

interface DialogsProviderProps {
  children: ReactNode;
}

// Тестовые данные для диалогов
const initialDialogs: Dialog[] = [
  {
    id: '1',
    buyerId: 'user1',
    sellerId: '1', // Алексей Петров
    listingId: '1',
    createdAt: '2024-01-10T00:00:00.000Z',
    lastMessageAt: '2024-01-15T00:00:00.000Z',
    messageCount: 5,
    isActive: true,
    hasSellerResponse: true,
    buyerMessageCount: 2,
    sellerMessageCount: 3
  },
  {
    id: '2',
    buyerId: 'user2',
    sellerId: '1', // Алексей Петров
    listingId: '1',
    createdAt: '2024-01-12T00:00:00.000Z',
    lastMessageAt: '2024-01-14T00:00:00.000Z',
    messageCount: 3,
    isActive: true,
    hasSellerResponse: true,
    buyerMessageCount: 1,
    sellerMessageCount: 2
  },
  {
    id: '3',
    buyerId: 'user3',
    sellerId: '2', // Мария Иванова
    listingId: '2',
    createdAt: '2024-01-08T00:00:00.000Z',
    lastMessageAt: '2024-01-13T00:00:00.000Z',
    messageCount: 8,
    isActive: true,
    hasSellerResponse: true,
    buyerMessageCount: 3,
    sellerMessageCount: 5
  },
  {
    id: '4',
    buyerId: 'user4',
    sellerId: '3', // Игорь Сидоров
    listingId: '3',
    createdAt: '2024-01-11T00:00:00.000Z',
    lastMessageAt: '2024-01-16T00:00:00.000Z',
    messageCount: 12,
    isActive: true,
    hasSellerResponse: true,
    buyerMessageCount: 5,
    sellerMessageCount: 7
  },

];

export const DialogsProvider: React.FC<DialogsProviderProps> = ({ children }) => {
  const [dialogs, setDialogs] = useState<Dialog[]>(() => {
    const savedDialogs = localStorage.getItem('dialogs');
    return savedDialogs ? JSON.parse(savedDialogs) : initialDialogs;
  });

  const saveDialogsToStorage = (dialogsToSave: Dialog[]) => {
    localStorage.setItem('dialogs', JSON.stringify(dialogsToSave));
  };

  const createDialog = (buyerId: string, sellerId: string, listingId: string) => {
    // Проверяем, не существует ли уже диалог
    const existingDialog = dialogs.find(
      dialog => dialog.buyerId === buyerId && dialog.sellerId === sellerId
    );

    if (existingDialog) {
      // Если диалог существует, обновляем его активность
      updateDialogActivity(existingDialog.id);
      return;
    }

    const newDialog: Dialog = {
      id: newId(),
      buyerId,
      sellerId,
      listingId,
      createdAt: nowIso(),
      lastMessageAt: nowIso(),
      messageCount: 1,
      isActive: true,
      hasSellerResponse: false,
      buyerMessageCount: 1,
      sellerMessageCount: 0
    };

    setDialogs(prev => {
      const updatedDialogs = [newDialog, ...prev];
      saveDialogsToStorage(updatedDialogs);
      return updatedDialogs;
    });
  };

  const getDialog = (buyerId: string, sellerId: string): Dialog | null => {
    return dialogs.find(
      dialog => dialog.buyerId === buyerId && dialog.sellerId === sellerId
    ) || null;
  };

  const hasDialogWithSeller = (buyerId: string, sellerId: string): boolean => {
    return dialogs.some(
      dialog => dialog.buyerId === buyerId && 
                dialog.sellerId === sellerId && 
                dialog.isActive && 
                dialog.hasSellerResponse
    );
  };

  const updateDialogActivity = (dialogId: string) => {
    setDialogs(prev => {
      const updatedDialogs = prev.map(dialog => 
        dialog.id === dialogId 
          ? { ...dialog, lastMessageAt: nowIso(), isActive: true }
          : dialog
      );
      saveDialogsToStorage(updatedDialogs);
      return updatedDialogs;
    });
  };

  const incrementMessageCount = (dialogId: string) => {
    setDialogs(prev => {
      const updatedDialogs = prev.map(dialog => 
        dialog.id === dialogId 
          ? { 
              ...dialog, 
              messageCount: dialog.messageCount + 1,
              lastMessageAt: nowIso(),
              isActive: true
            }
          : dialog
      );
      saveDialogsToStorage(updatedDialogs);
      return updatedDialogs;
    });
  };

  const addSellerMessage = (dialogId: string) => {
    setDialogs(prev => {
      const updatedDialogs = prev.map(dialog => 
        dialog.id === dialogId 
          ? { 
              ...dialog, 
              messageCount: dialog.messageCount + 1,
              sellerMessageCount: dialog.sellerMessageCount + 1,
              hasSellerResponse: true,
              lastMessageAt: nowIso(),
              isActive: true
            }
          : dialog
      );
      saveDialogsToStorage(updatedDialogs);
      return updatedDialogs;
    });
  };

  const addBuyerMessage = (dialogId: string) => {
    setDialogs(prev => {
      const updatedDialogs = prev.map(dialog => 
        dialog.id === dialogId 
          ? { 
              ...dialog, 
              messageCount: dialog.messageCount + 1,
              buyerMessageCount: dialog.buyerMessageCount + 1,
              lastMessageAt: nowIso(),
              isActive: true
            }
          : dialog
      );
      saveDialogsToStorage(updatedDialogs);
      return updatedDialogs;
    });
  };

  const value = {
    dialogs,
    createDialog,
    getDialog,
    hasDialogWithSeller,
    updateDialogActivity,
    incrementMessageCount,
    addSellerMessage,
    addBuyerMessage
  };

  return (
    <DialogsContext.Provider value={value}>
      {children}
    </DialogsContext.Provider>
  );
}; 