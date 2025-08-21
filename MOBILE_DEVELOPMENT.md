# 📱 Мобильная разработка TARG

## 🎯 **Подход к мобильной разработке**

### **Определение устройства vs размер экрана**

Мы используем **определение устройства** вместо только размера экрана для более точного UX:

```typescript
// ✅ Правильно - определяем устройство
const { isMobile, isTablet, isDesktop } = useDeviceType();

// ✅ Также правильно - определяем размер экрана (для адаптивности)
const { isSmall, isMedium, isLarge } = useScreenSize();

// ❌ Неправильно - только размер экрана для определения устройства
const isMobile = window.innerWidth <= 768;
```

### **Разница между устройством и размером экрана:**

- **Устройство** - определяется по User Agent (iPhone, Android, Desktop)
- **Размер экрана** - определяется по ширине окна (768px, 1024px, etc.)

**Пример:**
- Десктоп с узким окном = `device-desktop` + `screen-small`
- iPhone в ландшафте = `device-mobile` + `screen-medium`

## 🔧 **Как это работает**

### **1. Определение устройства**
```typescript
// src/hooks/useDeviceType.ts
const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
const isMobileDevice = mobileRegex.test(navigator.userAgent);
```

### **2. CSS классы устройства**
```html
<!-- Автоматически добавляется к корневому элементу -->
<div class="App device-mobile">   <!-- для мобильных -->
<div class="App device-tablet">   <!-- для планшетов -->
<div class="App device-desktop">  <!-- для десктопа -->
```

### **3. Использование в компонентах**
```typescript
import { useDeviceType } from '../hooks/useDeviceType';
import { useScreenSize } from '../hooks/useScreenSize';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop, type } = useDeviceType();
  const { isSmall, isMedium, isLarge, size } = useScreenSize();
  
  // Определяем версию по устройству
  if (isMobile) {
    return <MobileVersion />;
  }
  
  // Адаптируем стили по размеру экрана
  return (
    <div className={`desktop-version screen-${size}`}>
      <DesktopVersion />
    </div>
  );
};
```

## 📱 **Мобильные компоненты**

### **Структура мобильных компонентов:**
```
src/components/
├── MobileHomeView.tsx          # Мобильная главная
├── MobileMessagesView.tsx      # Мобильные сообщения
├── MobileFilterSheet.tsx       # Мобильные фильтры
└── mobile-styles.css          # Мобильные стили
```

### **Пример мобильного компонента:**
```typescript
import React from 'react';
import { useDeviceType } from '../hooks/useDeviceType';

const MyComponent = () => {
  const { isMobile } = useDeviceType();
  
  // Мобильная версия
  if (isMobile) {
    return (
      <div className="mobile-container">
        <div className="mobile-header">
          <h1>Мобильная версия</h1>
        </div>
        <div className="mobile-content">
          {/* Мобильный контент */}
        </div>
      </div>
    );
  }
  
  // Десктопная версия
  return (
    <div className="desktop-container">
      <div className="desktop-header">
        <h1>Десктопная версия</h1>
      </div>
      <div className="desktop-content">
        {/* Десктопный контент */}
      </div>
    </div>
  );
};
```

## 🎨 **Мобильные стили**

### **CSS подход:**
```css
/* Общие стили */
.component {
  /* базовые стили */
}

/* Мобильные стили */
.device-mobile .component {
  /* мобильные стили */
}

/* Планшетные стили */
.device-tablet .component {
  /* планшетные стили */
}

/* Десктопные стили */
.device-desktop .component {
  /* десктопные стили */
}
```

### **Tailwind подход:**
```jsx
<div className={`
  ${isMobile ? 'mobile-classes' : ''}
  ${isTablet ? 'tablet-classes' : ''}
  ${isDesktop ? 'desktop-classes' : ''}
`}>
```

## 📋 **План мобильной разработки**

### **1. Главная страница (MobileHomeView)**
- [ ] Адаптивная сетка объявлений
- [ ] Мобильная навигация
- [ ] Touch-жесты
- [ ] Оптимизация изображений

### **2. Детальная страница объявления**
- [ ] Мобильная галерея фото
- [ ] Swipe-навигация
- [ ] Мобильные кнопки действий
- [ ] Адаптивная информация о продавце

### **3. Сообщения (MobileMessagesView)**
- [ ] Мобильный чат
- [ ] Список чатов
- [ ] Мобильная клавиатура
- [ ] Push-уведомления

### **4. Профиль (MobileProfileView)**
- [ ] Мобильная форма входа
- [ ] Адаптивное редактирование профиля
- [ ] Мобильные настройки

### **5. Фильтры и поиск**
- [ ] Мобильные фильтры
- [ ] Мобильный поиск
- [ ] Bottom sheet для фильтров

## 🎯 **Мобильные UX принципы**

### **1. Touch-friendly интерфейс**
```css
/* Минимальный размер для touch */
.touch-button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}
```

### **2. Мобильная навигация**
```typescript
// Bottom navigation для мобильных
{isMobile && (
  <nav className="mobile-bottom-nav">
    <Link to="/">🏠</Link>
    <Link to="/add">➕</Link>
    <Link to="/favorites">❤️</Link>
    <Link to="/messages">💬</Link>
    <Link to="/profile">👤</Link>
  </nav>
)}
```

### **3. Swipe-жесты**
```typescript
// Пример swipe для галереи
const handleSwipe = (direction: 'left' | 'right') => {
  if (direction === 'left') {
    // Следующее фото
  } else {
    // Предыдущее фото
  }
};
```

### **4. Мобильная производительность**
```typescript
// Lazy loading для мобильных
const MobileImage = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
      className={isLoaded ? 'loaded' : 'loading'}
    />
  );
};
```

## 🔍 **Тестирование мобильной версии**

### **1. DevTools**
- Chrome DevTools → Device Toolbar
- Firefox Responsive Design Mode
- Safari Web Inspector

### **2. Реальные устройства**
- iPhone (Safari)
- Android (Chrome)
- iPad (Safari)

### **3. Тестирование жестов**
- Touch events
- Swipe gestures
- Pinch to zoom

## ⚠️ **Важные моменты**

### **1. Не изменять десктопную версию**
```typescript
// ✅ Правильно - создаем отдельные компоненты
if (isMobile) {
  return <MobileComponent />;
}
return <DesktopComponent />;

// ❌ Неправильно - изменяем существующий
return <Component className={isMobile ? 'mobile' : 'desktop'} />;
```

### **2. Сохранять функциональность**
- Все функции должны работать на мобильных
- Не упрощать интерфейс слишком сильно
- Сохранять доступность

### **3. Производительность**
- Оптимизировать изображения
- Использовать lazy loading
- Минимизировать re-renders

## 🚀 **Следующие шаги**

1. **Начать с главной страницы** - MobileHomeView
2. **Адаптировать детальную страницу** объявления
3. **Создать мобильные сообщения** - MobileMessagesView
4. **Добавить мобильные фильтры** - MobileFilterSheet
5. **Протестировать на реальных устройствах**

## 📱 **Мобильные особенности**

### **Viewport**
```html
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
```

### **Touch events**
```typescript
const handleTouchStart = (e: TouchEvent) => {
  // Обработка touch событий
};
```

### **Mobile keyboard**
```css
/* Адаптация под мобильную клавиатуру */
.mobile-input {
  font-size: 16px; /* Предотвращает zoom на iOS */
}
``` 