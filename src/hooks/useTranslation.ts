import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../locales/translations';

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();
  
  const t = (key: string): string => {
    const translations = getTranslations(currentLanguage);
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return { t, currentLanguage };
}; 