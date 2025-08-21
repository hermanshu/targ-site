import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // Определяем мобильные устройства ТОЛЬКО по User Agent
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(navigator.userAgent);
      
      // Убираем проверку размера экрана - только реальное устройство
      setIsMobile(isMobileDevice);
    };

    // Проверяем при загрузке
    checkIsMobile();

    // Добавляем слушатель изменения размера окна (для планшетов в ландшафтном режиме)
    window.addEventListener('resize', checkIsMobile);

    // Очищаем слушатель при размонтировании
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}; 