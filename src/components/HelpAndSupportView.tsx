import React, { useState } from 'react';
import { 
  ArrowLeftIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

interface FAQItem {
  question: string;
  answer: string;
}

const HelpAndSupportView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

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

  const contactMethods = [
    {
      icon: EnvelopeIcon,
      title: t('help.emailSupport'),
              subtitle: 'support@targ.store',
        action: () => window.open('mailto:support@targ.store')
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
            <div className="useful-link">
              <DocumentTextIcon className="link-icon" />
              <div className="link-info">
                <h3 className="link-title">{t('help.termsOfService')}</h3>
                <p className="link-subtitle">{t('help.termsOfServiceSubtitle')}</p>
              </div>
              <ArrowLeftIcon className="link-arrow" />
            </div>
            <div className="useful-link">
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
    </div>
  );
};

export default HelpAndSupportView; 