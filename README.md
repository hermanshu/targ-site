# TARG Барахолка - Веб-версия

Веб-версия приложения TARG Барахолка, созданная на основе SwiftUI приложения.

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm start
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

## 🔥 Настройка Firebase

### 1. Создание проекта Firebase

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Создайте новый проект
3. Включите следующие сервисы:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage

### 2. Получение конфигурации

1. В настройках проекта найдите раздел "Your apps"
2. Добавьте веб-приложение
3. Скопируйте конфигурацию

### 3. Обновление конфигурации

Откройте файл `src/firebase/config.ts` и замените `firebaseConfig` на ваши данные:

```typescript
const firebaseConfig = {
  apiKey: "ваш-api-key",
  authDomain: "ваш-project.firebaseapp.com",
  projectId: "ваш-project-id",
  storageBucket: "ваш-project.appspot.com",
  messagingSenderId: "ваш-sender-id",
  appId: "ваш-app-id"
};
```

### 4. Настройка правил Firestore

В Firebase Console перейдите в Firestore Database → Rules и установите следующие правила:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Пользователи могут читать все объявления
    match /listings/{listingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Пользователи могут управлять своими профилями
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Пользователи могут управлять своими избранными
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Пользователи могут читать и писать сообщения
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.senderId || request.auth.uid == resource.data.receiverId);
    }
  }
}
```

## 📱 Функциональность

Приложение включает следующие функции:

- ✅ **Многоязычность** (Русский, Английский, Сербский)
- ✅ **Аутентификация** пользователей
- ✅ **Объявления** с категориями
- ✅ **Избранное**
- ✅ **Чат** между пользователями
- ✅ **Профили** пользователей
- ✅ **Загрузка изображений**

## 🏗️ Архитектура

Проект основан на архитектуре вашего SwiftUI приложения:

- **Contexts** - аналоги @StateObject в SwiftUI
- **Components** - аналоги Views в SwiftUI  
- **Types** - аналоги Models в SwiftUI
- **Firebase** - замена Core Data

## 🎨 Дизайн

Используется Tailwind CSS с кастомными цветами в стиле вашего приложения:
- Основной цвет: Turquoise (#00e6cc)
- Градиенты и тени
- Адаптивный дизайн

## 📦 Сборка для продакшена

```bash
npm run build
```

## 🔧 Дополнительные настройки

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
REACT_APP_FIREBASE_API_KEY=ваш-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=ваш-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=ваш-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=ваш-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=ваш-sender-id
REACT_APP_FIREBASE_APP_ID=ваш-app-id
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License
