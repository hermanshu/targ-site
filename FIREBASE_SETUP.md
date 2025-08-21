# 🔥 Firebase Authentication Setup для TARG

## 📋 **Шаги настройки Firebase**

### 1. **Создание проекта Firebase**

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Нажмите "Создать проект"
3. Введите название: `targ-marketplace`
4. Включите Google Analytics (опционально)
5. Выберите аккаунт Google Analytics
6. Нажмите "Создать проект"

### 2. **Настройка Authentication**

1. В боковом меню выберите "Authentication"
2. Нажмите "Начать"
3. Перейдите на вкладку "Sign-in method"
4. Включите "Email/Password"
5. Включите "Email link (passwordless sign-in)" - для email ссылок
6. Настройте шаблоны email (опционально)

### 3. **Настройка Firestore Database**

1. В боковом меню выберите "Firestore Database"
2. Нажмите "Создать базу данных"
3. Выберите "Начать в тестовом режиме"
4. Выберите ближайший регион (например, `europe-west1`)
5. Нажмите "Готово"

### 4. **Получение конфигурации**

1. В настройках проекта найдите раздел "Your apps"
2. Нажмите на иконку веб-приложения (</>)
3. Введите название: `TARG Web App`
4. Нажмите "Register app"
5. Скопируйте конфигурацию

### 5. **Установка Firebase SDK**

```bash
npm install firebase
```

### 6. **Создание конфигурационного файла**

Создайте файл `src/firebase/config.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "ваш-api-key",
  authDomain: "ваш-project.firebaseapp.com",
  projectId: "ваш-project-id",
  storageBucket: "ваш-project.appspot.com",
  messagingSenderId: "ваш-sender-id",
  appId: "ваш-app-id"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Инициализация сервисов
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
```

## 🔧 **Интеграция в код**

### 1. **Обновление AuthContext**

1. Раскомментируйте Firebase импорты в `src/contexts/AuthContext.tsx`
2. Раскомментируйте Firebase логику
3. Удалите временную демо логику

### 2. **Обновление App.tsx**

1. Раскомментируйте Firebase логику в `src/App.tsx`
2. Добавьте импорты Firebase

### 3. **Обновление ProfileView**

1. Удалите кнопку "Ввести код вручную" для email ссылок
2. Обновите логику регистрации

## 📧 **Настройка Email Templates**

### 1. **Email Verification Template**

1. В Firebase Console → Authentication → Templates
2. Выберите "Email verification"
3. Настройте шаблон:

**Subject:**
```
Подтвердите ваш email для TARG
```

**Message:**
```
Здравствуйте!

Спасибо за регистрацию в TARG. Для завершения регистрации нажмите на ссылку ниже:

[Подтвердить email]

Если вы не регистрировались в TARG, проигнорируйте это письмо.

С уважением,
Команда TARG
```

### 2. **Password Reset Template**

**Subject:**
```
Сброс пароля для TARG
```

**Message:**
```
Здравствуйте!

Вы запросили сброс пароля для вашего аккаунта TARG. Нажмите на ссылку ниже для сброса пароля:

[Сбросить пароль]

Если вы не запрашивали сброс пароля, проигнорируйте это письмо.

С уважением,
Команда TARG
```

## 🔒 **Правила безопасности Firestore**

Создайте правила безопасности в Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Пользователи могут читать и писать только свои данные
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Объявления - читать все, писать только авторизованные
    match /listings/{listingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Отзывы - читать все, писать только авторизованные
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🚀 **Тестирование**

### 1. **Тест регистрации**
1. Зарегистрируйте нового пользователя
2. Проверьте получение email
3. Нажмите на ссылку в email
4. Убедитесь, что пользователь вошел в систему

### 2. **Тест входа**
1. Войдите с существующими данными
2. Убедитесь, что работает авторизация

### 3. **Тест сброса пароля**
1. Нажмите "Забыли пароль?"
2. Введите email
3. Проверьте получение email для сброса

## ⚠️ **Важные моменты**

1. **Email ссылки работают только в том же браузере**, где была начата регистрация
2. **Сохраняйте email в localStorage** перед отправкой ссылки
3. **Проверяйте email ссылки при загрузке приложения**
4. **Настройте домены** в Firebase Console для production

## 🔧 **Production настройки**

1. **Добавьте домен** в Firebase Console → Authentication → Settings → Authorized domains
2. **Настройте SSL** для вашего домена
3. **Обновите правила безопасности** Firestore
4. **Настройте мониторинг** в Firebase Console

## 📱 **Мобильная поддержка**

Для мобильных приложений:
1. Настройте Deep Links
2. Добавьте обработку универсальных ссылок
3. Настройте App Store Connect для iOS
4. Настройте Google Play Console для Android 