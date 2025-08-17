import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../hooks/useTranslation';

interface Category {
  name: string;
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  hasSubcategories?: boolean;
}

interface Subcategory {
  name: string;
  key: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface WebsiteCategoryViewProps {
  isOpen: boolean;
  categories: Category[];
  subcategories: { [key: string]: Subcategory[] };
  selectedCategory: string;
  onCategorySelect: (categoryKey: string) => void;
  onClose: () => void;
  expandedCategory: string | null;
  onCategoryExpand: (categoryName: string | null) => void;
}

const WebsiteCategoryView: React.FC<WebsiteCategoryViewProps> = ({
  isOpen,
  categories,
  subcategories,
  selectedCategory,
  onCategorySelect,
  onClose,
  expandedCategory,
  onCategoryExpand
}) => {
  const { t } = useTranslation();

  const handleCategoryClick = (category: Category) => {
    if (category.hasSubcategories) {
      // Если у категории есть подкатегории, переключаем их отображение
      onCategoryExpand(expandedCategory === category.name ? null : category.name);
    } else {
      // Если это обычная категория, выбираем её
      onCategorySelect(category.key);
      onClose();
    }
  };

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    onCategorySelect(subcategory.key);
    onCategoryExpand(null);
    onClose();
  };

  return (
    <div className={`website-category-container ${isOpen ? 'website-category-visible' : 'website-category-hidden'}`}>
      <div className="website-category-content">
        <div className="website-category-grid">
          {categories.map((category) => {
            const isExpanded = expandedCategory === category.name;
            const hasSubcategories = category.hasSubcategories;
            const IconComponent = category.icon;
            
            return (
              <div key={category.name} className="website-category-item">
                <button
                  className={`website-category-button ${selectedCategory === category.key ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <IconComponent className="website-category-icon" />
                  <span className="website-category-name">{category.name}</span>
                  {hasSubcategories && (
                    <ChevronDownIcon 
                      className={`website-category-chevron ${isExpanded ? 'expanded' : ''}`} 
                    />
                  )}
                </button>
                
                {/* Подкатегории */}
                {hasSubcategories && isExpanded && (
                  <div className="website-subcategory-list">
                    {subcategories[category.name]?.map((subcategory) => {
                      const SubIconComponent = subcategory.icon;
                      return (
                        <button
                          key={subcategory.name}
                          className={`website-subcategory-button ${selectedCategory === subcategory.key ? 'active' : ''}`}
                          onClick={() => handleSubcategoryClick(subcategory)}
                        >
                          <SubIconComponent className="website-subcategory-icon" />
                          <span className="website-subcategory-name">{subcategory.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WebsiteCategoryView; 