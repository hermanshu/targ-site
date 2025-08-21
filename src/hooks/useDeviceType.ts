import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
}

export const useDeviceType = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    userAgent: '',
    screenWidth: 0,
    screenHeight: 0
  });

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;

      // Определяем мобильные устройства по User Agent
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(userAgent);

      // Определяем планшеты (iPad или Android планшеты)
      const tabletRegex = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i;
      const isTabletDevice = tabletRegex.test(userAgent);

      // Определяем тип устройства ТОЛЬКО по User Agent
      let type: DeviceType = 'desktop';
      let isMobile = false;
      let isTablet = false;
      let isDesktop = true;

      if (isMobileDevice) {
        if (isTabletDevice) {
          type = 'tablet';
          isTablet = true;
          isDesktop = false;
        } else {
          type = 'mobile';
          isMobile = true;
          isDesktop = false;
        }
      }

      setDeviceInfo({
        type,
        isMobile,
        isTablet,
        isDesktop,
        userAgent,
        screenWidth,
        screenHeight
      });
    };

    // Определяем устройство при загрузке
    detectDevice();

    // Обновляем при изменении размера окна (только для планшетов в ландшафтном режиме)
    const handleResize = () => {
      detectDevice();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deviceInfo;
};

// Удобные хелперы
export const useIsMobile = (): boolean => {
  const { isMobile } = useDeviceType();
  return isMobile;
};

export const useIsTablet = (): boolean => {
  const { isTablet } = useDeviceType();
  return isTablet;
};

export const useIsDesktop = (): boolean => {
  const { isDesktop } = useDeviceType();
  return isDesktop;
}; 