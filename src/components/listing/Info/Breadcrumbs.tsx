import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';

interface BreadcrumbTrail {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  trail: BreadcrumbTrail[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = React.memo(({ trail }) => {
  const { t } = useTranslation();

  return (
    <nav className="breadcrumbs" aria-label="Хлебные крошки">
      <ol className="breadcrumbs-list">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">
            {t('home.home')}
          </Link>
        </li>
        {trail.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {index === trail.length - 1 ? (
              <span className="breadcrumb-current">{item.label}</span>
            ) : (
              <Link to={item.href} className="breadcrumb-link">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}); 