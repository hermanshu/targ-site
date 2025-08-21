import { useState, useEffect } from 'react';

export type ScreenSize = 'small' | 'medium' | 'large';

interface ScreenInfo {
  size: ScreenSize;
  width: number;
  height: number;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
}

export const useScreenSize = (): ScreenInfo => {
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>({
    size: 'large',
    width: window.innerWidth,
    height: window.innerHeight,
    isSmall: false,
    isMedium: false,
    isLarge: true
  });

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      let size: ScreenSize = 'large';
      let isSmall = false;
      let isMedium = false;
      let isLarge = true;

      if (width <= 768) {
        size = 'small';
        isSmall = true;
        isMedium = false;
        isLarge = false;
      } else if (width > 768 && width <= 1024) {
        size = 'medium';
        isSmall = false;
        isMedium = true;
        isLarge = false;
      } else {
        size = 'large';
        isSmall = false;
        isMedium = false;
        isLarge = true;
      }

      setScreenInfo({
        size,
        width,
        height,
        isSmall,
        isMedium,
        isLarge
      });
    };

    // Обновляем при загрузке
    updateScreenSize();

    // Обновляем при изменении размера окна
    window.addEventListener('resize', updateScreenSize);

    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);

  return screenInfo;
};

// Удобные хелперы
export const useIsSmallScreen = (): boolean => {
  const { isSmall } = useScreenSize();
  return isSmall;
};

export const useIsMediumScreen = (): boolean => {
  const { isMedium } = useScreenSize();
  return isMedium;
};

export const useIsLargeScreen = (): boolean => {
  const { isLarge } = useScreenSize();
  return isLarge;
}; 