import React, { useState } from 'react';
import { 
  ArrowLeftIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { LegalDocumentModal } from './legal/LegalDocumentModal';

interface FAQItem {
  question: string;
  answer: string;
}

const HelpAndSupportView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  const faqItems: FAQItem[] = [
    {
      question: t('help.howToCreateListing'),
      answer: t('help.howToCreateListingAnswer')
    },
    {
      question: t('help.howToContactSeller'),
      answer: t('help.howToContactSellerAnswer')
    },
    {
      question: t('help.howToEditListing'),
      answer: t('help.howToEditListingAnswer')
    },
    {
      question: t('help.howToDeleteListing'),
      answer: t('help.howToDeleteListingAnswer')
    },
    {
      question: t('help.howToReport'),
      answer: t('help.howToReportAnswer')
    },
    {
      question: t('help.howToChangeLanguage'),
      answer: t('help.howToChangeLanguageAnswer')
    }
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const toggleAbout = () => {
    setIsAboutExpanded(!isAboutExpanded);
  };

  const contactMethods = [
    {
      icon: EnvelopeIcon,
      title: t('help.emailSupport'),
      subtitle: 'support@targ.store',
      action: () => window.open('mailto:support@targ.store')
    }
  ];

  const aboutFeatures = [
    {
      icon: GlobeAltIcon,
      title: 'Локальная платформа',
      description: 'Targ - это местная платформа для покупки и продажи товаров в Сербии. Мы соединяем людей в твоём городе.'
    },
    {
      icon: UserGroupIcon,
      title: 'Сообщество',
      description: 'Присоединяйся к растущему сообществу покупателей и продавцов. Делись опытом и находи новых друзей.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Безопасность',
      description: 'Мы заботимся о безопасности наших пользователей. Все объявления проходят модерацию.'
    },
    {
      icon: HeartIcon,
      title: 'Простота использования',
      description: 'Интуитивно понятный интерфейс позволяет легко создавать объявления и находить нужные товары.'
    }
  ];

  const platformFeatures = [
    {
      icon: '💬',
      title: 'Умные диалоги',
      description: 'Помечай диалоги статусами: "Договорились о встрече", "Жду ответа", "Успешная сделка", "Архив" и легко фильтруй их для быстрого доступа к нужным перепискам.'
    },
    {
      icon: '📊',
      title: 'Статистика объявлений',
      description: 'Отслеживай просмотры своих объявлений, количество сообщений и анализируй эффективность продаж.'
    },
    {
      icon: '📁',
      title: 'Папки избранного',
      description: 'Создавай тематические папки для избранных объявлений и делись списками с друзьями через удобные ссылки.'
    }
  ];

  return (
    <div className="help-support-container">
      <div className="help-header">
        <button 
          className="back-button"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeftIcon className="back-icon" />
        </button>
        <h1 className="help-title">{t('help.title')}</h1>
      </div>

      <div className="help-content">
        {/* О нас */}
        <section className="help-section about-section">
          <button 
            className="about-header-button"
            onClick={toggleAbout}
          >
                          <div className="about-header-content">
                <InformationCircleIcon className="section-icon" />
                <h2 className="section-title">О нашей платформе</h2>
              </div>
            {isAboutExpanded ? (
              <ChevronUpIcon className="about-chevron" />
            ) : (
              <ChevronDownIcon className="about-chevron" />
            )}
          </button>
          
          {isAboutExpanded && (
            <div className="about-content">
              <div className="about-intro">
                <h3 className="about-subtitle">Добро пожаловать в Targ</h3>
                <p className="about-description">
                  Targ - это современная платформа для покупки и продажи товаров в Сербии. 
                  Мы создали удобное место, где ты можешь найти практически всё, что нужно, 
                  или продать то, что больше не используешь.
                </p>
                <div className="about-note">
                  <p>
                    💡 Платформа создана на чистом энтузиазме! Если ты заметил ошибки, баги 
                    или у тебя есть предложения по функционалу и дизайну - мы всегда рады 
                    обратной связи. Пиши нам на почту, указанную ниже в разделе "Контакты".
                  </p>
                </div>
              </div>

              <div className="about-features">
                {aboutFeatures.map((feature, index) => (
                  <div key={index} className="about-feature">
                    <div className="about-feature-icon">
                      <feature.icon />
                    </div>
                    <div className="about-feature-content">
                      <h4 className="about-feature-title">{feature.title}</h4>
                      <p className="about-feature-description">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="platform-features">
                <h4 className="features-title">Ключевые возможности платформы</h4>
                <div className="features-grid">
                  {platformFeatures.map((feature, index) => (
                    <div key={index} className="platform-feature">
                      <div className="platform-feature-icon">{feature.icon}</div>
                      <div className="platform-feature-content">
                        <h5 className="platform-feature-title">{feature.title}</h5>
                        <p className="platform-feature-description">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          )}
        </section>

        {/* Контактная информация */}
        <section className="help-section">
          <h2 className="section-title">{t('help.contactUs')}</h2>
          <div className="contact-methods">
            {contactMethods.map((method, index) => (
              <div 
                key={index}
                className="contact-method"
                onClick={method.action}
              >
                <div className="contact-icon">
                  <method.icon />
                </div>
                <div className="contact-info">
                  <h3 className="contact-title">{method.title}</h3>
                  <p className="contact-subtitle">{method.subtitle}</p>
                </div>
                <ArrowLeftIcon className="contact-arrow" />
              </div>
            ))}
          </div>
        </section>

        {/* Часто задаваемые вопросы */}
        <section className="help-section">
          <h2 className="section-title">{t('help.frequentlyAskedQuestions')}</h2>
          <div className="faq-list">
            {faqItems.map((item, index) => (
              <div key={index} className="faq-item">
                <button 
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <QuestionMarkCircleIcon className="faq-icon" />
                  <span className="faq-text">{item.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUpIcon className="faq-chevron" />
                  ) : (
                    <ChevronDownIcon className="faq-chevron" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Полезные ссылки */}
        <section className="help-section">
          <h2 className="section-title">{t('help.usefulLinks')}</h2>
          <div className="useful-links">
            <div className="useful-link" onClick={() => setShowTermsModal(true)}>
              <DocumentTextIcon className="link-icon" />
              <div className="link-info">
                <h3 className="link-title">{t('help.termsOfService')}</h3>
                <p className="link-subtitle">{t('help.termsOfServiceSubtitle')}</p>
              </div>
              <ArrowLeftIcon className="link-arrow" />
            </div>
            <div className="useful-link" onClick={() => setShowPrivacyModal(true)}>
              <DocumentTextIcon className="link-icon" />
              <div className="link-info">
                <h3 className="link-title">{t('help.privacyPolicy')}</h3>
                <p className="link-subtitle">{t('help.privacyPolicySubtitle')}</p>
              </div>
              <ArrowLeftIcon className="link-arrow" />
            </div>
          </div>
        </section>
      </div>

      {/* Модальные окна для юридических документов */}
      <LegalDocumentModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        documentType="terms"
      />
      <LegalDocumentModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        documentType="privacy"
      />
    </div>
  );
};

export default HelpAndSupportView; 