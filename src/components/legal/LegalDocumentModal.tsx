import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../../hooks/useTranslation';

interface LegalDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'terms' | 'privacy';
}

export const LegalDocumentModal: React.FC<LegalDocumentModalProps> = ({
  isOpen,
  onClose,
  documentType
}) => {
  const { t, currentLanguage } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<'ru' | 'en' | 'sr'>(currentLanguage as 'ru' | 'en' | 'sr');

  if (!isOpen) return null;

  const getDocumentContent = () => {
    const lang = selectedLanguage === 'sr' ? 'SR' : selectedLanguage === 'en' ? 'EN' : 'RU';
    const type = documentType === 'terms' ? 'Terms' : 'Privacy';
    
    // Здесь будет содержимое документов
    const documents: { [key: string]: string } = {
      'Terms_RU': `Условия использования Targ.store
(Дата последнего изменения: 24.08.2025)

Настоящие Условия и положения (далее — «Условия») регулируют использование веб-сайта Targ.store и связанных с ним сервисов (далее — «Сервис»). Используя Targ.store, вы подтверждаете, что ознакомились и согласны с данными Условиями. Если вы не согласны, вы обязаны прекратить использование Сервиса.

1. Общие положения
Владелец и оператор сайта Targ.store (далее — «Администрация») не является юридическим лицом, коммерческой организацией или посредником в сделках между пользователями.
Сервис представляет собой техническую платформу для размещения и поиска объявлений.
Все действия пользователей происходят исключительно на их собственный риск.

2. Регистрация и аккаунт
Для использования Сервиса необходимо создать аккаунт.
Пользователь несет ответственность за сохранность своих учетных данных.
Запрещается передавать доступ к аккаунту третьим лицам.

3. Размещение объявлений
Пользователи могут размещать объявления о товарах и услугах.
Запрещается размещать незаконный контент, спам, мошеннические предложения.
Администрация оставляет за собой право удалять объявления без предварительного уведомления.

4. Ответственность
Пользователи несут полную ответственность за размещаемый контент.
Администрация не несет ответственности за действия пользователей.
Сервис предоставляется «как есть» без каких-либо гарантий.

5. Изменения условий
Администрация может изменять настоящие Условия.
Пользователи уведомляются об изменениях через Сервис.
Продолжение использования означает согласие с новыми условиями.`,

      'Terms_EN': `Terms of Use Targ.store
(Last modified: 24.08.2025)

These Terms and Conditions (hereinafter — "Terms") govern the use of the Targ.store website and related services (hereinafter — "Service"). By using Targ.store, you confirm that you have read and agree to these Terms. If you disagree, you must stop using the Service.

1. General Provisions
The owner and operator of the Targ.store website (hereinafter — "Administration") is not a legal entity, commercial organization, or intermediary in transactions between users.
The Service is a technical platform for posting and searching advertisements.
All user actions occur exclusively at their own risk.

2. Registration and Account
To use the Service, you must create an account.
Users are responsible for the security of their credentials.
It is prohibited to transfer account access to third parties.

3. Posting Advertisements
Users can post advertisements for goods and services.
It is prohibited to post illegal content, spam, or fraudulent offers.
The Administration reserves the right to remove advertisements without prior notice.

4. Liability
Users bear full responsibility for posted content.
The Administration is not responsible for user actions.
The Service is provided "as is" without any warranties.

5. Changes to Terms
The Administration may change these Terms.
Users are notified of changes through the Service.
Continued use means agreement with new terms.`,

      'Terms_SR': `Uslovi korišćenja Targ.store
(Datum poslednje izmene: 24.08.2025)

Ovi Uslovi i odredbe (u daljem tekstu — "Uslovi") regulišu korišćenje Targ.store web sajta i povezanih usluga (u daljem tekstu — "Usluga"). Koristeći Targ.store, potvrđujete da ste se upoznali i saglasni ste sa ovim Uslovima. Ako se ne slažete, dužni ste da prestanete sa korišćenjem Usluge.

1. Opšte odredbe
Vlasnik i operator Targ.store sajta (u daljem tekstu — "Administracija") nije pravno lice, komercijalna organizacija ili posrednik u transakcijama između korisnika.
Usluga predstavlja tehničku platformu za objavljivanje i pretraživanje oglasa.
Sve akcije korisnika se odvijaju isključivo na njihov rizik.

2. Registracija i nalog
Za korišćenje Usluge potrebno je kreirati nalog.
Korisnici su odgovorni za sigurnost svojih podataka za pristup.
Zabranjeno je prenošenje pristupa nalogu trećim licima.

3. Objavljivanje oglasa
Korisnici mogu objavljivati oglase za robu i usluge.
Zabranjeno je objavljivanje nezakonitog sadržaja, spama, prevarantskih ponuda.
Administracija zadržava pravo uklanjanja oglasa bez prethodne najave.

4. Odgovornost
Korisnici snose punu odgovornost za objavljeni sadržaj.
Administracija nije odgovorna za akcije korisnika.
Usluga se pruža "kakva jeste" bez ikakvih garancija.

5. Promene uslova
Administracija može menjati ove Uslove.
Korisnici se obaveštavaju o promenama kroz Uslugu.
Nastavljeno korišćenje znači saglasnost sa novim uslovima.`,

      'Privacy_RU': `Политика конфиденциальности Targ.store
(Дата последнего изменения: 24.08.2025)

Настоящая Политика описывает, как сайт Targ.store (далее — «Сервис») собирает, использует и защищает персональные данные пользователей.

1. Сбор данных
Сервис может собирать e-mail, телефон, IP, данные объявлений, cookies.

2. Использование данных
Данные применяются только для работы сервиса и обратной связи.

3. Публичные данные
Контакты из объявлений доступны публично. Администрация не несёт ответственности за их использование.

4. Хранение и защита данных
Данные хранятся на серверах за пределами РФ. Применяются разумные меры защиты.

5. Cookies
Используются для авторизации и аналитики.

6. Права пользователя
Можно запросить удаление, изменение, исправление данных.

7. Контакты
support@targ.store`,

      'Privacy_EN': `Privacy Policy Targ.store
(Last modified: 24.08.2025)

This Policy describes how the Targ.store website (hereinafter — "Service") collects, uses, and protects users' personal data.

1. Data Collection
The Service may collect email, phone, IP, advertisement data, cookies.

2. Data Usage
Data is used only for service operation and feedback.

3. Public Data
Contacts from advertisements are publicly available. The Administration is not responsible for their use.

4. Data Storage and Protection
Data is stored on servers outside the Russian Federation. Reasonable protection measures are applied.

5. Cookies
Used for authorization and analytics.

6. User Rights
You can request deletion, modification, and correction of data.

7. Contacts
support@targ.store`,

      'Privacy_SR': `Politika privatnosti Targ.store
(Datum poslednje izmene: 24.08.2025)

Ova Politika opisuje kako Targ.store web sajt (u daljem tekstu — "Usluga") prikuplja, koristi i štiti lične podatke korisnika.

1. Prikupljanje podataka
Usluga može prikupljati e-mail, telefon, IP, podatke o oglasima, kolačiće.

2. Korišćenje podataka
Podaci se koriste samo za rad usluge i povratne informacije.

3. Javni podaci
Kontakti iz oglasa su javno dostupni. Administracija nije odgovorna za njihovo korišćenje.

4. Čuvanje i zaštita podataka
Podaci se čuvaju na serverima van Republike Srbije. Primenjuju se razumne mere zaštite.

5. Kolačići
Koriste se za autorizaciju i analitiku.

6. Prava korisnika
Možete zatražiti brisanje, izmenu, ispravku podataka.

7. Kontakti
support@targ.store`
    };

    return documents[`${type}_${lang}`] || documents[`${type}_RU`];
  };

  const getDocumentTitle = () => {
    if (documentType === 'terms') {
      return {
        ru: 'Условия использования',
        en: 'Terms of Use',
        sr: 'Uslovi korišćenja'
      }[selectedLanguage] || 'Условия использования';
    } else {
      return {
        ru: 'Политика конфиденциальности',
        en: 'Privacy Policy',
        sr: 'Politika privatnosti'
      }[selectedLanguage] || 'Политика конфиденциальности';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content legal-document-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{getDocumentTitle()}</h2>
          <button
            type="button"
            onClick={onClose}
            className="modal-close"
          >
            <XMarkIcon className="modal-close-icon" />
          </button>
        </div>
        
        <div className="modal-body">
          {/* Выбор языка */}
          <div className="language-selector">
            <button
              className={`lang-button ${selectedLanguage === 'ru' ? 'active' : ''}`}
              onClick={() => setSelectedLanguage('ru')}
            >
              RU
            </button>
            <button
              className={`lang-button ${selectedLanguage === 'en' ? 'active' : ''}`}
              onClick={() => setSelectedLanguage('en')}
            >
              EN
            </button>
            <button
              className={`lang-button ${selectedLanguage === 'sr' ? 'active' : ''}`}
              onClick={() => setSelectedLanguage('sr')}
            >
              SR
            </button>
          </div>

          {/* Содержимое документа */}
          <div className="document-content">
            <pre className="document-text">{getDocumentContent()}</pre>
          </div>
        </div>
        
        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="auth-button"
          >
            {t('profile.understand') || 'Понятно'}
          </button>
        </div>
      </div>
    </div>
  );
}; 